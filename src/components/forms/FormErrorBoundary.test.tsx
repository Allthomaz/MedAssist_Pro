import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FormErrorBoundary, { withFormErrorBoundary } from './FormErrorBoundary';
import * as Sentry from '@sentry/react';

// Mock do Sentry
vi.mock('@sentry/react', () => ({
  captureException: vi.fn(() => 'test-event-id'),
  showReportDialog: vi.fn(),
}));

// Componente que gera erro para testar
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test form error');
  }
  return <div>Form working</div>;
};

// Mock do console.error para evitar logs nos testes
const originalConsoleError = console.error;
beforeEach(() => {
  console.error = vi.fn();
});

afterEach(() => {
  console.error = originalConsoleError;
  vi.clearAllMocks();
});

describe('FormErrorBoundary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar children quando não há erro', () => {
    render(
      <FormErrorBoundary>
        <ThrowError shouldThrow={false} />
      </FormErrorBoundary>
    );

    expect(screen.getByText('Form working')).toBeInTheDocument();
  });

  it('deve renderizar fallback UI padrão quando há erro', () => {
    render(
      <FormErrorBoundary>
        <ThrowError shouldThrow={true} />
      </FormErrorBoundary>
    );

    expect(screen.getByText('Erro no Formulário')).toBeInTheDocument();
    expect(
      screen.getByText('Ocorreu um problema inesperado no formulário.')
    ).toBeInTheDocument();
  });

  it('deve renderizar UI específica para formulário de paciente', () => {
    render(
      <FormErrorBoundary formType="patient">
        <ThrowError shouldThrow={true} />
      </FormErrorBoundary>
    );

    expect(
      screen.getByText('Erro no Formulário de Paciente')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Ocorreu um problema ao processar os dados do paciente.')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Confirme se o CPF está no formato correto')
    ).toBeInTheDocument();
  });

  it('deve renderizar UI específica para formulário de consulta', () => {
    render(
      <FormErrorBoundary formType="consultation">
        <ThrowError shouldThrow={true} />
      </FormErrorBoundary>
    );

    expect(
      screen.getByText('Erro no Formulário de Consulta')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Ocorreu um problema ao processar os dados da consulta.')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Verifique se o paciente foi selecionado')
    ).toBeInTheDocument();
  });

  it('deve renderizar UI específica para template', () => {
    render(
      <FormErrorBoundary formType="template">
        <ThrowError shouldThrow={true} />
      </FormErrorBoundary>
    );

    expect(screen.getByText('Erro no Template')).toBeInTheDocument();
    expect(
      screen.getByText('Ocorreu um problema ao processar o template.')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Verifique se o formato do template está correto')
    ).toBeInTheDocument();
  });

  it('deve capturar erro com Sentry incluindo contexto do formulário', () => {
    const mockCaptureException = vi.mocked(Sentry.captureException);

    render(
      <FormErrorBoundary formType="patient">
        <ThrowError shouldThrow={true} />
      </FormErrorBoundary>
    );

    expect(mockCaptureException).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        contexts: expect.objectContaining({
          form: expect.objectContaining({
            formType: 'patient',
            userAgent: expect.any(String),
            timestamp: expect.any(String),
          }),
        }),
        tags: expect.objectContaining({
          section: 'form_component',
          formType: 'patient',
          feature: 'data_entry',
        }),
      })
    );
  });

  it('deve chamar onError callback quando fornecido', () => {
    const onErrorMock = vi.fn();

    render(
      <FormErrorBoundary onError={onErrorMock}>
        <ThrowError shouldThrow={true} />
      </FormErrorBoundary>
    );

    expect(onErrorMock).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String),
      })
    );
  });

  it('deve permitir tentar novamente', () => {
    render(
      <FormErrorBoundary>
        <ThrowError shouldThrow={true} />
      </FormErrorBoundary>
    );

    expect(screen.getByText('Erro no Formulário')).toBeInTheDocument();

    const retryButton = screen.getByText('Tentar Novamente');
    expect(retryButton).toBeInTheDocument();

    // Verificar se o botão de retry pode ser clicado sem erros
    expect(() => fireEvent.click(retryButton)).not.toThrow();
  });

  it('deve mostrar botão de reportar quando há eventId', () => {
    render(
      <FormErrorBoundary>
        <ThrowError shouldThrow={true} />
      </FormErrorBoundary>
    );

    const reportButton = screen.getByText('Reportar Problema');
    expect(reportButton).toBeInTheDocument();

    fireEvent.click(reportButton);
    expect(Sentry.showReportDialog).toHaveBeenCalledWith({
      eventId: 'test-event-id',
    });
  });

  it('deve renderizar fallback customizado quando fornecido', () => {
    const customFallback = <div>Custom form fallback</div>;

    render(
      <FormErrorBoundary fallback={customFallback}>
        <ThrowError shouldThrow={true} />
      </FormErrorBoundary>
    );

    expect(screen.getByText('Custom form fallback')).toBeInTheDocument();
    expect(screen.queryByText('Erro no Formulário')).not.toBeInTheDocument();
  });

  it('deve mostrar detalhes técnicos em modo dev', () => {
    // Mock do import.meta.env.DEV
    vi.stubGlobal('import.meta', {
      env: {
        DEV: true,
      },
    });

    render(
      <FormErrorBoundary>
        <ThrowError shouldThrow={true} />
      </FormErrorBoundary>
    );

    expect(screen.getByText('Detalhes Técnicos (Dev)')).toBeInTheDocument();

    // Limpar mock
    vi.unstubAllGlobals();
  });
});

describe('withFormErrorBoundary HOC', () => {
  it('deve envolver componente com FormErrorBoundary', () => {
    const TestComponent = () => <div>Test Form Component</div>;
    const WrappedComponent = withFormErrorBoundary(TestComponent, 'patient');

    render(<WrappedComponent />);

    expect(screen.getByText('Test Form Component')).toBeInTheDocument();
  });

  it('deve definir displayName corretamente', () => {
    const TestComponent = () => <div>Test Form Component</div>;
    TestComponent.displayName = 'TestFormComponent';

    const WrappedComponent = withFormErrorBoundary(TestComponent, 'patient');

    expect(WrappedComponent.displayName).toBe(
      'withFormErrorBoundary(TestFormComponent)'
    );
  });

  it('deve usar nome do componente quando displayName não está disponível', () => {
    function TestFormComponent() {
      return <div>Test Form Component</div>;
    }

    const WrappedComponent = withFormErrorBoundary(
      TestFormComponent,
      'consultation'
    );

    expect(WrappedComponent.displayName).toBe(
      'withFormErrorBoundary(TestFormComponent)'
    );
  });

  it('deve passar formType corretamente', () => {
    const TestComponent = () => {
      throw new Error('Test error');
    };

    const WrappedComponent = withFormErrorBoundary(TestComponent, 'template');

    render(<WrappedComponent />);

    expect(screen.getByText('Erro no Template')).toBeInTheDocument();
  });
});
