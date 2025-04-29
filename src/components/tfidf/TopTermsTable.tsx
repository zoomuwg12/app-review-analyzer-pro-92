
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { TermWeight } from '@/utils/tfIdfProcessing';
import { exportToCsv } from '@/utils/exportData';
import { useToast } from '@/hooks/use-toast';
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

interface TopTermsTableProps {
  terms: TermWeight[];
  maxTerms: number;
  onMaxTermsChange: (value: number) => void;
  appTitle?: string;
}

const TopTermsTable: React.FC<TopTermsTableProps> = ({
  terms,
  maxTerms,
  onMaxTermsChange,
  appTitle
}) => {
  const { toast } = useToast();

  const downloadTfIdfResults = () => {
    if (!terms?.length) return;
    
    // Format data for CSV
    const csvData = terms.map((item, index) => ({
      Rank: index + 1,
      Term: item.term,
      "TF-IDF Weight": item.weight.toFixed(4)
    }));
    
    exportToCsv(csvData, `${appTitle || 'app'}_tfidf_results_${new Date().toISOString().split('T')[0]}`);
    
    toast({
      title: "Export successful",
      description: "TF-IDF results exported as CSV",
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Top Terms by TF-IDF</CardTitle>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Show:</span>
          <Select 
            value={maxTerms.toString()} 
            onValueChange={(value) => onMaxTermsChange(parseInt(value))}
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
              {terms.slice(0, maxTerms).map((item, index) => (
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
  );
};

export default TopTermsTable;
