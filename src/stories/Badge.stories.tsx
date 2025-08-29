import { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle,
  AlertCircle,
  Clock,
  User,
  Activity,
  Heart,
} from 'lucide-react';

const meta = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Componente Badge para exibir status, categorias e informações importantes no MedAssist Pro.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'secondary', 'destructive', 'outline'],
    },
    className: {
      control: { type: 'text' },
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

// Badge básico
export const Default: Story = {
  args: {
    children: 'Badge',
  },
};

// Variantes
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secundário',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Crítico',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
};

// Status de pacientes
export const PatientActive: Story = {
  render: () => (
    <Badge className="bg-medical-success text-medical-success-foreground">
      <CheckCircle className="w-3 h-3 mr-1" />
      Ativo
    </Badge>
  ),
};

export const PatientInactive: Story = {
  render: () => (
    <Badge variant="secondary">
      <Clock className="w-3 h-3 mr-1" />
      Inativo
    </Badge>
  ),
};

export const PatientCritical: Story = {
  render: () => (
    <Badge className="bg-medical-alert text-medical-alert-foreground">
      <AlertCircle className="w-3 h-3 mr-1" />
      Crítico
    </Badge>
  ),
};

// Status de consultas
export const ConsultationScheduled: Story = {
  render: () => (
    <Badge className="bg-medical-blue text-medical-blue-foreground">
      Agendada
    </Badge>
  ),
};

export const ConsultationInProgress: Story = {
  render: () => (
    <Badge className="bg-yellow-500 text-yellow-50">
      <Activity className="w-3 h-3 mr-1" />
      Em Andamento
    </Badge>
  ),
};

export const ConsultationCompleted: Story = {
  render: () => (
    <Badge className="bg-medical-success text-medical-success-foreground">
      <CheckCircle className="w-3 h-3 mr-1" />
      Concluída
    </Badge>
  ),
};

export const ConsultationCancelled: Story = {
  render: () => <Badge variant="destructive">Cancelada</Badge>,
};

// Especialidades médicas
export const Cardiology: Story = {
  render: () => (
    <Badge className="bg-red-100 text-red-800 border-red-200">
      <Heart className="w-3 h-3 mr-1" />
      Cardiologia
    </Badge>
  ),
};

export const Pediatrics: Story = {
  render: () => (
    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
      <User className="w-3 h-3 mr-1" />
      Pediatria
    </Badge>
  ),
};

export const GeneralMedicine: Story = {
  render: () => (
    <Badge className="bg-green-100 text-green-800 border-green-200">
      Clínica Geral
    </Badge>
  ),
};

// Prioridades
export const HighPriority: Story = {
  render: () => (
    <Badge className="bg-medical-alert text-medical-alert-foreground animate-pulse">
      Alta Prioridade
    </Badge>
  ),
};

export const MediumPriority: Story = {
  render: () => (
    <Badge className="bg-yellow-500 text-yellow-50">Média Prioridade</Badge>
  ),
};

export const LowPriority: Story = {
  render: () => <Badge variant="secondary">Baixa Prioridade</Badge>,
};

// Contadores
export const NotificationCount: Story = {
  render: () => (
    <Badge className="bg-medical-alert text-medical-alert-foreground rounded-full px-2 py-1 text-xs font-bold">
      3
    </Badge>
  ),
};

export const PatientCount: Story = {
  render: () => (
    <Badge className="bg-medical-blue text-medical-blue-foreground rounded-full px-2 py-1 text-xs">
      156
    </Badge>
  ),
};

// Badges com diferentes tamanhos
export const Small: Story = {
  render: () => <Badge className="text-xs px-1.5 py-0.5">Pequeno</Badge>,
};

export const Large: Story = {
  render: () => <Badge className="text-sm px-3 py-1">Grande</Badge>,
};

// Badge interativo
export const Interactive: Story = {
  render: () => (
    <Badge className="cursor-pointer hover:bg-medical-blue/90 transition-colors">
      Clicável
    </Badge>
  ),
};

// Grupo de badges
export const BadgeGroup: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge className="bg-medical-success text-medical-success-foreground">
        <CheckCircle className="w-3 h-3 mr-1" />
        Ativo
      </Badge>
      <Badge className="bg-medical-blue text-medical-blue-foreground">
        Cardiologia
      </Badge>
      <Badge className="bg-yellow-500 text-yellow-50">
        <Clock className="w-3 h-3 mr-1" />
        Agendado
      </Badge>
      <Badge variant="outline">Plano Premium</Badge>
    </div>
  ),
};

// Status de exames
export const ExamPending: Story = {
  render: () => (
    <Badge className="bg-orange-100 text-orange-800 border-orange-200">
      <Clock className="w-3 h-3 mr-1" />
      Pendente
    </Badge>
  ),
};

export const ExamCompleted: Story = {
  render: () => (
    <Badge className="bg-medical-success text-medical-success-foreground">
      <CheckCircle className="w-3 h-3 mr-1" />
      Concluído
    </Badge>
  ),
};

export const ExamAbnormal: Story = {
  render: () => (
    <Badge className="bg-medical-alert text-medical-alert-foreground">
      <AlertCircle className="w-3 h-3 mr-1" />
      Alterado
    </Badge>
  ),
};

// Badge com tooltip (simulado)
export const WithTooltip: Story = {
  render: () => (
    <div className="relative group">
      <Badge className="cursor-help">Hover para info</Badge>
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        Informação adicional sobre este badge
      </div>
    </div>
  ),
};

// Casos de uso médicos específicos
export const MedicalBadges: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Status do Paciente</h4>
        <div className="flex gap-2">
          <Badge className="bg-medical-success text-medical-success-foreground">
            <Heart className="w-3 h-3 mr-1" />
            Estável
          </Badge>
          <Badge className="bg-yellow-500 text-yellow-50">
            <Activity className="w-3 h-3 mr-1" />
            Monitoramento
          </Badge>
          <Badge className="bg-medical-alert text-medical-alert-foreground">
            <AlertCircle className="w-3 h-3 mr-1" />
            Crítico
          </Badge>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Tipos de Consulta</h4>
        <div className="flex gap-2">
          <Badge className="bg-blue-100 text-blue-800">Rotina</Badge>
          <Badge className="bg-purple-100 text-purple-800">Retorno</Badge>
          <Badge className="bg-red-100 text-red-800">Emergência</Badge>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Planos de Saúde</h4>
        <div className="flex gap-2">
          <Badge variant="outline">SUS</Badge>
          <Badge className="bg-gold-100 text-gold-800">Premium</Badge>
          <Badge className="bg-silver-100 text-silver-800">Básico</Badge>
        </div>
      </div>
    </div>
  ),
};
