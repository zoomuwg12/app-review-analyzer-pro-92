
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, FileText, BarChart2, LineChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppReview } from '@/utils/scraper';
import SentimentSummary from '@/components/SentimentSummary';
import RatingsDistribution from '@/components/RatingsDistribution';
import AspectAnalysis from '@/components/AspectAnalysis';
import ReviewsTable from '@/components/ReviewsTable';
import { useToast } from '@/hooks/use-toast';
import Swal from 'sweetalert2';

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

  const showAnalysisInfo = () => {
    Swal.fire({
      title: 'Advanced Analysis',
      html: `
        <div class="text-left">
          <p>The Advanced Analysis section provides deeper insights into your app reviews:</p>
          <ul class="list-disc pl-5 mt-2">
            <li class="mb-1">Sentiment breakdown with detailed metrics</li>
            <li class="mb-1">Topic modeling to discover common themes</li>
            <li class="mb-1">Keyword extraction for important terms</li>
            <li class="mb-1">Custom visualization options</li>
          </ul>
        </div>
      `,
      confirmButtonText: 'Got it!',
      showClass: {
        popup: 'animate-in',
      },
      hideClass: {
        popup: 'animate-out',
      }
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
          <BarChart2 className="mr-2 h-4 w-4" />
          Advanced Analysis
          <Button 
            variant="ghost" 
            size="icon" 
            className="ml-1 h-5 w-5 rounded-full p-0" 
            onClick={(e) => {
              e.stopPropagation();
              showAnalysisInfo();
            }}
          >
            <span className="font-semibold">?</span>
          </Button>
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
