
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const NoDataCard: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto py-12 px-4">
      <Card>
        <CardContent className="pt-6 flex flex-col items-center">
          <h2 className="text-2xl font-semibold mb-4">No data available</h2>
          <p className="text-muted-foreground text-center mb-6">
            Please select an app with reviews first.
          </p>
          <Button onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NoDataCard;
