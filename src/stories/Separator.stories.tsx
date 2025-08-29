import type { Meta, StoryObj } from '@storybook/react';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  User,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  Heart,
  Activity,
  Thermometer,
  Droplets,
  FileText,
  Pill,
  Stethoscope,
  AlertCircle,
  CheckCircle,
  Settings,
  Bell,
  Shield,
} from 'lucide-react';

const meta = {
  title: 'UI/Separator',
  component: Separator,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Componente Separator para divisão visual de conteúdo no MedAssist Pro.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: { type: 'radio' },
      options: ['horizontal', 'vertical'],
      description: 'Orientação do separador',
    },
    className: {
      control: 'text',
      description: 'Classes CSS adicionais',
    },
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

// Separator horizontal básico
export const Default: Story = {
  render: () => (
    <div className="w-[300px]">
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">
          Informações do Paciente
        </h4>
        <p className="text-sm text-muted-foreground">
          Dados pessoais e contato
        </p>
      </div>
      <Separator className="my-4" />
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Histórico Médico</h4>
        <p className="text-sm text-muted-foreground">
          Consultas e tratamentos anteriores
        </p>
      </div>
    </div>
  ),
};

// Separator vertical
export const Vertical: Story = {
  render: () => (
    <div className="flex h-20 items-center space-x-4 text-sm">
      <div>Dados Pessoais</div>
      <Separator orientation="vertical" />
      <div>Contato</div>
      <Separator orientation="vertical" />
      <div>Endereço</div>
      <Separator orientation="vertical" />
      <div>Emergência</div>
    </div>
  ),
};

// Separadores em card de paciente
export const PatientCard: Story = {
  render: () => (
    <Card className="w-[400px]">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src="" alt="João Silva" />
            <AvatarFallback className="bg-blue-500 text-white">
              JS
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>João Silva</CardTitle>
            <CardDescription>Paciente #12345</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium">Idade</p>
            <p className="text-sm text-muted-foreground">45 anos</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Sexo</p>
            <p className="text-sm text-muted-foreground">Masculino</p>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Contato
          </h4>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">(11) 99999-9999</p>
            <p className="text-sm text-muted-foreground">
              joao.silva@email.com
            </p>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Endereço
          </h4>
          <p className="text-sm text-muted-foreground">
            Rua das Flores, 123 - São Paulo, SP
          </p>
        </div>

        <Separator />

        <div className="flex gap-2">
          <Button size="sm" className="flex-1">
            <Calendar className="h-3 w-3 mr-1" />
            Agendar
          </Button>
          <Button size="sm" variant="outline">
            <FileText className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="outline">
            <Phone className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  ),
};

// Separadores em dashboard médico
export const MedicalDashboard: Story = {
  render: () => (
    <Card className="w-[500px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Dashboard Médico
        </CardTitle>
        <CardDescription>Visão geral do paciente</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Sinais Vitais */}
          <div>
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500" />
              Sinais Vitais
            </h3>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-red-500">72</p>
                <p className="text-xs text-muted-foreground">BPM</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-500">36.8</p>
                <p className="text-xs text-muted-foreground">°C</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-500">98</p>
                <p className="text-xs text-muted-foreground">SpO2</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-500">120/80</p>
                <p className="text-xs text-muted-foreground">mmHg</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Medicações */}
          <div>
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Pill className="h-4 w-4 text-green-500" />
              Medicações Ativas
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Losartana 50mg</span>
                <Badge className="bg-green-500 text-white">Ativo</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Metformina 850mg</span>
                <Badge className="bg-green-500 text-white">Ativo</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Sinvastatina 20mg</span>
                <Badge variant="outline">Pausado</Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Próximas Consultas */}
          <div>
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              Próximas Consultas
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Cardiologia</p>
                  <p className="text-xs text-muted-foreground">Dr. Silva</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">15/08/2024</p>
                  <p className="text-xs text-muted-foreground">14:30</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Endocrinologia</p>
                  <p className="text-xs text-muted-foreground">Dra. Santos</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">22/08/2024</p>
                  <p className="text-xs text-muted-foreground">09:00</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Alertas */}
          <div>
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              Alertas
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-md">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">Exame de sangue pendente</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-green-50 rounded-md">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Medicação tomada hoje</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};

// Separadores em menu lateral
export const SidebarMenu: Story = {
  render: () => (
    <Card className="w-[250px] h-[400px]">
      <CardContent className="p-0">
        <div className="p-4">
          <h3 className="font-semibold text-lg">MedAssist Pro</h3>
          <p className="text-sm text-muted-foreground">Sistema Médico</p>
        </div>

        <Separator />

        <div className="p-2">
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start">
              <User className="h-4 w-4 mr-2" />
              Pacientes
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Calendar className="h-4 w-4 mr-2" />
              Agenda
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Prontuários
            </Button>
          </div>

          <Separator className="my-2" />

          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start">
              <Stethoscope className="h-4 w-4 mr-2" />
              Consultas
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Pill className="h-4 w-4 mr-2" />
              Medicações
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Activity className="h-4 w-4 mr-2" />
              Exames
            </Button>
          </div>

          <Separator className="my-2" />

          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start">
              <Bell className="h-4 w-4 mr-2" />
              Notificações
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </Button>
          </div>
        </div>

        <div className="absolute bottom-0 w-full">
          <Separator />
          <div className="p-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-medical-blue text-white text-xs">
                  DR
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">Dr. Silva</p>
                <p className="text-xs text-muted-foreground">Cardiologista</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};

// Separadores com diferentes estilos
export const CustomStyles: Story = {
  render: () => (
    <div className="w-[400px] space-y-6">
      <div>
        <h4 className="text-sm font-medium mb-2">Separador Padrão</h4>
        <Separator />
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">Separador Grosso</h4>
        <Separator className="h-1 bg-gray-300" />
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">Separador Colorido</h4>
        <Separator className="bg-blue-500" />
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">Separador Pontilhado</h4>
        <Separator className="border-dashed border-t border-gray-300 bg-transparent h-0" />
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">Separador Gradiente</h4>
        <Separator className="h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">Separador com Sombra</h4>
        <Separator className="shadow-md" />
      </div>
    </div>
  ),
};

// Separadores em formulário médico
export const MedicalForm: Story = {
  render: () => (
    <Card className="w-[500px]">
      <CardHeader>
        <CardTitle>Ficha de Consulta</CardTitle>
        <CardDescription>Registro de atendimento médico</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Data da Consulta</label>
            <p className="text-sm text-muted-foreground">15/08/2024</p>
          </div>
          <div>
            <label className="text-sm font-medium">Horário</label>
            <p className="text-sm text-muted-foreground">14:30</p>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-sm font-medium mb-2">Queixa Principal</h3>
          <p className="text-sm text-muted-foreground">
            Paciente relata dor no peito há 2 dias, com irradiação para braço
            esquerdo.
          </p>
        </div>

        <Separator />

        <div>
          <h3 className="text-sm font-medium mb-2">Exame Físico</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Pressão Arterial</p>
              <p className="text-sm">130/85 mmHg</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                Frequência Cardíaca
              </p>
              <p className="text-sm">78 bpm</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Temperatura</p>
              <p className="text-sm">36.5°C</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Saturação</p>
              <p className="text-sm">98%</p>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-sm font-medium mb-2">Diagnóstico</h3>
          <p className="text-sm text-muted-foreground">
            Angina pectoris estável. Recomendado acompanhamento cardiológico.
          </p>
        </div>

        <Separator />

        <div>
          <h3 className="text-sm font-medium mb-2">Prescrição</h3>
          <div className="space-y-1">
            <p className="text-sm">• Isossorbida 5mg - 1 comp. 2x/dia</p>
            <p className="text-sm">• AAS 100mg - 1 comp. 1x/dia</p>
            <p className="text-sm">• Retorno em 15 dias</p>
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium">Dr. Silva - CRM 12345</span>
          </div>
          <Badge className="bg-green-500 text-white">Finalizada</Badge>
        </div>
      </CardContent>
    </Card>
  ),
};

// Separadores em lista de notificações
export const NotificationList: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notificações
        </CardTitle>
        <CardDescription>Últimas atualizações</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-0">
          <div className="p-4 hover:bg-gray-50">
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Nova consulta agendada</p>
                <p className="text-xs text-muted-foreground">
                  João Silva - 15/08 às 14:30
                </p>
                <p className="text-xs text-muted-foreground">há 5 minutos</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="p-4 hover:bg-gray-50">
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 bg-green-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Exame disponível</p>
                <p className="text-xs text-muted-foreground">
                  Hemograma completo - Maria Santos
                </p>
                <p className="text-xs text-muted-foreground">há 1 hora</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="p-4 hover:bg-gray-50">
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 bg-yellow-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Medicação vencendo</p>
                <p className="text-xs text-muted-foreground">
                  Losartana - Pedro Costa
                </p>
                <p className="text-xs text-muted-foreground">há 2 horas</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="p-4 hover:bg-gray-50">
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 bg-red-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Consulta cancelada</p>
                <p className="text-xs text-muted-foreground">
                  Ana Lima - 14/08 às 10:00
                </p>
                <p className="text-xs text-muted-foreground">há 3 horas</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="p-4 text-center">
            <Button variant="ghost" size="sm" className="text-xs">
              Ver todas as notificações
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};

// Separadores responsivos
export const ResponsiveSeparators: Story = {
  render: () => (
    <div className="space-y-6">
      <Card className="w-full max-w-[600px]">
        <CardHeader>
          <CardTitle>Layout Responsivo</CardTitle>
          <CardDescription>
            Separadores que se adaptam ao tamanho da tela
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <h3 className="font-medium mb-2">Informações Pessoais</h3>
              <p className="text-sm text-muted-foreground">
                Nome, idade, contato
              </p>
            </div>

            <Separator orientation="vertical" className="hidden md:block" />
            <Separator className="md:hidden" />

            <div className="flex-1">
              <h3 className="font-medium mb-2">Histórico Médico</h3>
              <p className="text-sm text-muted-foreground">
                Consultas anteriores
              </p>
            </div>

            <Separator orientation="vertical" className="hidden md:block" />
            <Separator className="md:hidden" />

            <div className="flex-1">
              <h3 className="font-medium mb-2">Medicações</h3>
              <p className="text-sm text-muted-foreground">
                Prescrições ativas
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  ),
};
