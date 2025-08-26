import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AudioErrorBoundary, {
  withAudioErrorBoundary,
} from './AudioErrorBoundary';
import * as Sentry from '@sentry/react';

// Mock do Sentry
vi.mock('@sentry/react', () => ({
  captureException: vi.fn(() => 'test-event-id'),
  showReportDialog: vi.fn(),
}));

// Componente que gera erro para testar
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

// Mock do console.error para evitar logs nos testes
const originalConsoleError = console.error;
beforeEach(() => {
  console.error = vi.fn();
});

afterEach(() => {
  console.error = originalConsoleError;
});

describe('AudioErrorBoundary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar children quando não há erro', () => {
    render(
      <AudioErrorBoundary>
        <ThrowError shouldThrow={false} />
      </AudioErrorBoundary>
    );

    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('deve renderizar fallback UI quando há erro', () => {
    render(
      <AudioErrorBoundary>
        <ThrowError shouldThrow={true} />
      </AudioErrorBoundary>
    );

    expect(screen.getByText('Erro no Sistema de Áudio')).toBeInTheDocument();
    expect(
      screen.getByText(/Ocorreu um problema com a funcionalidade de áudio/)
    ).toBeInTheDocument();
  });

  it('deve capturar erro com Sentry', () => {
    const mockCaptureException = vi.mocked(Sentry.captureException);

    render(
      <AudioErrorBoundary>
        <ThrowError shouldThrow={true} />
      </AudioErrorBoundary>
    );

    expect(mockCaptureException).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        contexts: expect.objectContaining({
          audio: expect.objectContaining({
            userAgent: expect.any(String),
            mediaDevices: expect.any(Boolean),
            permissions: expect.any(Boolean),
          }),
        }),
        tags: expect.objectContaining({
          section: 'audio_component',
          feature: 'audio_recording',
        }),
      })
    );
  });

  it('deve chamar onError callback quando fornecido', () => {
    const onErrorMock = vi.fn();

    render(
      <AudioErrorBoundary onError={onErrorMock}>
        <ThrowError shouldThrow={true} />
      </AudioErrorBoundary>
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
      <AudioErrorBoundary>
        <ThrowError shouldThrow={true} />
      </AudioErrorBoundary>
    );

    expect(screen.getByText('Erro no Sistema de Áudio')).toBeInTheDocument();

    const retryButton = screen.getByText('Tentar Novamente');
    expect(retryButton).toBeInTheDocument();

    // Verificar se o botão de retry pode ser clicado sem erros
    expect(() => fireEvent.click(retryButton)).not.toThrow();
  });

  it('deve mostrar botão de reportar quando há eventId', () => {
    render(
      <AudioErrorBoundary>
        <ThrowError shouldThrow={true} />
      </AudioErrorBoundary>
    );

    const reportButton = screen.getByText('Reportar Problema');
    expect(reportButton).toBeInTheDocument();

    fireEvent.click(reportButton);
    expect(Sentry.showReportDialog).toHaveBeenCalledWith({
      eventId: 'test-event-id',
    });
  });

  it('deve mostrar dicas específicas para áudio', () => {
    render(
      <AudioErrorBoundary>
        <ThrowError shouldThrow={true} />
      </AudioErrorBoundary>
    );

    expect(
      screen.getByText('Verifique se o microfone está conectado')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Permita o acesso ao microfone no navegador')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Teste em um navegador diferente')
    ).toBeInTheDocument();
  });

  it('deve renderizar fallback customizado quando fornecido', () => {
    const customFallback = <div>Custom fallback</div>;

    render(
      <AudioErrorBoundary fallback={customFallback}>
        <ThrowError shouldThrow={true} />
      </AudioErrorBoundary>
    );

    expect(screen.getByText('Custom fallback')).toBeInTheDocument();
    expect(
      screen.queryByText('Erro no Sistema de Áudio')
    ).not.toBeInTheDocument();
  });

  it('deve mostrar detalhes técnicos em modo dev', () => {
    // Mock do import.meta.env.DEV
    vi.stubGlobal('import.meta', {
      env: {
        DEV: true,
      },
    });

    render(
      <AudioErrorBoundary>
        <ThrowError shouldThrow={true} />
      </AudioErrorBoundary>
    );

    expect(screen.getByText('Detalhes Técnicos (Dev)')).toBeInTheDocument();

    // Limpar mock
    vi.unstubAllGlobals();
  });
});

describe('withAudioErrorBoundary HOC', () => {
  it('deve envolver componente com AudioErrorBoundary', () => {
    const TestComponent = () => <div>Test Component</div>;
    const WrappedComponent = withAudioErrorBoundary(TestComponent);

    render(<WrappedComponent />);

    expect(screen.getByText('Test Component')).toBeInTheDocument();
  });

  it('deve definir displayName corretamente', () => {
    const TestComponent = () => <div>Test Component</div>;
    TestComponent.displayName = 'TestComponent';

    const WrappedComponent = withAudioErrorBoundary(TestComponent);

    expect(WrappedComponent.displayName).toBe(
      'withAudioErrorBoundary(TestComponent)'
    );
  });

  it('deve usar nome do componente quando displayName não está disponível', () => {
    function TestComponent() {
      return <div>Test Component</div>;
    }

    const WrappedComponent = withAudioErrorBoundary(TestComponent);

    expect(WrappedComponent.displayName).toBe(
      'withAudioErrorBoundary(TestComponent)'
    );
  });
});
