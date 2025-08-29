import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from '../card';

// Estender expect com jest-axe
expect.extend(toHaveNoViolations);

describe('Card Components', () => {
  describe('Card', () => {
    it('deve renderizar card básico', () => {
      render(
        <Card data-testid="card">
          <CardContent>Conteúdo do card</CardContent>
        </Card>
      );
      expect(screen.getByTestId('card')).toBeInTheDocument();
      expect(screen.getByText('Conteúdo do card')).toBeInTheDocument();
    });

    it('deve aceitar className customizado', () => {
      render(
        <Card className="custom-card" data-testid="card">
          <CardContent>Conteúdo</CardContent>
        </Card>
      );
      expect(screen.getByTestId('card')).toHaveClass('custom-card');
    });
  });

  describe('CardHeader', () => {
    it('deve renderizar header do card', () => {
      render(
        <Card>
          <CardHeader data-testid="card-header">
            <CardTitle>Título</CardTitle>
          </CardHeader>
        </Card>
      );
      expect(screen.getByTestId('card-header')).toBeInTheDocument();
    });
  });

  describe('CardTitle', () => {
    it('deve renderizar título do card', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Título do Card</CardTitle>
          </CardHeader>
        </Card>
      );
      expect(screen.getByText('Título do Card')).toBeInTheDocument();
    });

    it('deve renderizar como h3 por padrão', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Título</CardTitle>
          </CardHeader>
        </Card>
      );
      expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
    });
  });

  describe('CardDescription', () => {
    it('deve renderizar descrição do card', () => {
      render(
        <Card>
          <CardHeader>
            <CardDescription>Descrição do card</CardDescription>
          </CardHeader>
        </Card>
      );
      expect(screen.getByText('Descrição do card')).toBeInTheDocument();
    });
  });

  describe('CardContent', () => {
    it('deve renderizar conteúdo do card', () => {
      render(
        <Card>
          <CardContent data-testid="card-content">
            Conteúdo principal
          </CardContent>
        </Card>
      );
      expect(screen.getByTestId('card-content')).toBeInTheDocument();
      expect(screen.getByText('Conteúdo principal')).toBeInTheDocument();
    });
  });

  describe('CardFooter', () => {
    it('deve renderizar footer do card', () => {
      render(
        <Card>
          <CardFooter data-testid="card-footer">Footer do card</CardFooter>
        </Card>
      );
      expect(screen.getByTestId('card-footer')).toBeInTheDocument();
      expect(screen.getByText('Footer do card')).toBeInTheDocument();
    });
  });

  describe('Card Completo', () => {
    it('deve renderizar card completo com todos os componentes', () => {
      render(
        <Card data-testid="complete-card">
          <CardHeader>
            <CardTitle>Título Completo</CardTitle>
            <CardDescription>Descrição completa do card</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Conteúdo principal do card</p>
          </CardContent>
          <CardFooter>
            <button>Ação</button>
          </CardFooter>
        </Card>
      );

      expect(screen.getByTestId('complete-card')).toBeInTheDocument();
      expect(screen.getByText('Título Completo')).toBeInTheDocument();
      expect(
        screen.getByText('Descrição completa do card')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Conteúdo principal do card')
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Ação' })).toBeInTheDocument();
    });
  });

  describe('Acessibilidade', () => {
    it('deve não ter violações de acessibilidade - card básico', async () => {
      const { container } = render(
        <Card>
          <CardContent>Conteúdo acessível</CardContent>
        </Card>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('deve não ter violações de acessibilidade - card completo', async () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>Título Acessível</CardTitle>
            <CardDescription>Descrição acessível</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Conteúdo acessível</p>
          </CardContent>
          <CardFooter>
            <button>Botão Acessível</button>
          </CardFooter>
        </Card>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('deve ter estrutura semântica correta', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Título</CardTitle>
            <CardDescription>Descrição</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Parágrafo de conteúdo</p>
          </CardContent>
        </Card>
      );

      // Verificar hierarquia de headings
      expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();

      // Verificar que o conteúdo está estruturado corretamente
      expect(screen.getByText('Parágrafo de conteúdo')).toBeInTheDocument();
    });

    it('deve aceitar aria-label para melhor acessibilidade', () => {
      render(
        <Card aria-label="Card de informações do usuário">
          <CardContent>Informações</CardContent>
        </Card>
      );
      expect(
        screen.getByLabelText('Card de informações do usuário')
      ).toBeInTheDocument();
    });

    it('deve aceitar role customizado', () => {
      render(
        <Card role="article">
          <CardHeader>
            <CardTitle>Artigo</CardTitle>
          </CardHeader>
          <CardContent>Conteúdo do artigo</CardContent>
        </Card>
      );
      expect(screen.getByRole('article')).toBeInTheDocument();
    });
  });

  describe('Interatividade', () => {
    it('deve ser clicável quando onClick é fornecido', () => {
      const handleClick = jest.fn();
      render(
        <Card onClick={handleClick} data-testid="clickable-card">
          <CardContent>Card clicável</CardContent>
        </Card>
      );

      const card = screen.getByTestId('clickable-card');
      card.click();

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('deve ser focável quando é interativo', () => {
      const handleClick = jest.fn();
      render(
        <Card onClick={handleClick} tabIndex={0} data-testid="focusable-card">
          <CardContent>Card focável</CardContent>
        </Card>
      );

      const card = screen.getByTestId('focusable-card');
      card.focus();

      expect(card).toHaveFocus();
    });
  });

  describe('Variações de Layout', () => {
    it('deve renderizar card apenas com título', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Apenas Título</CardTitle>
          </CardHeader>
        </Card>
      );
      expect(screen.getByText('Apenas Título')).toBeInTheDocument();
    });

    it('deve renderizar card apenas com conteúdo', () => {
      render(
        <Card>
          <CardContent>Apenas conteúdo</CardContent>
        </Card>
      );
      expect(screen.getByText('Apenas conteúdo')).toBeInTheDocument();
    });

    it('deve renderizar card com múltiplos elementos no footer', () => {
      render(
        <Card>
          <CardContent>Conteúdo</CardContent>
          <CardFooter>
            <button>Cancelar</button>
            <button>Confirmar</button>
          </CardFooter>
        </Card>
      );

      expect(
        screen.getByRole('button', { name: 'Cancelar' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Confirmar' })
      ).toBeInTheDocument();
    });
  });
});
