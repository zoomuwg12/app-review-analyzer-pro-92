
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle } from 'lucide-react';

interface DemoAlertProps {
  isDemoMode?: boolean;
}

const DemoAlert: React.FC<DemoAlertProps> = ({ isDemoMode = true }) => {
  if (isDemoMode) {
    return (
      <Alert className="bg-amber-50 border-amber-200 mb-6">
        <AlertTriangle className="h-4 w-4 text-amber-500" />
        <AlertTitle>Demo Mode</AlertTitle>
        <AlertDescription>
          This app is running in demo mode with mock data. In production, this would connect to the Google Play Store API.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <Alert className="bg-green-50 border-green-200 mb-6">
      <CheckCircle className="h-4 w-4 text-green-500" />
      <AlertTitle>Live Mode</AlertTitle>
      <AlertDescription>
        Connected to Google Play Store API. Showing real app data.
      </AlertDescription>
    </Alert>
  );
};

export default DemoAlert;
