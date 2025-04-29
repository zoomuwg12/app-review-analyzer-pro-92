
import React from 'react';
import { ChartBar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const TfidfLoading: React.FC<{ reviewCount: number }> = ({ reviewCount }) => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="flex flex-col items-center gap-4">
          <ChartBar className="h-16 w-16 animate-pulse text-primary" />
          <h3 className="text-xl font-semibold">Processing TF-IDF</h3>
          <p className="text-center text-muted-foreground">
            Analyzing term importance across {reviewCount} reviews. This may take a moment...
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TfidfLoading;
