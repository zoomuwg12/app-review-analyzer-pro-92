
import { MLModel, TrainingData } from '../types';

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
