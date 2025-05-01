
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AppInfo, AppReview, fetchAppInfo, fetchAppReviews } from '@/utils/scraper';
import { loadAppsFromDatabase, syncAppsToDatabase, syncReviewsToDatabase, loadReviewsFromDatabase } from '@/utils/databaseSync';
import { supabase } from "@/integrations/supabase/client";

export function useAppState() {
  const { toast } = useToast();
  const [apps, setApps] = useState<AppInfo[]>([]);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [reviews, setReviews] = useState<AppReview[]>([]);
  const [isLoadingApps, setIsLoadingApps] = useState(false);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [reviewCount, setReviewCount] = useState<number>(100);
  const [isSyncingWithDatabase, setSyncingWithDatabase] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);

  // Load apps from Supabase on mount
  useEffect(() => {
    const loadApps = async () => {
      setIsLoadingApps(true);
      
      try {
        const result = await loadAppsFromDatabase();
        setApps(result.apps);
        
        // If there are apps, select the first one
        if (result.apps.length > 0 && !selectedAppId) {
          setSelectedAppId(result.apps[0].appId);
        }
        
        // If apps were loaded from localStorage, sync them to database
        if (!result.fromDatabase && result.apps.length > 0) {
          await syncAppsToDatabase(result.apps);
        }
      } finally {
        setIsLoadingApps(false);
      }
    };
    
    loadApps();
  }, []);

  // Load reviews when selected app changes
  useEffect(() => {
    if (selectedAppId) {
      loadReviews(selectedAppId);
    } else {
      setReviews([]);
    }
  }, [selectedAppId, reviewCount]);

  // Save apps to localStorage when they change
  useEffect(() => {
    localStorage.setItem('appReviewAnalyzer_apps', JSON.stringify(apps));
  }, [apps]);

  useEffect(() => {
    console.log("Apps state:", apps);
    console.log("Selected App ID:", selectedAppId);
    console.log("Reviews state:", reviews);
    console.log("Demo mode:", isDemoMode);
  }, [apps, selectedAppId, reviews, isDemoMode]);

  const loadReviews = async (appId: string) => {
    setIsLoadingReviews(true);
    try {
      // First try to load from Supabase
      const databaseReviews = await loadReviewsFromDatabase(appId, reviewCount);
      
      if (databaseReviews) {
        setReviews(databaseReviews);
        setIsDemoMode(false);
        return;
      }
      
      // If not enough reviews in database, fetch from API
      try {
        const fetchedReviews = await fetchAppReviews(appId, reviewCount);
        setReviews(fetchedReviews);
        setIsDemoMode(false);
        
        // Save to database
        await syncReviewsToDatabase(appId, fetchedReviews);
        
        toast({
          title: "Reviews loaded",
          description: `${fetchedReviews.length} reviews loaded for analysis.`,
          variant: "default",
        });
      } catch (error) {
        // If API fetch fails, use mock data
        console.error("Real API fetch failed, falling back to mock data:", error);
        toast({
          title: "Using demo data",
          description: "Could not fetch real reviews. Using demo data instead.",
          variant: "warning",
        });
        
        // Generate mock reviews
        const mockReviews: AppReview[] = [];
        for (let i = 0; i < reviewCount; i++) {
          const score = Math.floor(Math.random() * 5) + 1;
          const date = new Date();
          date.setDate(date.getDate() - Math.floor(Math.random() * 365));
          
          mockReviews.push({
            id: `review-${appId}-${i}`,
            userName: `User${Math.floor(Math.random() * 1000)}`,
            content: score > 3 ? 
              "Love this app! It's amazing and very useful." : 
              "Not satisfied with this app. Needs improvement.",
            score,
            at: date,
            thumbsUpCount: Math.floor(Math.random() * 100),
            reviewCreatedVersion: `${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`
          });
        }
        
        setReviews(mockReviews);
        setIsDemoMode(true);
      }
    } catch (error) {
      console.error('Failed to load reviews:', error);
      toast({
        title: "Failed to load reviews",
        description: "Could not fetch reviews. Please try again.",
        variant: "destructive",
      });
      setReviews([]);
      setIsDemoMode(true);
    } finally {
      setIsLoadingReviews(false);
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
      // Try to fetch real app info
      try {
        const appInfo = await fetchAppInfo(appId);
        
        // Add to local state
        setApps(prevApps => [...prevApps, appInfo]);
        
        // Save to Supabase
        await syncAppsToDatabase([appInfo]);
        
        // If this is the first app, select it
        if (!selectedAppId) {
          setSelectedAppId(appId);
        }

        toast({
          title: "App added successfully",
          description: `${appInfo.title} has been added to your list.`,
          variant: "default",
        });
        setIsDemoMode(false);
      } catch (error) {
        console.error("Error fetching real app info, falling back to mock data:", error);
        
        // If real fetch fails, use mock data
        const mockAppData = {
          appId,
          title: `App ${appId.split('.').pop()}`,
          developer: "Mock Developer",
          icon: "https://via.placeholder.com/150",
          score: 4.2,
          free: true,
          installs: "1,000,000+",
          summary: "This is a mock app description because real data could not be fetched."
        };
        
        setApps(prevApps => [...prevApps, mockAppData]);
        
        // Save mock data to Supabase
        await syncAppsToDatabase([mockAppData]);
        
        // If this is the first app, select it
        if (!selectedAppId) {
          setSelectedAppId(appId);
        }

        toast({
          title: "App added in demo mode",
          description: "Could not fetch real app data. Added with mock data instead.",
          variant: "warning",
        });
        setIsDemoMode(true);
      }
    } catch (error) {
      console.error('Failed to add app:', error);
      toast({
        title: "Failed to add app",
        description: `Could not add app. Please check the app ID and try again.`,
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

  return {
    apps,
    selectedAppId,
    reviews,
    isLoadingApps,
    isLoadingReviews,
    reviewCount,
    isSyncingWithDatabase,
    isDemoMode,
    selectedApp: apps.find(app => app.appId === selectedAppId),
    setSelectedAppId,
    setReviewCount,
    handleAddApp,
    handleRemoveApp,
    loadReviews
  };
}
