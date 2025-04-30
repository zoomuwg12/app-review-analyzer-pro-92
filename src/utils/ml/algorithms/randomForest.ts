
import { MLModel, TrainingData } from '../types';

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
