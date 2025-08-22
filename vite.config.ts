import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { sentryVitePlugin } from '@sentry/vite-plugin';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';

  return {
    base: '/',
    server: {
      host: '::',
      port: 8080,
    },
    plugins: [
      react(),
      visualizer({
        filename: 'dist/stats.html',
        open: true,
        gzipSize: true,
        brotliSize: true,
      }),
      sentryVitePlugin({
        org: process.env.SENTRY_ORG,
        project: process.env.SENTRY_PROJECT,
        authToken: process.env.SENTRY_AUTH_TOKEN,
      }),
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: !isDev,
      minify: !isDev,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'supabase-vendor': ['@supabase/supabase-js'],
            'pdf-vendor': ['jspdf', 'html2canvas'],
            'date-vendor': ['date-fns'],
            'form-vendor': ['react-hook-form', '@hookform/resolvers'],
            'sentry-vendor': ['@sentry/react'],
          },
        },
      },
    },
    define: {
      global: 'globalThis',
    },
    optimizeDeps: {
      include: ['react', 'react-dom'],
    },
  };
});
