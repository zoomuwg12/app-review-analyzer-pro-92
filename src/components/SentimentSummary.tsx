
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { AppReview } from '@/utils/scraper';
import { getSentiment } from '@/utils/textProcessing';

interface SentimentSummaryProps {
  reviews: AppReview[];
}

const SentimentSummary: React.FC<SentimentSummaryProps> = ({ reviews }) => {
  // Count reviews by sentiment
  const sentimentCounts = reviews.reduce(
    (acc, review) => {
      const sentiment = getSentiment(review.score);
      acc[sentiment]++;
      return acc;
    },
    { positive: 0, neutral: 0, negative: 0 }
  );

  const data = [
    { name: 'Positive', value: sentimentCounts.positive, color: '#4caf50' },
    { name: 'Neutral', value: sentimentCounts.neutral, color: '#ff9800' },
    { name: 'Negative', value: sentimentCounts.negative, color: '#f44336' }
  ];

  // Calculate percentages
  const total = reviews.length;
  const percentages = {
    positive: ((sentimentCounts.positive / total) * 100).toFixed(1),
    neutral: ((sentimentCounts.neutral / total) * 100).toFixed(1),
    negative: ((sentimentCounts.negative / total) * 100).toFixed(1)
  };

  return (
    <div className="bg-card rounded-lg p-5 shadow-md">
      <h2 className="text-lg font-medium mb-4">Sentiment Analysis</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col justify-center">
          <div className="stats-grid grid gap-4">
            <div className="bg-background/50 p-3 rounded-md border border-border">
              <div className="text-sm text-muted-foreground">Positive</div>
              <div className="flex justify-between items-center">
                <div className="text-xl font-semibold text-sentiment-positive">
                  {sentimentCounts.positive}
                </div>
                <div className="text-sm text-muted-foreground">
                  {percentages.positive}%
                </div>
              </div>
            </div>
            <div className="bg-background/50 p-3 rounded-md border border-border">
              <div className="text-sm text-muted-foreground">Neutral</div>
              <div className="flex justify-between items-center">
                <div className="text-xl font-semibold text-sentiment-neutral">
                  {sentimentCounts.neutral}
                </div>
                <div className="text-sm text-muted-foreground">
                  {percentages.neutral}%
                </div>
              </div>
            </div>
            <div className="bg-background/50 p-3 rounded-md border border-border">
              <div className="text-sm text-muted-foreground">Negative</div>
              <div className="flex justify-between items-center">
                <div className="text-xl font-semibold text-sentiment-negative">
                  {sentimentCounts.negative}
                </div>
                <div className="text-sm text-muted-foreground">
                  {percentages.negative}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SentimentSummary;
