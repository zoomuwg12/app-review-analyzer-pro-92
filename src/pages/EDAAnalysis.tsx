
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AppReview } from '@/utils/scraper';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ReviewCorrelation from '@/components/eda/ReviewCorrelation';
import ReviewTrends from '@/components/eda/ReviewTrends';
import ReviewLength from '@/components/eda/ReviewLength';
import SentimentDistribution from '@/components/eda/SentimentDistribution';
import { useToast } from '@/hooks/use-toast';

const EDAAnalysis: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [timeFrame, setTimeFrame] = useState('all');
  const { reviews: locationReviews, app } = location.state || { reviews: [], app: null };
  
  // Store reviews in state to prevent loss during navigation
  const [reviews, setReviews] = useState<AppReview[]>(locationReviews || []);
  
  useEffect(() => {
    // Update reviews when location state changes
    if (location.state?.reviews?.length > 0) {
      setReviews(location.state.reviews);
      toast({
        title: "Data loaded successfully",
        description: `${location.state.reviews.length} reviews available for analysis`,
      });
    }
  }, [location.state, toast]);

  if (!app || reviews.length === 0) {
    return (
      <div className="container mx-auto py-12 px-4">
        <Card>
          <CardContent className="pt-6 flex flex-col items-center">
            <h2 className="text-2xl font-semibold mb-4">No data available for EDA analysis</h2>
            <p className="text-muted-foreground text-center mb-6">
              Please select an app and load reviews from the dashboard first.
            </p>
            <Button asChild>
              <Link to="/">Return to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredReviews = timeFrame === 'all' 
    ? reviews 
    : reviews.filter(review => {
        const reviewDate = new Date(review.at);
        const now = new Date();
        const daysAgo = (now.getTime() - reviewDate.getTime()) / (1000 * 60 * 60 * 24);
        
        switch (timeFrame) {
          case '30days': return daysAgo <= 30;
          case '90days': return daysAgo <= 90;
          case '180days': return daysAgo <= 180;
          default: return true;
        }
      });

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{app.title} - Data Science & EDA</h1>
          <p className="text-muted-foreground">Analyzing {filteredReviews.length} reviews</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Time Frame:</span>
          <Select value={timeFrame} onValueChange={setTimeFrame}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time frame" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="180days">Last 180 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="sentimentDistribution" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
          <TabsTrigger value="sentimentDistribution">Sentiment Distribution</TabsTrigger>
          <TabsTrigger value="reviewLength">Review Length Analysis</TabsTrigger>
          <TabsTrigger value="reviewTrends">Review Trends</TabsTrigger>
          <TabsTrigger value="correlation">Correlation Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sentimentDistribution">
          <SentimentDistribution reviews={filteredReviews} />
        </TabsContent>
        
        <TabsContent value="reviewLength">
          <ReviewLength reviews={filteredReviews} />
        </TabsContent>
        
        <TabsContent value="reviewTrends">
          <ReviewTrends reviews={filteredReviews} />
        </TabsContent>
        
        <TabsContent value="correlation">
          <ReviewCorrelation reviews={filteredReviews} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EDAAnalysis;
