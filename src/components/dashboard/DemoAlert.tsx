
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface DemoAlertProps {
  isDemoMode?: boolean;
}

const DemoAlert: React.FC<DemoAlertProps> = ({ isDemoMode = true }) => {
  return (
    <Alert className="bg-amber-50 border-amber-200 mb-6">
      <AlertTriangle className="h-4 w-4 text-amber-500" />
      <AlertTitle>Demo Mode</AlertTitle>
      <AlertDescription>
        This app is running in demo mode with mock data. The google-play-scraper package is designed 
        for server-side use and cannot run directly in the browser. In a production environment, 
        you would implement a server API that uses this package.
      </AlertDescription>
    </Alert>
  );
};

export default DemoAlert;
