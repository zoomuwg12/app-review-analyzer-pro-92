
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ProcessedReview } from '@/utils/textProcessing';
import { AppReview } from '@/utils/scraper';

interface ReviewPreviewProps {
  selectedReview: AppReview | null;
  selectedReviewIndex: number;
  reviewsLength: number;
  processedReview: ProcessedReview;
  onPrevious: () => void;
  onNext: () => void;
  onProcessAll: () => void;
}

const ReviewPreview: React.FC<ReviewPreviewProps> = ({
  selectedReview,
  selectedReviewIndex,
  reviewsLength,
  processedReview,
  onPrevious,
  onNext,
  onProcessAll
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Text Preprocessing Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Review {selectedReviewIndex + 1} of {reviewsLength}</h3>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" onClick={onPrevious}>Previous</Button>
              <Button size="sm" variant="outline" onClick={onNext}>Next</Button>
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

          <Button className="w-full" onClick={onProcessAll}>
            Process All Reviews
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewPreview;
