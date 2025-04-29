
import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { AppReview } from '@/utils/scraper';
import { getSentiment } from '@/utils/textProcessing';
import { exportToCsv, exportToExcel } from '@/utils/exportData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faChevronDown, faStar } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

interface ReviewsTableProps {
  reviews: AppReview[];
  appName: string;
}

const ReviewsTable: React.FC<ReviewsTableProps> = ({ reviews, appName }) => {
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  const getSentimentColor = (score: number) => {
    const sentiment = getSentiment(score);
    switch (sentiment) {
      case 'positive': return 'text-sentiment-positive';
      case 'neutral': return 'text-sentiment-neutral';
      case 'negative': return 'text-sentiment-negative';
      default: return '';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleExport = (format: 'csv' | 'excel') => {
    const filename = `${appName.replace(/\s+/g, '_')}_reviews_${new Date().toISOString().split('T')[0]}`;
    
    if (format === 'csv') {
      exportToCsv(reviews, filename);
    } else {
      exportToExcel(reviews, filename);
    }
  };

  const showReviewDetails = (review: AppReview) => {
    Swal.fire({
      title: `Review by ${review.userName}`,
      html: `
        <div class="text-left">
          <p class="mb-2"><strong>Rating:</strong> ${review.score}/5</p>
          <p class="mb-2"><strong>Date:</strong> ${formatDate(review.at)}</p>
          <p class="mb-4"><strong>Review:</strong></p>
          <p class="px-4 py-3 bg-gray-100 rounded">${review.content}</p>
        </div>
      `,
      confirmButtonText: 'Close',
      customClass: {
        container: 'font-sans'
      }
    });
  };

  const columns = [
    {
      name: 'User',
      selector: (row: AppReview) => row.userName,
      sortable: true,
    },
    {
      name: 'Review',
      selector: (row: AppReview) => row.content,
      sortable: true,
      cell: (row: AppReview) => (
        <div className="max-w-md cursor-pointer" onClick={() => showReviewDetails(row)}>
          <div className="line-clamp-2">{row.content}</div>
        </div>
      ),
    },
    {
      name: 'Rating',
      selector: (row: AppReview) => row.score,
      sortable: true,
      cell: (row: AppReview) => (
        <div className="flex items-center">
          <FontAwesomeIcon icon={faStar} className="text-yellow-400 mr-1" />
          {row.score}
        </div>
      ),
      width: '100px',
    },
    {
      name: 'Sentiment',
      selector: (row: AppReview) => getSentiment(row.score),
      sortable: true,
      cell: (row: AppReview) => (
        <span className={`font-medium ${getSentimentColor(row.score)}`}>
          {getSentiment(row.score).toUpperCase()}
        </span>
      ),
      width: '120px',
    },
    {
      name: 'Date',
      selector: (row: AppReview) => row.at,
      sortable: true,
      cell: (row: AppReview) => formatDate(row.at),
      width: '150px',
    },
  ];

  const customStyles = {
    headRow: {
      style: {
        backgroundColor: 'hsl(var(--secondary))',
        color: 'hsl(var(--secondary-foreground))',
      },
    },
    rows: {
      style: {
        backgroundColor: 'hsl(var(--card))',
        color: 'hsl(var(--card-foreground))',
        '&:hover': {
          backgroundColor: 'hsl(var(--muted))',
        },
      },
    },
    pagination: {
      style: {
        backgroundColor: 'hsl(var(--card))',
        color: 'hsl(var(--card-foreground))',
      },
    },
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Reviews ({reviews.length})</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <FontAwesomeIcon icon={faDownload} className="mr-2" />
              Export
              <FontAwesomeIcon icon={faChevronDown} className="ml-2" />
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
        <DataTable
          columns={columns}
          data={reviews}
          pagination
          paginationResetDefaultPage={resetPaginationToggle}
          customStyles={customStyles}
          highlightOnHover
          pointerOnHover
          persistTableHead
          noDataComponent={
            <div className="p-4 text-center">No reviews available</div>
          }
        />
      </div>
    </div>
  );
};

export default ReviewsTable;
