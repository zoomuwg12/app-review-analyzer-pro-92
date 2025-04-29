
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Download, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ReviewsPreprocessing from '@/components/ReviewsPreprocessing';

const Preprocessing: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [processedData, setProcessedData] = useState<string>('');
  const location = useLocation();
  const { reviews: locationReviews, app } = location.state || { reviews: [], app: null };
  
  // Store reviews in state to prevent loss during navigation
  const [reviews, setReviews] = useState(locationReviews || []);
  
  useEffect(() => {
    // Update reviews when location state changes
    if (location.state?.reviews?.length > 0) {
      setReviews(location.state.reviews);
    }
  }, [location.state]);

  const handleProcessedDataChange = (data: string) => {
    setProcessedData(data);
    toast({
      title: "Text preprocessing complete",
      description: `${reviews.length} reviews processed successfully.`,
      variant: "default",
    });
  };

  const downloadProcessedText = () => {
    const blob = new Blob([processedData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${app?.title || 'app'}_processed_reviews.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download started",
      description: "Processed text file is being downloaded",
    });
  };
  
  const goBack = () => {
    navigate(-1);
  };

  if (!app || reviews.length === 0) {
    return (
      <div className="container mx-auto py-12 px-4">
        <Card>
          <CardContent className="pt-6 flex flex-col items-center">
            <h2 className="text-2xl font-semibold mb-4">No data available for preprocessing</h2>
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

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={goBack} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{app.title} - Text Preprocessing</h1>
            <p className="text-muted-foreground">{reviews.length} reviews available for processing</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReviewsPreprocessing 
          reviews={reviews} 
          onProcessedDataChange={handleProcessedDataChange}
        />
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Processed Output</CardTitle>
            </CardHeader>
            <CardContent>
              {processedData ? (
                <>
                  <Textarea
                    readOnly
                    value={processedData}
                    className="min-h-[300px] mb-4 bg-muted/30"
                  />
                  <Button onClick={downloadProcessedText} className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download Processed Text
                  </Button>
                </>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No processed data yet</p>
                  <p className="text-sm mt-2">
                    Use the preprocessing options on the left and click "Process All Reviews"
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Preprocessing Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium">What is Text Preprocessing?</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Text preprocessing is the process of cleaning and transforming text data to make it suitable for analysis.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium">Why is it Important?</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Preprocessing helps improve the quality of text analysis by removing noise and standardizing the text format.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium">Options Explained:</h3>
                  <ul className="text-sm text-muted-foreground mt-1 space-y-1 list-disc pl-4">
                    <li>Lowercase: Converts all text to lowercase for consistency</li>
                    <li>Remove Stop Words: Eliminates common words that add little meaning</li>
                    <li>Remove Numbers: Removes numerical values from the text</li>
                    <li>Remove Punctuation: Removes punctuation marks from the text</li>
                    <li>Remove HTML Tags: Cleans any HTML tags that might be present</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Preprocessing;
