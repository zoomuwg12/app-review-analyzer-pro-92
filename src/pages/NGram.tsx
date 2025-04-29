
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { processNgrams } from '@/utils/textProcessing/ngram';
import { AppReview } from '@/utils/scraper';
import NgramTable from '@/components/ngram/NgramTable';
import NgramBarChart from '@/components/ngram/NgramBarChart';
import NgramOptions from '@/components/ngram/NgramOptions';
import NgramExplanation from '@/components/ngram/NgramExplanation';

const NGram: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { processedReviews, app } = location.state || { processedReviews: [], app: null };
  
  const [ngramSize, setNgramSize] = useState<number>(2);
  const [maxItems, setMaxItems] = useState<number>(20);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [ngramData, setNgramData] = useState<Array<{ ngram: string; count: number }>>([]);
  
  // Process n-grams when component mounts
  useEffect(() => {
    if (processedReviews?.length > 0) {
      processNgramData();
    }
  }, []);
  
  const processNgramData = () => {
    if (!processedReviews?.length) return;
    
    setIsProcessing(true);
    
    // Use setTimeout to avoid blocking the UI
    setTimeout(() => {
      try {
        const results = processNgrams(processedReviews as AppReview[], ngramSize, 100);
        setNgramData(results);
        
        toast({
          title: "N-Gram Processing Complete",
          description: `Processed ${processedReviews.length} reviews successfully.`,
        });
      } catch (error) {
        console.error("Error processing N-grams:", error);
        toast({
          title: "N-Gram Processing Error",
          description: "An error occurred while processing n-grams.",
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    }, 100);
  };
  
  // Navigate back to previous page
  const goBack = () => {
    navigate(-1);
  };
  
  // Handle n-gram size change
  const handleNgramSizeChange = (size: number) => {
    setNgramSize(size);
  };
  
  // Handle max items change
  const handleMaxItemsChange = (count: number) => {
    setMaxItems(count);
  };
  
  // Check if we have valid data
  if (!app || !processedReviews?.length) {
    return (
      <div className="container mx-auto py-12 px-4">
        <Card>
          <CardContent className="pt-6 flex flex-col items-center">
            <h2 className="text-2xl font-semibold mb-4">No processed data available</h2>
            <p className="text-muted-foreground text-center mb-6">
              Please process reviews in the preprocessing page first.
            </p>
            <Button onClick={() => navigate('/preprocessing')}>
              Go to Preprocessing
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
            <h1 className="text-3xl font-bold">{app.title} - N-Gram Analysis</h1>
            <p className="text-muted-foreground">{processedReviews.length} reviews analyzed</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <NgramOptions 
            ngramSize={ngramSize}
            maxItems={maxItems}
            onNgramSizeChange={handleNgramSizeChange}
            onMaxItemsChange={handleMaxItemsChange}
            onReprocess={processNgramData}
          />
          <NgramExplanation />
        </div>
        
        <div className="lg:col-span-2 space-y-6">
          <NgramTable 
            ngrams={ngramData}
            maxItems={maxItems}
            appTitle={app?.title}
          />
          <NgramBarChart 
            ngrams={ngramData}
            maxItems={maxItems}
          />
        </div>
      </div>
    </div>
  );
};

export default NGram;
