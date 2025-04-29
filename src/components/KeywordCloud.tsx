
import React from 'react';
import { getKeywordFrequencies } from '@/utils/textProcessing';
import { AppReview } from '@/utils/scraper';

interface KeywordCloudProps {
  reviews: AppReview[];
}

const KeywordCloud: React.FC<KeywordCloudProps> = ({ reviews }) => {
  const reviewTexts = reviews.map(review => review.content);
  const keywords = getKeywordFrequencies(reviewTexts, 50);
  
  // Calculate font sizes based on frequencies
  const maxFreq = keywords.length > 0 ? keywords[0].count : 0;
  const minFreq = keywords.length > 0 ? keywords[keywords.length - 1].count : 0;
  const range = maxFreq - minFreq || 1;
  
  const getFontSize = (count: number) => {
    const minSize = 12;
    const maxSize = 28;
    const normalized = (count - minFreq) / range;
    return minSize + normalized * (maxSize - minSize);
  };

  const getColor = (index: number) => {
    // Color palette for the keywords
    const colors = [
      '#4caf50', '#2196f3', '#ff9800', '#9c27b0', 
      '#00bcd4', '#f44336', '#8bc34a', '#3f51b5'
    ];
    return colors[index % colors.length];
  };
  
  return (
    <div className="bg-card rounded-lg p-5 shadow-md">
      <h2 className="text-lg font-medium mb-4">Keyword Analysis</h2>
      
      {keywords.length === 0 ? (
        <div className="text-center text-muted-foreground p-8">
          No keywords available
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-2 p-4">
          {keywords.map((keyword, index) => (
            <span
              key={keyword.word}
              className="px-2 py-0.5 rounded hover:bg-background/50 cursor-default transition-colors"
              style={{
                fontSize: `${getFontSize(keyword.count)}px`,
                color: getColor(index),
                opacity: 0.7 + (keyword.count / maxFreq) * 0.3
              }}
              title={`${keyword.word}: ${keyword.count} occurrences`}
            >
              {keyword.word}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default KeywordCloud;
