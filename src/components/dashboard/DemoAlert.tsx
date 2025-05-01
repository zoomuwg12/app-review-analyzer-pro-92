
import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Check, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DemoAlertProps {
  isDemoMode?: boolean;
}

const DemoAlert: React.FC<DemoAlertProps> = ({ isDemoMode = false }) => {
  const [isDemo, setIsDemo] = useState<boolean>(isDemoMode);
  
  // Check if we're in demo mode by attempting to make a real API call
  useEffect(() => {
    // On mount, set demo mode based on prop
    setIsDemo(isDemoMode);
  }, [isDemoMode]);
  
  if (!isDemo) return null;

  return (
    <Alert className="bg-amber-50 border-amber-200 mb-6">
      <AlertTriangle className="h-4 w-4 text-amber-500" />
      <AlertTitle>Demo Mode</AlertTitle>
      <AlertDescription className="flex flex-col gap-2">
        <p>This app is running in demo mode with mock data. To connect to the real Google Play Store API, ensure the system has internet access.</p>
        <div className="flex flex-wrap gap-2 mt-2">
          <Button 
            variant="outline" 
            size="sm"
            className="text-xs"
            onClick={() => setIsDemo(false)}
          >
            <Check className="mr-1 h-3 w-3" />
            Dismiss
          </Button>
          <a href="https://github.com/facundoolano/google-play-scraper" target="_blank" rel="noopener noreferrer">
            <Button 
              variant="link" 
              size="sm"
              className="text-xs"
            >
              <ExternalLink className="mr-1 h-3 w-3" />
              API Documentation
            </Button>
          </a>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default DemoAlert;
