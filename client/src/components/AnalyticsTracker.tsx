import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const AnalyticsTracker: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const trackPageView = async () => {
      try {
        const pageData = {
          page: location.pathname,
          referrer: document.referrer || '',
          userAgent: navigator.userAgent,
          screenResolution: `${window.screen.width}x${window.screen.height}`,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };

        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(pageData)
        });
      } catch (error) {
        // Silently fail - analytics tracking shouldn't break the app
        console.error('Analytics tracking failed:', error);
      }
    };

    // Track page view when location changes
    trackPageView();
  }, [location]);

  // This component doesn't render anything
  return null;
};

export default AnalyticsTracker; 