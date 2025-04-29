
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Download, FileText, FileSpreadsheet, BarChart2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { AppReview } from '@/utils/scraper';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { exportToCsv, exportToExcel } from '@/utils/exportData';

interface ProcessedOutputViewProps {
  processedData: string;
  processedReviews: AppReview[];
  app: any | null;
}

const ProcessedOutputView: React.FC<ProcessedOutputViewProps> = ({
  processedData,
  processedReviews,
  app
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'text' | 'dataset'>('text');

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

  const exportProcessedReviews = (format: 'csv' | 'excel') => {
    const filename = `${app?.title || 'app'}_processed_reviews_${new Date().toISOString().split('T')[0]}`;
    
    if (format === 'csv') {
      exportToCsv(processedReviews, filename);
      toast({
        title: "Export successful",
        description: "Processed reviews exported as CSV",
      });
    } else {
      exportToExcel(processedReviews, filename);
      toast({
        title: "Export successful",
        description: "Processed reviews exported as Excel",
      });
    }
  };

  const navigateToTFIDF = () => {
    if (processedReviews.length > 0) {
      navigate('/tfidf', { 
        state: { 
          processedReviews, 
          app 
        } 
      });
      toast({
        title: "Navigating to TF-IDF Analysis",
        description: `${processedReviews.length} reviews ready for TF-IDF analysis`,
      });
    } else {
      toast({
        title: "No processed data",
        description: "Please process reviews first before performing TF-IDF analysis",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Processed Output</CardTitle>
        <div className="flex space-x-2">
          <Button 
            variant={viewMode === 'text' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('text')}
          >
            Text View
          </Button>
          <Button 
            variant={viewMode === 'dataset' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('dataset')}
          >
            Dataset View
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {processedData ? (
          viewMode === 'text' ? (
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
            <>
              <div className="rounded-md border overflow-auto max-h-[300px] mb-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Processed Review</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {processedReviews.slice(0, 50).map((review) => (
                      <TableRow key={review.id}>
                        <TableCell className="font-medium">{review.userName}</TableCell>
                        <TableCell className="max-w-xs truncate">{review.processedContent || review.content}</TableCell>
                        <TableCell>{review.score}</TableCell>
                        <TableCell>{review.at.toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {processedReviews.length > 50 && (
                <p className="text-sm text-muted-foreground mb-4">
                  Showing 50 of {processedReviews.length} processed reviews.
                </p>
              )}
              <div className="flex space-x-2 mb-4">
                <Button onClick={() => exportProcessedReviews('csv')} className="flex-1">
                  <FileText className="mr-2 h-4 w-4" />
                  Export as CSV
                </Button>
                <Button onClick={() => exportProcessedReviews('excel')} className="flex-1">
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Export as Excel
                </Button>
              </div>
              <Button onClick={navigateToTFIDF} className="w-full">
                <BarChart2 className="mr-2 h-4 w-4" />
                Run TF-IDF Analysis
              </Button>
            </>
          )
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
  );
};

export default ProcessedOutputView;
