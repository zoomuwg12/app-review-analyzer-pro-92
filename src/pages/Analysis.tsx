
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { LineChart, BarChart, FileText } from 'lucide-react';
import KeywordCloud from '@/components/KeywordCloud';
import AspectAnalysis from '@/components/AspectAnalysis';
import { useToast } from '@/hooks/use-toast';

const Analysis: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { reviews, app } = location.state || { reviews: [], app: null };

  if (!app || reviews.length === 0) {
    return (
      <div className="container mx-auto py-12 px-4">
        <Card>
          <CardContent className="pt-6 flex flex-col items-center">
            <h2 className="text-2xl font-semibold mb-4">No data available for analysis</h2>
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

  const handleNavigateToEDAAnalysis = () => {
    navigate('/eda-analysis', { state: { reviews, app } });
    toast({
      title: "Navigating to EDA Analysis",
      description: `Analyzing ${reviews.length} reviews for ${app.title}`,
    });
  };
  
  const handleNavigateToPreprocessing = () => {
    navigate('/preprocessing', { state: { reviews, app } });
    toast({
      title: "Navigating to Preprocessing",
      description: `${reviews.length} reviews ready for preprocessing`,
    });
  };

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{app.title} - Advanced Analysis</h1>
          <p className="text-muted-foreground">Analyzing {reviews.length} reviews</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleNavigateToPreprocessing}>
            <FileText className="mr-2 h-4 w-4" />
            Text Preprocessing
          </Button>
          <Button variant="default" onClick={handleNavigateToEDAAnalysis}>
            <LineChart className="mr-2 h-4 w-4" />
            EDA & Statistics
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Keyword Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <KeywordCloud reviews={reviews} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Aspect Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <AspectAnalysis reviews={reviews} />
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Sentiment Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            This feature will be available in the next update.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analysis;
