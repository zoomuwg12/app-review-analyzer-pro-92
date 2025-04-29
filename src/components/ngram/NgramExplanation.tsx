
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BrainCircuit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NgramExplanationProps {
  app?: any;
  processedReviews?: any[];
}

const NgramExplanation: React.FC<NgramExplanationProps> = ({ app, processedReviews }) => {
  const navigate = useNavigate();

  const handleNavigateToMLComparison = () => {
    if (processedReviews?.length > 0 && app) {
      navigate('/ml-comparison', { 
        state: { 
          reviews: processedReviews,
          app: app
        }
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>About N-Gram Analysis</CardTitle>
        <CardDescription>
          Understanding how N-Grams help in text analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm space-y-4">
        <p>
          <strong>N-Grams</strong> are contiguous sequences of n items from a text. For example:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Unigrams (n=1):</strong> Individual words like "app", "great", "feature"</li>
          <li><strong>Bigrams (n=2):</strong> Pairs of words like "great app", "new feature"</li>
          <li><strong>Trigrams (n=3):</strong> Three-word sequences like "easy to use"</li>
        </ul>
        <p>
          N-Gram analysis helps identify common phrases in user reviews, revealing:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Frequently mentioned features or aspects</li>
          <li>Common praise or complaint patterns</li>
          <li>Multi-word expressions that single-word analysis might miss</li>
        </ul>
        <p>
          Use this analysis to complement TF-IDF by examining how words appear together in context rather than just their individual importance.
        </p>
      </CardContent>
      {app && processedReviews && processedReviews.length > 0 && (
        <CardFooter className="border-t pt-4">
          <Button variant="outline" className="w-full" onClick={handleNavigateToMLComparison}>
            <BrainCircuit className="mr-2 h-4 w-4" />
            Try Machine Learning Analysis
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default NgramExplanation;
