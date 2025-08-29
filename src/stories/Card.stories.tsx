import { Meta, StoryObj } from '@storybook/react-vite';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, Heart, User, Calendar, FileText, Bell } from 'lucide-react';

const meta = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Componente Card flexível para exibir conteúdo estruturado no MedAssist Pro.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: { type: 'text' },
      description: 'Classes CSS adicionais',
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

// Card básico
export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Título</CardTitle>
        <CardDescription>Descrição do card</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Conteúdo do card aqui.</p>
      </CardContent>
    </Card>
  ),
};

// Card com footer
export const WithFooter: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card com Footer</CardTitle>
        <CardDescription>Card que inclui área de rodapé</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Conteúdo principal do card.</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancelar</Button>
        <Button>Confirmar</Button>
      </CardFooter>
    </Card>
  ),
};

// Card de paciente
export const PatientCard: Story = {
  render: () => (
    <Card className="w-[400px]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-medical-blue" />
            <CardTitle>João Silva</CardTitle>
          </div>
          <Badge variant="secondary">Ativo</Badge>
        </div>
        <CardDescription>Paciente desde 15/03/2024</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center space-x-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>Próxima consulta: 25/01/2025</span>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <Heart className="h-4 w-4 text-medical-success" />
          <span>Condição: Estável</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="medical" className="w-full">
          <FileText className="mr-2 h-4 w-4" />
          Ver Prontuário
        </Button>
      </CardFooter>
    </Card>
  ),
};

// Card de estatísticas
export const StatsCard: Story = {
  render: () => (
    <Card className="w-[300px]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Total de Pacientes
        </CardTitle>
        <User className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">1,234</div>
        <p className="text-xs text-muted-foreground">
          +20.1% em relação ao mês passado
        </p>
      </CardContent>
    </Card>
  ),
};

// Card de consulta
export const ConsultationCard: Story = {
  render: () => (
    <Card className="w-[380px]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-medical-blue" />
            <CardTitle>Consulta Cardiológica</CardTitle>
          </div>
          <Badge className="bg-medical-success text-medical-success-foreground">
            Concluída
          </Badge>
        </div>
        <CardDescription>Dr. Maria Santos - 20/01/2025 14:30</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <p className="text-sm font-medium">Paciente:</p>
          <p className="text-sm text-muted-foreground">Ana Costa, 45 anos</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Diagnóstico:</p>
          <p className="text-sm text-muted-foreground">
            Hipertensão arterial leve - acompanhamento de rotina
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" size="sm">
          Ver Detalhes
        </Button>
        <Button variant="medical" size="sm">
          Gerar Relatório
        </Button>
      </CardFooter>
    </Card>
  ),
};

// Card de notificação
export const NotificationCard: Story = {
  render: () => (
    <Card className="w-[350px] border-l-4 border-l-medical-alert">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Bell className="h-5 w-5 text-medical-alert" />
          <CardTitle className="text-base">Medicação Pendente</CardTitle>
        </div>
        <CardDescription>Há 2 horas</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">
          Paciente João Silva não tomou a medicação das 14:00. Lembrete
          automático enviado.
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="medical-outline" size="sm" className="w-full">
          Marcar como Resolvido
        </Button>
      </CardFooter>
    </Card>
  ),
};

// Card compacto
export const CompactCard: Story = {
  render: () => (
    <Card className="w-[250px]">
      <CardContent className="p-4">
        <div className="flex items-center space-x-2">
          <Heart className="h-8 w-8 text-medical-success" />
          <div>
            <p className="text-sm font-medium">Batimentos</p>
            <p className="text-2xl font-bold">72 bpm</p>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};

// Card com hover effect
export const InteractiveCard: Story = {
  render: () => (
    <Card className="w-[320px] cursor-pointer transition-all hover:shadow-lg hover:scale-105">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-medical-blue" />
          <CardTitle>Exame de Sangue</CardTitle>
        </div>
        <CardDescription>Resultados disponíveis</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Clique para visualizar os resultados completos do exame.
        </p>
      </CardContent>
    </Card>
  ),
};

// Grid de cards
export const CardGrid: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 w-[700px]">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Consultas Hoje</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-medical-blue">8</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pacientes Ativos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-medical-success">156</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Alertas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-medical-alert">3</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Relatórios</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-muted-foreground">24</p>
        </CardContent>
      </Card>
    </div>
  ),
};
