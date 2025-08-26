import React, { Component, ErrorInfo, ReactNode } from 'react';
import * as Sentry from '@sentry/react';
import { AlertTriangle, RefreshCw, FileText, Database } from 'lucide-react';
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
  formType?: 'patient' | 'consultation' | 'template' | 'general';
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  eventId?: string;
}

class FormErrorBoundary extends Component<Props, State> {
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
    console.error('FormErrorBoundary caught an error:', error, errorInfo);

    // Capture error with Sentry with form-specific context
    const eventId = Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
        form: {
          formType: this.props.formType || 'unknown',
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        },
      },
      tags: {
        section: 'form_component',
        formType: this.props.formType || 'general',
        feature: 'data_entry',
      },
      extra: {
        errorInfo,
        formProps: this.props,
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

  getFormTypeInfo() {
    const { formType } = this.props;

    switch (formType) {
      case 'patient':
        return {
          title: 'Erro no Formulário de Paciente',
          description: 'Ocorreu um problema ao processar os dados do paciente.',
          icon: Database,
          tips: [
            'Verifique se todos os campos obrigatórios estão preenchidos',
            'Confirme se o CPF está no formato correto',
            'Verifique a conexão com o banco de dados',
          ],
        };
      case 'consultation':
        return {
          title: 'Erro no Formulário de Consulta',
          description: 'Ocorreu um problema ao processar os dados da consulta.',
          icon: FileText,
          tips: [
            'Verifique se o paciente foi selecionado',
            'Confirme se a data e hora estão corretas',
            'Verifique se há dados não salvos',
          ],
        };
      case 'template':
        return {
          title: 'Erro no Template',
          description: 'Ocorreu um problema ao processar o template.',
          icon: FileText,
          tips: [
            'Verifique se o formato do template está correto',
            'Confirme se todos os campos estão válidos',
            'Tente recarregar o template',
          ],
        };
      default:
        return {
          title: 'Erro no Formulário',
          description: 'Ocorreu um problema inesperado no formulário.',
          icon: AlertTriangle,
          tips: [
            'Verifique se todos os dados estão corretos',
            'Tente recarregar a página',
            'Entre em contato com o suporte se o problema persistir',
          ],
        };
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const formInfo = this.getFormTypeInfo();
      const IconComponent = formInfo.icon;

      return (
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <IconComponent className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-xl font-semibold text-gray-900">
              {formInfo.title}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {formInfo.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Dicas para resolver:</strong>
                <ul className="mt-2 list-disc list-inside text-sm space-y-1">
                  {formInfo.tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
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

export default FormErrorBoundary;

// HOC para facilitar o uso
export const withFormErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  formType?: Props['formType'],
  errorBoundaryProps?: Omit<Props, 'children' | 'formType'>
) => {
  const WrappedComponent = (props: P) => (
    <FormErrorBoundary formType={formType} {...errorBoundaryProps}>
      <Component {...props} />
    </FormErrorBoundary>
  );

  WrappedComponent.displayName = `withFormErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
};
