
import React from 'react';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface SplitRatioSelectorProps {
  selectedRatio: string;
  onSelectRatio: (ratio: string) => void;
}

const SplitRatioSelector: React.FC<SplitRatioSelectorProps> = ({ 
  selectedRatio,
  onSelectRatio
}) => {
  const ratios = [
    { value: '65:35', label: '65% Train / 35% Test' },
    { value: '70:30', label: '70% Train / 30% Test' },
    { value: '75:25', label: '75% Train / 25% Test' },
    { value: '80:20', label: '80% Train / 20% Test' }
  ];

  return (
    <div className="space-y-3">
      <h3 className="font-medium text-sm">Training/Testing Split Ratio</h3>
      <RadioGroup value={selectedRatio} onValueChange={onSelectRatio} className="flex flex-col gap-2">
        {ratios.map(ratio => (
          <div key={ratio.value} className="flex items-center space-x-2">
            <RadioGroupItem value={ratio.value} id={`ratio-${ratio.value}`} />
            <Label htmlFor={`ratio-${ratio.value}`}>{ratio.label}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default SplitRatioSelector;
