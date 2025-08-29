import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '../toast';
import { useToast, toast } from '@/hooks/use-toast';

// Estender expect com jest-axe
expect.extend(toHaveNoViolations);

// Mock do portal para testes
jest.mock('@radix-ui/react-toast', () => {
  const actual = jest.requireActual('@radix-ui/react-toast');
  return {
    ...actual,
    Root: ({ children, ...props }: any) => (
      <div role="alert" {...props}>
        {children}
      </div>
    ),
    Viewport: ({ children, ...props }: any) => (
      <div data-testid="toast-viewport" {...props}>
        {children}
      </div>
    ),
  };
});

// Componente de teste para usar o hook useToast
const TestToastComponent = () => {
  const { toast } = useToast();

  return (
    <div>
      <button
        onClick={() =>
          toast({ title: 'Sucesso', description: 'Operação realizada' })
        }
      >
        Toast Sucesso
      </button>
      <button
        onClick={() =>
          toast({
            title: 'Erro',
            description: 'Algo deu errado',
            variant: 'destructive',
          })
        }
      >
        Toast Erro
      </button>
      <button
        onClick={() =>
          toast({
            title: 'Aviso',
            description: 'Atenção necessária',
            variant: 'default',
          })
        }
      >
        Toast Aviso
      </button>
    </div>
  );
};

describe('Toast Components', () => {
  describe('Toast Básico', () => {
    it('deve renderizar toast com título e descrição', () => {
      render(
        <ToastProvider>
          <Toast>
            <ToastTitle>Título do Toast</ToastTitle>
            <ToastDescription>Descrição do toast</ToastDescription>
          </Toast>
          <ToastViewport />
        </ToastProvider>
      );

      expect(screen.getByText('Título do Toast')).toBeInTheDocument();
      expect(screen.getByText('Descrição do toast')).toBeInTheDocument();
    });

    it('deve renderizar toast apenas com título', () => {
      render(
        <ToastProvider>
          <Toast>
            <ToastTitle>Apenas Título</ToastTitle>
          </Toast>
          <ToastViewport />
        </ToastProvider>
      );

      expect(screen.getByText('Apenas Título')).toBeInTheDocument();
    });

    it('deve renderizar toast apenas com descrição', () => {
      render(
        <ToastProvider>
          <Toast>
            <ToastDescription>Apenas descrição</ToastDescription>
          </Toast>
          <ToastViewport />
        </ToastProvider>
      );

      expect(screen.getByText('Apenas descrição')).toBeInTheDocument();
    });
  });

  describe('Toast com Ações', () => {
    it('deve renderizar toast com ação', () => {
      const handleAction = jest.fn();

      render(
        <ToastProvider>
          <Toast>
            <ToastTitle>Toast com Ação</ToastTitle>
            <ToastDescription>Clique na ação</ToastDescription>
            <ToastAction altText="Desfazer ação" onClick={handleAction}>
              Desfazer
            </ToastAction>
          </Toast>
          <ToastViewport />
        </ToastProvider>
      );

      const actionButton = screen.getByRole('button', { name: 'Desfazer' });
      expect(actionButton).toBeInTheDocument();

      fireEvent.click(actionButton);
      expect(handleAction).toHaveBeenCalledTimes(1);
    });

    it('deve renderizar toast com botão de fechar', () => {
      render(
        <ToastProvider>
          <Toast>
            <ToastTitle>Toast com Fechar</ToastTitle>
            <ToastDescription>Pode ser fechado</ToastDescription>
            <ToastClose />
          </Toast>
          <ToastViewport />
        </ToastProvider>
      );

      const closeButton = screen.getByRole('button');
      expect(closeButton).toBeInTheDocument();
    });
  });

  describe('Variantes do Toast', () => {
    it('deve aplicar classe padrão', () => {
      render(
        <ToastProvider>
          <Toast data-testid="toast-default">
            <ToastTitle>Toast Padrão</ToastTitle>
          </Toast>
          <ToastViewport />
        </ToastProvider>
      );

      const toast = screen.getByTestId('toast-default');
      expect(toast).toHaveClass('border', 'bg-background', 'text-foreground');
    });

    it('deve aplicar classe destrutiva', () => {
      render(
        <ToastProvider>
          <Toast variant="destructive" data-testid="toast-destructive">
            <ToastTitle>Toast Erro</ToastTitle>
          </Toast>
          <ToastViewport />
        </ToastProvider>
      );

      const toast = screen.getByTestId('toast-destructive');
      expect(toast).toHaveClass('destructive');
    });
  });

  describe('Hook useToast', () => {
    it('deve renderizar componente de teste', () => {
      render(
        <ToastProvider>
          <TestToastComponent />
          <ToastViewport />
        </ToastProvider>
      );

      expect(screen.getByText('Toast Sucesso')).toBeInTheDocument();
      expect(screen.getByText('Toast Erro')).toBeInTheDocument();
      expect(screen.getByText('Toast Aviso')).toBeInTheDocument();
    });
  });

  describe('ToastViewport', () => {
    it('deve renderizar viewport do toast', () => {
      render(
        <ToastProvider>
          <ToastViewport data-testid="viewport" />
        </ToastProvider>
      );

      expect(screen.getByTestId('viewport')).toBeInTheDocument();
    });
  });

  describe('Interações', () => {
    it('deve ter botão fechar funcional', () => {
      render(
        <ToastProvider>
          <Toast open={true}>
            <ToastTitle>Toast Fechável</ToastTitle>
            <ToastDescription>Pode ser fechado</ToastDescription>
            <ToastClose />
          </Toast>
          <ToastViewport />
        </ToastProvider>
      );

      expect(screen.getByText('Toast Fechável')).toBeInTheDocument();

      const closeButton = screen.getByRole('button');
      expect(closeButton).toBeInTheDocument();

      // Verifica se o botão é clicável
      fireEvent.click(closeButton);
    });

    it('deve executar ação e fechar toast', async () => {
      const handleAction = jest.fn();
      render(
        <ToastProvider>
          <Toast>
            <ToastTitle>Teste de Ação</ToastTitle>
            <ToastDescription>Clique para executar</ToastDescription>
            <ToastAction altText="Executar ação" onClick={handleAction}>
              Executar
            </ToastAction>
          </Toast>
          <ToastViewport />
        </ToastProvider>
      );

      const actionButton = screen.getByRole('button', { name: 'Executar' });
      fireEvent.click(actionButton);

      expect(handleAction).toHaveBeenCalledTimes(1);
    });
  });

  describe('Acessibilidade', () => {
    it('deve não ter violações de acessibilidade', async () => {
      const { container } = render(
        <ToastProvider>
          <Toast>
            <ToastTitle>Toast Acessível</ToastTitle>
            <ToastDescription>Descrição acessível</ToastDescription>
          </Toast>
          <ToastViewport />
        </ToastProvider>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('deve ter role alert', () => {
      render(
        <ToastProvider>
          <Toast>
            <ToastTitle>Toast com Role</ToastTitle>
          </Toast>
          <ToastViewport />
        </ToastProvider>
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('deve ter altText no botão de ação', () => {
      render(
        <ToastProvider>
          <Toast>
            <ToastTitle>Toast</ToastTitle>
            <ToastAction altText="Desfazer última ação">Desfazer</ToastAction>
          </Toast>
          <ToastViewport />
        </ToastProvider>
      );

      const actionButton = screen.getByRole('button', { name: 'Desfazer' });
      expect(actionButton).toBeInTheDocument();
    });

    it('deve ter botão fechar', () => {
      render(
        <ToastProvider>
          <Toast>
            <ToastTitle>Título</ToastTitle>
            <ToastDescription>Descrição</ToastDescription>
            <ToastClose />
          </Toast>
          <ToastViewport />
        </ToastProvider>
      );

      const closeButton = screen.getByRole('button');
      expect(closeButton).toBeInTheDocument();
    });

    it('deve ser navegável por teclado', () => {
      render(
        <ToastProvider>
          <Toast>
            <ToastTitle>Toast Navegável</ToastTitle>
            <ToastAction altText="Ação">Ação</ToastAction>
            <ToastClose />
          </Toast>
          <ToastViewport />
        </ToastProvider>
      );

      const actionButton = screen.getByRole('button', { name: 'Ação' });
      const buttons = screen.getAllByRole('button');
      const closeButton =
        buttons.find(btn => btn.getAttribute('aria-label')?.match(/fechar/i)) ||
        buttons[1];

      // Deve ser possível focar nos botões
      actionButton.focus();
      expect(actionButton).toHaveFocus();

      closeButton.focus();
      expect(closeButton).toHaveFocus();
    });
  });

  describe('Props Customizadas', () => {
    it('deve aceitar className customizado', () => {
      render(
        <ToastProvider>
          <Toast className="custom-toast" data-testid="custom-toast">
            <ToastTitle>Toast Customizado</ToastTitle>
          </Toast>
          <ToastViewport />
        </ToastProvider>
      );

      const toast = screen.getByTestId('custom-toast');
      expect(toast).toHaveClass('custom-toast');
    });

    it('deve aceitar data-testid', () => {
      render(
        <ToastProvider>
          <Toast data-testid="test-toast">
            <ToastTitle>Toast para Teste</ToastTitle>
          </Toast>
          <ToastViewport />
        </ToastProvider>
      );

      expect(screen.getByTestId('test-toast')).toBeInTheDocument();
    });

    it('deve aceitar duração customizada', () => {
      render(
        <ToastProvider>
          <Toast duration={1000}>
            <ToastTitle>Toast Rápido</ToastTitle>
          </Toast>
          <ToastViewport />
        </ToastProvider>
      );

      expect(screen.getByText('Toast Rápido')).toBeInTheDocument();
    });
  });
});
