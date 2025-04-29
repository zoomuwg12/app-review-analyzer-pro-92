
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const About: React.FC = () => {
  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <h1 className="text-3xl font-bold">About App Review Analyzer</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            App Review Analyzer is a powerful tool designed to help app developers and product managers gain insights from user reviews on the Google Play Store. Using natural language processing and sentiment analysis techniques, it helps you understand what users love or dislike about your app.
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Key Features</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-muted-foreground list-disc pl-5">
            <li>Add and manage multiple apps for analysis</li>
            <li>Fetch and analyze user reviews from Google Play Store</li>
            <li>Sentiment analysis to categorize reviews as positive, neutral, or negative</li>
            <li>Aspect-based analysis to identify specific product features mentioned in reviews</li>
            <li>Keyword extraction to identify common themes and issues</li>
            <li>Text preprocessing capabilities for custom analysis</li>
            <li>Export data in CSV and Excel formats for further analysis</li>
            <li>Interactive visualizations for better understanding of the data</li>
          </ul>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>How to Use</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-4 text-muted-foreground list-decimal pl-5">
            <li>
              <strong className="text-foreground">Add an App:</strong>
              <p>Enter the Google Play Store app ID (e.g., com.example.app) or the full URL of the app on the Play Store in the input field on the Dashboard page.</p>
            </li>
            <li>
              <strong className="text-foreground">Fetch Reviews:</strong>
              <p>Select the number of reviews you want to analyze (50, 100, 200, 300, or 500) and click "Refresh Reviews" to fetch the latest reviews for the selected app.</p>
            </li>
            <li>
              <strong className="text-foreground">Analyze Reviews:</strong>
              <p>Once reviews are loaded, explore the various visualizations and insights provided on the Dashboard, including sentiment analysis, rating distribution, and aspect-based analysis.</p>
            </li>
            <li>
              <strong className="text-foreground">Preprocess Text:</strong>
              <p>Use the Preprocessing page to clean and transform the review text for custom analysis. You can lowercase the text, remove stop words, numbers, punctuation, and HTML tags.</p>
            </li>
            <li>
              <strong className="text-foreground">Export Data:</strong>
              <p>Export the review data to CSV or Excel format for further analysis in other tools.</p>
            </li>
          </ol>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Technical Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">
            <p className="mb-2">This application is built using the following technologies:</p>
            <ul className="space-y-1 list-disc pl-5">
              <li>React for the frontend user interface</li>
              <li>TypeScript for type-safe code</li>
              <li>Tailwind CSS for styling</li>
              <li>Recharts for data visualization</li>
              <li>Google Play Scraper library for fetching app data and reviews</li>
              <li>shadcn/ui component library for UI elements</li>
              <li>XLSX library for Excel export functionality</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default About;
