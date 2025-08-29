// Import Sentry only in production to avoid issues in development
if (import.meta.env.PROD && import.meta.env['VITE_SENTRY_DSN']) {
  import('./sentry');
}

// Import axe-core for accessibility auditing in development
if (import.meta.env.DEV) {
  import('@axe-core/react').then(axe => {
    axe.default(React, ReactDOM, 1000);
  });
}

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { ThemeProvider } from 'next-themes';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
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
