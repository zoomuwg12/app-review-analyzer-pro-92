
import React from 'react';
import { useAppState } from '@/hooks/useAppState';
import DemoAlert from '@/components/dashboard/DemoAlert';
import AppSelector from '@/components/dashboard/AppSelector';
import AppHeader from '@/components/dashboard/AppHeader';
import ReviewsContent from '@/components/dashboard/ReviewsContent';

const Dashboard: React.FC = () => {
  const { 
    apps, 
    selectedAppId, 
    reviews, 
    isLoadingApps, 
    isLoadingReviews, 
    reviewCount, 
    selectedApp,
    setSelectedAppId,
    setReviewCount,
    handleAddApp, 
    handleRemoveApp, 
    loadReviews
  } = useAppState();

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <DemoAlert />

      <AppSelector 
        apps={apps}
        selectedAppId={selectedAppId}
        onAddApp={handleAddApp}
        onRemoveApp={handleRemoveApp}
        onSelectApp={setSelectedAppId}
        isLoadingApps={isLoadingApps}
      />

      {selectedApp && (
        <div className="space-y-8">
          <AppHeader 
            app={selectedApp}
            reviewCount={reviewCount}
            setReviewCount={setReviewCount}
            onRefreshReviews={() => selectedAppId && loadReviews(selectedAppId)}
            isLoadingReviews={isLoadingReviews}
          />

          <ReviewsContent 
            reviews={reviews}
            isLoadingReviews={isLoadingReviews}
            appName={selectedApp.title}
            app={selectedApp}
            onLoadReviews={() => selectedAppId && loadReviews(selectedAppId)}
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
