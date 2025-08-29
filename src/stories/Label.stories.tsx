import { Meta, StoryObj } from '@storybook/react-vite';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Stethoscope,
  Heart,
  AlertCircle,
  Info,
  Star,
  Clock,
  FileText,
} from 'lucide-react';

const meta = {
  title: 'UI/Label',
  component: Label,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Componente Label para rotular campos de formulário no MedAssist Pro.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    htmlFor: {
      control: 'text',
      description: 'ID do elemento associado',
    },
    children: {
      control: 'text',
      description: 'Conteúdo do label',
    },
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

// Label básico
export const Default: Story = {
  args: {
    children: 'Nome do Paciente',
  },
};

// Label com input
export const WithInput: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="name">Nome Completo</Label>
      <Input id="name" type="text" placeholder="Digite o nome completo" />
    </div>
  ),
};

// Label com ícone
export const WithIcon: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email" className="flex items-center gap-2">
        <Mail className="h-4 w-4 text-medical-blue" />
        E-mail
      </Label>
      <Input id="email" type="email" placeholder="exemplo@email.com" />
    </div>
  ),
};

// Label obrigatório
export const Required: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="cpf" className="flex items-center gap-1">
        CPF
        <span className="text-red-500">*</span>
      </Label>
      <Input id="cpf" type="text" placeholder="000.000.000-00" required />
    </div>
  ),
};

// Label com badge
export const WithBadge: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="specialty" className="flex items-center gap-2">
        <Stethoscope className="h-4 w-4 text-medical-blue" />
        Especialidade
        <Badge variant="outline" className="text-xs">
          Obrigatório
        </Badge>
      </Label>
      <Input id="specialty" type="text" placeholder="Ex: Cardiologia" />
    </div>
  ),
};

// Label com descrição
export const WithDescription: Story = {
  render: () => (
    <div className="grid w-full max-w-md items-center gap-1.5">
      <Label htmlFor="observations" className="flex items-center gap-2">
        <FileText className="h-4 w-4 text-medical-blue" />
        Observações Médicas
      </Label>
      <p className="text-sm text-muted-foreground mb-2">
        Descreva sintomas, histórico e observações relevantes para o diagnóstico
      </p>
      <Textarea
        id="observations"
        placeholder="Digite as observações..."
        rows={4}
      />
    </div>
  ),
};

// Labels médicos específicos
export const MedicalLabels: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-6">
      <div className="grid items-center gap-1.5">
        <Label htmlFor="patient-name" className="flex items-center gap-2">
          <User className="h-4 w-4 text-medical-blue" />
          Nome do Paciente
          <span className="text-red-500">*</span>
        </Label>
        <Input id="patient-name" placeholder="Nome completo" />
      </div>

      <div className="grid items-center gap-1.5">
        <Label htmlFor="birth-date" className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-medical-blue" />
          Data de Nascimento
        </Label>
        <Input id="birth-date" type="date" />
      </div>

      <div className="grid items-center gap-1.5">
        <Label htmlFor="phone" className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-medical-blue" />
          Telefone de Contato
        </Label>
        <Input id="phone" placeholder="(11) 99999-9999" />
      </div>

      <div className="grid items-center gap-1.5">
        <Label htmlFor="address" className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-medical-blue" />
          Endereço Completo
        </Label>
        <Input id="address" placeholder="Rua, número, bairro, cidade" />
      </div>
    </div>
  ),
};

// Label com status de prioridade
export const PriorityLabels: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-4">
      <div className="grid items-center gap-1.5">
        <Label className="flex items-center gap-2">
          <Heart className="h-4 w-4 text-red-500" />
          Paciente Crítico
          <Badge className="bg-red-500 text-white text-xs">Urgente</Badge>
        </Label>
        <Input placeholder="Observações de emergência" />
      </div>

      <div className="grid items-center gap-1.5">
        <Label className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-yellow-500" />
          Consulta Prioritária
          <Badge
            variant="outline"
            className="text-yellow-600 border-yellow-600 text-xs"
          >
            Alta
          </Badge>
        </Label>
        <Input placeholder="Motivo da prioridade" />
      </div>

      <div className="grid items-center gap-1.5">
        <Label className="flex items-center gap-2">
          <User className="h-4 w-4 text-green-500" />
          Consulta de Rotina
          <Badge
            variant="outline"
            className="text-green-600 border-green-600 text-xs"
          >
            Normal
          </Badge>
        </Label>
        <Input placeholder="Observações gerais" />
      </div>
    </div>
  ),
};

// Label com tooltip simulado
export const WithTooltip: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="crm" className="flex items-center gap-2">
        CRM
        <Info
          className="h-4 w-4 text-muted-foreground cursor-help"
          title="Número do Conselho Regional de Medicina"
        />
        <span className="text-red-500">*</span>
      </Label>
      <Input id="crm" placeholder="Ex: 123456/SP" />
      <p className="text-xs text-muted-foreground">
        Formato: número/UF (Ex: 123456/SP)
      </p>
    </div>
  ),
};

// Label com checkbox
export const WithCheckbox: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox id="terms" />
        <Label
          htmlFor="terms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Aceito os termos de uso e política de privacidade
        </Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="notifications" />
        <Label
          htmlFor="notifications"
          className="text-sm font-medium leading-none"
        >
          Receber notificações por e-mail sobre consultas
        </Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="emergency" />
        <Label
          htmlFor="emergency"
          className="text-sm font-medium leading-none flex items-center gap-2"
        >
          <AlertCircle className="h-4 w-4 text-red-500" />
          Contato de emergência autorizado
        </Label>
      </div>
    </div>
  ),
};

// Label desabilitado
export const Disabled: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="readonly-field" className="opacity-50">
        Campo Somente Leitura
      </Label>
      <Input id="readonly-field" value="Valor fixo" disabled />
    </div>
  ),
};

// Label com diferentes tamanhos
export const Sizes: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-4">
      <div className="grid items-center gap-1.5">
        <Label className="text-xs font-medium">Label Pequeno</Label>
        <Input placeholder="Input pequeno" className="h-8 text-xs" />
      </div>

      <div className="grid items-center gap-1.5">
        <Label className="text-sm font-medium">Label Padrão</Label>
        <Input placeholder="Input padrão" />
      </div>

      <div className="grid items-center gap-1.5">
        <Label className="text-base font-medium">Label Grande</Label>
        <Input placeholder="Input grande" className="h-12 text-base" />
      </div>

      <div className="grid items-center gap-1.5">
        <Label className="text-lg font-semibold">Label Extra Grande</Label>
        <Input placeholder="Input extra grande" className="h-14 text-lg" />
      </div>
    </div>
  ),
};

// Formulário médico completo
export const MedicalForm: Story = {
  render: () => (
    <div className="w-full max-w-2xl space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-medical-blue">
          Cadastro de Paciente
        </h2>
        <p className="text-muted-foreground">
          Preencha todos os campos obrigatórios (*)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid items-center gap-1.5">
          <Label htmlFor="full-name" className="flex items-center gap-2">
            <User className="h-4 w-4 text-medical-blue" />
            Nome Completo
            <span className="text-red-500">*</span>
          </Label>
          <Input id="full-name" placeholder="Nome completo do paciente" />
        </div>

        <div className="grid items-center gap-1.5">
          <Label htmlFor="cpf-field" className="flex items-center gap-2">
            CPF
            <span className="text-red-500">*</span>
          </Label>
          <Input id="cpf-field" placeholder="000.000.000-00" />
        </div>

        <div className="grid items-center gap-1.5">
          <Label htmlFor="birth-date-field" className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-medical-blue" />
            Data de Nascimento
            <span className="text-red-500">*</span>
          </Label>
          <Input id="birth-date-field" type="date" />
        </div>

        <div className="grid items-center gap-1.5">
          <Label htmlFor="phone-field" className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-medical-blue" />
            Telefone
            <span className="text-red-500">*</span>
          </Label>
          <Input id="phone-field" placeholder="(11) 99999-9999" />
        </div>
      </div>

      <div className="grid items-center gap-1.5">
        <Label htmlFor="email-field" className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-medical-blue" />
          E-mail
        </Label>
        <Input id="email-field" type="email" placeholder="exemplo@email.com" />
      </div>

      <div className="grid items-center gap-1.5">
        <Label htmlFor="address-field" className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-medical-blue" />
          Endereço Completo
        </Label>
        <Input
          id="address-field"
          placeholder="Rua, número, bairro, cidade, CEP"
        />
      </div>

      <div className="grid items-center gap-1.5">
        <Label htmlFor="medical-history" className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-medical-blue" />
          Histórico Médico
        </Label>
        <Textarea
          id="medical-history"
          placeholder="Descreva o histórico médico do paciente..."
          rows={4}
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox id="consent" />
          <Label htmlFor="consent" className="text-sm">
            Autorizo o uso dos meus dados para fins médicos
            <span className="text-red-500 ml-1">*</span>
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox id="emergency-contact" />
          <Label htmlFor="emergency-contact" className="text-sm">
            Autorizo contato em caso de emergência
          </Label>
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button variant="outline" className="flex-1">
          Cancelar
        </Button>
        <Button variant="medical" className="flex-1">
          Cadastrar Paciente
        </Button>
      </div>
    </div>
  ),
};
