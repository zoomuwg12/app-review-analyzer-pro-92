
import React, { useState } from 'react';
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WordCloudChart from './WordCloudChart';
import { ChartBarIcon, ChartBar } from 'lucide-react';

interface TermsVisualizationProps {
  terms: TermWeight[];
  maxTerms: number;
}

interface TooltipProps {
  active?: boolean;
  payload?: any[];
}

type ChartType = 'vertical' | 'horizontal' | 'wordcloud';

const TermsVisualization: React.FC<TermsVisualizationProps> = ({ terms, maxTerms }) => {
  const [chartType, setChartType] = useState<ChartType>('horizontal');
  
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

  const renderChart = () => {
    const data = getChartData();
    
    switch (chartType) {
      case 'vertical':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="term" 
                angle={-45} 
                textAnchor="end"
                height={70}
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <RechartsTooltip content={<CustomTooltip />} />
              <Bar dataKey="weight" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'horizontal':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
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
        );
      
      case 'wordcloud':
        return <WordCloudChart terms={terms} maxTerms={maxTerms} />;
      
      default:
        return null;
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Term Importance Visualization</CardTitle>
        <Tabs 
          value={chartType} 
          onValueChange={(value) => setChartType(value as ChartType)}
          className="ml-auto"
        >
          <TabsList>
            <TabsTrigger value="horizontal" className="flex items-center gap-1 px-3">
              <ChartBar className="rotate-90 h-4 w-4" />
              <span>Horizontal</span>
            </TabsTrigger>
            <TabsTrigger value="vertical" className="flex items-center gap-1 px-3">
              <ChartBar className="h-4 w-4" />
              <span>Vertical</span>
            </TabsTrigger>
            <TabsTrigger value="wordcloud" className="flex items-center gap-1 px-3">
              <span>Word Cloud</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          {renderChart()}
        </div>
      </CardContent>
    </Card>
  );
};

export default TermsVisualization;
