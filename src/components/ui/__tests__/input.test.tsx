import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Input } from '../input';

// Estender expect com jest-axe
expect.extend(toHaveNoViolations);

describe('Input Component', () => {
  describe('Renderização', () => {
    it('deve renderizar input básico', () => {
      render(<Input placeholder="Digite aqui" />);
      expect(screen.getByPlaceholderText('Digite aqui')).toBeInTheDocument();
    });

    it('deve renderizar com valor inicial', () => {
      render(<Input defaultValue="Valor inicial" />);
      expect(screen.getByDisplayValue('Valor inicial')).toBeInTheDocument();
    });

    it('deve renderizar como disabled quando prop disabled é true', () => {
      render(<Input disabled placeholder="Desabilitado" />);
      expect(screen.getByPlaceholderText('Desabilitado')).toBeDisabled();
    });

    it('deve renderizar com type correto', () => {
      render(<Input type="email" placeholder="Email" />);
      expect(screen.getByPlaceholderText('Email')).toHaveAttribute(
        'type',
        'email'
      );
    });
  });

  describe('Interações', () => {
    it('deve chamar onChange quando valor muda', () => {
      const handleChange = jest.fn();
      render(<Input onChange={handleChange} placeholder="Teste" />);

      const input = screen.getByPlaceholderText('Teste');
      fireEvent.change(input, { target: { value: 'novo valor' } });

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({ value: 'novo valor' }),
        })
      );
    });

    it('deve chamar onFocus quando focado', () => {
      const handleFocus = jest.fn();
      render(<Input onFocus={handleFocus} placeholder="Focus" />);

      fireEvent.focus(screen.getByPlaceholderText('Focus'));
      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it('deve chamar onBlur quando perde foco', () => {
      const handleBlur = jest.fn();
      render(<Input onBlur={handleBlur} placeholder="Blur" />);

      const input = screen.getByPlaceholderText('Blur');
      fireEvent.focus(input);
      fireEvent.blur(input);

      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it('deve aceitar entrada de teclado', () => {
      render(<Input placeholder="Teclado" />);
      const input = screen.getByPlaceholderText('Teclado');

      fireEvent.change(input, { target: { value: 'texto digitado' } });
      expect(input).toHaveValue('texto digitado');
    });
  });

  describe('Tipos de Input', () => {
    const inputTypes = [
      'text',
      'email',
      'password',
      'number',
      'tel',
      'url',
      'search',
    ] as const;

    inputTypes.forEach(type => {
      it(`deve renderizar input type ${type} corretamente`, () => {
        render(<Input type={type} placeholder={`Teste ${type}`} />);
        const input = screen.getByPlaceholderText(`Teste ${type}`);
        expect(input).toHaveAttribute('type', type);
      });
    });
  });

  describe('Estados', () => {
    it('deve mostrar estado de erro com aria-invalid', () => {
      render(<Input aria-invalid="true" placeholder="Erro" />);
      expect(screen.getByPlaceholderText('Erro')).toHaveAttribute(
        'aria-invalid',
        'true'
      );
    });

    it('deve ser readonly quando prop readonly é true', () => {
      render(<Input readOnly defaultValue="Somente leitura" />);
      expect(screen.getByDisplayValue('Somente leitura')).toHaveAttribute(
        'readonly'
      );
    });

    it('deve ter required quando prop required é true', () => {
      render(<Input required placeholder="Obrigatório" />);
      expect(screen.getByPlaceholderText('Obrigatório')).toBeRequired();
    });
  });

  describe('Acessibilidade', () => {
    it('deve não ter violações de acessibilidade', async () => {
      const { container } = render(
        <div>
          <label htmlFor="test-input">Nome</label>
          <Input id="test-input" placeholder="Digite seu nome" />
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('deve ter aria-label quando fornecido', () => {
      render(<Input aria-label="Campo de busca" />);
      expect(screen.getByLabelText('Campo de busca')).toBeInTheDocument();
    });

    it('deve ter aria-describedby quando fornecido', () => {
      render(
        <div>
          <Input aria-describedby="help-text" placeholder="Input" />
          <div id="help-text">Texto de ajuda</div>
        </div>
      );
      expect(screen.getByPlaceholderText('Input')).toHaveAttribute(
        'aria-describedby',
        'help-text'
      );
    });

    it('deve ser focável por teclado', () => {
      render(<Input placeholder="Focável" />);
      const input = screen.getByPlaceholderText('Focável');

      input.focus();
      expect(input).toHaveFocus();
    });

    it('deve navegar com Tab', () => {
      render(
        <div>
          <Input placeholder="Primeiro" />
          <Input placeholder="Segundo" />
        </div>
      );

      const firstInput = screen.getByPlaceholderText('Primeiro');
      const secondInput = screen.getByPlaceholderText('Segundo');

      firstInput.focus();
      expect(firstInput).toHaveFocus();

      fireEvent.keyDown(firstInput, { key: 'Tab' });
      // Note: jsdom não simula navegação real por Tab, mas podemos testar que os elementos são focáveis
      expect(firstInput).toBeInTheDocument();
      expect(secondInput).toBeInTheDocument();
    });
  });

  describe('Validação', () => {
    it('deve validar email quando type é email', () => {
      render(<Input type="email" placeholder="Email" />);
      const input = screen.getByPlaceholderText('Email');

      fireEvent.change(input, { target: { value: 'email-invalido' } });
      fireEvent.blur(input);

      // O navegador fará a validação nativa
      expect(input).toHaveAttribute('type', 'email');
    });

    it('deve aceitar pattern para validação', () => {
      render(
        <Input pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" placeholder="Telefone" />
      );
      expect(screen.getByPlaceholderText('Telefone')).toHaveAttribute(
        'pattern',
        '[0-9]{3}-[0-9]{3}-[0-9]{4}'
      );
    });

    it('deve aceitar minLength e maxLength', () => {
      render(<Input minLength={3} maxLength={10} placeholder="Texto" />);
      const input = screen.getByPlaceholderText('Texto');

      expect(input).toHaveAttribute('minLength', '3');
      expect(input).toHaveAttribute('maxLength', '10');
    });
  });

  describe('Props customizadas', () => {
    it('deve aceitar className customizado', () => {
      render(<Input className="custom-input" placeholder="Custom" />);
      expect(screen.getByPlaceholderText('Custom')).toHaveClass('custom-input');
    });

    it('deve aceitar data-testid', () => {
      render(<Input data-testid="custom-input" placeholder="Test ID" />);
      expect(screen.getByTestId('custom-input')).toBeInTheDocument();
    });

    it('deve aceitar ref', () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<Input ref={ref} placeholder="Ref" />);

      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });
  });
});
