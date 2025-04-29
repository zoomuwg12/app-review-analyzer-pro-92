import React, { useState } from 'react';
import { AppReview } from '@/utils/scraper';
import { preprocessText } from '@/utils/textProcessing';
import PreprocessingOptions from '@/components/preprocessing/PreprocessingOptions';
import ReviewPreview from '@/components/preprocessing/ReviewPreview';

interface ReviewsPreprocessingProps {
  reviews: AppReview[];
  onProcessedDataChange?: (data: string) => void;
  onProcessedReviewsChange?: (data: AppReview[]) => void;
}

const ReviewsPreprocessing: React.FC<ReviewsPreprocessingProps> = ({ 
  reviews, 
  onProcessedDataChange,
  onProcessedReviewsChange
}) => {
  const [options, setOptions] = useState({
    lowercase: true,
    removeStopWords: true,
    removeNumbers: false,
    removePunctuation: true,
    removeTags: true,
    applyStemming: false,
  });

  const [selectedReviewIndex, setSelectedReviewIndex] = useState(0);
  
  const handleOptionChange = (option: keyof typeof options) => {
    setOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  const selectedReview = reviews[selectedReviewIndex];
  
  // Process the selected review text
  const processedReview = selectedReview ? 
    preprocessText(selectedReview.content, options) : 
    { original: '', processed: '', sentences: [], words: [], wordCount: 0, uniqueWords: [], uniqueWordCount: 0 };

  // Handle review navigation
  const handlePreviousReview = () => {
    setSelectedReviewIndex(prev => (prev - 1 + reviews.length) % reviews.length);
  };

  const handleNextReview = () => {
    setSelectedReviewIndex(prev => (prev + 1) % reviews.length);
  };

  // Process all reviews and return as text
  const processAllReviews = () => {
    if (reviews.length === 0) return '';
    
    return reviews
      .map(review => preprocessText(review.content, options).processed)
      .join('\n');
  };

  // Process all reviews and return modified review objects
  const processAllReviewObjects = (): AppReview[] => {
    if (reviews.length === 0) return [];
    
    return reviews.map(review => ({
      ...review,
      content: preprocessText(review.content, options).processed,
      processedContent: preprocessText(review.content, options).processed,
      // Keep the original content in a separate field
      originalContent: review.content
    }));
  };

  const handleProcessAll = () => {
    const processedText = processAllReviews();
    const processedReviews = processAllReviewObjects();
    
    if (onProcessedDataChange) {
      onProcessedDataChange(processedText);
    }
    
    if (onProcessedReviewsChange) {
      onProcessedReviewsChange(processedReviews);
    }
  };

  return (
    <div className="space-y-6">
      <PreprocessingOptions
        options={options}
        onOptionChange={handleOptionChange}
      />

      <ReviewPreview
        selectedReview={selectedReview}
        selectedReviewIndex={selectedReviewIndex}
        reviewsLength={reviews.length}
        processedReview={processedReview}
        onPrevious={handlePreviousReview}
        onNext={handleNextReview}
        onProcessAll={handleProcessAll}
      />
    </div>
  );
};

export default ReviewsPreprocessing;
