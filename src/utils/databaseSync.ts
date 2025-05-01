
import { supabase } from "@/integrations/supabase/client";
import { AppInfo, AppReview } from "@/utils/scraper";
import { useToast } from "@/hooks/use-toast";

export const syncAppsToDatabase = async (appsToSync: AppInfo[], toast: ReturnType<typeof useToast>) => {
  if (appsToSync.length === 0) return;
  
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
  }
};

export const syncReviewsToDatabase = async (appId: string, reviewsToSync: AppReview[]) => {
  if (reviewsToSync.length === 0) return;
  
  try {
    // Convert to database format and ensure dates are strings
    const dataToInsert = reviewsToSync.map(review => ({
      app_id: appId,
      review_id: review.id,
      user_name: review.userName,
      content: review.content,
      score: review.score,
      review_date: review.at.toISOString(),
      reply_content: review.replyContent || null,
      reply_date: review.replyAt ? review.replyAt.toISOString() : null,
      thumbs_up_count: review.thumbsUpCount,
      review_created_version: review.reviewCreatedVersion || null,
      processed_content: review.processedContent || null,
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

export const loadAppsFromDatabase = async (toast: ReturnType<typeof useToast>) => {
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
      
      toast({
        title: "Apps loaded from database",
        description: `Loaded ${loadedApps.length} apps from the database.`,
        variant: "default",
      });

      return { apps: loadedApps, fromDatabase: true };
    } else {
      // If no apps in database, check localStorage
      const savedApps = localStorage.getItem('appReviewAnalyzer_apps');
      if (savedApps) {
        try {
          const parsedApps = JSON.parse(savedApps);
          return { apps: parsedApps, fromDatabase: false };
        } catch (error) {
          console.error('Failed to parse saved apps:', error);
          return { apps: [], fromDatabase: false };
        }
      }
    }
    
    return { apps: [], fromDatabase: false };
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
        return { apps: JSON.parse(savedApps), fromDatabase: false };
      } catch (error) {
        console.error('Failed to parse saved apps:', error);
      }
    }
    
    return { apps: [], fromDatabase: false };
  }
};

export const loadReviewsFromDatabase = async (appId: string, reviewCount: number, toast: ReturnType<typeof useToast>) => {
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
      
      toast({
        title: "Reviews loaded from database",
        description: `Loaded ${loadedReviews.length} reviews from the database.`,
        variant: "default",
      });
      
      return loadedReviews;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to load reviews from database:', error);
    return null;
  }
};
