import React, { Component, ErrorInfo, ReactNode } from 'react';
import * as Sentry from '@sentry/react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  showDetails?: boolean;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  eventId?: string;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Capture error with Sentry
    const eventId = Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
      tags: {
        section: 'error_boundary',
      },
      extra: {
        errorInfo,
      },
    });

    this.setState({
      error,
      errorInfo,
      eventId,
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleReportFeedback = () => {
    if (this.state.eventId) {
      Sentry.showReportDialog({ eventId: this.state.eventId });
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-xl font-semibold text-gray-900">
                Oops! Algo deu errado
              </CardTitle>
              <CardDescription className="text-gray-600">
                Ocorreu um erro inesperado. Nossa equipe foi notificada
                automaticamente.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-2">
                <Button onClick={this.handleReload} className="w-full">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Recarregar Página
                </Button>
                <Button
                  variant="outline"
                  onClick={this.handleGoHome}
                  className="w-full"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Voltar ao Início
                </Button>
                {this.state.eventId && (
                  <Button
                    variant="ghost"
                    onClick={this.handleReportFeedback}
                    className="w-full text-sm"
                  >
                    Reportar Problema
                  </Button>
                )}
              </div>

              {this.props.showDetails && this.state.error && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                    Detalhes Técnicos
                  </summary>
                  <div className="mt-2 rounded-md bg-gray-100 p-3">
                    <pre className="text-xs text-gray-800 whitespace-pre-wrap break-words">
                      {this.state.error.toString()}
                      {this.state.errorInfo?.componentStack && (
                        <>
                          \n\nComponent Stack:
                          {this.state.errorInfo.componentStack}
                        </>
                      )}
                    </pre>
                  </div>
                  {this.state.eventId && (
                    <p className="mt-2 text-xs text-gray-500">
                      ID do Erro: {this.state.eventId}
                    </p>
                  )}
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// HOC para facilitar o uso
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
};

// Hook para capturar erros em componentes funcionais
export const useErrorHandler = () => {
  return React.useCallback(
    (error: Error, errorInfo?: { componentStack?: string }) => {
      console.error('Error caught by useErrorHandler:', error);

      Sentry.captureException(error, {
        contexts: {
          react: errorInfo
            ? { componentStack: errorInfo.componentStack }
            : undefined,
        },
        tags: {
          section: 'error_handler_hook',
        },
      });
    },
    []
  );
};

export default ErrorBoundary;
