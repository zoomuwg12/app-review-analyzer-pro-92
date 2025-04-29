
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ModelEvaluation } from '@/utils/mlAlgorithms';

interface ModelComparisonChartProps {
  evaluations: ModelEvaluation[];
  metric: 'accuracy' | 'precision' | 'recall' | 'f1Score';
}

const ModelComparisonChart: React.FC<ModelComparisonChartProps> = ({ evaluations, metric }) => {
  const chartData = useMemo(() => {
    const data: Record<string, any>[] = [];
    
    // Group by split ratio
    const splitRatios = [...new Set(evaluations.map(e => e.splitRatio))];
    splitRatios.forEach(ratio => {
      const ratioData: Record<string, any> = { name: ratio };
      
      evaluations
        .filter(e => e.splitRatio === ratio)
        .forEach(e => {
          ratioData[e.modelName] = e.confusionMatrix[metric];
        });
      
      data.push(ratioData);
    });
    
    return data;
  }, [evaluations, metric]);

  const metricLabels = {
    accuracy: 'Accuracy',
    precision: 'Precision',
    recall: 'Recall',
    f1Score: 'F1 Score'
  };
  
  const modelColors = {
    'Naive Bayes': '#3b82f6',
    'SVM': '#22c55e',
    'Random Forest': '#a855f7'
  };

  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis 
            domain={[0, 1]} 
            tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
          />
          <Tooltip 
            formatter={(value: number) => `${(value * 100).toFixed(2)}%`}
            labelFormatter={(label) => `Split Ratio: ${label}`}
          />
          <Legend />
          {Object.entries(modelColors).map(([model, color]) => (
            <Bar 
              key={model}
              dataKey={model}
              name={model}
              fill={color} 
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ModelComparisonChart;
