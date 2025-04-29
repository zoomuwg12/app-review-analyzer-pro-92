
import { AppReview } from './scraper';
import { getSentiment } from './textProcessing';

// Types for ML operations
export interface TrainingData {
  features: number[][];  // Feature vectors
  labels: string[];      // Corresponding labels
}

export interface MLModel {
  name: string;
  train: (data: TrainingData) => void;
  predict: (features: number[]) => string;
}

export interface ConfusionMatrix {
  truePositive: number;
  falsePositive: number;
  trueNegative: number;
  falseNegative: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
}

export interface ModelEvaluation {
  modelName: string;
  splitRatio: string;
  confusionMatrix: ConfusionMatrix;
  predictionTime: number;
}

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

// Calculate confusion matrix and metrics
export function calculateConfusionMatrix(actualLabels: string[], predictedLabels: string[]): ConfusionMatrix {
  let truePositive = 0;
  let falsePositive = 0;
  let trueNegative = 0;
  let falseNegative = 0;
  
  for (let i = 0; i < actualLabels.length; i++) {
    // Simplify to binary classification (positive vs non-positive)
    const isActualPositive = actualLabels[i] === 'positive';
    const isPredictedPositive = predictedLabels[i] === 'positive';
    
    if (isActualPositive && isPredictedPositive) truePositive++;
    if (!isActualPositive && isPredictedPositive) falsePositive++;
    if (!isActualPositive && !isPredictedPositive) trueNegative++;
    if (isActualPositive && !isPredictedPositive) falseNegative++;
  }
  
  const accuracy = (truePositive + trueNegative) / actualLabels.length || 0;
  const precision = truePositive / (truePositive + falsePositive) || 0;
  const recall = truePositive / (truePositive + falseNegative) || 0;
  const f1Score = 2 * ((precision * recall) / (precision + recall)) || 0;
  
  return {
    truePositive,
    falsePositive,
    trueNegative,
    falseNegative,
    accuracy,
    precision,
    recall,
    f1Score
  };
}

// Naive Bayes implementation
export class NaiveBayes implements MLModel {
  name = "Naive Bayes";
  private classCounts: Record<string, number> = {};
  private featureProbabilities: Record<string, number[][]> = {};
  
  train(data: TrainingData): void {
    const { features, labels } = data;
    const classes = [...new Set(labels)];
    
    // Count class occurrences
    labels.forEach(label => {
      this.classCounts[label] = (this.classCounts[label] || 0) + 1;
    });
    
    // Initialize feature probabilities
    classes.forEach(className => {
      this.featureProbabilities[className] = [];
      for (let i = 0; i < features[0].length; i++) {
        this.featureProbabilities[className][i] = [0, 0]; // [sum, count]
      }
    });
    
    // Gather feature statistics by class
    features.forEach((feature, idx) => {
      const label = labels[idx];
      feature.forEach((value, featureIdx) => {
        this.featureProbabilities[label][featureIdx][0] += value;
        this.featureProbabilities[label][featureIdx][1]++;
      });
    });
    
    // Calculate mean for each feature by class
    Object.keys(this.featureProbabilities).forEach(className => {
      for (let i = 0; i < this.featureProbabilities[className].length; i++) {
        const [sum, count] = this.featureProbabilities[className][i];
        this.featureProbabilities[className][i] = [sum / count, 0.1]; // Mean and variance (simplified)
      }
    });
  }
  
  predict(features: number[]): string {
    const classes = Object.keys(this.classCounts);
    let bestClass = null;
    let maxProb = -Infinity;
    
    for (const className of classes) {
      // Prior probability: P(class)
      let prob = Math.log(this.classCounts[className] / 
        Object.values(this.classCounts).reduce((a, b) => a + b, 0));
      
      // Likelihood: P(features | class)
      for (let i = 0; i < features.length; i++) {
        const [mean, variance] = this.featureProbabilities[className][i];
        // Simplified Gaussian probability
        const diff = features[i] - mean;
        prob += -0.5 * Math.log(2 * Math.PI * variance) - (diff * diff) / (2 * variance);
      }
      
      if (prob > maxProb) {
        maxProb = prob;
        bestClass = className;
      }
    }
    
    return bestClass || 'neutral';
  }
}

// Very simplified SVM implementation
export class SVM implements MLModel {
  name = "SVM";
  private weights: number[] = [];
  private bias: number = 0;
  private classMapping: Record<string, number> = {};
  private reverseClassMapping: Record<string, string> = {};
  
  train(data: TrainingData): void {
    const { features, labels } = data;
    
    // Map classes to -1, 0, 1 for simplified implementation
    const uniqueClasses = [...new Set(labels)];
    uniqueClasses.forEach((className, idx) => {
      this.classMapping[className] = idx - 1;
      this.reverseClassMapping[idx - 1] = className;
    });
    
    // Initialize weights
    this.weights = new Array(features[0].length).fill(0);
    
    // Simple gradient descent for SVM
    const learningRate = 0.01;
    const iterations = 100;
    
    for (let iter = 0; iter < iterations; iter++) {
      for (let i = 0; i < features.length; i++) {
        const x = features[i];
        const y = this.classMapping[labels[i]];
        
        // Predict
        let prediction = this.bias;
        for (let j = 0; j < this.weights.length; j++) {
          prediction += this.weights[j] * x[j];
        }
        
        // Update weights if prediction is wrong
        if (y * prediction < 1) {
          for (let j = 0; j < this.weights.length; j++) {
            this.weights[j] += learningRate * (y * x[j] - 0.01 * this.weights[j]);
          }
          this.bias += learningRate * y;
        }
      }
    }
  }
  
  predict(features: number[]): string {
    // Calculate decision value
    let decision = this.bias;
    for (let i = 0; i < this.weights.length; i++) {
      decision += this.weights[i] * features[i];
    }
    
    // Map to closest class
    const classValue = Math.sign(decision);
    return this.reverseClassMapping[classValue] || 'neutral';
  }
}

// Simplified Random Forest
export class RandomForest implements MLModel {
  name = "Random Forest";
  private trees: Array<{ feature: number; threshold: number; left: any; right: any; prediction?: string }> = [];
  private numTrees = 10;
  private maxDepth = 3;
  
  train(data: TrainingData): void {
    const { features, labels } = data;
    
    // Build multiple decision trees
    for (let t = 0; t < this.numTrees; t++) {
      // Bootstrap sampling
      const sampleIndices = new Array(features.length)
        .fill(0)
        .map((_, i) => Math.floor(Math.random() * features.length));
      
      const sampledFeatures = sampleIndices.map(i => features[i]);
      const sampledLabels = sampleIndices.map(i => labels[i]);
      
      // Build a decision tree
      this.trees.push(this.buildTree(sampledFeatures, sampledLabels, 0));
    }
  }
  
  predict(features: number[]): string {
    // Get predictions from all trees
    const predictions = this.trees.map(tree => this.predictWithTree(tree, features));
    
    // Majority vote
    const counts: Record<string, number> = {};
    predictions.forEach(prediction => {
      counts[prediction] = (counts[prediction] || 0) + 1;
    });
    
    let maxCount = 0;
    let maxClass = 'neutral';
    Object.entries(counts).forEach(([className, count]) => {
      if (count > maxCount) {
        maxCount = count;
        maxClass = className;
      }
    });
    
    return maxClass;
  }
  
  private buildTree(features: number[][], labels: string[], depth: number) {
    // Check stopping criteria
    if (depth >= this.maxDepth || this.allSameLabels(labels)) {
      return { prediction: this.getMajorityLabel(labels) };
    }
    
    // Find best split
    const bestSplit = this.findBestSplit(features, labels);
    if (!bestSplit) {
      return { prediction: this.getMajorityLabel(labels) };
    }
    
    const { feature, threshold, leftIndices, rightIndices } = bestSplit;
    
    // Create children
    const leftFeatures = leftIndices.map(i => features[i]);
    const leftLabels = leftIndices.map(i => labels[i]);
    
    const rightFeatures = rightIndices.map(i => features[i]);
    const rightLabels = rightIndices.map(i => labels[i]);
    
    // Recursively build tree
    const left = this.buildTree(leftFeatures, leftLabels, depth + 1);
    const right = this.buildTree(rightFeatures, rightLabels, depth + 1);
    
    return { feature, threshold, left, right };
  }
  
  private predictWithTree(tree: any, features: number[]): string {
    if (tree.prediction !== undefined) {
      return tree.prediction;
    }
    
    if (features[tree.feature] <= tree.threshold) {
      return this.predictWithTree(tree.left, features);
    } else {
      return this.predictWithTree(tree.right, features);
    }
  }
  
  private allSameLabels(labels: string[]): boolean {
    return new Set(labels).size <= 1;
  }
  
  private getMajorityLabel(labels: string[]): string {
    const counts: Record<string, number> = {};
    labels.forEach(label => {
      counts[label] = (counts[label] || 0) + 1;
    });
    
    let maxCount = 0;
    let maxLabel = 'neutral';
    Object.entries(counts).forEach(([label, count]) => {
      if (count > maxCount) {
        maxCount = count;
        maxLabel = label;
      }
    });
    
    return maxLabel;
  }
  
  private findBestSplit(features: number[][], labels: string[]) {
    let bestGini = Infinity;
    let bestSplit = null;
    
    // Consider only a subset of features for each split (feature randomness)
    const featureIndices = new Array(features[0].length).fill(0).map((_, i) => i);
    const selectedFeatures = featureIndices
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.ceil(Math.sqrt(features[0].length)));
    
    for (const featureIdx of selectedFeatures) {
      // Find unique values for the feature
      const values = [...new Set(features.map(f => f[featureIdx]))];
      
      for (const value of values) {
        // Split based on this value
        const leftIndices: number[] = [];
        const rightIndices: number[] = [];
        
        features.forEach((feature, idx) => {
          if (feature[featureIdx] <= value) {
            leftIndices.push(idx);
          } else {
            rightIndices.push(idx);
          }
        });
        
        // Skip if split is too unbalanced
        if (leftIndices.length < 2 || rightIndices.length < 2) continue;
        
        // Calculate Gini impurity for this split
        const leftLabels = leftIndices.map(i => labels[i]);
        const rightLabels = rightIndices.map(i => labels[i]);
        
        const leftGini = this.calculateGini(leftLabels);
        const rightGini = this.calculateGini(rightLabels);
        
        // Weighted Gini impurity
        const gini = (leftLabels.length / labels.length) * leftGini +
                     (rightLabels.length / labels.length) * rightGini;
        
        if (gini < bestGini) {
          bestGini = gini;
          bestSplit = { feature: featureIdx, threshold: value, leftIndices, rightIndices };
        }
      }
    }
    
    return bestSplit;
  }
  
  private calculateGini(labels: string[]): number {
    const counts: Record<string, number> = {};
    
    labels.forEach(label => {
      counts[label] = (counts[label] || 0) + 1;
    });
    
    let gini = 1;
    for (const count of Object.values(counts)) {
      const p = count / labels.length;
      gini -= p * p;
    }
    
    return gini;
  }
}
