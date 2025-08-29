import { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Search, Eye, EyeOff, User, Mail, Phone, Calendar } from 'lucide-react';
import { useState } from 'react';

const meta = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Componente Input para entrada de dados no MedAssist Pro.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: [
        'text',
        'email',
        'password',
        'number',
        'tel',
        'url',
        'search',
        'date',
        'time',
      ],
    },
    placeholder: {
      control: { type: 'text' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
    className: {
      control: { type: 'text' },
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

// Input básico
export const Default: Story = {
  args: {
    placeholder: 'Digite aqui...',
  },
};

// Input com label
export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="name">Nome Completo</Label>
      <Input type="text" id="name" placeholder="Digite seu nome" />
    </div>
  ),
};

// Input de email
export const Email: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input type="email" id="email" placeholder="seu@email.com" />
    </div>
  ),
};

// Input de senha
export const Password: Story = {
  render: () => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="password">Senha</Label>
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            id="password"
            placeholder="Digite sua senha"
            className="pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    );
  },
};

// Input de busca
export const SearchInput: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="search">Buscar Pacientes</Label>
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          id="search"
          placeholder="Nome, CPF ou prontuário..."
          className="pl-8"
        />
      </div>
    </div>
  ),
};

// Input numérico
export const Number: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="age">Idade</Label>
      <Input type="number" id="age" placeholder="0" min="0" max="120" />
    </div>
  ),
};

// Input de telefone
export const PhoneInput: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="phone">Telefone</Label>
      <div className="relative">
        <Phone className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="tel"
          id="phone"
          placeholder="(11) 99999-9999"
          className="pl-8"
        />
      </div>
    </div>
  ),
};

// Input de data
export const Date: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="birthdate">Data de Nascimento</Label>
      <div className="relative">
        <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input type="date" id="birthdate" className="pl-8" />
      </div>
    </div>
  ),
};

// Input desabilitado
export const Disabled: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="disabled">Campo Desabilitado</Label>
      <Input type="text" id="disabled" placeholder="Não editável" disabled />
    </div>
  ),
};

// Input com erro
export const WithError: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="error" className="text-destructive">
        CPF *
      </Label>
      <Input
        type="text"
        id="error"
        placeholder="000.000.000-00"
        className="border-destructive focus-visible:ring-destructive"
      />
      <p className="text-sm text-destructive">
        CPF inválido. Verifique o formato.
      </p>
    </div>
  ),
};

// Input com sucesso
export const WithSuccess: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="success" className="text-medical-success">
        Email Verificado
      </Label>
      <Input
        type="email"
        id="success"
        value="usuario@medassist.com"
        className="border-medical-success focus-visible:ring-medical-success"
        readOnly
      />
      <p className="text-sm text-medical-success">
        ✓ Email verificado com sucesso
      </p>
    </div>
  ),
};

// Formulário de paciente
export const PatientForm: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-4">
      <div className="space-y-2">
        <Label htmlFor="patient-name">Nome Completo *</Label>
        <div className="relative">
          <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            id="patient-name"
            placeholder="Nome do paciente"
            className="pl-8"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="patient-email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="email"
            id="patient-email"
            placeholder="email@exemplo.com"
            className="pl-8"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="patient-phone">Telefone</Label>
        <div className="relative">
          <Phone className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="tel"
            id="patient-phone"
            placeholder="(11) 99999-9999"
            className="pl-8"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="patient-birthdate">Data de Nascimento</Label>
        <div className="relative">
          <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="date" id="patient-birthdate" className="pl-8" />
        </div>
      </div>

      <Button className="w-full" variant="medical">
        Cadastrar Paciente
      </Button>
    </div>
  ),
};

// Input de busca avançada
export const AdvancedSearch: Story = {
  render: () => (
    <div className="w-full max-w-lg space-y-4">
      <div className="space-y-2">
        <Label>Busca Avançada de Pacientes</Label>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Nome, CPF, prontuário ou telefone..."
            className="pl-8 pr-20"
          />
          <Button
            size="sm"
            variant="medical"
            className="absolute right-1 top-1 h-8"
          >
            Buscar
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Digite pelo menos 3 caracteres para iniciar a busca
        </p>
      </div>
    </div>
  ),
};

// Diferentes tamanhos
export const Sizes: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-sm">
      <div className="space-y-2">
        <Label>Input Pequeno</Label>
        <Input placeholder="Pequeno" className="h-8 text-sm" />
      </div>

      <div className="space-y-2">
        <Label>Input Padrão</Label>
        <Input placeholder="Padrão" />
      </div>

      <div className="space-y-2">
        <Label>Input Grande</Label>
        <Input placeholder="Grande" className="h-12 text-base" />
      </div>
    </div>
  ),
};
