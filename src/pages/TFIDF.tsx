
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { processTfIdf } from '@/utils/tfIdfProcessing';
import TopTermsTable from '@/components/tfidf/TopTermsTable';
import TermsVisualization from '@/components/tfidf/TermsVisualization';
import TfidfExplanation from '@/components/tfidf/TfidfExplanation';
import TfidfLoading from '@/components/tfidf/TfidfLoading';

const TFIDF: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { processedReviews, app } = location.state || { processedReviews: [], app: null };
  
  const [maxTerms, setMaxTerms] = useState<number>(20);
  const [tfIdfData, setTfIdfData] = useState<{ topTermsOverall: { term: string; weight: number }[] }>({ topTermsOverall: [] });
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  useEffect(() => {
    if (processedReviews?.length > 0) {
      setIsProcessing(true);
      
      // Process TF-IDF in a setTimeout to avoid blocking the UI
      setTimeout(() => {
        try {
          const result = processTfIdf(processedReviews);
          setTfIdfData(result);
          console.log("TF-IDF processing complete:", result);
          
          toast({
            title: "TF-IDF Processing Complete",
            description: `Processed ${processedReviews.length} reviews successfully.`,
          });
        } catch (error) {
          console.error("Error processing TF-IDF:", error);
          toast({
            title: "TF-IDF Processing Error",
            description: "An error occurred while processing TF-IDF data.",
            variant: "destructive",
          });
        } finally {
          setIsProcessing(false);
        }
      }, 100);
    }
  }, [processedReviews, toast]);
  
  const goBack = () => {
    navigate(-1);
  };
  
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
            <h1 className="text-3xl font-bold">{app.title} - TF-IDF Analysis</h1>
            <p className="text-muted-foreground">{processedReviews.length} reviews analyzed</p>
          </div>
        </div>
      </div>
      
      {isProcessing ? (
        <TfidfLoading reviewCount={processedReviews.length} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopTermsTable 
            terms={tfIdfData.topTermsOverall} 
            maxTerms={maxTerms} 
            onMaxTermsChange={setMaxTerms}
            appTitle={app?.title}
          />
          
          <TermsVisualization 
            terms={tfIdfData.topTermsOverall} 
            maxTerms={maxTerms}
          />
          
          <TfidfExplanation />
        </div>
      )}
    </div>
  );
};

export default TFIDF;
