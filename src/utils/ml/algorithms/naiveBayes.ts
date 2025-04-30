
import { MLModel, TrainingData } from '../types';

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
