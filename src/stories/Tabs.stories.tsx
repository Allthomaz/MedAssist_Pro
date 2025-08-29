import { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  User,
  FileText,
  Calendar,
  Activity,
  Settings,
  Bell,
  Shield,
  Heart,
  Stethoscope,
  Pill,
  TestTube,
  ClipboardList,
  Phone,
  Mail,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  BarChart3,
  PieChart,
  LineChart,
} from 'lucide-react';
import { useState } from 'react';

const meta = {
  title: 'UI/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Componente Tabs para organização de conteúdo em abas no MedAssist Pro.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    defaultValue: {
      control: 'text',
      description: 'Aba ativa por padrão',
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Orientação das abas',
    },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

// Tabs básicas
export const Default: Story = {
  args: {
    defaultValue: 'tab1',
  },
  render: args => (
    <Tabs {...args} className="w-[400px]">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="tab1">Aba 1</TabsTrigger>
        <TabsTrigger value="tab2">Aba 2</TabsTrigger>
        <TabsTrigger value="tab3">Aba 3</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1" className="space-y-2">
        <h3 className="text-lg font-medium">Conteúdo da Aba 1</h3>
        <p className="text-sm text-muted-foreground">
          Este é o conteúdo da primeira aba.
        </p>
      </TabsContent>
      <TabsContent value="tab2" className="space-y-2">
        <h3 className="text-lg font-medium">Conteúdo da Aba 2</h3>
        <p className="text-sm text-muted-foreground">
          Este é o conteúdo da segunda aba.
        </p>
      </TabsContent>
      <TabsContent value="tab3" className="space-y-2">
        <h3 className="text-lg font-medium">Conteúdo da Aba 3</h3>
        <p className="text-sm text-muted-foreground">
          Este é o conteúdo da terceira aba.
        </p>
      </TabsContent>
    </Tabs>
  ),
};

// Tabs com ícones
export const WithIcons: Story = {
  render: () => (
    <Tabs defaultValue="profile" className="w-[500px]">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="profile" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Perfil
        </TabsTrigger>
        <TabsTrigger value="documents" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Documentos
        </TabsTrigger>
        <TabsTrigger value="calendar" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Agenda
        </TabsTrigger>
        <TabsTrigger value="settings" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Configurações
        </TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        <Card>
          <CardHeader>
            <CardTitle>Informações do Perfil</CardTitle>
            <CardDescription>
              Gerencie suas informações pessoais
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" placeholder="Seu nome" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="seu@email.com" />
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="documents">
        <Card>
          <CardHeader>
            <CardTitle>Documentos Médicos</CardTitle>
            <CardDescription>
              Acesse seus documentos e relatórios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 border rounded">
                <span className="text-sm">Exame de Sangue - 15/01/2024</span>
                <Badge>Disponível</Badge>
              </div>
              <div className="flex items-center justify-between p-2 border rounded">
                <span className="text-sm">Raio-X Tórax - 10/01/2024</span>
                <Badge variant="secondary">Processando</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="calendar">
        <Card>
          <CardHeader>
            <CardTitle>Próximas Consultas</CardTitle>
            <CardDescription>Visualize sua agenda médica</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 border rounded">
                <Calendar className="h-5 w-5 text-medical-blue" />
                <div>
                  <p className="font-medium">Dr. Silva - Cardiologia</p>
                  <p className="text-sm text-muted-foreground">
                    20/01/2024 às 14:00
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="settings">
        <Card>
          <CardHeader>
            <CardTitle>Configurações</CardTitle>
            <CardDescription>Personalize sua experiência</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Notificações</Label>
                <Button variant="outline" size="sm">
                  Configurar
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <Label>Privacidade</Label>
                <Button variant="outline" size="sm">
                  Gerenciar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  ),
};

// Perfil do paciente
export const PatientProfile: Story = {
  render: () => (
    <Tabs defaultValue="personal" className="w-[600px]">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="personal">
          <User className="h-4 w-4 mr-1" />
          Pessoal
        </TabsTrigger>
        <TabsTrigger value="medical">
          <Heart className="h-4 w-4 mr-1" />
          Médico
        </TabsTrigger>
        <TabsTrigger value="exams">
          <TestTube className="h-4 w-4 mr-1" />
          Exames
        </TabsTrigger>
        <TabsTrigger value="medications">
          <Pill className="h-4 w-4 mr-1" />
          Medicações
        </TabsTrigger>
        <TabsTrigger value="history">
          <ClipboardList className="h-4 w-4 mr-1" />
          Histórico
        </TabsTrigger>
      </TabsList>

      <TabsContent value="personal">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-medical-blue" />
              Informações Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Nome Completo</Label>
                <p className="text-sm text-muted-foreground">
                  João Silva Santos
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">
                  Data de Nascimento
                </Label>
                <p className="text-sm text-muted-foreground">15/03/1985</p>
              </div>
              <div>
                <Label className="text-sm font-medium">CPF</Label>
                <p className="text-sm text-muted-foreground">123.456.789-00</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Telefone</Label>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  (11) 99999-9999
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Email</Label>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  joao@email.com
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Endereço</Label>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  São Paulo, SP
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="medical">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-medical-blue" />
              Informações Médicas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Tipo Sanguíneo</Label>
                <Badge className="bg-red-500 text-white">O+</Badge>
              </div>
              <div>
                <Label className="text-sm font-medium">Alergias</Label>
                <div className="flex gap-1 flex-wrap">
                  <Badge variant="outline">Penicilina</Badge>
                  <Badge variant="outline">Dipirona</Badge>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">
                  Condições Crônicas
                </Label>
                <div className="flex gap-1 flex-wrap">
                  <Badge className="bg-orange-500 text-white">
                    Hipertensão
                  </Badge>
                  <Badge className="bg-blue-500 text-white">
                    Diabetes Tipo 2
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Plano de Saúde</Label>
                <p className="text-sm text-muted-foreground">
                  Unimed - 123456789
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="exams">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5 text-medical-blue" />
              Exames Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-3">
                  <TestTube className="h-4 w-4 text-medical-blue" />
                  <div>
                    <p className="font-medium">Hemograma Completo</p>
                    <p className="text-sm text-muted-foreground">15/01/2024</p>
                  </div>
                </div>
                <Badge className="bg-green-500 text-white">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Normal
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-3">
                  <Activity className="h-4 w-4 text-medical-blue" />
                  <div>
                    <p className="font-medium">Eletrocardiograma</p>
                    <p className="text-sm text-muted-foreground">10/01/2024</p>
                  </div>
                </div>
                <Badge className="bg-yellow-500 text-white">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Alterado
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-3">
                  <Stethoscope className="h-4 w-4 text-medical-blue" />
                  <div>
                    <p className="font-medium">Raio-X Tórax</p>
                    <p className="text-sm text-muted-foreground">05/01/2024</p>
                  </div>
                </div>
                <Badge variant="secondary">
                  <Clock className="h-3 w-3 mr-1" />
                  Aguardando
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="medications">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5 text-medical-blue" />
              Medicações Atuais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 border rounded">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Losartana 50mg</h4>
                  <Badge className="bg-green-500 text-white">Ativo</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  1 comprimido pela manhã
                </p>
                <p className="text-xs text-muted-foreground">
                  Prescrição: Dr. Silva - Válida até 15/03/2024
                </p>
              </div>

              <div className="p-3 border rounded">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Metformina 850mg</h4>
                  <Badge className="bg-green-500 text-white">Ativo</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  1 comprimido 2x ao dia
                </p>
                <p className="text-xs text-muted-foreground">
                  Prescrição: Dr. Santos - Válida até 20/02/2024
                </p>
              </div>

              <div className="p-3 border rounded opacity-60">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Omeprazol 20mg</h4>
                  <Badge variant="secondary">
                    <XCircle className="h-3 w-3 mr-1" />
                    Suspenso
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Suspenso em 10/01/2024
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="history">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-medical-blue" />
              Histórico de Consultas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 border rounded">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Consulta Cardiológica</h4>
                  <span className="text-sm text-muted-foreground">
                    15/01/2024
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  Dr. Silva - CRM 12345
                </p>
                <p className="text-sm">
                  Paciente apresenta melhora nos níveis pressóricos. Manter
                  medicação atual.
                </p>
              </div>

              <div className="p-3 border rounded">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Consulta Endocrinológica</h4>
                  <span className="text-sm text-muted-foreground">
                    08/01/2024
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  Dr. Santos - CRM 67890
                </p>
                <p className="text-sm">
                  Controle glicêmico adequado. Orientações dietéticas
                  reforçadas.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  ),
};

// Dashboard médico
export const MedicalDashboard: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-[700px]">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="overview">
          <BarChart3 className="h-4 w-4 mr-1" />
          Visão Geral
        </TabsTrigger>
        <TabsTrigger value="patients">
          <User className="h-4 w-4 mr-1" />
          Pacientes
        </TabsTrigger>
        <TabsTrigger value="appointments">
          <Calendar className="h-4 w-4 mr-1" />
          Consultas
        </TabsTrigger>
        <TabsTrigger value="analytics">
          <TrendingUp className="h-4 w-4 mr-1" />
          Analytics
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pacientes Hoje
              </CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+2 desde ontem</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Consultas Agendadas
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Para esta semana</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Exames Pendentes
              </CardTitle>
              <TestTube className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">
                Aguardando resultados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Receitas Emitidas
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
              <p className="text-xs text-muted-foreground">Este mês</p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="patients">
        <Card>
          <CardHeader>
            <CardTitle>Lista de Pacientes</CardTitle>
            <CardDescription>
              Pacientes ativos em acompanhamento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-medical-blue rounded-full flex items-center justify-center text-white text-sm">
                    JS
                  </div>
                  <div>
                    <p className="font-medium">João Silva</p>
                    <p className="text-sm text-muted-foreground">
                      Última consulta: 15/01/2024
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-500 text-white">Estável</Badge>
              </div>

              <div className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-medical-blue rounded-full flex items-center justify-center text-white text-sm">
                    MS
                  </div>
                  <div>
                    <p className="font-medium">Maria Santos</p>
                    <p className="text-sm text-muted-foreground">
                      Última consulta: 12/01/2024
                    </p>
                  </div>
                </div>
                <Badge className="bg-yellow-500 text-white">
                  Acompanhamento
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="appointments">
        <Card>
          <CardHeader>
            <CardTitle>Agenda de Consultas</CardTitle>
            <CardDescription>Próximas consultas agendadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 border rounded">
                <Clock className="h-5 w-5 text-medical-blue" />
                <div className="flex-1">
                  <p className="font-medium">João Silva - Retorno</p>
                  <p className="text-sm text-muted-foreground">Hoje às 14:00</p>
                </div>
                <Badge>Confirmado</Badge>
              </div>

              <div className="flex items-center gap-3 p-3 border rounded">
                <Clock className="h-5 w-5 text-medical-blue" />
                <div className="flex-1">
                  <p className="font-medium">
                    Maria Santos - Primeira Consulta
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Amanhã às 09:00
                  </p>
                </div>
                <Badge variant="outline">Pendente</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="analytics">
        <div className="grid grid-cols-1 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-medical-blue" />
                Distribuição de Especialidades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Cardiologia</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-gray-200 rounded">
                      <div className="w-3/5 h-2 bg-medical-blue rounded"></div>
                    </div>
                    <span className="text-sm text-muted-foreground">60%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Endocrinologia</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-gray-200 rounded">
                      <div className="w-2/5 h-2 bg-green-500 rounded"></div>
                    </div>
                    <span className="text-sm text-muted-foreground">40%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

// Tabs verticais
export const VerticalTabs: Story = {
  render: () => (
    <Tabs
      defaultValue="general"
      orientation="vertical"
      className="flex w-[600px] h-[400px]"
    >
      <TabsList className="flex flex-col h-full w-[200px]">
        <TabsTrigger value="general" className="w-full justify-start">
          <Settings className="h-4 w-4 mr-2" />
          Geral
        </TabsTrigger>
        <TabsTrigger value="notifications" className="w-full justify-start">
          <Bell className="h-4 w-4 mr-2" />
          Notificações
        </TabsTrigger>
        <TabsTrigger value="privacy" className="w-full justify-start">
          <Shield className="h-4 w-4 mr-2" />
          Privacidade
        </TabsTrigger>
        <TabsTrigger value="medical" className="w-full justify-start">
          <Heart className="h-4 w-4 mr-2" />
          Médico
        </TabsTrigger>
      </TabsList>

      <div className="flex-1 ml-4">
        <TabsContent value="general" className="mt-0">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>Personalize sua experiência</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Idioma</Label>
                <select className="w-full p-2 border rounded">
                  <option>Português (Brasil)</option>
                  <option>English</option>
                  <option>Español</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Tema</Label>
                <select className="w-full p-2 border rounded">
                  <option>Claro</option>
                  <option>Escuro</option>
                  <option>Automático</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-0">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Notificações</CardTitle>
              <CardDescription>
                Configure como deseja ser notificado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Email</Label>
                <input type="checkbox" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label>Push</Label>
                <input type="checkbox" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label>SMS</Label>
                <input type="checkbox" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="mt-0">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Privacidade</CardTitle>
              <CardDescription>Controle seus dados pessoais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Perfil público</Label>
                <input type="checkbox" />
              </div>
              <div className="flex items-center justify-between">
                <Label>Compartilhar dados</Label>
                <input type="checkbox" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medical" className="mt-0">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Configurações Médicas</CardTitle>
              <CardDescription>
                Preferências relacionadas ao atendimento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Lembretes de medicação</Label>
                <input type="checkbox" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label>Contato de emergência</Label>
                <input type="checkbox" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </div>
    </Tabs>
  ),
};

// Tabs com badges
export const WithBadges: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState('inbox');

    return (
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-[500px]"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="inbox" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Caixa de Entrada
            <Badge className="bg-red-500 text-white text-xs">3</Badge>
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Pendentes
            <Badge className="bg-orange-500 text-white text-xs">7</Badge>
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Concluídos
            <Badge variant="outline" className="text-xs">
              12
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inbox">
          <Card>
            <CardHeader>
              <CardTitle>Mensagens Não Lidas</CardTitle>
              <CardDescription>3 novas mensagens</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="p-2 border rounded bg-blue-50">
                  <p className="font-medium text-sm">
                    Resultado de exame disponível
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Dr. Silva - há 2 horas
                  </p>
                </div>
                <div className="p-2 border rounded bg-blue-50">
                  <p className="font-medium text-sm">
                    Lembrete: Consulta amanhã
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Sistema - há 4 horas
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Tarefas Pendentes</CardTitle>
              <CardDescription>7 itens aguardando ação</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="p-2 border rounded">
                  <p className="font-medium text-sm">
                    Agendar retorno - João Silva
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Vence em 2 dias
                  </p>
                </div>
                <div className="p-2 border rounded">
                  <p className="font-medium text-sm">
                    Revisar exames - Maria Santos
                  </p>
                  <p className="text-xs text-muted-foreground">Vence hoje</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Tarefas Concluídas</CardTitle>
              <CardDescription>
                12 itens finalizados esta semana
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="p-2 border rounded opacity-75">
                  <p className="font-medium text-sm">
                    Consulta realizada - Pedro Costa
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Concluído ontem
                  </p>
                </div>
                <div className="p-2 border rounded opacity-75">
                  <p className="font-medium text-sm">
                    Receita emitida - Ana Lima
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Concluído há 2 dias
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    );
  },
};
