
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';

const InfoCard: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Preprocessing Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium">What is Text Preprocessing?</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Text preprocessing is the process of cleaning and transforming text data to make it suitable for analysis.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium">Why is it Important?</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Preprocessing helps improve the quality of text analysis by removing noise and standardizing the text format.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium">Options Explained:</h3>
            <ul className="text-sm text-muted-foreground mt-1 space-y-1 list-disc pl-4">
              <li>Lowercase: Converts all text to lowercase for consistency</li>
              <li>Remove Stop Words: Eliminates common words that add little meaning</li>
              <li>Remove Numbers: Removes numerical values from the text</li>
              <li>Remove Punctuation: Removes punctuation marks from the text</li>
              <li>Remove HTML Tags: Cleans any HTML tags that might be present</li>
              <li>Apply Stemming: Reduces words to their root/stem form (e.g., "running" → "run")</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InfoCard;
