import { lazy } from 'react';

// Lazy load AppointmentForm for better performance
export const LazyAppointmentForm = lazy(() => 
  import('./AppointmentForm').then(module => ({ default: module.AppointmentForm }))
);