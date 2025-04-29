
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AppReview } from '@/utils/scraper';

interface RatingsDistributionProps {
  reviews: AppReview[];
}

const RatingsDistribution: React.FC<RatingsDistributionProps> = ({ reviews }) => {
  // Count reviews by rating
  const ratingCounts = reviews.reduce((acc, review) => {
    acc[review.score] = (acc[review.score] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  // Create data for the chart
  const data = [
    { rating: '5 ★', count: ratingCounts[5] || 0, color: '#4caf50' },
    { rating: '4 ★', count: ratingCounts[4] || 0, color: '#8bc34a' },
    { rating: '3 ★', count: ratingCounts[3] || 0, color: '#ffc107' },
    { rating: '2 ★', count: ratingCounts[2] || 0, color: '#ff9800' },
    { rating: '1 ★', count: ratingCounts[1] || 0, color: '#f44336' }
  ];

  return (
    <div className="bg-card rounded-lg p-5 shadow-md">
      <h2 className="text-lg font-medium mb-4">Rating Distribution</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="rating" />
            <YAxis />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1e293b', 
                borderColor: '#475569',
                borderRadius: '8px' 
              }} 
            />
            <Bar dataKey="count" name="Reviews">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RatingsDistribution;
