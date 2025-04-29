
import * as XLSX from 'xlsx';
import { AppReview } from './scraper';

export function exportToCsv(data: any[], filename: string): void {
  // Format the data for CSV
  const csvRows: string[] = [];
  
  // Add headers based on the first object's keys
  if (data.length > 0) {
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(','));
    
    // Add data rows
    data.forEach(item => {
      const row = headers.map(header => {
        // Handle different data types appropriately
        const value = item[header];
        if (value === null || value === undefined) {
          return '""';
        } else if (typeof value === 'string') {
          return `"${value.replace(/"/g, '""')}"`;
        } else if (value instanceof Date) {
          return `"${value.toISOString()}"`;
        } else {
          return value;
        }
      });
      csvRows.push(row.join(','));
    });
  }
  
  // Create CSV content
  const csvContent = csvRows.join('\n');
  
  // Create a blob with the CSV content
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Create download link
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  // Add link to body, click it, and remove it
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Special function for AppReview objects
export function exportReviewsToCsv(data: AppReview[], filename: string): void {
  // Format the data for CSV
  const csvRows: string[] = [];
  
  // Add headers
  const headers = ['ID', 'User Name', 'Content', 'Score', 'Date', 'App Version', 'Thumbs Up'];
  csvRows.push(headers.join(','));
  
  // Add data rows
  data.forEach(item => {
    const row = [
      `"${item.id}"`,
      `"${item.userName.replace(/"/g, '""')}"`,
      `"${item.content.replace(/"/g, '""')}"`,
      item.score,
      `"${item.at.toISOString()}"`,
      `"${item.reviewCreatedVersion || ''}"`,
      item.thumbsUpCount
    ];
    csvRows.push(row.join(','));
  });
  
  // Create CSV content
  const csvContent = csvRows.join('\n');
  
  // Create a blob with the CSV content
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Create download link
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  // Add link to body, click it, and remove it
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToExcel(data: AppReview[], filename: string): void {
  // Format the data for Excel
  const excelData = data.map(item => ({
    ID: item.id,
    'User Name': item.userName,
    Content: item.content,
    Score: item.score,
    Date: item.at,
    'App Version': item.reviewCreatedVersion || '',
    'Thumbs Up': item.thumbsUpCount,
    'Reply': item.replyContent || '',
    'Reply Date': item.replyAt || ''
  }));
  
  // Create a new workbook
  const wb = XLSX.utils.book_new();
  
  // Convert the data to a worksheet
  const ws = XLSX.utils.json_to_sheet(excelData);
  
  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Reviews');
  
  // Generate the Excel file
  XLSX.writeFile(wb, `${filename}.xlsx`);
}
