
import React from 'react';
import { TermWeight } from '@/utils/tfIdfProcessing';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer
} from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

interface TermsVisualizationProps {
  terms: TermWeight[];
  maxTerms: number;
}

interface TooltipProps {
  active?: boolean;
  payload?: any[];
}

const TermsVisualization: React.FC<TermsVisualizationProps> = ({ terms, maxTerms }) => {
  // Chart data preparation
  const getChartData = () => {
    return terms
      .slice(0, maxTerms)
      .map(item => ({
        term: item.term,
        weight: parseFloat(item.weight.toFixed(4))
      }));
  };

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-2 rounded-md shadow-md">
          <p className="font-medium">{`Term: ${payload[0].payload.term}`}</p>
          <p className="text-sm text-muted-foreground">{`Weight: ${payload[0].value.toFixed(4)}`}</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Term Importance Visualization</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={getChartData()}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" domain={[0, 'auto']} />
              <YAxis 
                type="category" 
                dataKey="term" 
                width={80} 
                tick={{ fontSize: 12 }}
              />
              <RechartsTooltip content={<CustomTooltip />} />
              <Bar dataKey="weight" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TermsVisualization;
