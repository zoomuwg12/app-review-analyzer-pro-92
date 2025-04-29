
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

const TfidfExplanation: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Understanding TF-IDF Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium">What is TF-IDF?</h3>
            <p className="text-sm text-muted-foreground mt-1">
              TF-IDF (Term Frequency-Inverse Document Frequency) is a statistical measure used to evaluate the importance 
              of a word in a document relative to a collection of documents. It helps identify significant terms that are 
              distinctive to specific documents.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium">How is it calculated?</h3>
            <p className="text-sm text-muted-foreground mt-1">
              TF-IDF weight is the product of two factors:
            </p>
            <ul className="text-sm text-muted-foreground mt-1 space-y-1 list-disc pl-4">
              <li>Term Frequency (TF): How often a term appears in a document</li>
              <li>Inverse Document Frequency (IDF): How unique or rare the term is across all documents</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-medium">Why is TF-IDF useful for app reviews?</h3>
            <ul className="text-sm text-muted-foreground mt-1 space-y-1 list-disc pl-4">
              <li>Identifies important keywords specific to your app's reviews</li>
              <li>Helps discover unique feature requests or issues</li>
              <li>Filters out common words that appear in all reviews</li>
              <li>Provides insight into what makes your app distinctive</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TfidfExplanation;
