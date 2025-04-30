
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart2, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModelEvaluation } from '@/utils/ml';
import ModelComparisonChart from './ModelComparisonChart';
import ConfusionMatrixCard from './ConfusionMatrixCard';

interface ResultsCardProps {
  evaluations: ModelEvaluation[];
  selectedMetric: 'accuracy' | 'precision' | 'recall' | 'f1Score';
  selectedRatio: string;
  onSelectMetric: (metric: 'accuracy' | 'precision' | 'recall' | 'f1Score') => void;
  onSelectRatio: (ratio: string) => void;
  isLoading?: boolean;
}

const ResultsCard: React.FC<ResultsCardProps> = ({
  evaluations,
  selectedMetric,
  selectedRatio,
  onSelectMetric,
  onSelectRatio,
  isLoading = false
}) => {
  return (
    <Card className="lg:col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span>Results</span>
          
          {evaluations.length > 0 && (
            <div className="space-x-1">
              <Button 
                variant={selectedMetric === 'accuracy' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onSelectMetric('accuracy')}
              >
                Accuracy
              </Button>
              <Button 
                variant={selectedMetric === 'precision' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onSelectMetric('precision')}
              >
                Precision
              </Button>
              <Button 
                variant={selectedMetric === 'recall' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onSelectMetric('recall')}
              >
                Recall
              </Button>
              <Button 
                variant={selectedMetric === 'f1Score' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onSelectMetric('f1Score')}
              >
                F1 Score
              </Button>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[400px]">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading saved results...</p>
          </div>
        ) : evaluations.length > 0 ? (
          <div className="space-y-6">
            <ModelComparisonChart 
              evaluations={evaluations} 
              metric={selectedMetric}
            />
            
            {/* Show details for the selected split ratio */}
            <Tabs defaultValue={selectedRatio} value={selectedRatio} onValueChange={onSelectRatio}>
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="65:35">65:35</TabsTrigger>
                <TabsTrigger value="70:30">70:30</TabsTrigger>
                <TabsTrigger value="75:25">75:25</TabsTrigger>
                <TabsTrigger value="80:20">80:20</TabsTrigger>
              </TabsList>
              {['65:35', '70:30', '75:25', '80:20'].map(ratio => (
                <TabsContent key={ratio} value={ratio} className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {evaluations
                      .filter(e => e.splitRatio === ratio)
                      .map((evaluation, index) => (
                        <ConfusionMatrixCard 
                          key={`${evaluation.modelName}-${ratio}-${index}`}
                          modelName={evaluation.modelName}
                          confusionMatrix={evaluation.confusionMatrix}
                          splitRatio={evaluation.splitRatio}
                          predictionTime={evaluation.predictionTime}
                        />
                      ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[400px] text-center">
            <BarChart2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No comparison data yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Configure your models and split ratio, then click the "Run Comparison" button to see results here.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResultsCard;
