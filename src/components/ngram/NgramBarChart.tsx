
import React from 'react';
import { 
  Bar, 
  BarChart, 
  CartesianGrid, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

interface NgramBarChartProps {
  ngrams: Array<{ ngram: string; count: number }>;
  maxItems: number;
}

interface TooltipProps {
  active?: boolean;
  payload?: any[];
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border p-2 rounded-md shadow-md">
        <p className="font-medium">{`${payload[0].payload.ngram}`}</p>
        <p className="text-sm text-muted-foreground">{`Frequency: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const NgramBarChart: React.FC<NgramBarChartProps> = ({ ngrams, maxItems }) => {
  // Prepare data for the chart
  const chartData = ngrams
    .slice(0, maxItems)
    .map(item => ({
      ngram: item.ngram,
      count: item.count
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Phrase Frequency Visualization</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 120, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" domain={[0, 'auto']} />
                <YAxis 
                  type="category" 
                  dataKey="ngram" 
                  width={120} 
                  tick={{ fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NgramBarChart;
