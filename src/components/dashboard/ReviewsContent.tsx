
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { AppReview } from '@/utils/scraper';
import SentimentSummary from '@/components/SentimentSummary';
import RatingsDistribution from '@/components/RatingsDistribution';
import AspectAnalysis from '@/components/AspectAnalysis';
import ReviewsTable from '@/components/ReviewsTable';

interface ReviewsContentProps {
  reviews: AppReview[];
  isLoadingReviews: boolean;
  appName: string;
  onLoadReviews: () => void;
}

const ReviewsContent: React.FC<ReviewsContentProps> = ({ 
  reviews, 
  isLoadingReviews, 
  appName,
  onLoadReviews 
}) => {
  if (isLoadingReviews) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 bg-card rounded-lg shadow-md">
        <h3 className="text-xl font-medium mb-2">No reviews loaded</h3>
        <p className="text-muted-foreground mb-4">
          Click the "Refresh Reviews" button to load reviews for analysis
        </p>
        <Button onClick={onLoadReviews}>
          Load Reviews
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SentimentSummary reviews={reviews} />
        <RatingsDistribution reviews={reviews} />
      </div>
      
      <AspectAnalysis reviews={reviews} />
      
      <ReviewsTable reviews={reviews} appName={appName} />
    </>
  );
};

export default ReviewsContent;
