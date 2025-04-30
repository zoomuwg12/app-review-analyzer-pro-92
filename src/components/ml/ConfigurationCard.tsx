
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import ModelSelector from './ModelSelector';
import SplitRatioSelector from './SplitRatioSelector';

interface ConfigurationCardProps {
  selectedModels: string[];
  selectedRatio: string;
  isTraining: boolean;
  onToggleModel: (model: string) => void;
  onSelectRatio: (ratio: string) => void;
  onRunComparison: () => void;
}

const ConfigurationCard: React.FC<ConfigurationCardProps> = ({
  selectedModels,
  selectedRatio,
  isTraining,
  onToggleModel,
  onSelectRatio,
  onRunComparison
}) => {
  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle>Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <ModelSelector 
          selectedModels={selectedModels}
          onToggleModel={onToggleModel}
        />
        
        <SplitRatioSelector 
          selectedRatio={selectedRatio}
          onSelectRatio={onSelectRatio}
        />
        
        <Button 
          onClick={onRunComparison} 
          disabled={isTraining || selectedModels.length === 0}
          className="w-full"
        >
          {isTraining ? (
            <>
              <Play className="mr-2 h-4 w-4 animate-spin" />
              Running Comparison...
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Run Comparison
            </>
          )}
        </Button>
        
        {selectedModels.length === 0 && (
          <Alert variant="destructive">
            <AlertTitle>No models selected</AlertTitle>
            <AlertDescription>
              Please select at least one model to run the comparison.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default ConfigurationCard;
