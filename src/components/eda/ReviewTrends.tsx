
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AppReview } from '@/utils/scraper';
import { getSentiment } from '@/utils/textProcessing';

interface ReviewTrendsProps {
  reviews: AppReview[];
}

const ReviewTrends: React.FC<ReviewTrendsProps> = ({ reviews }) => {
  // Sort reviews by date (oldest to newest)
  const sortedReviews = [...reviews].sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());
  
  // Group reviews by month
  const reviewsByMonth: Record<string, { 
    count: number, 
    avgScore: number,
    positive: number,
    neutral: number,
    negative: number
  }> = {};
  
  sortedReviews.forEach(review => {
    const date = new Date(review.at);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!reviewsByMonth[monthKey]) {
      reviewsByMonth[monthKey] = { 
        count: 0, 
        avgScore: 0,
        positive: 0,
        neutral: 0,
        negative: 0
      };
    }
    
    const sentiment = getSentiment(review.score);
    reviewsByMonth[monthKey][sentiment]++;
    reviewsByMonth[monthKey].count++;
    reviewsByMonth[monthKey].avgScore += review.score;
  });
  
  // Calculate average scores and format data for charts
  const monthlyData = Object.entries(reviewsByMonth).map(([month, data]) => {
    const [year, monthNum] = month.split('-');
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    return {
      month: `${monthNames[parseInt(monthNum) - 1]} ${year}`,
      avgScore: data.count > 0 ? (data.avgScore / data.count).toFixed(2) : 0,
      reviewCount: data.count,
      positive: data.positive,
      neutral: data.neutral,
      negative: data.negative
    };
  });
  
  // Group reviews by day of week
  const reviewsByDayOfWeek = Array(7).fill(0).map(() => ({ 
    count: 0, 
    avgScore: 0,
    positive: 0,
    neutral: 0,
    negative: 0
  }));
  
  sortedReviews.forEach(review => {
    const date = new Date(review.at);
    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    const sentiment = getSentiment(review.score);
    reviewsByDayOfWeek[dayOfWeek][sentiment]++;
    reviewsByDayOfWeek[dayOfWeek].count++;
    reviewsByDayOfWeek[dayOfWeek].avgScore += review.score;
  });
  
  // Calculate average scores by day of week
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayOfWeekData = reviewsByDayOfWeek.map((data, index) => ({
    day: dayNames[index],
    avgScore: data.count > 0 ? Number((data.avgScore / data.count).toFixed(2)) : 0,
    reviewCount: data.count,
    positive: data.positive,
    neutral: data.neutral,
    negative: data.negative
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Rating Trends Over Time</CardTitle>
          <CardDescription>
            Average rating by month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={monthlyData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="month" 
                  angle={-45} 
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  yAxisId="left" 
                  domain={[0, 5]} 
                  label={{ value: 'Average Rating', angle: -90, position: 'insideLeft' }}
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right" 
                  label={{ value: 'Review Count', angle: 90, position: 'insideRight' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    borderColor: '#475569',
                    borderRadius: '8px' 
                  }}
                />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="avgScore" 
                  name="Avg Rating"
                  stroke="#4caf50" 
                  strokeWidth={2}
                  dot={{ fill: '#4caf50', r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="reviewCount" 
                  name="Review Count"
                  stroke="#2196f3" 
                  strokeWidth={2}
                  dot={{ fill: '#2196f3', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Review Volume by Month</CardTitle>
          <CardDescription>
            Number of reviews received by month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="month" 
                  angle={-45} 
                  textAnchor="end"
                  height={60}
                />
                <YAxis label={{ value: 'Number of Reviews', angle: -90, position: 'insideLeft' }} />
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reviews by Day of Week</CardTitle>
          <CardDescription>
            Patterns of reviews across different days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dayOfWeekData}
                margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    borderColor: '#475569',
                    borderRadius: '8px' 
                  }}
                />
                <Legend />
                <Bar dataKey="reviewCount" name="Review Count" fill="#9c27b0" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewTrends;
