import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { Toaster as Sonner } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/contexts/AuthContext';
import ErrorBoundary from '@/components/ErrorBoundary';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useWebVitals } from '@/components/PerformanceMonitor';

// Lazy load pages for better performance with strategic preloading
const Index = lazy(() => import('./pages/Index'));
const Patients = lazy(() =>
  import('./pages/Patients').then(module => {
    // Preload related pages after Patients loads
    import('./pages/Consultations');
    import('./pages/Documents');
    return module;
  })
);
const Templates = lazy(() => import('./pages/Templates'));
const Consultations = lazy(() => import('./pages/Consultations'));
const Documents = lazy(() => import('./pages/Documents'));
const Appointments = lazy(() =>
  import('./pages/Appointments').then(module => {
    // Preload Analytics as it's commonly accessed after Appointments
    import('./pages/Analytics');
    return module;
  })
);
const Settings = lazy(() => import('./pages/Settings'));
const Analytics = lazy(() => import('./pages/Analytics'));
const NotFound = lazy(() => import('./pages/NotFound'));
const AuthPage = lazy(() => import('@/pages/Auth'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword'));
const DesignShowcase = lazy(() =>
  import('@/components/showcase/DesignShowcase').then(module => ({
    default: module.DesignShowcase,
  }))
);
const SimpleTranscriptionTest = lazy(
  () => import('./components/test/SimpleTranscriptionTest')
);
const ReportTest = lazy(() => import('./components/test/ReportTest'));
const StorageTest = lazy(() => import('./components/test/StorageTest'));
const AuthTest = lazy(() => import('@/components/test/AuthTest'));
const RLSTest = lazy(() => import('@/components/test/RLSTest'));
const TestNavigation = lazy(() => import('@/components/test/TestNavigation'));

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

// Loading component for Suspense fallback
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

function App() {
  return (
    <ErrorBoundary showDetails={import.meta.env.DEV}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AuthProvider>
            <BrowserRouter>
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/auth/reset" element={<ResetPassword />} />
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <Index />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/patients"
                    element={
                      <ProtectedRoute>
                        <Patients />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/consultations"
                    element={
                      <ProtectedRoute>
                        <Consultations />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/templates"
                    element={
                      <ProtectedRoute>
                        <Templates />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/appointments"
                    element={
                      <ProtectedRoute>
                        <Appointments />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/documents"
                    element={
                      <ProtectedRoute>
                        <Documents />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/analytics"
                    element={
                      <ProtectedRoute>
                        <Analytics />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/showcase"
                    element={
                      <ProtectedRoute>
                        <DesignShowcase />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/test-transcription"
                    element={
                      <ProtectedRoute>
                        <SimpleTranscriptionTest />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/test-reports"
                    element={
                      <ProtectedRoute>
                        <ReportTest />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/test-storage"
                    element={
                      <ProtectedRoute>
                        <StorageTest />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/test-auth"
                    element={
                      <ProtectedRoute>
                        <AuthTest />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/test-rls"
                    element={
                      <ProtectedRoute>
                        <RLSTest />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/tests"
                    element={
                      <ProtectedRoute>
                        <TestNavigation />
                      </ProtectedRoute>
                    }
                  />

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

// Componente que integra monitoramento de performance
function AppWithMonitoring() {
  useWebVitals();
  return <App />;
}

export default AppWithMonitoring;
