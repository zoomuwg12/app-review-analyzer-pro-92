
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface PreprocessingHeaderProps {
  title: string;
  reviewCount: number;
  onBack: () => void;
}

const PreprocessingHeader: React.FC<PreprocessingHeaderProps> = ({ 
  title, 
  reviewCount, 
  onBack 
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{title} - Text Preprocessing</h1>
          <p className="text-muted-foreground">{reviewCount} reviews available for processing</p>
        </div>
      </div>
    </div>
  );
};

export default PreprocessingHeader;
