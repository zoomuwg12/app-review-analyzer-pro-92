
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AppReview, fetchAppReviews } from '@/utils/scraper';
import { syncReviewsToDatabase, loadReviewsFromDatabase } from '@/utils/databaseSync';

export function useReviews() {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<AppReview[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [reviewCount, setReviewCount] = useState<number>(100);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);

  const loadReviews = async (appId: string) => {
    setIsLoadingReviews(true);
    try {
      // First try to load from Supabase
      const databaseReviews = await loadReviewsFromDatabase(appId, reviewCount);
      
      if (databaseReviews && databaseReviews.length >= reviewCount) {
        setReviews(databaseReviews);
        setIsDemoMode(false);
        toast({
          title: "Reviews loaded from database",
          description: `${databaseReviews.length} reviews loaded from the database.`,
          variant: "default",
        });
        setIsLoadingReviews(false);
        return;
      }
      
      // If not enough reviews in database, use mock data
      try {
        // Always use mock data since we can't use the real API in the browser
        const mockReviews = await fetchAppReviews(appId, reviewCount);
        setReviews(mockReviews);
        setIsDemoMode(true);
        
        // Save mock reviews to database for consistency
        await syncReviewsToDatabase(appId, mockReviews);
        
        toast({
          title: "Using demo data",
          description: "Showing mock review data. In a production environment, this would connect to the real Google Play Store API.",
          variant: "warning",
        });
      } catch (error) {
        console.error("Error generating mock data:", error);
        toast({
          title: "Error loading reviews",
          description: "Could not generate review data.",
          variant: "destructive",
        });
        setReviews([]);
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

  return {
    reviews,
    isLoadingReviews,
    reviewCount,
    isDemoMode,
    setReviewCount,
    loadReviews,
    setReviews
  };
}
