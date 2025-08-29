import { Meta, StoryObj } from '@storybook/react-vite';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from '@/components/ui/sidebar';
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
  FileText,
  Activity,
  Pill,
  TestTube,
  Settings,
  BarChart3,
  Users,
  Clock,
  Heart,
  Stethoscope,
  ClipboardList,
  Image,
  MessageSquare,
  Bell,
  Search,
  Home,
  Plus,
  MoreHorizontal,
  ChevronRight,
  Folder,
  FolderOpen,
  UserCheck,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Calendar as CalendarIcon,
  Phone,
  Mail,
  MapPin,
  Shield,
  LogOut,
  HelpCircle,
  Zap,
  Database,
  Monitor,
  Smartphone,
  Tablet,
} from 'lucide-react';

const meta: Meta<typeof SidebarProvider> = {
  title: 'UI/Sidebar',
  component: SidebarProvider,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Componente Sidebar para navegação lateral no MedAssist Pro. Oferece navegação hierárquica, estados colapsáveis e suporte completo para dispositivos móveis.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sidebar básico
export const Default: Story = {
  render: () => (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Heart className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">MedAssist Pro</span>
              <span className="text-xs text-muted-foreground">
                Sistema Médico
              </span>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navegação Principal</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Home className="h-4 w-4" />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Users className="h-4 w-4" />
                    <span>Pacientes</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Calendar className="h-4 w-4" />
                    <span>Agenda</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <div className="flex items-center gap-2 px-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/avatars/doctor.jpg" />
              <AvatarFallback>DR</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Dr. Silva</span>
              <span className="text-xs text-muted-foreground">
                Cardiologista
              </span>
            </div>
          </div>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">Dashboard</h1>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <Card>
            <CardHeader>
              <CardTitle>Conteúdo Principal</CardTitle>
              <CardDescription>
                Esta é a área principal da aplicação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                O sidebar pode ser colapsado clicando no botão de toggle.
              </p>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  ),
};

// Sidebar médico completo
export const MedicalSidebar: Story = {
  render: () => (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Heart className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">MedAssist Pro</span>
              <span className="text-xs text-muted-foreground">v2.0.1</span>
            </div>
          </div>

          <div className="px-2 pt-2">
            <SidebarInput placeholder="Buscar paciente..." />
          </div>
        </SidebarHeader>

        <SidebarContent>
          {/* Navegação Principal */}
          <SidebarGroup>
            <SidebarGroupLabel>Principal</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive tooltip="Visão geral do sistema">
                    <Home className="h-4 w-4" />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Gerenciar pacientes">
                    <Users className="h-4 w-4" />
                    <span>Pacientes</span>
                    <SidebarMenuBadge>24</SidebarMenuBadge>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Agenda de consultas">
                    <Calendar className="h-4 w-4" />
                    <span>Agenda</span>
                    <SidebarMenuBadge>8</SidebarMenuBadge>
                  </SidebarMenuButton>
                  <SidebarMenuAction>
                    <Plus className="h-4 w-4" />
                  </SidebarMenuAction>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator />

          {/* Área Clínica */}
          <SidebarGroup>
            <SidebarGroupLabel>Área Clínica</SidebarGroupLabel>
            <SidebarGroupAction>
              <Plus className="h-4 w-4" />
            </SidebarGroupAction>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Prontuários eletrônicos">
                    <FileText className="h-4 w-4" />
                    <span>Prontuários</span>
                  </SidebarMenuButton>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton>
                        <span>Novos Prontuários</span>
                        <SidebarMenuBadge>3</SidebarMenuBadge>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton>
                        <span>Em Andamento</span>
                        <SidebarMenuBadge>12</SidebarMenuBadge>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton>
                        <span>Concluídos</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Sinais vitais">
                    <Activity className="h-4 w-4" />
                    <span>Sinais Vitais</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Prescrições médicas">
                    <Pill className="h-4 w-4" />
                    <span>Prescrições</span>
                    <SidebarMenuBadge>5</SidebarMenuBadge>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator />

          {/* Exames e Diagnósticos */}
          <SidebarGroup>
            <SidebarGroupLabel>Exames & Diagnósticos</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Exames laboratoriais">
                    <TestTube className="h-4 w-4" />
                    <span>Laboratório</span>
                  </SidebarMenuButton>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton isActive>
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>Resultados</span>
                        <SidebarMenuBadge>2</SidebarMenuBadge>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton>
                        <Clock className="h-3 w-3 text-yellow-500" />
                        <span>Pendentes</span>
                        <SidebarMenuBadge>4</SidebarMenuBadge>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Exames de imagem">
                    <Image className="h-4 w-4" />
                    <span>Imagem</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Eletrocardiograma">
                    <Heart className="h-4 w-4" />
                    <span>ECG</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator />

          {/* Relatórios */}
          <SidebarGroup>
            <SidebarGroupLabel>Relatórios</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Relatórios estatísticos">
                    <BarChart3 className="h-4 w-4" />
                    <span>Estatísticas</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Relatórios financeiros">
                    <TrendingUp className="h-4 w-4" />
                    <span>Financeiro</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Notificações">
                <Bell className="h-4 w-4" />
                <span>Notificações</span>
                <SidebarMenuBadge>3</SidebarMenuBadge>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Configurações">
                <Settings className="h-4 w-4" />
                <span>Configurações</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          <SidebarSeparator />

          <div className="flex items-center gap-2 px-2 py-1">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/avatars/doctor.jpg" />
              <AvatarFallback>DS</AvatarFallback>
            </Avatar>
            <div className="flex flex-1 flex-col">
              <span className="text-sm font-medium">Dr. Silva</span>
              <span className="text-xs text-muted-foreground">
                Cardiologista
              </span>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">Dashboard Médico</h1>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Nova Consulta
            </Button>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pacientes Hoje
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">+2 desde ontem</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Consultas</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18</div>
                <p className="text-xs text-muted-foreground">
                  6 restantes hoje
                </p>
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
                <div className="text-2xl font-bold">4</div>
                <p className="text-xs text-muted-foreground">2 urgentes</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  ),
};

// Sidebar com skeleton loading
export const LoadingSidebar: Story = {
  render: () => (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Heart className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">MedAssist Pro</span>
              <span className="text-xs text-muted-foreground">
                Carregando...
              </span>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Carregando dados...</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuSkeleton showIcon />
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuSkeleton showIcon />
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuSkeleton showIcon />
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuSkeleton showIcon />
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuSkeleton showIcon />
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator />

          <SidebarGroup>
            <SidebarGroupLabel>Área Clínica</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuSkeleton showIcon />
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuSkeleton showIcon />
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuSkeleton showIcon />
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <div className="flex items-center gap-2 px-2">
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
            <div className="flex flex-col gap-1">
              <div className="h-3 w-16 bg-muted rounded animate-pulse" />
              <div className="h-2 w-12 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex items-center gap-2">
            <div className="h-6 w-32 bg-muted rounded animate-pulse" />
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <Card>
            <CardHeader>
              <div className="h-6 w-48 bg-muted rounded animate-pulse" />
              <div className="h-4 w-64 bg-muted rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 w-full bg-muted rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  ),
};

// Sidebar administrativo
export const AdminSidebar: Story = {
  render: () => (
    <SidebarProvider>
      <Sidebar variant="inset">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-white">
              <Shield className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Admin Panel</span>
              <span className="text-xs text-muted-foreground">
                MedAssist Pro
              </span>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Sistema</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive>
                    <Monitor className="h-4 w-4" />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Database className="h-4 w-4" />
                    <span>Banco de Dados</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Zap className="h-4 w-4" />
                    <span>Performance</span>
                    <SidebarMenuBadge className="bg-yellow-500">
                      !
                    </SidebarMenuBadge>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator />

          <SidebarGroup>
            <SidebarGroupLabel>Usuários</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Users className="h-4 w-4" />
                    <span>Médicos</span>
                    <SidebarMenuBadge>12</SidebarMenuBadge>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <UserCheck className="h-4 w-4" />
                    <span>Enfermeiros</span>
                    <SidebarMenuBadge>8</SidebarMenuBadge>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <User className="h-4 w-4" />
                    <span>Recepcionistas</span>
                    <SidebarMenuBadge>4</SidebarMenuBadge>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator />

          <SidebarGroup>
            <SidebarGroupLabel>Configurações</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Settings className="h-4 w-4" />
                    <span>Geral</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Shield className="h-4 w-4" />
                    <span>Segurança</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Bell className="h-4 w-4" />
                    <span>Notificações</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <HelpCircle className="h-4 w-4" />
                <span>Ajuda</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton>
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          <SidebarSeparator />

          <div className="flex items-center gap-2 px-2 py-1">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/avatars/admin.jpg" />
              <AvatarFallback className="bg-orange-500 text-white">
                AD
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-1 flex-col">
              <span className="text-sm font-medium">Admin</span>
              <span className="text-xs text-muted-foreground">
                Administrador
              </span>
            </div>
          </div>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">Painel Administrativo</h1>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Badge
              variant="outline"
              className="text-orange-600 border-orange-600"
            >
              <AlertTriangle className="h-3 w-3 mr-1" />3 Alertas
            </Badge>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Usuários Ativos
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">+2 desde ontem</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Uptime</CardTitle>
                <Monitor className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">99.9%</div>
                <p className="text-xs text-muted-foreground">Últimos 30 dias</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Armazenamento
                </CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.4GB</div>
                <p className="text-xs text-muted-foreground">68% utilizado</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Alertas</CardTitle>
                <AlertTriangle className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">Requer atenção</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  ),
};

// Sidebar responsivo para diferentes dispositivos
export const ResponsiveSidebar: Story = {
  render: () => (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Heart className="h-4 w-4" />
            </div>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="text-sm font-semibold">MedAssist Pro</span>
              <span className="text-xs text-muted-foreground">Responsivo</span>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navegação</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Dashboard">
                    <Home className="h-4 w-4" />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Pacientes">
                    <Users className="h-4 w-4" />
                    <span>Pacientes</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Agenda">
                    <Calendar className="h-4 w-4" />
                    <span>Agenda</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Exames">
                    <TestTube className="h-4 w-4" />
                    <span>Exames</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <div className="flex items-center gap-2 px-2 group-data-[collapsible=icon]:justify-center">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/avatars/doctor.jpg" />
              <AvatarFallback>DR</AvatarFallback>
            </Avatar>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="text-sm font-medium">Dr. Silva</span>
              <span className="text-xs text-muted-foreground">Online</span>
            </div>
          </div>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">Layout Responsivo</h1>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Smartphone className="h-4 w-4" />
              <span className="hidden sm:inline">Mobile</span>
              <Tablet className="h-4 w-4 ml-2" />
              <span className="hidden md:inline">Tablet</span>
              <Monitor className="h-4 w-4 ml-2" />
              <span className="hidden lg:inline">Desktop</span>
            </div>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <Card>
            <CardHeader>
              <CardTitle>Sidebar Responsivo</CardTitle>
              <CardDescription>
                O sidebar se adapta automaticamente ao tamanho da tela
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Em telas pequenas: Sidebar como overlay</p>
                <p>• Em telas médias: Sidebar colapsável para ícones</p>
                <p>• Em telas grandes: Sidebar completo</p>
                <p>• Use Cmd/Ctrl + B para alternar</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  ),
};
