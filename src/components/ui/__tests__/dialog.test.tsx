import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../dialog';

expect.extend(toHaveNoViolations);

// Mock do Radix UI Dialog
jest.mock('@radix-ui/react-dialog', () => ({
  Root: ({ children }: any) => <div data-testid="dialog-root">{children}</div>,
  Trigger: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
  Portal: ({ children }: any) => (
    <div data-testid="dialog-portal">{children}</div>
  ),
  Overlay: ({ children, ...props }: any) => (
    <div data-testid="dialog-overlay" {...props}>
      {children}
    </div>
  ),
  Content: ({ children, ...props }: any) => {
    const { 'aria-labelledby': ariaLabelledby, ...otherProps } = props;
    return (
      <div
        role="dialog"
        data-testid="dialog-content"
        aria-labelledby={ariaLabelledby}
        {...otherProps}
      >
        {children}
      </div>
    );
  },
  Title: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
  Description: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  Close: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}));

describe('Dialog Components', () => {
  describe('Dialog Básico', () => {
    it('deve renderizar trigger do dialog', () => {
      render(
        <Dialog>
          <DialogTrigger>Abrir Dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle>Título</DialogTitle>
          </DialogContent>
        </Dialog>
      );

      expect(screen.getByText('Abrir Dialog')).toBeInTheDocument();
    });
  });

  describe('Dialog Controlado', () => {
    it('deve renderizar dialog controlado aberto', () => {
      render(
        <Dialog open={true}>
          <DialogContent>
            <DialogTitle>Dialog Controlado</DialogTitle>
            <DialogDescription>Conteúdo controlado</DialogDescription>
          </DialogContent>
        </Dialog>
      );

      expect(screen.getByText('Dialog Controlado')).toBeInTheDocument();
      expect(screen.getByText('Conteúdo controlado')).toBeInTheDocument();
    });
  });

  describe('DialogContent', () => {
    it('deve renderizar conteúdo do dialog', () => {
      render(
        <Dialog open={true}>
          <DialogContent data-testid="dialog-content">
            <DialogTitle>Título do Dialog</DialogTitle>
            <DialogDescription>Descrição do dialog</DialogDescription>
            <div>Conteúdo personalizado</div>
          </DialogContent>
        </Dialog>
      );

      expect(screen.getByTestId('dialog-content')).toBeInTheDocument();
      expect(screen.getByText('Título do Dialog')).toBeInTheDocument();
      expect(screen.getByText('Descrição do dialog')).toBeInTheDocument();
      expect(screen.getByText('Conteúdo personalizado')).toBeInTheDocument();
    });
  });

  describe('DialogHeader e DialogFooter', () => {
    it('deve renderizar header e footer', () => {
      render(
        <Dialog open={true}>
          <DialogContent>
            <DialogHeader data-testid="dialog-header">
              <DialogTitle>Título no Header</DialogTitle>
              <DialogDescription>Descrição no header</DialogDescription>
            </DialogHeader>
            <div>Conteúdo principal</div>
            <DialogFooter data-testid="dialog-footer">
              <button>Cancelar</button>
              <button>Confirmar</button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );

      expect(screen.getByTestId('dialog-header')).toBeInTheDocument();
      expect(screen.getByTestId('dialog-footer')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Cancelar' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Confirmar' })
      ).toBeInTheDocument();
    });
  });

  describe('Acessibilidade', () => {
    it('deve não ter violações de acessibilidade', async () => {
      const { container } = render(
        <Dialog open={true}>
          <DialogContent aria-labelledby="dialog-title">
            <DialogTitle id="dialog-title">Dialog Acessível</DialogTitle>
            <DialogDescription>Descrição para acessibilidade</DialogDescription>
          </DialogContent>
        </Dialog>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('deve ter role dialog', () => {
      render(
        <Dialog open={true}>
          <DialogContent>
            <DialogTitle>Dialog com Role</DialogTitle>
          </DialogContent>
        </Dialog>
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  describe('Props Customizadas', () => {
    it('deve aceitar className customizado', () => {
      render(
        <Dialog open={true}>
          <DialogContent className="custom-dialog">
            <DialogTitle>Dialog Customizado</DialogTitle>
          </DialogContent>
        </Dialog>
      );

      expect(screen.getByRole('dialog')).toHaveClass('custom-dialog');
    });

    it('deve aceitar data-testid', () => {
      render(
        <Dialog open={true}>
          <DialogContent data-testid="custom-dialog">
            <DialogTitle>Dialog com Test ID</DialogTitle>
            <DialogDescription>Para testes</DialogDescription>
          </DialogContent>
        </Dialog>
      );

      expect(screen.getByTestId('custom-dialog')).toBeInTheDocument();
    });
  });
});
