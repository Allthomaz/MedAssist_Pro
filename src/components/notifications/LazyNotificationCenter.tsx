import { lazy } from 'react';

// Lazy load NotificationCenter for better performance
export const LazyNotificationCenter = lazy(() => 
  import('./NotificationCenter').then(module => ({ default: module.NotificationCenter }))
);