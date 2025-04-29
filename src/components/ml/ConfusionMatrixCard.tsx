
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfusionMatrix } from '@/utils/mlAlgorithms';

interface ConfusionMatrixCardProps {
  modelName: string;
  confusionMatrix: ConfusionMatrix;
  splitRatio: string;
  predictionTime: number;
}

const ConfusionMatrixCard: React.FC<ConfusionMatrixCardProps> = ({
  modelName,
  confusionMatrix,
  splitRatio,
  predictionTime
}) => {
  const {
    truePositive,
    falsePositive,
    trueNegative,
    falseNegative,
    accuracy,
    precision,
    recall,
    f1Score
  } = confusionMatrix;
  
  const formatMetric = (value: number): string => {
    return (value * 100).toFixed(2) + '%';
  };
  
  const getModelColor = (model: string): string => {
    switch(model) {
      case 'Naive Bayes': return 'bg-blue-100 dark:bg-blue-900';
      case 'SVM': return 'bg-green-100 dark:bg-green-900';
      case 'Random Forest': return 'bg-purple-100 dark:bg-purple-900';
      default: return 'bg-gray-100 dark:bg-gray-900';
    }
  };

  return (
    <Card className={`overflow-hidden border-t-4 ${
      modelName === 'Naive Bayes' ? 'border-blue-500' : 
      modelName === 'SVM' ? 'border-green-500' : 
      'border-purple-500'
    }`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>{modelName}</span>
          <span className="text-xs text-muted-foreground font-normal">
            Split: {splitRatio}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="grid grid-cols-2 gap-px bg-muted rounded overflow-hidden">
            <div className="bg-card p-2 text-center">
              <div className="text-sm font-medium">True Positive</div>
              <div className="text-2xl font-bold text-green-600">{truePositive}</div>
            </div>
            <div className="bg-card p-2 text-center">
              <div className="text-sm font-medium">False Positive</div>
              <div className="text-2xl font-bold text-red-600">{falsePositive}</div>
            </div>
            <div className="bg-card p-2 text-center">
              <div className="text-sm font-medium">False Negative</div>
              <div className="text-2xl font-bold text-red-600">{falseNegative}</div>
            </div>
            <div className="bg-card p-2 text-center">
              <div className="text-sm font-medium">True Negative</div>
              <div className="text-2xl font-bold text-green-600">{trueNegative}</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Accuracy:</span>
              <span className="font-bold">{formatMetric(accuracy)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Precision:</span>
              <span className="font-bold">{formatMetric(precision)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Recall:</span>
              <span className="font-bold">{formatMetric(recall)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">F1 Score:</span>
              <span className="font-bold">{formatMetric(f1Score)}</span>
            </div>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground text-right">
          Prediction time: {predictionTime.toFixed(2)}ms
        </div>
      </CardContent>
    </Card>
  );
};

export default ConfusionMatrixCard;
