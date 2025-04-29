
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, LineChart, BarChart, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppReview } from '@/utils/scraper';
import SentimentSummary from '@/components/SentimentSummary';
import RatingsDistribution from '@/components/RatingsDistribution';
import AspectAnalysis from '@/components/AspectAnalysis';
import ReviewsTable from '@/components/ReviewsTable';
import { useToast } from '@/hooks/use-toast';

interface ReviewsContentProps {
  reviews: AppReview[];
  isLoadingReviews: boolean;
  appName: string;
  app: any; // The app object
  onLoadReviews: () => void;
}

const ReviewsContent: React.FC<ReviewsContentProps> = ({ 
  reviews, 
  isLoadingReviews, 
  appName,
  app,
  onLoadReviews 
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();

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

  const handleNavigateToAnalysis = () => {
    navigate('/analysis', { state: { reviews, app } });
    toast({
      title: "Navigating to Analysis",
      description: `Analyzing ${reviews.length} reviews`,
    });
  };
  
  const handleNavigateToEDAAnalysis = () => {
    navigate('/eda-analysis', { state: { reviews, app } });
    toast({
      title: "Navigating to EDA Analysis",
      description: `${reviews.length} reviews ready for statistical analysis`,
    });
  };

  const handleNavigateToPreprocessing = () => {
    navigate('/preprocessing', { state: { reviews, app } });
    toast({
      title: "Navigating to Text Preprocessing",
      description: `${reviews.length} reviews available for text processing`,
    });
  };

  return (
    <>
      <div className="flex flex-wrap justify-end gap-2 mb-6">
        <Button variant="outline" onClick={handleNavigateToPreprocessing}>
          <FileText className="mr-2 h-4 w-4" />
          Text Preprocessing
        </Button>
        <Button variant="outline" onClick={handleNavigateToAnalysis}>
          <BarChart className="mr-2 h-4 w-4" />
          Advanced Analysis
        </Button>
        <Button variant="default" onClick={handleNavigateToEDAAnalysis}>
          <LineChart className="mr-2 h-4 w-4" />
          EDA & Statistics
        </Button>
      </div>
      
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
