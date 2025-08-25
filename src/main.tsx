// Import Sentry only in production to avoid issues in development
if (import.meta.env.PROD && import.meta.env['VITE_SENTRY_DSN']) {
  import('./sentry');
}

import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { ThemeProvider } from 'next-themes';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <ThemeProvider
    attribute="class"
    defaultTheme="light"
    storageKey="vite-ui-theme"
  >
    <App />
    <SpeedInsights />
    <Analytics />
  </ThemeProvider>
);
