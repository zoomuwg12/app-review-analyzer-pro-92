
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface ModelSelectorProps {
  selectedModels: string[];
  onToggleModel: (model: string) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ 
  selectedModels,
  onToggleModel
}) => {
  const models = [
    { id: "naive-bayes", name: "Naive Bayes", description: "Fast, simple probabilistic classifier" },
    { id: "svm", name: "SVM", description: "Effective in high-dimensional spaces" },
    { id: "random-forest", name: "Random Forest", description: "Ensemble of decision trees" }
  ];

  return (
    <div className="space-y-3">
      <h3 className="font-medium text-sm">Models to Compare</h3>
      <div className="space-y-2">
        {models.map((model) => (
          <div key={model.id} className="flex items-start space-x-2">
            <Checkbox 
              id={model.id}
              checked={selectedModels.includes(model.name)}
              onCheckedChange={() => onToggleModel(model.name)}
            />
            <div className="grid gap-0.5 leading-none">
              <Label htmlFor={model.id} className="cursor-pointer">{model.name}</Label>
              <p className="text-xs text-muted-foreground">{model.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModelSelector;
