import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { componentTagger } from 'lovable-tagger';
import { visualizer } from 'rollup-plugin-visualizer';
import { sentryVitePlugin } from '@sentry/vite-plugin';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: '::',
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
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
    rollupOptions: {
      output: {
        manualChunks: id => {
          // Node modules chunking strategy
          if (id.includes('node_modules')) {
            // React ecosystem
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }

            // UI libraries
            if (id.includes('@radix-ui') || id.includes('cmdk')) {
              return 'ui-vendor';
            }

            // Supabase
            if (id.includes('@supabase') || id.includes('supabase')) {
              return 'supabase-vendor';
            }

            // Sentry
            if (id.includes('@sentry')) {
              return 'sentry-vendor';
            }

            // Icons
            if (id.includes('lucide-react')) {
              return 'icons-vendor';
            }

            // PDF generation
            if (id.includes('jspdf') || id.includes('html2canvas')) {
              return 'pdf-vendor';
            }

            // Date/time utilities
            if (id.includes('date-fns') || id.includes('dayjs')) {
              return 'date-vendor';
            }

            // Form libraries
            if (id.includes('react-hook-form') || id.includes('zod')) {
              return 'form-vendor';
            }

            // Query libraries
            if (id.includes('@tanstack/react-query')) {
              return 'query-vendor';
            }

            // Other utilities
            if (
              id.includes('clsx') ||
              id.includes('tailwind-merge') ||
              id.includes('class-variance-authority')
            ) {
              return 'utils-vendor';
            }

            // Default vendor chunk for other node_modules
            return 'vendor';
          }

          // Feature-based chunking for source code
          if (
            id.includes('/pages/Patients') ||
            id.includes('/components/patients/')
          ) {
            return 'patients';
          }

          if (
            id.includes('/pages/Consultations') ||
            id.includes('/components/consultations/')
          ) {
            return 'consultations';
          }

          if (
            id.includes('/pages/Documents') ||
            id.includes('/components/documents/')
          ) {
            return 'documents';
          }

          if (
            id.includes('/pages/Appointments') ||
            id.includes('/components/appointments/')
          ) {
            return 'appointments';
          }

          if (
            id.includes('/pages/Analytics') ||
            id.includes('/components/analytics/')
          ) {
            return 'analytics';
          }

          if (
            id.includes('/pages/Settings') ||
            id.includes('/components/settings/')
          ) {
            return 'settings';
          }

          if (id.includes('/components/test/')) {
            return 'test-components';
          }

          // Shared components and utilities
          if (
            id.includes('/components/ui/') ||
            id.includes('/components/common/')
          ) {
            return 'shared-ui';
          }

          if (id.includes('/lib/') || id.includes('/utils/')) {
            return 'shared-utils';
          }

          if (id.includes('/contexts/') || id.includes('/hooks/')) {
            return 'shared-logic';
          }
        },
        // Optimize chunk names
        chunkFileNames: chunkInfo => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId
                .split('/')
                .pop()
                ?.replace('.tsx', '')
                .replace('.ts', '')
            : 'chunk';
          return `assets/[name]-[hash].js`;
        },
        // Optimize asset names
        assetFileNames: assetInfo => {
          const info = assetInfo.name?.split('.') || [];
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext || '')) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/css/i.test(ext || '')) {
            return `assets/styles/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      },
      // Optimize external dependencies
      external: id => {
        // Keep these as external if they're CDN loaded
        return false;
      },
    },
    // Increase chunk size warning limit for better optimization
    chunkSizeWarningLimit: 1500,
    // Enable source maps for production debugging with Sentry
    sourcemap: true,
    // Optimize build performance
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production',
      },
    },
  },
}));
