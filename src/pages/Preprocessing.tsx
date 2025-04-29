
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { AppReview } from '@/utils/scraper';
import ReviewsPreprocessing from '@/components/ReviewsPreprocessing';
import NoDataAlert from '@/components/preprocessing/NoDataAlert';
import PreprocessingHeader from '@/components/preprocessing/PreprocessingHeader';
import ProcessedOutputView from '@/components/preprocessing/ProcessedOutputView';
import InfoCard from '@/components/preprocessing/InfoCard';

const Preprocessing: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [processedData, setProcessedData] = useState<string>('');
  const [processedReviews, setProcessedReviews] = useState<AppReview[]>([]);
  const location = useLocation();
  const { reviews: locationReviews, app } = location.state || { reviews: [], app: null };
  
  // Store reviews in state to prevent loss during navigation
  const [reviews, setReviews] = useState(locationReviews || []);
  
  useEffect(() => {
    // Update reviews when location state changes
    if (location.state?.reviews?.length > 0) {
      setReviews(location.state.reviews);
    }
  }, [location.state]);

  const handleProcessedDataChange = (data: string) => {
    setProcessedData(data);
    toast({
      title: "Text preprocessing complete",
      description: `${reviews.length} reviews processed successfully.`,
      variant: "default",
    });
  };

  const handleProcessedReviewsChange = (data: AppReview[]) => {
    setProcessedReviews(data);
  };
  
  const goBack = () => {
    navigate(-1);
  };

  // If no app or reviews data, show alert
  if (!app || reviews.length === 0) {
    return <NoDataAlert />;
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <PreprocessingHeader 
        title={app.title} 
        reviewCount={reviews.length} 
        onBack={goBack} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReviewsPreprocessing 
          reviews={reviews} 
          onProcessedDataChange={handleProcessedDataChange}
          onProcessedReviewsChange={handleProcessedReviewsChange}
        />
        
        <div className="space-y-6">
          <ProcessedOutputView 
            processedData={processedData}
            processedReviews={processedReviews}
            app={app}
          />
          
          <InfoCard />
        </div>
      </div>
    </div>
  );
};

export default Preprocessing;
