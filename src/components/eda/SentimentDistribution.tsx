
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { AppReview } from '@/utils/scraper';
import { getSentiment } from '@/utils/textProcessing';

interface SentimentDistributionProps {
  reviews: AppReview[];
}

const SentimentDistribution: React.FC<SentimentDistributionProps> = ({ reviews }) => {
  // Count reviews by sentiment and score
  const sentimentCounts = reviews.reduce(
    (acc, review) => {
      const sentiment = getSentiment(review.score);
      acc[sentiment]++;
      return acc;
    },
    { positive: 0, neutral: 0, negative: 0 }
  );

  const pieData = [
    { name: 'Positive', value: sentimentCounts.positive, color: '#4caf50' },
    { name: 'Neutral', value: sentimentCounts.neutral, color: '#ff9800' },
    { name: 'Negative', value: sentimentCounts.negative, color: '#f44336' }
  ];

  // Count by score (1-5 stars)
  const scoreDistribution = reviews.reduce((acc, review) => {
    acc[review.score] = (acc[review.score] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const scorePieData = [
    { name: '5 ★', value: scoreDistribution[5] || 0, color: '#4caf50' },
    { name: '4 ★', value: scoreDistribution[4] || 0, color: '#8bc34a' },
    { name: '3 ★', value: scoreDistribution[3] || 0, color: '#ffc107' },
    { name: '2 ★', value: scoreDistribution[2] || 0, color: '#ff9800' },
    { name: '1 ★', value: scoreDistribution[1] || 0, color: '#f44336' }
  ];

  const total = reviews.length;
  const avgScore = reviews.reduce((sum, review) => sum + review.score, 0) / total || 0;

  const stats = [
    { label: 'Average Score', value: avgScore.toFixed(2) },
    { label: 'Positive %', value: `${((sentimentCounts.positive / total) * 100).toFixed(1)}%` },
    { label: 'Neutral %', value: `${((sentimentCounts.neutral / total) * 100).toFixed(1)}%` },
    { label: 'Negative %', value: `${((sentimentCounts.negative / total) * 100).toFixed(1)}%` },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Sentiment Distribution</CardTitle>
          <CardDescription>
            Distribution of positive, neutral and negative sentiments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} reviews`, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Rating Distribution</CardTitle>
          <CardDescription>
            Distribution of review ratings (1-5 stars)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={scorePieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                >
                  {scorePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} reviews`, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Sentiment Statistics Summary</CardTitle>
          <CardDescription>
            Key metrics from sentiment analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="bg-background/50 p-4 rounded-md border border-border">
                <div className="text-sm text-muted-foreground">{stat.label}</div>
                <div className="text-2xl font-semibold">{stat.value}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SentimentDistribution;
