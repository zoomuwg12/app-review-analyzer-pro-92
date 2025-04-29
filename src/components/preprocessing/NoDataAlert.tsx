
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const NoDataAlert: React.FC = () => {
  return (
    <div className="container mx-auto py-12 px-4">
      <Card>
        <CardContent className="pt-6 flex flex-col items-center">
          <h2 className="text-2xl font-semibold mb-4">No data available for preprocessing</h2>
          <p className="text-muted-foreground text-center mb-6">
            Please select an app and load reviews from the dashboard first.
          </p>
          <Button asChild>
            <Link to="/">Return to Dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NoDataAlert;
