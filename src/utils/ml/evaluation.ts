
import { ConfusionMatrix } from './types';

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
