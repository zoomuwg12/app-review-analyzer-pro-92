
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

const DemoAlert: React.FC = () => {
  return (
    <Alert className="bg-amber-50 border-amber-200 mb-6">
      <AlertTriangle className="h-4 w-4 text-amber-500" />
      <AlertTitle>Demo Mode</AlertTitle>
      <AlertDescription>
        This app is running in demo mode with mock data. In production, this would connect to the Google Play Store API.
      </AlertDescription>
    </Alert>
  );
};

export default DemoAlert;
