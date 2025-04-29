
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, ZAxis } from 'recharts';
import { AppReview } from '@/utils/scraper';

interface ReviewLengthProps {
  reviews: AppReview[];
}

const ReviewLength: React.FC<ReviewLengthProps> = ({ reviews }) => {
  // Calculate review lengths
  const reviewLengths = reviews.map(review => ({
    id: review.id,
    userName: review.userName,
    length: review.content.length,
    wordCount: review.content.split(/\s+/).filter(Boolean).length,
    score: review.score,
  }));

  // Histogram data for content length
  const calculateHistogram = (data: number[], bins: number = 10) => {
    if (data.length === 0) return [];
    
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min;
    const binWidth = range / bins;
    
    const histogram = Array(bins).fill(0).map((_, i) => ({
      binStart: Math.round(min + i * binWidth),
      binEnd: Math.round(min + (i + 1) * binWidth),
      count: 0
    }));
    
    data.forEach(value => {
      const binIndex = Math.min(Math.floor((value - min) / binWidth), bins - 1);
      histogram[binIndex].count++;
    });
    
    return histogram.map(bin => ({
      binRange: `${bin.binStart}-${bin.binEnd}`,
      count: bin.count,
    }));
  };

  const lengthHistogram = calculateHistogram(reviewLengths.map(r => r.length));
  const wordCountHistogram = calculateHistogram(reviewLengths.map(r => r.wordCount));

  // Scatter plot data (word count vs. rating)
  const scatterData = reviewLengths.map(review => ({
    wordCount: review.wordCount,
    score: review.score,
    name: review.userName
  }));

  // Calculate stats
  const avgLength = reviewLengths.reduce((sum, review) => sum + review.length, 0) / reviewLengths.length || 0;
  const avgWordCount = reviewLengths.reduce((sum, review) => sum + review.wordCount, 0) / reviewLengths.length || 0;
  const maxLength = Math.max(...reviewLengths.map(r => r.length));
  const minLength = Math.min(...reviewLengths.map(r => r.length));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Review Length Distribution</CardTitle>
          <CardDescription>
            Distribution of review character lengths
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={lengthHistogram}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="binRange" 
                  angle={-45} 
                  textAnchor="end"
                  height={60}
                  label={{ value: 'Character Count Range', position: 'insideBottom', offset: -5 }}
                />
                <YAxis label={{ value: 'Number of Reviews', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    borderColor: '#475569',
                    borderRadius: '8px' 
                  }}
                  formatter={(value) => [`${value} reviews`, 'Count']}
                />
                <Bar dataKey="count" fill="#4caf50" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Word Count Distribution</CardTitle>
          <CardDescription>
            Distribution of review word counts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={wordCountHistogram}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="binRange" 
                  angle={-45} 
                  textAnchor="end"
                  height={60}
                  label={{ value: 'Word Count Range', position: 'insideBottom', offset: -5 }}
                />
                <YAxis label={{ value: 'Number of Reviews', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    borderColor: '#475569',
                    borderRadius: '8px' 
                  }}
                  formatter={(value) => [`${value} reviews`, 'Count']}
                />
                <Bar dataKey="count" fill="#2196f3" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Review Length vs Rating</CardTitle>
          <CardDescription>
            Relationship between review length and rating
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  type="number" 
                  dataKey="wordCount" 
                  name="Word Count" 
                  label={{ value: 'Word Count', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  type="number" 
                  dataKey="score" 
                  name="Rating" 
                  domain={[0, 5.5]} 
                  label={{ value: 'Rating', angle: -90, position: 'insideLeft' }}
                />
                <ZAxis range={[50, 50]} />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    borderColor: '#475569',
                    borderRadius: '8px' 
                  }}
                  formatter={(value, name) => [value, name]}
                />
                <Scatter 
                  name="Reviews" 
                  data={scatterData} 
                  fill="#8884d8"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Review Length Statistics</CardTitle>
          <CardDescription>
            Key metrics about review length
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-background/50 p-4 rounded-md border border-border">
              <div className="text-sm text-muted-foreground">Average Length (chars)</div>
              <div className="text-2xl font-semibold">{avgLength.toFixed(0)}</div>
            </div>
            <div className="bg-background/50 p-4 rounded-md border border-border">
              <div className="text-sm text-muted-foreground">Average Word Count</div>
              <div className="text-2xl font-semibold">{avgWordCount.toFixed(1)}</div>
            </div>
            <div className="bg-background/50 p-4 rounded-md border border-border">
              <div className="text-sm text-muted-foreground">Longest Review</div>
              <div className="text-2xl font-semibold">{maxLength} chars</div>
            </div>
            <div className="bg-background/50 p-4 rounded-md border border-border">
              <div className="text-sm text-muted-foreground">Shortest Review</div>
              <div className="text-2xl font-semibold">{minLength} chars</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewLength;
