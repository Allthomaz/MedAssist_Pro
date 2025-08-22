import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { componentTagger } from 'lovable-tagger';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: '::',
    port: 8080,
  },
  plugins: [react(), mode === 'development' && componentTagger()].filter(
    Boolean
  ),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
          ],
          'supabase-vendor': ['@supabase/supabase-js'],
          'utils-vendor': [
            'clsx',
            'tailwind-merge',
            'class-variance-authority',
          ],
          'icons-vendor': ['lucide-react'],
          // Feature chunks
          patients: [
            './src/pages/Patients.tsx',
            './src/components/patients/PatientForm.tsx',
            './src/components/patients/PatientProfile.tsx',
          ],
          consultations: [
            './src/pages/Consultations.tsx',
            './src/components/consultations/ConsultationDetail.tsx',
          ],
          documents: [
            './src/pages/Documents.tsx',
            './src/components/documents/DocumentGenerator.tsx',
          ],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: mode === 'development',
  },
}));
