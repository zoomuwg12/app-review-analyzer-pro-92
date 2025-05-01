
import { useState, useEffect } from 'react';
import { useApps } from './useApps';
import { useReviews } from './useReviews';
import { AppInfo } from '@/utils/scraper';

export function useAppState() {
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [isSyncingWithDatabase, setSyncingWithDatabase] = useState(false);
  
  const { 
    apps, 
    isLoadingApps, 
    isDemoMode: appsDemoMode,
    handleAddApp, 
    handleRemoveApp 
  } = useApps();
  
  const { 
    reviews, 
    isLoadingReviews, 
    reviewCount, 
    isDemoMode: reviewsDemoMode,
    setReviewCount, 
    loadReviews 
  } = useReviews();

  // Set the first app as selected when apps are loaded
  useEffect(() => {
    if (apps.length > 0 && !selectedAppId) {
      setSelectedAppId(apps[0].appId);
    }
  }, [apps, selectedAppId]);

  // Load reviews when selected app changes
  useEffect(() => {
    if (selectedAppId) {
      loadReviews(selectedAppId);
    }
  }, [selectedAppId, reviewCount]);

  // Debug logs
  useEffect(() => {
    console.log("Apps state:", apps);
    console.log("Selected App ID:", selectedAppId);
    console.log("Reviews state:", reviews);
    console.log("Demo mode:", appsDemoMode || reviewsDemoMode);
  }, [apps, selectedAppId, reviews, appsDemoMode, reviewsDemoMode]);

  // Find the currently selected app
  const selectedApp = apps.find(app => app.appId === selectedAppId);

  return {
    apps,
    selectedAppId,
    reviews,
    isLoadingApps,
    isLoadingReviews,
    reviewCount,
    isSyncingWithDatabase,
    isDemoMode: appsDemoMode || reviewsDemoMode, // Either source being in demo mode means we're in demo mode
    selectedApp,
    setSelectedAppId,
    setReviewCount,
    handleAddApp,
    handleRemoveApp,
    loadReviews
  };
}
