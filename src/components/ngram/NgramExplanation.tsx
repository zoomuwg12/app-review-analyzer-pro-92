
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const NgramExplanation: React.FC = () => {
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
    </Card>
  );
};

export default NgramExplanation;
