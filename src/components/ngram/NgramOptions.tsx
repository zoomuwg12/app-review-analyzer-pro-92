
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface NgramOptionsProps {
  ngramSize: number;
  maxItems: number;
  onNgramSizeChange: (size: number) => void;
  onMaxItemsChange: (count: number) => void;
  onReprocess: () => void;
}

const NgramOptions: React.FC<NgramOptionsProps> = ({
  ngramSize,
  maxItems,
  onNgramSizeChange,
  onMaxItemsChange,
  onReprocess,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>N-Gram Options</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="ngram-size">N-Gram Size</Label>
            <Select
              value={ngramSize.toString()}
              onValueChange={(value) => onNgramSizeChange(parseInt(value))}
            >
              <SelectTrigger id="ngram-size">
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 (Unigrams)</SelectItem>
                <SelectItem value="2">2 (Bigrams)</SelectItem>
                <SelectItem value="3">3 (Trigrams)</SelectItem>
                <SelectItem value="4">4 (Four-grams)</SelectItem>
                <SelectItem value="5">5 (Five-grams)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Select how many words to include in each phrase
            </p>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="max-items">Display Count</Label>
            <Select
              value={maxItems.toString()}
              onValueChange={(value) => onMaxItemsChange(parseInt(value))}
            >
              <SelectTrigger id="max-items">
                <SelectValue placeholder="Select count" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="30">30</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Number of results to display
            </p>
          </div>
          
          <Button onClick={onReprocess} className="w-full">
            Process N-Grams
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NgramOptions;
