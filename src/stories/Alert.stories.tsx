import { Meta, StoryObj } from '@storybook/react-vite';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertTriangle,
  CheckCircle,
  Info,
  XCircle,
  Heart,
  Activity,
  Calendar,
  FileText,
  Bell,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const meta = {
  title: 'UI/Alert',
  component: Alert,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Componente Alert para exibir mensagens importantes, notificações e avisos no MedAssist Pro.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'destructive'],
      description: 'Variante visual do alert',
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

// Alert padrão
export const Default: Story = {
  args: {
    variant: 'default',
  },
  render: args => (
    <Alert {...args}>
      <Info className="h-4 w-4" />
      <AlertTitle>Informação</AlertTitle>
      <AlertDescription>
        Esta é uma mensagem informativa padrão.
      </AlertDescription>
    </Alert>
  ),
};

// Alert de sucesso
export const Success: Story = {
  render: () => (
    <Alert className="border-medical-success bg-medical-success/10">
      <CheckCircle className="h-4 w-4 text-medical-success" />
      <AlertTitle className="text-medical-success">Sucesso!</AlertTitle>
      <AlertDescription>
        Paciente cadastrado com sucesso no sistema. Prontuário #2024001 foi
        criado.
      </AlertDescription>
    </Alert>
  ),
};

// Alert de erro
export const Error: Story = {
  args: {
    variant: 'destructive',
  },
  render: args => (
    <Alert {...args}>
      <XCircle className="h-4 w-4" />
      <AlertTitle>Erro no Sistema</AlertTitle>
      <AlertDescription>
        Não foi possível conectar com o servidor. Verifique sua conexão e tente
        novamente.
      </AlertDescription>
    </Alert>
  ),
};

// Alert de aviso
export const Warning: Story = {
  render: () => (
    <Alert className="border-yellow-500 bg-yellow-50">
      <AlertTriangle className="h-4 w-4 text-yellow-600" />
      <AlertTitle className="text-yellow-800">Atenção</AlertTitle>
      <AlertDescription className="text-yellow-700">
        O paciente possui alergia a penicilina. Verifique a medicação antes de
        prescrever.
      </AlertDescription>
    </Alert>
  ),
};

// Alert médico - Paciente crítico
export const CriticalPatient: Story = {
  render: () => (
    <Alert className="border-red-500 bg-red-50">
      <Heart className="h-4 w-4 text-red-600" />
      <AlertTitle className="text-red-800 flex items-center gap-2">
        Paciente em Estado Crítico
        <Badge className="bg-red-600 text-white text-xs">URGENTE</Badge>
      </AlertTitle>
      <AlertDescription className="text-red-700">
        <div className="space-y-2">
          <p>
            <strong>João Silva</strong> - Leito 205
          </p>
          <p>Sinais vitais instáveis. Pressão arterial: 180/120 mmHg</p>
          <div className="flex gap-2 mt-3">
            <Button size="sm" variant="destructive">
              Chamar Médico
            </Button>
            <Button size="sm" variant="outline">
              Ver Prontuário
            </Button>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  ),
};

// Alert de consulta agendada
export const AppointmentReminder: Story = {
  render: () => (
    <Alert className="border-medical-blue bg-medical-blue/10">
      <Calendar className="h-4 w-4 text-medical-blue" />
      <AlertTitle className="text-medical-blue">Consulta Agendada</AlertTitle>
      <AlertDescription>
        <div className="space-y-2">
          <p>
            Próxima consulta com <strong>Dr. Carlos Santos</strong>
          </p>
          <p className="text-sm text-muted-foreground">
            Hoje, 15:30 - Cardiologia - Sala 302
          </p>
          <div className="flex gap-2 mt-3">
            <Button size="sm" variant="medical">
              Confirmar Presença
            </Button>
            <Button size="sm" variant="outline">
              Reagendar
            </Button>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  ),
};

// Alert de exame disponível
export const ExamReady: Story = {
  render: () => (
    <Alert className="border-green-500 bg-green-50">
      <FileText className="h-4 w-4 text-green-600" />
      <AlertTitle className="text-green-800 flex items-center gap-2">
        Resultado de Exame Disponível
        <Badge className="bg-green-600 text-white text-xs">NOVO</Badge>
      </AlertTitle>
      <AlertDescription className="text-green-700">
        <div className="space-y-2">
          <p>
            Hemograma completo - <strong>Maria Santos</strong>
          </p>
          <p className="text-sm">Realizado em: 22/01/2025</p>
          <div className="flex gap-2 mt-3">
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              Visualizar Resultado
            </Button>
            <Button size="sm" variant="outline">
              Enviar por Email
            </Button>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  ),
};

// Alert de sistema
export const SystemMaintenance: Story = {
  render: () => (
    <Alert className="border-orange-500 bg-orange-50">
      <Shield className="h-4 w-4 text-orange-600" />
      <AlertTitle className="text-orange-800">Manutenção Programada</AlertTitle>
      <AlertDescription className="text-orange-700">
        <div className="space-y-2">
          <p>O sistema estará em manutenção das 02:00 às 04:00 de amanhã.</p>
          <p className="text-sm">
            Durante este período, algumas funcionalidades podem estar
            indisponíveis.
          </p>
        </div>
      </AlertDescription>
    </Alert>
  ),
};

// Alert com ações múltiplas
export const MultipleActions: Story = {
  render: () => (
    <Alert className="border-medical-blue bg-medical-blue/10">
      <Bell className="h-4 w-4 text-medical-blue" />
      <AlertTitle className="text-medical-blue">
        Notificações Pendentes
      </AlertTitle>
      <AlertDescription>
        <div className="space-y-3">
          <p>Você tem 3 notificações importantes não lidas.</p>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="medical">
              Ver Todas
            </Button>
            <Button size="sm" variant="outline">
              Marcar como Lidas
            </Button>
            <Button size="sm" variant="ghost">
              Configurar
            </Button>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  ),
};

// Alert compacto
export const Compact: Story = {
  render: () => (
    <Alert className="py-2">
      <Activity className="h-4 w-4" />
      <AlertDescription className="ml-2">
        Sistema funcionando normalmente. Última verificação: há 2 minutos.
      </AlertDescription>
    </Alert>
  ),
};

// Alert sem ícone
export const NoIcon: Story = {
  render: () => (
    <Alert>
      <AlertTitle>Título sem Ícone</AlertTitle>
      <AlertDescription>
        Este alert não possui ícone, apenas título e descrição.
      </AlertDescription>
    </Alert>
  ),
};

// Alert apenas com descrição
export const DescriptionOnly: Story = {
  render: () => (
    <Alert>
      <Info className="h-4 w-4" />
      <AlertDescription>
        Alert simples apenas com descrição e ícone, sem título.
      </AlertDescription>
    </Alert>
  ),
};

// Grupo de alerts
export const AlertGroup: Story = {
  render: () => (
    <div className="space-y-4">
      <Alert className="border-medical-success bg-medical-success/10">
        <CheckCircle className="h-4 w-4 text-medical-success" />
        <AlertTitle className="text-medical-success">
          Backup Realizado
        </AlertTitle>
        <AlertDescription>
          Backup automático concluído com sucesso às 03:00.
        </AlertDescription>
      </Alert>

      <Alert className="border-yellow-500 bg-yellow-50">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertTitle className="text-yellow-800">Espaço em Disco</AlertTitle>
        <AlertDescription className="text-yellow-700">
          Espaço em disco está em 85%. Considere fazer limpeza de arquivos
          antigos.
        </AlertDescription>
      </Alert>

      <Alert className="border-medical-blue bg-medical-blue/10">
        <Info className="h-4 w-4 text-medical-blue" />
        <AlertTitle className="text-medical-blue">
          Nova Funcionalidade
        </AlertTitle>
        <AlertDescription>
          Agora você pode exportar relatórios em formato PDF diretamente do
          sistema.
        </AlertDescription>
      </Alert>
    </div>
  ),
};
