import React, { Component, ErrorInfo, ReactNode } from 'react';
import * as Sentry from '@sentry/react';
import { AlertTriangle, RefreshCw, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  eventId?: string;
}

class AudioErrorBoundary extends Component<Props, State> {
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
    console.error('AudioErrorBoundary caught an error:', error, errorInfo);

    // Capture error with Sentry with audio-specific context
    const eventId = Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
        audio: {
          userAgent: navigator.userAgent,
          mediaDevices: 'mediaDevices' in navigator,
          permissions: 'permissions' in navigator,
        },
      },
      tags: {
        section: 'audio_component',
        feature: 'audio_recording',
      },
      extra: {
        errorInfo,
        timestamp: new Date().toISOString(),
      },
    });

    this.setState({
      error,
      errorInfo,
      eventId,
    });

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleReload = () => {
    window.location.reload();
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
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-xl font-semibold text-gray-900">
              Erro no Sistema de Áudio
            </CardTitle>
            <CardDescription className="text-gray-600">
              Ocorreu um problema com a funcionalidade de áudio. Isso pode ser
              devido a permissões do microfone ou compatibilidade do navegador.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Mic className="h-4 w-4" />
              <AlertDescription>
                <strong>Dicas para resolver:</strong>
                <ul className="mt-2 list-disc list-inside text-sm space-y-1">
                  <li>Verifique se o microfone está conectado</li>
                  <li>Permita o acesso ao microfone no navegador</li>
                  <li>Teste em um navegador diferente</li>
                  <li>Recarregue a página</li>
                </ul>
              </AlertDescription>
            </Alert>

            <div className="flex flex-col gap-2">
              <Button onClick={this.handleRetry} className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Tentar Novamente
              </Button>
              <Button
                variant="outline"
                onClick={this.handleReload}
                className="w-full"
              >
                Recarregar Página
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

            {import.meta.env.DEV && this.state.error && (
              <details className="mt-4">
                <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                  Detalhes Técnicos (Dev)
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
      );
    }

    return this.props.children;
  }
}

export default AudioErrorBoundary;

// HOC para facilitar o uso
export const withAudioErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) => {
  const WrappedComponent = (props: P) => (
    <AudioErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </AudioErrorBoundary>
  );

  WrappedComponent.displayName = `withAudioErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
};
