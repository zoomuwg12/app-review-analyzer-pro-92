
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppInfo } from '@/utils/scraper';
import AddAppForm from '@/components/AddAppForm';
import AppCard from '@/components/AppCard';

interface AppSelectorProps {
  apps: AppInfo[];
  selectedAppId: string | null;
  onAddApp: (appId: string) => Promise<void>;
  onRemoveApp: (appId: string) => void;
  onSelectApp: (appId: string) => void;
  isLoadingApps: boolean;
}

const AppSelector: React.FC<AppSelectorProps> = ({ 
  apps, 
  selectedAppId, 
  onAddApp, 
  onRemoveApp, 
  onSelectApp, 
  isLoadingApps 
}) => {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Add Google Play App</CardTitle>
        </CardHeader>
        <CardContent>
          <AddAppForm onAddApp={onAddApp} isLoading={isLoadingApps} />
        </CardContent>
      </Card>

      {apps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Apps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              {apps.map(app => (
                <AppCard
                  key={app.appId}
                  app={app}
                  onRemove={onRemoveApp}
                  onSelect={onSelectApp}
                  isSelected={app.appId === selectedAppId}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AppSelector;
