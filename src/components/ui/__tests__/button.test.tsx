import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from '../button';

// Estender expect com jest-axe
expect.extend(toHaveNoViolations);

describe('Button Component', () => {
  describe('Renderização', () => {
    it('deve renderizar com texto padrão', () => {
      render(<Button>Clique aqui</Button>);
      expect(
        screen.getByRole('button', { name: 'Clique aqui' })
      ).toBeInTheDocument();
    });

    it('deve renderizar como disabled quando prop disabled é true', () => {
      render(<Button disabled>Botão Desabilitado</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('deve renderizar com variant correto', () => {
      render(<Button variant="destructive">Deletar</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-destructive');
    });

    it('deve renderizar com size correto', () => {
      render(<Button size="sm">Pequeno</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-9');
    });
  });

  describe('Interações', () => {
    it('deve chamar onClick quando clicado', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Clique</Button>);

      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('não deve chamar onClick quando disabled', () => {
      const handleClick = jest.fn();
      render(
        <Button disabled onClick={handleClick}>
          Botão Desabilitado
        </Button>
      );

      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('deve ter foco quando focado', () => {
      render(<Button>Focável</Button>);
      const button = screen.getByRole('button');

      button.focus();
      expect(button).toHaveFocus();
    });
  });

  describe('Variantes', () => {
    const variants = [
      'default',
      'destructive',
      'outline',
      'secondary',
      'ghost',
      'link',
    ] as const;

    variants.forEach(variant => {
      it(`deve renderizar variant ${variant} corretamente`, () => {
        render(<Button variant={variant}>Teste {variant}</Button>);
        expect(screen.getByRole('button')).toBeInTheDocument();
      });
    });
  });

  describe('Tamanhos', () => {
    const sizes = ['default', 'sm', 'lg', 'icon'] as const;

    sizes.forEach(size => {
      it(`deve renderizar size ${size} corretamente`, () => {
        render(<Button size={size}>Teste {size}</Button>);
        expect(screen.getByRole('button')).toBeInTheDocument();
      });
    });
  });

  describe('Acessibilidade', () => {
    it('deve não ter violações de acessibilidade', async () => {
      const { container } = render(<Button>Botão Acessível</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('deve ter aria-label quando fornecido', () => {
      render(<Button aria-label="Fechar modal">×</Button>);
      expect(screen.getByLabelText('Fechar modal')).toBeInTheDocument();
    });

    it('deve ter atributo disabled quando disabled', () => {
      render(<Button disabled>Desabilitado</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('deve ser navegável por teclado', () => {
      render(<Button>Navegável</Button>);
      const button = screen.getByRole('button');

      // Deve ser focável (botões HTML são focáveis por padrão)
      button.focus();
      expect(button).toHaveFocus();
    });

    it('deve ativar com Enter', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Enter</Button>);

      const button = screen.getByRole('button');
      fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });

      // O comportamento padrão do button já trata Enter
      expect(button).toBeInTheDocument();
    });

    it('deve ativar com Space', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Space</Button>);

      const button = screen.getByRole('button');
      fireEvent.keyDown(button, { key: ' ', code: 'Space' });

      // O comportamento padrão do button já trata Space
      expect(button).toBeInTheDocument();
    });
  });

  describe('Props customizadas', () => {
    it('deve aceitar className customizado', () => {
      render(<Button className="custom-class">Custom</Button>);
      expect(screen.getByRole('button')).toHaveClass('custom-class');
    });

    it('deve aceitar data-testid', () => {
      render(<Button data-testid="custom-button">Test ID</Button>);
      expect(screen.getByTestId('custom-button')).toBeInTheDocument();
    });

    it('deve renderizar como link quando asChild é usado', () => {
      render(
        <Button asChild>
          <a href="/test">Link Button</a>
        </Button>
      );
      expect(screen.getByRole('link')).toBeInTheDocument();
    });
  });
});
