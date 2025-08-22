// Import Sentry only in production to avoid issues in development
if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
  import('./sentry');
}

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from 'next-themes';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { useWebVitals } from '@/components/PerformanceMonitor';

// Component wrapper para incluir Web Vitals monitoring
const AppWithMonitoring = () => {
  useWebVitals();
  return <App />;
};

createRoot(document.getElementById('root')!).render(
  <ThemeProvider
    attribute="class"
    defaultTheme="light"
    storageKey="vite-ui-theme"
  >
    <AppWithMonitoring />
    <SpeedInsights />
  </ThemeProvider>
);
