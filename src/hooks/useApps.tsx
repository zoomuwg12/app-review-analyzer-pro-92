
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AppInfo, fetchAppInfo } from '@/utils/scraper';
import { loadAppsFromDatabase, syncAppsToDatabase } from '@/utils/databaseSync';
import { supabase } from "@/integrations/supabase/client";

export function useApps() {
  const { toast } = useToast();
  const [apps, setApps] = useState<AppInfo[]>([]);
  const [isLoadingApps, setIsLoadingApps] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);

  // Load apps from Supabase on mount
  useEffect(() => {
    loadAppsFromStore();
  }, []);

  // Save apps to localStorage when they change
  useEffect(() => {
    localStorage.setItem('appReviewAnalyzer_apps', JSON.stringify(apps));
  }, [apps]);

  const loadAppsFromStore = async () => {
    setIsLoadingApps(true);
    
    try {
      const result = await loadAppsFromDatabase();
      setApps(result.apps);
      
      // If apps were loaded from localStorage, sync them to database
      if (!result.fromDatabase && result.apps.length > 0) {
        await syncAppsToDatabase(result.apps);
      }
    } finally {
      setIsLoadingApps(false);
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
      // Always use mock app data in the browser
      const appInfo = await fetchAppInfo(appId);
      
      // Add to local state
      setApps(prevApps => [...prevApps, appInfo]);
      
      // Save to Supabase
      await syncAppsToDatabase([appInfo]);

      toast({
        title: "App added in demo mode",
        description: "App has been added with mock data. In a production environment, this would fetch real data from the Google Play Store API.",
        variant: "warning",
      });
      setIsDemoMode(true);
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
    isLoadingApps,
    isDemoMode,
    handleAddApp,
    handleRemoveApp
  };
}
