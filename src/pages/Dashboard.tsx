
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { fetchAppInfo, fetchAppReviews, AppInfo, AppReview } from '@/utils/scraper';
import AppSelector from '@/components/dashboard/AppSelector';
import AppHeader from '@/components/dashboard/AppHeader';
import ReviewsContent from '@/components/dashboard/ReviewsContent';

const Dashboard: React.FC = () => {
  const { toast } = useToast();
  const [apps, setApps] = useState<AppInfo[]>([]);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [reviews, setReviews] = useState<AppReview[]>([]);
  const [isLoadingApps, setIsLoadingApps] = useState(false);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [reviewCount, setReviewCount] = useState<number>(100);

  // Load saved apps from localStorage on mount
  useEffect(() => {
    const savedApps = localStorage.getItem('appReviewAnalyzer_apps');
    if (savedApps) {
      try {
        const parsedApps = JSON.parse(savedApps);
        setApps(parsedApps);
        // If there are apps, select the first one
        if (parsedApps.length > 0) {
          setSelectedAppId(parsedApps[0].appId);
        }
      } catch (error) {
        console.error('Failed to parse saved apps:', error);
      }
    }
  }, []);

  // Save apps to localStorage when they change
  useEffect(() => {
    localStorage.setItem('appReviewAnalyzer_apps', JSON.stringify(apps));
  }, [apps]);

  // Load reviews when selected app changes
  useEffect(() => {
    if (selectedAppId) {
      loadReviews(selectedAppId);
    } else {
      setReviews([]);
    }
  }, [selectedAppId, reviewCount]);

  const handleAddApp = async (appId: string) => {
    // Check if the app is already added
    if (apps.some(app => app.appId === appId)) {
      toast({
        title: "App already added",
        description: "This app is already in your list.",
        variant: "default",
      });
      return;
    }

    setIsLoadingApps(true);
    try {
      const appInfo = await fetchAppInfo(appId);
      setApps(prevApps => [...prevApps, appInfo]);
      
      // If this is the first app, select it
      if (!selectedAppId) {
        setSelectedAppId(appId);
      }

      toast({
        title: "App added successfully",
        description: `${appInfo.title} has been added to your list.`,
        variant: "default",
      });
    } catch (error) {
      console.error('Failed to add app:', error);
      toast({
        title: "Failed to add app",
        description: `Could not fetch app info. Please check the app ID and try again.`,
        variant: "destructive",
      });
    } finally {
      setIsLoadingApps(false);
    }
  };

  const handleRemoveApp = (appId: string) => {
    setApps(prevApps => prevApps.filter(app => app.appId !== appId));
    
    // If the removed app was selected, select the first app or null
    if (selectedAppId === appId) {
      const remainingApps = apps.filter(app => app.appId !== appId);
      setSelectedAppId(remainingApps.length > 0 ? remainingApps[0].appId : null);
    }
  };

  const loadReviews = async (appId: string) => {
    setIsLoadingReviews(true);
    try {
      const fetchedReviews = await fetchAppReviews(appId, reviewCount);
      setReviews(fetchedReviews);
      
      toast({
        title: "Reviews loaded",
        description: `${fetchedReviews.length} reviews loaded for analysis.`,
        variant: "default",
      });
    } catch (error) {
      console.error('Failed to load reviews:', error);
      toast({
        title: "Failed to load reviews",
        description: "Could not fetch reviews. Please try again.",
        variant: "destructive",
      });
      setReviews([]);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  const selectedApp = apps.find(app => app.appId === selectedAppId);

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <Alert className="bg-amber-50 border-amber-200 mb-6">
        <AlertTriangle className="h-4 w-4 text-amber-500" />
        <AlertTitle>Demo Mode</AlertTitle>
        <AlertDescription>
          This app is running in demo mode with mock data. In production, this would connect to the Google Play Store API.
        </AlertDescription>
      </Alert>

      <AppSelector 
        apps={apps}
        selectedAppId={selectedAppId}
        onAddApp={handleAddApp}
        onRemoveApp={handleRemoveApp}
        onSelectApp={setSelectedAppId}
        isLoadingApps={isLoadingApps}
      />

      {selectedApp && (
        <div className="space-y-8">
          <AppHeader 
            app={selectedApp}
            reviewCount={reviewCount}
            setReviewCount={setReviewCount}
            onRefreshReviews={() => loadReviews(selectedAppId!)}
            isLoadingReviews={isLoadingReviews}
          />

          <ReviewsContent 
            reviews={reviews}
            isLoadingReviews={isLoadingReviews}
            appName={selectedApp.title}
            onLoadReviews={() => loadReviews(selectedAppId!)}
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
