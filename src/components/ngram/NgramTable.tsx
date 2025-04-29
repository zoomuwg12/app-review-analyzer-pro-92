
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
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
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

interface NgramTableProps {
  ngrams: Array<{ ngram: string; count: number }>;
  maxItems: number;
  appTitle?: string;
}

const NgramTable: React.FC<NgramTableProps> = ({
  ngrams,
  maxItems,
  appTitle
}) => {
  const { toast } = useToast();

  const handleExport = () => {
    if (!ngrams?.length) return;
    
    // Format data for CSV
    const csvData = ngrams.map((item, index) => ({
      Rank: index + 1,
      Phrase: item.ngram,
      Frequency: item.count
    }));
    
    exportToCsv(csvData, `${appTitle || 'app'}_ngrams_${new Date().toISOString().split('T')[0]}`);
    
    toast({
      title: "Export successful",
      description: "N-gram results exported as CSV",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Phrases</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Phrase</TableHead>
                <TableHead className="text-right">Frequency</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ngrams.slice(0, maxItems).map((item, index) => (
                <TableRow key={item.ngram}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{item.ngram}</TableCell>
                  <TableCell className="text-right">{item.count}</TableCell>
                </TableRow>
              ))}
              {ngrams.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                    No phrases found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        <Button onClick={handleExport} className="w-full mt-4" disabled={!ngrams.length}>
          <Download className="mr-2 h-4 w-4" />
          Export Results
        </Button>
      </CardContent>
    </Card>
  );
};

export default NgramTable;
