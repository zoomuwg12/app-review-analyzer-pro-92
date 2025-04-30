
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { fetchAppInfo, fetchAppReviews, AppInfo, AppReview } from '@/utils/scraper';
import AppSelector from '@/components/dashboard/AppSelector';
import AppHeader from '@/components/dashboard/AppHeader';
import ReviewsContent from '@/components/dashboard/ReviewsContent';
import { supabase } from "@/integrations/supabase/client";

const Dashboard: React.FC = () => {
  const { toast } = useToast();
  const [apps, setApps] = useState<AppInfo[]>([]);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [reviews, setReviews] = useState<AppReview[]>([]);
  const [isLoadingApps, setIsLoadingApps] = useState(false);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [reviewCount, setReviewCount] = useState<number>(100);
  const [isSyncingWithDatabase, setSyncingWithDatabase] = useState(false);

  // Load apps from Supabase on mount
  useEffect(() => {
    loadAppsFromDatabase();
  }, []);

  // Load reviews when selected app changes
  useEffect(() => {
    if (selectedAppId) {
      loadReviews(selectedAppId);
    } else {
      setReviews([]);
    }
  }, [selectedAppId, reviewCount]);

  const loadAppsFromDatabase = async () => {
    setIsLoadingApps(true);
    try {
      // First try to load from Supabase
      const { data, error } = await supabase
        .from('apps')
        .select('*');
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Convert Supabase data format to AppInfo
        const loadedApps: AppInfo[] = data.map(app => ({
          appId: app.app_id,
          title: app.title,
          developer: app.developer,
          icon: app.icon,
          score: app.score,
          free: app.free,
          priceText: app.price_text,
          installs: app.installs,
          summary: app.summary,
          url: app.url
        }));
        
        setApps(loadedApps);
        
        // If there are apps, select the first one
        if (loadedApps.length > 0 && !selectedAppId) {
          setSelectedAppId(loadedApps[0].appId);
        }
        
        toast({
          title: "Apps loaded from database",
          description: `Loaded ${loadedApps.length} apps from the database.`,
          variant: "default",
        });
      } else {
        // If no apps in database, check localStorage
        const savedApps = localStorage.getItem('appReviewAnalyzer_apps');
        if (savedApps) {
          try {
            const parsedApps = JSON.parse(savedApps);
            setApps(parsedApps);
            
            // If there are apps, select the first one
            if (parsedApps.length > 0) {
              setSelectedAppId(parsedApps[0].appId);
            }
            
            // Sync local apps to database
            syncAppsToDatabase(parsedApps);
          } catch (error) {
            console.error('Failed to parse saved apps:', error);
          }
        }
      }
    } catch (error) {
      console.error('Failed to load apps from database:', error);
      toast({
        title: "Failed to load apps",
        description: "Could not fetch app data from the database.",
        variant: "destructive",
      });
      
      // Fallback to localStorage
      const savedApps = localStorage.getItem('appReviewAnalyzer_apps');
      if (savedApps) {
        try {
          setApps(JSON.parse(savedApps));
        } catch (error) {
          console.error('Failed to parse saved apps:', error);
        }
      }
    } finally {
      setIsLoadingApps(false);
    }
  };

  const syncAppsToDatabase = async (appsToSync: AppInfo[]) => {
    if (appsToSync.length === 0) return;
    
    setSyncingWithDatabase(true);
    try {
      // Convert to database format
      const dataToInsert = appsToSync.map(app => ({
        app_id: app.appId,
        title: app.title,
        developer: app.developer,
        icon: app.icon,
        score: app.score,
        free: app.free,
        price_text: app.priceText,
        installs: app.installs,
        summary: app.summary,
        url: app.url
      }));
      
      // Insert into Supabase with upsert
      const { error } = await supabase
        .from('apps')
        .upsert(dataToInsert, { onConflict: 'app_id' });
      
      if (error) throw error;
      
      toast({
        title: "Apps synced to database",
        description: `Synced ${appsToSync.length} apps to the database.`,
        variant: "default",
      });
    } catch (error) {
      console.error('Failed to sync apps to database:', error);
      toast({
        title: "Failed to sync apps",
        description: "Could not save app data to the database.",
        variant: "destructive",
      });
    } finally {
      setSyncingWithDatabase(false);
    }
  };

  const syncReviewsToDatabase = async (appId: string, reviewsToSync: AppReview[]) => {
    if (reviewsToSync.length === 0) return;
    
    try {
      // Convert to database format
      const dataToInsert = reviewsToSync.map(review => ({
        app_id: appId,
        review_id: review.id,
        user_name: review.userName,
        content: review.content,
        score: review.score,
        review_date: review.at,
        reply_content: review.replyContent,
        reply_date: review.replyAt,
        thumbs_up_count: review.thumbsUpCount,
        review_created_version: review.reviewCreatedVersion,
        processed_content: review.processedContent,
        sentiment: review.score >= 3 ? 'positive' : 'negative' // Simple sentiment estimation
      }));
      
      // Insert into Supabase with upsert
      const { error } = await supabase
        .from('app_reviews')
        .upsert(dataToInsert, { onConflict: 'app_id,review_id' });
      
      if (error) throw error;
      
      console.log(`Synced ${reviewsToSync.length} reviews to the database.`);
    } catch (error) {
      console.error('Failed to sync reviews to database:', error);
    }
  };

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
      
      // Add to local state
      setApps(prevApps => [...prevApps, appInfo]);
      
      // Save to Supabase
      await supabase.from('apps').insert({
        app_id: appInfo.appId,
        title: appInfo.title,
        developer: appInfo.developer,
        icon: appInfo.icon,
        score: appInfo.score,
        free: appInfo.free,
        price_text: appInfo.priceText,
        installs: appInfo.installs,
        summary: appInfo.summary,
        url: appInfo.url
      });
      
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

  const handleRemoveApp = async (appId: string) => {
    try {
      // Remove from local state
      setApps(prevApps => prevApps.filter(app => app.appId !== appId));
      
      // Remove from Supabase
      await supabase.from('apps').delete().eq('app_id', appId);
      
      // If the removed app was selected, select the first app or null
      if (selectedAppId === appId) {
        const remainingApps = apps.filter(app => app.appId !== appId);
        setSelectedAppId(remainingApps.length > 0 ? remainingApps[0].appId : null);
      }
      
      toast({
        title: "App removed",
        description: "The app has been removed from your list.",
        variant: "default",
      });
    } catch (error) {
      console.error('Failed to remove app:', error);
      toast({
        title: "Failed to remove app",
        description: "Could not remove the app from the database.",
        variant: "destructive",
      });
    }
  };

  const loadReviews = async (appId: string) => {
    setIsLoadingReviews(true);
    try {
      // First try to load from Supabase
      const { data, error } = await supabase
        .from('app_reviews')
        .select('*')
        .eq('app_id', appId)
        .limit(reviewCount);
      
      if (error) throw error;
      
      if (data && data.length > 0 && data.length >= reviewCount) {
        // Convert Supabase data format to AppReview
        const loadedReviews: AppReview[] = data.map(review => ({
          id: review.review_id,
          userName: review.user_name,
          content: review.content,
          score: review.score,
          at: new Date(review.review_date),
          replyContent: review.reply_content,
          replyAt: review.reply_date ? new Date(review.reply_date) : undefined,
          thumbsUpCount: review.thumbs_up_count,
          reviewCreatedVersion: review.review_created_version,
          processedContent: review.processed_content
        }));
        
        setReviews(loadedReviews);
        
        toast({
          title: "Reviews loaded from database",
          description: `Loaded ${loadedReviews.length} reviews from the database.`,
          variant: "default",
        });
      } else {
        // If not enough reviews in database, fetch from API
        const fetchedReviews = await fetchAppReviews(appId, reviewCount);
        setReviews(fetchedReviews);
        
        // Save to database
        await syncReviewsToDatabase(appId, fetchedReviews);
        
        toast({
          title: "Reviews loaded",
          description: `${fetchedReviews.length} reviews loaded for analysis.`,
          variant: "default",
        });
      }
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

  // Save apps to localStorage when they change
  useEffect(() => {
    localStorage.setItem('appReviewAnalyzer_apps', JSON.stringify(apps));
  }, [apps]);

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
            app={selectedApp}
            onLoadReviews={() => loadReviews(selectedAppId!)}
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
