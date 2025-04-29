
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { AppReview } from '@/utils/scraper';
import { getAspectSentiments, categorizeReviewByAspect, APP_ASPECTS } from '@/utils/textProcessing';

interface AspectAnalysisProps {
  reviews: AppReview[];
}

const AspectAnalysis: React.FC<AspectAnalysisProps> = ({ reviews }) => {
  const aspectSentiments = getAspectSentiments(reviews);
  
  // Convert aspect sentiments to chart data
  const chartData = Object.entries(aspectSentiments)
    .filter(([aspect, counts]) => counts.total > 0)
    .map(([aspect, counts]) => ({
      aspect,
      positive: counts.positive,
      neutral: counts.neutral,
      negative: counts.negative,
      total: counts.total
    }))
    .sort((a, b) => b.total - a.total);

  // Find the most common aspects
  const topAspects = chartData.slice(0, 5);
  
  return (
    <div className="bg-card rounded-lg p-5 shadow-md">
      <h2 className="text-lg font-medium mb-4">Aspect-Based Analysis</h2>
      
      <div className="mb-6">
        <h3 className="text-md font-medium mb-3">Top Discussed Aspects</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topAspects}
              margin={{ top: 10, right: 30, left: 30, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="aspect" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  borderColor: '#475569',
                  borderRadius: '8px' 
                }} 
              />
              <Legend />
              <Bar dataKey="positive" name="Positive" stackId="a" fill="#4caf50" />
              <Bar dataKey="neutral" name="Neutral" stackId="a" fill="#ff9800" />
              <Bar dataKey="negative" name="Negative" stackId="a" fill="#f44336" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {chartData.slice(0, 6).map((aspect) => (
          <div key={aspect.aspect} className="bg-background/50 p-4 rounded-md border border-border">
            <h4 className="font-medium mb-2">{aspect.aspect}</h4>
            <div className="w-full bg-muted rounded-full h-2 mb-2">
              <div 
                className="bg-gradient-to-r from-sentiment-positive via-sentiment-neutral to-sentiment-negative h-2 rounded-full" 
                style={{ 
                  width: '100%',
                  background: `linear-gradient(to right, 
                    #4caf50 0%, 
                    #4caf50 ${(aspect.positive / aspect.total) * 100}%, 
                    #ff9800 ${(aspect.positive / aspect.total) * 100}%, 
                    #ff9800 ${((aspect.positive + aspect.neutral) / aspect.total) * 100}%, 
                    #f44336 ${((aspect.positive + aspect.neutral) / aspect.total) * 100}%, 
                    #f44336 100%)`
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <div>Mentions: {aspect.total}</div>
              <div className="flex space-x-3">
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-sentiment-positive rounded-full mr-1"></div>
                  {aspect.positive}
                </span>
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-sentiment-neutral rounded-full mr-1"></div>
                  {aspect.neutral}
                </span>
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-sentiment-negative rounded-full mr-1"></div>
                  {aspect.negative}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AspectAnalysis;
