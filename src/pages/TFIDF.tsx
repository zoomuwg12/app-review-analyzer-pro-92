
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChart2, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AppReview } from '@/utils/scraper';
import { processTfIdf, TermWeight } from '@/utils/tfIdfProcessing';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { exportToCsv } from '@/utils/exportData';

// Chart component for visualization
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const TFIDF: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { processedReviews, app } = location.state || { processedReviews: [], app: null };
  
  const [maxTerms, setMaxTerms] = useState<number>(20);
  const [tfIdfData, setTfIdfData] = useState<{ topTermsOverall: TermWeight[] }>({ topTermsOverall: [] });
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  useEffect(() => {
    if (processedReviews?.length > 0) {
      setIsProcessing(true);
      
      // Process TF-IDF in a setTimeout to avoid blocking the UI
      setTimeout(() => {
        const result = processTfIdf(processedReviews);
        setTfIdfData(result);
        setIsProcessing(false);
        
        toast({
          title: "TF-IDF Processing Complete",
          description: `Processed ${processedReviews.length} reviews successfully.`,
        });
      }, 100);
    }
  }, [processedReviews, toast]);
  
  const goBack = () => {
    navigate(-1);
  };
  
  const downloadTfIdfResults = () => {
    if (!tfIdfData.topTermsOverall?.length) return;
    
    // Format data for CSV
    const csvData = tfIdfData.topTermsOverall.map((item, index) => ({
      Rank: index + 1,
      Term: item.term,
      "TF-IDF Weight": item.weight.toFixed(4)
    }));
    
    exportToCsv(csvData, `${app?.title || 'app'}_tfidf_results_${new Date().toISOString().split('T')[0]}`);
    
    toast({
      title: "Export successful",
      description: "TF-IDF results exported as CSV",
    });
  };
  
  // Chart data preparation
  const getChartData = () => {
    return tfIdfData.topTermsOverall
      .slice(0, maxTerms)
      .map(item => ({
        term: item.term,
        weight: parseFloat(item.weight.toFixed(4))
      }));
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
            <Button asChild onClick={() => navigate('/preprocessing')}>
              <span>Go to Preprocessing</span>
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
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <BarChart2 className="h-16 w-16 animate-pulse text-primary" />
              <h3 className="text-xl font-semibold">Processing TF-IDF</h3>
              <p className="text-center text-muted-foreground">
                Analyzing term importance across {processedReviews.length} reviews. This may take a moment...
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Top Terms by TF-IDF</CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Show:</span>
                <Select 
                  value={maxTerms.toString()} 
                  onValueChange={(value) => setMaxTerms(parseInt(value))}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue placeholder="20" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="30">30</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Term</TableHead>
                      <TableHead className="text-right">TF-IDF Weight</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tfIdfData.topTermsOverall.slice(0, maxTerms).map((item, index) => (
                      <TableRow key={item.term}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{item.term}</TableCell>
                        <TableCell className="text-right">{item.weight.toFixed(4)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <Button onClick={downloadTfIdfResults} className="w-full mt-4">
                <Download className="mr-2 h-4 w-4" />
                Export Results
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Term Importance Visualization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={getChartData()}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis type="number" domain={[0, 'auto']} />
                    <YAxis 
                      type="category" 
                      dataKey="term" 
                      width={80} 
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      formatter={(value: number) => [value.toFixed(4), 'TF-IDF Weight']}
                      labelFormatter={(label) => `Term: ${label}`}
                    />
                    <Bar dataKey="weight" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Understanding TF-IDF Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium">What is TF-IDF?</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    TF-IDF (Term Frequency-Inverse Document Frequency) is a statistical measure used to evaluate the importance 
                    of a word in a document relative to a collection of documents. It helps identify significant terms that are 
                    distinctive to specific documents.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium">How is it calculated?</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    TF-IDF weight is the product of two factors:
                  </p>
                  <ul className="text-sm text-muted-foreground mt-1 space-y-1 list-disc pl-4">
                    <li>Term Frequency (TF): How often a term appears in a document</li>
                    <li>Inverse Document Frequency (IDF): How unique or rare the term is across all documents</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium">Why is TF-IDF useful for app reviews?</h3>
                  <ul className="text-sm text-muted-foreground mt-1 space-y-1 list-disc pl-4">
                    <li>Identifies important keywords specific to your app's reviews</li>
                    <li>Helps discover unique feature requests or issues</li>
                    <li>Filters out common words that appear in all reviews</li>
                    <li>Provides insight into what makes your app distinctive</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TFIDF;
