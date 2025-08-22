import './sentry';
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
