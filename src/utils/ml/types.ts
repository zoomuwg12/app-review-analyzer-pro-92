
import { AppReview } from '../scraper';

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
