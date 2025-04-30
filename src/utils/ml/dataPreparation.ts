
import { AppReview } from '../scraper';
import { TrainingData } from './types';
import { getSentiment } from '../textProcessing';

// Simple feature extraction from text
export function extractFeatures(text: string): number[] {
  const features: number[] = [];
  
  // Feature 1: Text length
  features.push(Math.min(1.0, text.length / 500));
  
  // Feature 2: Count of positive words
  const positiveWords = ['good', 'great', 'excellent', 'awesome', 'love', 'best', 'amazing', 'perfect', 'helpful', 'recommend'];
  let positiveCount = 0;
  positiveWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = text.match(regex);
    if (matches) positiveCount += matches.length;
  });
  features.push(Math.min(1.0, positiveCount / 5));
  
  // Feature 3: Count of negative words
  const negativeWords = ['bad', 'poor', 'terrible', 'awful', 'hate', 'worst', 'useless', 'disappointing', 'broken', 'issue'];
  let negativeCount = 0;
  negativeWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = text.match(regex);
    if (matches) negativeCount += matches.length;
  });
  features.push(Math.min(1.0, negativeCount / 5));
  
  // Feature 4: Exclamation marks
  const exclamationCount = (text.match(/!/g) || []).length;
  features.push(Math.min(1.0, exclamationCount / 3));
  
  // Feature 5: Question marks (might indicate issues/concerns)
  const questionCount = (text.match(/\?/g) || []).length;
  features.push(Math.min(1.0, questionCount / 3));
  
  return features;
}

// Prepare data for training and testing
export function prepareData(reviews: AppReview[], testSplitRatio: number = 0.3): {
  trainingData: TrainingData;
  testingData: TrainingData;
} {
  // Shuffle reviews to avoid bias
  const shuffledReviews = [...reviews].sort(() => Math.random() - 0.5);
  
  const testingCount = Math.floor(shuffledReviews.length * testSplitRatio);
  const trainingReviews = shuffledReviews.slice(testingCount);
  const testingReviews = shuffledReviews.slice(0, testingCount);
  
  // Extract features and labels
  const trainingFeatures = trainingReviews.map(review => extractFeatures(review.processedContent || review.content));
  const trainingLabels = trainingReviews.map(review => getSentiment(review.score));
  
  const testingFeatures = testingReviews.map(review => extractFeatures(review.processedContent || review.content));
  const testingLabels = testingReviews.map(review => getSentiment(review.score));
  
  return {
    trainingData: {
      features: trainingFeatures,
      labels: trainingLabels
    },
    testingData: {
      features: testingFeatures,
      labels: testingLabels
    }
  };
}
