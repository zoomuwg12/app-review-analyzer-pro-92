
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis, Cell } from 'recharts';
import { AppReview } from '@/utils/scraper';
import { preprocessText } from '@/utils/textProcessing';

interface ReviewCorrelationProps {
  reviews: AppReview[];
}

const ReviewCorrelation: React.FC<ReviewCorrelationProps> = ({ reviews }) => {
  // State to track calculated metrics
  const [analysisData, setAnalysisData] = useState<{
    lengthVsScore: Array<{score: number, length: number, id: string, content: string}>;
    wordCountVsScore: Array<{score: number, wordCount: number, id: string, content: string}>;
    uniqueWordsVsScore: Array<{score: number, uniqueWords: number, id: string, content: string}>;
    correlations: {
      lengthScoreCorrelation: number;
      wordCountScoreCorrelation: number;
      uniqueWordsScoreCorrelation: number;
    }
  }>({
    lengthVsScore: [],
    wordCountVsScore: [],
    uniqueWordsVsScore: [],
    correlations: {
      lengthScoreCorrelation: 0,
      wordCountScoreCorrelation: 0,
      uniqueWordsScoreCorrelation: 0
    }
  });

  // Calculate correlation coefficient
  function calculateCorrelation(x: number[], y: number[]): number {
    const n = x.length;
    if (n !== y.length || n === 0) return 0;
    
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumYY = y.reduce((sum, yi) => sum + yi * yi, 0);
    
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));
    
    return denominator === 0 ? 0 : numerator / denominator;
  }

  // Process the review data for correlation analysis
  useEffect(() => {
    if (reviews.length === 0) return;

    const lengthData = reviews.map(review => ({
      score: review.score,
      length: review.content.length,
      id: review.id,
      content: review.content
    }));

    const wordCountData = reviews.map(review => {
      const wordCount = review.content.split(/\s+/).filter(Boolean).length;
      return {
        score: review.score,
        wordCount,
        id: review.id,
        content: review.content
      };
    });

    const uniqueWordsData = reviews.map(review => {
      const processed = preprocessText(review.content);
      return {
        score: review.score,
        uniqueWords: processed.uniqueWordCount,
        id: review.id,
        content: review.content
      };
    });

    // Calculate correlations
    const lengthScoreCorrelation = calculateCorrelation(
      lengthData.map(d => d.length),
      lengthData.map(d => d.score)
    );

    const wordCountScoreCorrelation = calculateCorrelation(
      wordCountData.map(d => d.wordCount),
      wordCountData.map(d => d.score)
    );

    const uniqueWordsScoreCorrelation = calculateCorrelation(
      uniqueWordsData.map(d => d.uniqueWords),
      uniqueWordsData.map(d => d.score)
    );

    setAnalysisData({
      lengthVsScore: lengthData,
      wordCountVsScore: wordCountData,
      uniqueWordsVsScore: uniqueWordsData,
      correlations: {
        lengthScoreCorrelation,
        wordCountScoreCorrelation,
        uniqueWordsScoreCorrelation
      }
    });
  }, [reviews]);

  // Function to determine point color based on score
  const getPointColor = (score: number) => {
    if (score >= 4) return '#4caf50';  // green for positive
    if (score >= 3) return '#ff9800';  // orange for neutral
    return '#f44336';  // red for negative
  };

  // Format correlation for display
  const formatCorrelation = (corr: number) => {
    const value = parseFloat(corr.toFixed(3));
    if (Math.abs(value) < 0.2) return `${value} (Very Weak)`;
    if (Math.abs(value) < 0.4) return `${value} (Weak)`;
    if (Math.abs(value) < 0.6) return `${value} (Moderate)`;
    if (Math.abs(value) < 0.8) return `${value} (Strong)`;
    return `${value} (Very Strong)`;
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Correlation Analysis</CardTitle>
          <CardDescription>
            Examining relationships between review metrics and ratings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-background/50 p-4 rounded-md border border-border">
              <div className="text-sm text-muted-foreground">Review Length & Rating</div>
              <div className="text-lg font-semibold">
                {formatCorrelation(analysisData.correlations.lengthScoreCorrelation)}
              </div>
            </div>
            <div className="bg-background/50 p-4 rounded-md border border-border">
              <div className="text-sm text-muted-foreground">Word Count & Rating</div>
              <div className="text-lg font-semibold">
                {formatCorrelation(analysisData.correlations.wordCountScoreCorrelation)}
              </div>
            </div>
            <div className="bg-background/50 p-4 rounded-md border border-border">
              <div className="text-sm text-muted-foreground">Unique Words & Rating</div>
              <div className="text-lg font-semibold">
                {formatCorrelation(analysisData.correlations.uniqueWordsScoreCorrelation)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Word Count vs Rating</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart
                    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      type="number" 
                      dataKey="wordCount" 
                      name="Word Count" 
                      label={{ value: 'Word Count', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis 
                      type="number" 
                      dataKey="score" 
                      name="Rating" 
                      domain={[0, 5.5]} 
                      label={{ value: 'Rating', angle: -90, position: 'insideLeft' }}
                    />
                    <ZAxis range={[50, 50]} />
                    <Tooltip 
                      cursor={{ strokeDasharray: '3 3' }}
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        borderColor: '#475569',
                        borderRadius: '8px' 
                      }}
                      formatter={(value, name) => [value, name]}
                      labelFormatter={(value) => `Review`}
                    />
                    <Scatter 
                      name="Word Count vs Rating" 
                      data={analysisData.wordCountVsScore} 
                    >
                      {analysisData.wordCountVsScore.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getPointColor(entry.score)} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Unique Words vs Rating</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart
                    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      type="number" 
                      dataKey="uniqueWords" 
                      name="Unique Words" 
                      label={{ value: 'Unique Words', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis 
                      type="number" 
                      dataKey="score" 
                      name="Rating" 
                      domain={[0, 5.5]} 
                      label={{ value: 'Rating', angle: -90, position: 'insideLeft' }}
                    />
                    <ZAxis range={[50, 50]} />
                    <Tooltip 
                      cursor={{ strokeDasharray: '3 3' }}
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        borderColor: '#475569',
                        borderRadius: '8px' 
                      }}
                      formatter={(value, name) => [value, name]}
                      labelFormatter={(value) => `Review`}
                    />
                    <Scatter 
                      name="Unique Words vs Rating" 
                      data={analysisData.uniqueWordsVsScore} 
                    >
                      {analysisData.uniqueWordsVsScore.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getPointColor(entry.score)} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Interpretation of Results</CardTitle>
          <CardDescription>
            What these correlations mean for your app
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-md font-semibold">Understanding Correlation</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Correlation coefficients range from -1 to 1, where:
              <ul className="list-disc pl-5 mt-1">
                <li>Values close to 1 indicate a strong positive relationship</li>
                <li>Values close to -1 indicate a strong negative relationship</li>
                <li>Values close to 0 indicate little or no relationship</li>
              </ul>
            </p>
          </div>
          
          <div>
            <h3 className="text-md font-semibold">What to Look For</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {Math.abs(analysisData.correlations.wordCountScoreCorrelation) > 0.3 ? (
                <span>There appears to be a {analysisData.correlations.wordCountScoreCorrelation > 0 ? 'positive' : 'negative'} correlation between word count and ratings. {analysisData.correlations.wordCountScoreCorrelation > 0 ? 'Longer reviews tend to be more positive.' : 'Shorter reviews tend to be more positive.'}</span>
              ) : (
                <span>There is little correlation between review length and ratings, suggesting that review length doesn't significantly influence sentiment.</span>
              )}
            </p>
            
            <p className="text-sm text-muted-foreground mt-2">
              {Math.abs(analysisData.correlations.uniqueWordsScoreCorrelation) > 0.3 ? (
                <span>There appears to be a {analysisData.correlations.uniqueWordsScoreCorrelation > 0 ? 'positive' : 'negative'} correlation between vocabulary diversity and ratings. {analysisData.correlations.uniqueWordsScoreCorrelation > 0 ? 'Reviews with more diverse vocabulary tend to be more positive.' : 'Reviews with simpler vocabulary tend to be more positive.'}</span>
              ) : (
                <span>The diversity of vocabulary in reviews doesn't seem to correlate strongly with ratings.</span>
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewCorrelation;
