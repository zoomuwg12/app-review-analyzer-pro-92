
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChartBar, Download } from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AppReview } from '@/utils/scraper';
import { exportToCsv } from '@/utils/exportData';
import { useToast } from '@/hooks/use-toast';

interface ProcessedOutputViewProps {
  processedData: string;
  processedReviews: AppReview[];
  app: any;
}

const ProcessedOutputView: React.FC<ProcessedOutputViewProps> = ({ 
  processedData,
  processedReviews,
  app
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleExport = () => {
    if (!processedReviews?.length) return;
    
    const exportData = processedReviews.map((review) => ({
      id: review.id,
      content: review.processedContent || review.content,
      score: review.score,
      date: review.at // Use review.at instead of review.date
    }));
    
    exportToCsv(exportData, `${app?.title}_processed_reviews_${new Date().toISOString().split('T')[0]}`);
    
    toast({
      title: "Export successful",
      description: "Processed reviews exported as CSV",
    });
  };

  const navigateToTfIdf = () => {
    if (processedReviews?.length > 0 && app) {
      navigate('/tfidf', { 
        state: { 
          processedReviews: processedReviews,
          app: app
        }
      });
    } else {
      toast({
        title: "No data available",
        description: "Please process your reviews first.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Processed Output</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-[300px] overflow-auto border rounded-md p-3 bg-muted/30">
          {processedData ? (
            <pre className="text-xs whitespace-pre-wrap">{processedData}</pre>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Click "Process All Reviews" to see results
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <div className="flex w-full gap-2">
          <Button 
            variant="outline" 
            className="w-1/2"
            disabled={!processedData}
            onClick={handleExport}
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button 
            className="w-1/2"
            disabled={!processedData}
            onClick={navigateToTfIdf}
          >
            <ChartBar className="mr-2 h-4 w-4" />
            TF-IDF Analysis
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProcessedOutputView;
