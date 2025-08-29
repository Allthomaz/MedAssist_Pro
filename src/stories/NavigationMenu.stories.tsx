import type { Meta, StoryObj } from '@storybook/react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Calendar,
  FileText,
  Activity,
  Settings,
  Stethoscope,
  Heart,
  Microscope,
  Pill,
  ClipboardList,
  BarChart3,
  User,
  Clock,
  Bell,
  Shield,
  Database,
  HelpCircle,
  Phone,
  Mail,
  MapPin,
  FileImage,
  Download,
  Upload,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  AlertCircle,
  XCircle,
  Home,
  Building2,
  UserCheck,
  Clipboard,
  TrendingUp,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const meta = {
  title: 'UI/NavigationMenu',
  component: NavigationMenu,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Componente NavigationMenu para navegação principal no MedAssist Pro.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NavigationMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

// Componente auxiliar para links
const ListItem = ({
  className,
  title,
  children,
  icon: Icon,
  badge,
  ...props
}: {
  className?: string;
  title: string;
  children: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string;
} & React.ComponentPropsWithoutRef<'a'>) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-4 w-4" />}
            <div className="text-sm font-medium leading-none">{title}</div>
            {badge && (
              <Badge variant="secondary" className="text-xs">
                {badge}
              </Badge>
            )}
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
};

// Navigation Menu básico
export const Default: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Início</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/"
                  >
                    <Home className="h-6 w-6" />
                    <div className="mb-2 mt-4 text-lg font-medium">
                      MedAssist Pro
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Sistema completo de gestão médica com prontuário
                      eletrônico.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="/dashboard" title="Dashboard" icon={BarChart3}>
                Visão geral dos dados e métricas do consultório.
              </ListItem>
              <ListItem href="/patients" title="Pacientes" icon={Users}>
                Gerenciamento completo de pacientes e histórico médico.
              </ListItem>
              <ListItem
                href="/appointments"
                title="Agendamentos"
                icon={Calendar}
              >
                Sistema de agendamento de consultas e procedimentos.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Pacientes</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <ListItem title="Lista de Pacientes" icon={Users}>
                Visualizar todos os pacientes cadastrados.
              </ListItem>
              <ListItem title="Novo Paciente" icon={Plus}>
                Cadastrar novo paciente no sistema.
              </ListItem>
              <ListItem title="Buscar Paciente" icon={Search}>
                Busca avançada por nome, CPF ou prontuário.
              </ListItem>
              <ListItem title="Prontuários" icon={FileText}>
                Acessar prontuários eletrônicos.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink
            className={navigationMenuTriggerStyle()}
            href="/reports"
          >
            Relatórios
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};

// Navigation Menu médico completo
export const MedicalNavigation: Story = {
  render: () => (
    <Card className="w-[900px]">
      <CardHeader>
        <CardTitle>Navegação Principal - MedAssist Pro</CardTitle>
        <CardDescription>
          Menu de navegação completo para sistema médico
        </CardDescription>
      </CardHeader>
      <CardContent>
        <NavigationMenu>
          <NavigationMenuList>
            {/* Menu Pacientes */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Pacientes
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  <ListItem title="Lista de Pacientes" icon={Users} badge="156">
                    Visualizar todos os pacientes cadastrados no sistema.
                  </ListItem>
                  <ListItem title="Novo Paciente" icon={Plus}>
                    Cadastrar novo paciente com dados completos.
                  </ListItem>
                  <ListItem title="Busca Avançada" icon={Search}>
                    Buscar por nome, CPF, prontuário ou convênio.
                  </ListItem>
                  <ListItem title="Prontuários" icon={FileText} badge="342">
                    Acessar prontuários eletrônicos e histórico.
                  </ListItem>
                  <ListItem title="Dados Demográficos" icon={BarChart3}>
                    Relatórios e estatísticas dos pacientes.
                  </ListItem>
                  <ListItem title="Importar/Exportar" icon={Database}>
                    Gerenciar dados em lote e backups.
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Menu Consultas */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4" />
                Consultas
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  <ListItem title="Agenda do Dia" icon={Calendar} badge="8">
                    Consultas agendadas para hoje.
                  </ListItem>
                  <ListItem title="Nova Consulta" icon={Plus}>
                    Agendar nova consulta ou encaixe.
                  </ListItem>
                  <ListItem title="Teleconsulta" icon={Activity}>
                    Consultas online e telemedicina.
                  </ListItem>
                  <ListItem title="Histórico" icon={Clock}>
                    Consultas realizadas e relatórios.
                  </ListItem>
                  <ListItem title="Sinais Vitais" icon={Heart} badge="Novo">
                    Monitoramento de sinais vitais.
                  </ListItem>
                  <ListItem title="Prescrições" icon={Pill}>
                    Receitas médicas e medicamentos.
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Menu Exames */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="flex items-center gap-2">
                <Microscope className="h-4 w-4" />
                Exames
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  <ListItem title="Solicitar Exame" icon={Plus}>
                    Nova solicitação de exame laboratorial ou imagem.
                  </ListItem>
                  <ListItem title="Resultados" icon={FileText} badge="12">
                    Resultados pendentes de análise.
                  </ListItem>
                  <ListItem title="Imagens Médicas" icon={FileImage}>
                    Raio-X, tomografia, ressonância e ultrassom.
                  </ListItem>
                  <ListItem title="Laboratório" icon={Microscope}>
                    Exames de sangue, urina e outros fluidos.
                  </ListItem>
                  <ListItem title="Laudos" icon={ClipboardList}>
                    Laudos médicos e pareceres técnicos.
                  </ListItem>
                  <ListItem title="Histórico" icon={Activity}>
                    Histórico completo de exames do paciente.
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Menu Relatórios */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Relatórios
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  <ListItem title="Dashboard Executivo" icon={TrendingUp}>
                    Métricas gerais e KPIs do consultório.
                  </ListItem>
                  <ListItem title="Financeiro" icon={BarChart3}>
                    Receitas, despesas e faturamento.
                  </ListItem>
                  <ListItem title="Produtividade" icon={Activity}>
                    Consultas realizadas e tempo médio.
                  </ListItem>
                  <ListItem title="Pacientes" icon={Users}>
                    Demografia e estatísticas de pacientes.
                  </ListItem>
                  <ListItem title="Agendamentos" icon={CalendarIcon}>
                    Taxa de ocupação e cancelamentos.
                  </ListItem>
                  <ListItem title="Exportar" icon={Download}>
                    Exportar relatórios em PDF ou Excel.
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Menu Configurações */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Sistema
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  <ListItem title="Perfil" icon={User}>
                    Dados pessoais e configurações da conta.
                  </ListItem>
                  <ListItem title="Consultório" icon={Building2}>
                    Informações do consultório e equipe.
                  </ListItem>
                  <ListItem title="Notificações" icon={Bell}>
                    Configurar alertas e lembretes.
                  </ListItem>
                  <ListItem title="Segurança" icon={Shield}>
                    Senhas, autenticação e logs de acesso.
                  </ListItem>
                  <ListItem title="Backup" icon={Database}>
                    Backup automático e restauração.
                  </ListItem>
                  <ListItem title="Suporte" icon={HelpCircle}>
                    Central de ajuda e contato técnico.
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </CardContent>
    </Card>
  ),
};

// Navigation Menu de agendamento
export const AppointmentNavigation: Story = {
  render: () => (
    <Card className="w-[700px]">
      <CardHeader>
        <CardTitle>Sistema de Agendamento</CardTitle>
        <CardDescription>
          Navegação específica para gerenciamento de consultas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Agenda
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                  <ListItem title="Hoje" icon={Clock} badge="8">
                    Consultas agendadas para hoje.
                  </ListItem>
                  <ListItem title="Esta Semana" icon={Calendar}>
                    Visão semanal da agenda.
                  </ListItem>
                  <ListItem title="Este Mês" icon={CalendarIcon}>
                    Calendário mensal completo.
                  </ListItem>
                  <ListItem title="Disponibilidade" icon={CheckCircle}>
                    Gerenciar horários disponíveis.
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Pacientes
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                  <ListItem title="Buscar Paciente" icon={Search}>
                    Localizar paciente para agendamento.
                  </ListItem>
                  <ListItem title="Novo Paciente" icon={Plus}>
                    Cadastrar e agendar simultaneamente.
                  </ListItem>
                  <ListItem title="Lista de Espera" icon={Clock} badge="3">
                    Pacientes aguardando vaga.
                  </ListItem>
                  <ListItem title="Histórico" icon={Activity}>
                    Consultas anteriores do paciente.
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                href="/notifications"
              >
                <Bell className="mr-2 h-4 w-4" />
                Notificações
                <Badge className="ml-2" variant="destructive">
                  5
                </Badge>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </CardContent>
    </Card>
  ),
};

// Navigation Menu de prontuário
export const MedicalRecordNavigation: Story = {
  render: () => (
    <Card className="w-[600px]">
      <CardHeader>
        <CardTitle>Prontuário Eletrônico</CardTitle>
        <CardDescription>
          Navegação para gerenciamento de prontuários
        </CardDescription>
      </CardHeader>
      <CardContent>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Prontuário
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                  <ListItem title="Dados Pessoais" icon={User}>
                    Informações básicas do paciente.
                  </ListItem>
                  <ListItem title="Anamnese" icon={ClipboardList}>
                    História clínica e queixas.
                  </ListItem>
                  <ListItem title="Exame Físico" icon={Stethoscope}>
                    Resultados do exame clínico.
                  </ListItem>
                  <ListItem title="Diagnóstico" icon={CheckCircle}>
                    Diagnósticos e CID-10.
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Monitoramento
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                  <ListItem title="Sinais Vitais" icon={Heart}>
                    Pressão, temperatura, pulso.
                  </ListItem>
                  <ListItem title="Evolução" icon={TrendingUp}>
                    Acompanhamento do tratamento.
                  </ListItem>
                  <ListItem title="Medicações" icon={Pill}>
                    Prescrições e posologia.
                  </ListItem>
                  <ListItem title="Alertas" icon={AlertCircle} badge="2">
                    Alergias e contraindicações.
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                href="/attachments"
              >
                <FileImage className="mr-2 h-4 w-4" />
                Anexos
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </CardContent>
    </Card>
  ),
};

// Navigation Menu simples
export const Simple: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} href="/">
            Início
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Pacientes</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
              <ListItem title="Lista" icon={Users}>
                Ver todos os pacientes.
              </ListItem>
              <ListItem title="Novo" icon={Plus}>
                Cadastrar paciente.
              </ListItem>
              <ListItem title="Buscar" icon={Search}>
                Localizar paciente.
              </ListItem>
              <ListItem title="Relatórios" icon={BarChart3}>
                Estatísticas e dados.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink
            className={navigationMenuTriggerStyle()}
            href="/appointments"
          >
            Consultas
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink
            className={navigationMenuTriggerStyle()}
            href="/reports"
          >
            Relatórios
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};
