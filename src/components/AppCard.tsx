
import React from 'react';
import { Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppInfo } from '@/utils/scraper';

interface AppCardProps {
  app: AppInfo;
  onRemove: (appId: string) => void;
  onSelect: (appId: string) => void;
  isSelected: boolean;
}

const AppCard: React.FC<AppCardProps> = ({ app, onRemove, onSelect, isSelected }) => {
  return (
    <div 
      className={`bg-card rounded-lg p-4 shadow-md flex items-center justify-between border ${
        isSelected ? 'border-primary' : 'border-border'
      } hover:shadow-lg transition-all cursor-pointer`}
      onClick={() => onSelect(app.appId)}
    >
      <div className="flex items-center gap-3">
        <img 
          src={app.icon} 
          alt={`${app.title} icon`} 
          className="w-10 h-10 rounded-lg" 
        />
        <div className="text-left">
          <h3 className="font-medium text-foreground">{app.title}</h3>
          <p className="text-xs text-muted-foreground">{app.appId}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <div className="text-yellow-400">★</div>
          <span className="text-sm">{app.score.toFixed(1)}</span>
        </div>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={(e) => {
            e.stopPropagation();
            onRemove(app.appId);
          }}
        >
          <Trash size={16} />
        </Button>
      </div>
    </div>
  );
};

export default AppCard;
