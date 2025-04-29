
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown, Download } from 'lucide-react';
import { AppReview } from '@/utils/scraper';
import { getSentiment } from '@/utils/textProcessing';
import { exportToCsv, exportToExcel } from '@/utils/exportData';

interface ReviewsTableProps {
  reviews: AppReview[];
  appName: string;
}

const ReviewsTable: React.FC<ReviewsTableProps> = ({ reviews, appName }) => {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof AppReview | 'sentiment';
    direction: 'asc' | 'desc';
  }>({ key: 'at', direction: 'desc' });

  const getSentimentColor = (score: number) => {
    const sentiment = getSentiment(score);
    switch (sentiment) {
      case 'positive': return 'text-sentiment-positive';
      case 'neutral': return 'text-sentiment-neutral';
      case 'negative': return 'text-sentiment-negative';
      default: return '';
    }
  };

  const handleSort = (key: keyof AppReview | 'sentiment') => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortConfig.key === 'sentiment') {
      const aSentiment = getSentiment(a.score);
      const bSentiment = getSentiment(b.score);
      return sortConfig.direction === 'asc' 
        ? aSentiment.localeCompare(bSentiment)
        : bSentiment.localeCompare(aSentiment);
    }
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const handleExport = (format: 'csv' | 'excel') => {
    const filename = `${appName.replace(/\s+/g, '_')}_reviews_${new Date().toISOString().split('T')[0]}`;
    
    if (format === 'csv') {
      exportToCsv(reviews, filename);
    } else {
      exportToExcel(reviews, filename);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Reviews ({reviews.length})</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleExport('csv')}>
              Export as CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('excel')}>
              Export as Excel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer hover:bg-secondary/20"
                onClick={() => handleSort('userName')}
              >
                User
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-secondary/20"
                onClick={() => handleSort('content')}
              >
                Review
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-secondary/20 w-20"
                onClick={() => handleSort('score')}
              >
                Rating
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-secondary/20 w-28"
                onClick={() => handleSort('sentiment')}
              >
                Sentiment
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-secondary/20 w-28"
                onClick={() => handleSort('at')}
              >
                Date
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedReviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No reviews available
                </TableCell>
              </TableRow>
            ) : (
              sortedReviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell className="font-medium">{review.userName}</TableCell>
                  <TableCell className="max-w-md">
                    <div className="line-clamp-3">{review.content}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="text-yellow-400 mr-1">★</span>
                      {review.score}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`font-medium ${getSentimentColor(review.score)}`}>
                      {getSentiment(review.score).toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>{formatDate(review.at)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ReviewsTable;
