
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2, ChevronDown, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AddAppForm from '@/components/AddAppForm';
import AppCard from '@/components/AppCard';
import ReviewsTable from '@/components/ReviewsTable';
import SentimentSummary from '@/components/SentimentSummary';
import AspectAnalysis from '@/components/AspectAnalysis';
import RatingsDistribution from '@/components/RatingsDistribution';
import { fetchAppInfo, fetchAppReviews, AppInfo, AppReview } from '@/utils/scraper';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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

      <Card>
        <CardHeader>
          <CardTitle>Add Google Play App</CardTitle>
        </CardHeader>
        <CardContent>
          <AddAppForm onAddApp={handleAddApp} isLoading={isLoadingApps} />
        </CardContent>
      </Card>

      {apps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Apps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              {apps.map(app => (
                <AppCard
                  key={app.appId}
                  app={app}
                  onRemove={handleRemoveApp}
                  onSelect={setSelectedAppId}
                  isSelected={app.appId === selectedAppId}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {selectedApp && (
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card rounded-lg p-5 shadow-md">
            <div className="flex items-center space-x-4">
              <img src={selectedApp.icon} alt={selectedApp.title} className="w-16 h-16 rounded-xl" />
              <div>
                <h2 className="text-2xl font-bold">{selectedApp.title}</h2>
                <p className="text-muted-foreground">{selectedApp.developer}</p>
                <div className="flex items-center mt-1">
                  <div className="text-yellow-400 mr-1">★</div>
                  <span>{selectedApp.score.toFixed(1)}</span>
                  <span className="mx-2">•</span>
                  <span>{selectedApp.free ? 'Free' : selectedApp.priceText}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground mb-1">Reviews to fetch:</span>
                <Select
                  value={reviewCount.toString()}
                  onValueChange={(value) => setReviewCount(parseInt(value))}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50">50 reviews</SelectItem>
                    <SelectItem value="100">100 reviews</SelectItem>
                    <SelectItem value="200">200 reviews</SelectItem>
                    <SelectItem value="300">300 reviews</SelectItem>
                    <SelectItem value="500">500 reviews</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={() => loadReviews(selectedAppId!)}
                disabled={isLoadingReviews}
              >
                {isLoadingReviews ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Refresh Reviews'
                )}
              </Button>
            </div>
          </div>

          {isLoadingReviews ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : reviews.length > 0 ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SentimentSummary reviews={reviews} />
                <RatingsDistribution reviews={reviews} />
              </div>
              
              <AspectAnalysis reviews={reviews} />
              
              <ReviewsTable reviews={reviews} appName={selectedApp.title} />
            </>
          ) : (
            <div className="text-center py-12 bg-card rounded-lg shadow-md">
              <h3 className="text-xl font-medium mb-2">No reviews loaded</h3>
              <p className="text-muted-foreground mb-4">
                Click the "Refresh Reviews" button to load reviews for analysis
              </p>
              <Button onClick={() => loadReviews(selectedAppId!)}>
                Load Reviews
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
