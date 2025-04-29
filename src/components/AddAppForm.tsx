
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';

interface AddAppFormProps {
  onAddApp: (appId: string) => Promise<void>;
  isLoading: boolean;
}

const AddAppForm: React.FC<AddAppFormProps> = ({ onAddApp, isLoading }) => {
  const [appIdInput, setAppIdInput] = useState('');
  const { toast } = useToast();

  const extractAppId = (input: string): string => {
    // Extract app ID from URL if it's a URL
    if (input.includes('play.google.com/store/apps/details')) {
      const url = new URL(input);
      const appId = url.searchParams.get('id');
      if (appId) return appId;
    }
    
    // If not a URL or couldn't extract ID, return the input as is
    return input;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!appIdInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter an app ID or URL",
        variant: "destructive",
      });
      return;
    }

    const appId = extractAppId(appIdInput.trim());
    
    try {
      await onAddApp(appId);
      setAppIdInput('');
    } catch (error) {
      console.error("Failed to add app:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-2">
        <div className="flex-1">
          <Input
            value={appIdInput}
            onChange={(e) => setAppIdInput(e.target.value)}
            placeholder="Enter Play Store app ID or URL (e.g., com.example.app)"
            className="bg-background border-border"
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Example: com.instagram.android or https://play.google.com/store/apps/details?id=com.instagram.android
          </p>
        </div>
        <Button type="submit" disabled={isLoading} className="whitespace-nowrap">
          <Plus className="mr-2 h-4 w-4" />
          Add App
        </Button>
      </div>
    </form>
  );
};

export default AddAppForm;
