
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AppReview } from '@/utils/scraper';
import { preprocessText } from '@/utils/textProcessing';

interface ReviewsPreprocessingProps {
  reviews: AppReview[];
  onProcessedDataChange?: (data: string) => void;
}

const ReviewsPreprocessing: React.FC<ReviewsPreprocessingProps> = ({ 
  reviews, 
  onProcessedDataChange 
}) => {
  const [options, setOptions] = useState({
    lowercase: true,
    removeStopWords: true,
    removeNumbers: false,
    removePunctuation: true,
    removeTags: true,
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

  const handleProcessAll = () => {
    const processedText = processAllReviews();
    if (onProcessedDataChange) {
      onProcessedDataChange(processedText);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Preprocessing Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="lowercase" className="cursor-pointer">Convert to lowercase</Label>
              <Switch
                id="lowercase"
                checked={options.lowercase}
                onCheckedChange={() => handleOptionChange('lowercase')}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="removeStopWords" className="cursor-pointer">Remove stop words</Label>
              <Switch
                id="removeStopWords"
                checked={options.removeStopWords}
                onCheckedChange={() => handleOptionChange('removeStopWords')}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="removeNumbers" className="cursor-pointer">Remove numbers</Label>
              <Switch
                id="removeNumbers"
                checked={options.removeNumbers}
                onCheckedChange={() => handleOptionChange('removeNumbers')}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="removePunctuation" className="cursor-pointer">Remove punctuation</Label>
              <Switch
                id="removePunctuation"
                checked={options.removePunctuation}
                onCheckedChange={() => handleOptionChange('removePunctuation')}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="removeTags" className="cursor-pointer">Remove HTML tags</Label>
              <Switch
                id="removeTags"
                checked={options.removeTags}
                onCheckedChange={() => handleOptionChange('removeTags')}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Text Preprocessing Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Review {selectedReviewIndex + 1} of {reviews.length}</h3>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={handlePreviousReview}>Previous</Button>
                <Button size="sm" variant="outline" onClick={handleNextReview}>Next</Button>
              </div>
            </div>

            {selectedReview ? (
              <>
                <div>
                  <h3 className="text-sm font-medium mb-1">Original Text:</h3>
                  <Textarea
                    readOnly
                    value={selectedReview.content}
                    className="h-24 resize-none bg-muted/30"
                  />
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-1">Processed Text:</h3>
                  <Textarea
                    readOnly
                    value={processedReview.processed}
                    className="h-24 resize-none bg-background/30"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="bg-background/30 p-2 rounded-md">
                    <h4 className="text-xs font-medium mb-1">Sentences</h4>
                    <p className="text-sm">{processedReview.sentences.length}</p>
                  </div>
                  <div className="bg-background/30 p-2 rounded-md">
                    <h4 className="text-xs font-medium mb-1">Words</h4>
                    <p className="text-sm">{processedReview.wordCount}</p>
                  </div>
                  <div className="bg-background/30 p-2 rounded-md">
                    <h4 className="text-xs font-medium mb-1">Unique Words</h4>
                    <p className="text-sm">{processedReview.uniqueWordCount}</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No reviews available for preprocessing
              </div>
            )}

            <Button className="w-full" onClick={handleProcessAll}>
              Process All Reviews
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewsPreprocessing;
