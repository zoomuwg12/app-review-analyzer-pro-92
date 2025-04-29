
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface PreprocessingOptionsProps {
  options: {
    lowercase: boolean;
    removeStopWords: boolean;
    removeNumbers: boolean;
    removePunctuation: boolean;
    removeTags: boolean;
    applyStemming: boolean;
  };
  onOptionChange: (option: keyof PreprocessingOptionsProps['options']) => void;
}

const PreprocessingOptions: React.FC<PreprocessingOptionsProps> = ({ 
  options, 
  onOptionChange 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Preprocessing Options</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="lowercase" className="cursor-pointer">Convert to lowercase</Label>
            <Switch
              id="lowercase"
              checked={options.lowercase}
              onCheckedChange={() => onOptionChange('lowercase')}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="removeStopWords" className="cursor-pointer">Remove stop words</Label>
            <Switch
              id="removeStopWords"
              checked={options.removeStopWords}
              onCheckedChange={() => onOptionChange('removeStopWords')}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="removeNumbers" className="cursor-pointer">Remove numbers</Label>
            <Switch
              id="removeNumbers"
              checked={options.removeNumbers}
              onCheckedChange={() => onOptionChange('removeNumbers')}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="removePunctuation" className="cursor-pointer">Remove punctuation</Label>
            <Switch
              id="removePunctuation"
              checked={options.removePunctuation}
              onCheckedChange={() => onOptionChange('removePunctuation')}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="removeTags" className="cursor-pointer">Remove HTML tags</Label>
            <Switch
              id="removeTags"
              checked={options.removeTags}
              onCheckedChange={() => onOptionChange('removeTags')}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="applyStemming" className="cursor-pointer">Apply stemming</Label>
            <Switch
              id="applyStemming"
              checked={options.applyStemming}
              onCheckedChange={() => onOptionChange('applyStemming')}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PreprocessingOptions;
