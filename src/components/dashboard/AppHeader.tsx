
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { AppInfo } from '@/utils/scraper';

interface AppHeaderProps {
  app: AppInfo;
  reviewCount: number;
  setReviewCount: (count: number) => void;
  onRefreshReviews: () => void;
  isLoadingReviews: boolean;
}

const AppHeader: React.FC<AppHeaderProps> = ({ 
  app, 
  reviewCount, 
  setReviewCount, 
  onRefreshReviews, 
  isLoadingReviews 
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card rounded-lg p-5 shadow-md">
      <div className="flex items-center space-x-4">
        <img src={app.icon} alt={app.title} className="w-16 h-16 rounded-xl" />
        <div>
          <h2 className="text-2xl font-bold">{app.title}</h2>
          <p className="text-muted-foreground">{app.developer}</p>
          <div className="flex items-center mt-1">
            <div className="text-yellow-400 mr-1">★</div>
            <span>{app.score.toFixed(1)}</span>
            <span className="mx-2">•</span>
            <span>{app.free ? 'Free' : app.priceText}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground mb-1">Reviews to fetch:</span>
          <Select
            value={reviewCount.toString()}
            onValueChange={(value) => setReviewCount(parseInt(value))}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="50">50 reviews</SelectItem>
              <SelectItem value="100">100 reviews</SelectItem>
              <SelectItem value="200">200 reviews</SelectItem>
              <SelectItem value="300">300 reviews</SelectItem>
              <SelectItem value="500">500 reviews</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button 
          onClick={onRefreshReviews}
          disabled={isLoadingReviews}
        >
          {isLoadingReviews ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            'Refresh Reviews'
          )}
        </Button>
      </div>
    </div>
  );
};

export default AppHeader;
