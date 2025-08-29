import { Meta, StoryObj } from '@storybook/react-vite';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarLabel,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
} from '@/components/ui/menubar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  FileText,
  Edit,
  Save,
  Print,
  Copy,
  Paste,
  Cut,
  Undo,
  Redo,
  Search,
  Settings,
  User,
  Users,
  Calendar,
  Activity,
  Heart,
  Stethoscope,
  ClipboardList,
  Download,
  Upload,
  RefreshCw,
  HelpCircle,
  LogOut,
  Bell,
  Shield,
  Database,
  BarChart3,
  FileImage,
  Microscope,
  Pill,
  Clock,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react';
import { useState } from 'react';

const meta = {
  title: 'UI/Menubar',
  component: Menubar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Componente Menubar para barras de menu no MedAssist Pro.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Menubar>;

export default meta;
type Story = StoryObj<typeof meta>;

// Menubar básico
export const Default: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>Arquivo</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <FileText className="mr-2 h-4 w-4" />
            Novo Documento
            <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            <Save className="mr-2 h-4 w-4" />
            Salvar
            <MenubarShortcut>⌘S</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            <Print className="mr-2 h-4 w-4" />
            Imprimir
            <MenubarShortcut>⌘P</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>Editar</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <Undo className="mr-2 h-4 w-4" />
            Desfazer
            <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            <Redo className="mr-2 h-4 w-4" />
            Refazer
            <MenubarShortcut>⌘Y</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            <Cut className="mr-2 h-4 w-4" />
            Recortar
            <MenubarShortcut>⌘X</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            <Copy className="mr-2 h-4 w-4" />
            Copiar
            <MenubarShortcut>⌘C</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            <Paste className="mr-2 h-4 w-4" />
            Colar
            <MenubarShortcut>⌘V</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>Ajuda</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <HelpCircle className="mr-2 h-4 w-4" />
            Central de Ajuda
          </MenubarItem>
          <MenubarItem>
            <Settings className="mr-2 h-4 w-4" />
            Configurações
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};

// Menubar médico completo
export const MedicalMenubar: Story = {
  render: () => {
    const [viewMode, setViewMode] = useState('list');
    const [notifications, setNotifications] = useState(true);
    const [autoSave, setAutoSave] = useState(true);

    return (
      <Card className="w-[800px]">
        <CardHeader>
          <CardTitle>Sistema MedAssist Pro</CardTitle>
          <CardDescription>
            Barra de menu principal do sistema médico
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Menubar>
            {/* Menu Pacientes */}
            <MenubarMenu>
              <MenubarTrigger className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Pacientes
              </MenubarTrigger>
              <MenubarContent>
                <MenubarItem>
                  <User className="mr-2 h-4 w-4" />
                  Novo Paciente
                  <MenubarShortcut>⌘N</MenubarShortcut>
                </MenubarItem>
                <MenubarItem>
                  <Search className="mr-2 h-4 w-4" />
                  Buscar Paciente
                  <MenubarShortcut>⌘F</MenubarShortcut>
                </MenubarItem>
                <MenubarSeparator />
                <MenubarSub>
                  <MenubarSubTrigger>
                    <ClipboardList className="mr-2 h-4 w-4" />
                    Relatórios
                  </MenubarSubTrigger>
                  <MenubarSubContent>
                    <MenubarItem>
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Estatísticas Gerais
                    </MenubarItem>
                    <MenubarItem>
                      <Activity className="mr-2 h-4 w-4" />
                      Pacientes Ativos
                    </MenubarItem>
                    <MenubarItem>
                      <Calendar className="mr-2 h-4 w-4" />
                      Consultas do Mês
                    </MenubarItem>
                  </MenubarSubContent>
                </MenubarSub>
                <MenubarSeparator />
                <MenubarItem>
                  <Download className="mr-2 h-4 w-4" />
                  Exportar Lista
                </MenubarItem>
                <MenubarItem>
                  <Upload className="mr-2 h-4 w-4" />
                  Importar Dados
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>

            {/* Menu Consultas */}
            <MenubarMenu>
              <MenubarTrigger className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4" />
                Consultas
              </MenubarTrigger>
              <MenubarContent>
                <MenubarItem>
                  <Calendar className="mr-2 h-4 w-4" />
                  Nova Consulta
                  <MenubarShortcut>⌘⇧N</MenubarShortcut>
                </MenubarItem>
                <MenubarItem>
                  <Clock className="mr-2 h-4 w-4" />
                  Agenda do Dia
                </MenubarItem>
                <MenubarSeparator />
                <MenubarSub>
                  <MenubarSubTrigger>
                    <FileText className="mr-2 h-4 w-4" />
                    Prontuários
                  </MenubarSubTrigger>
                  <MenubarSubContent>
                    <MenubarItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Novo Prontuário
                    </MenubarItem>
                    <MenubarItem>
                      <Search className="mr-2 h-4 w-4" />
                      Buscar Prontuário
                    </MenubarItem>
                    <MenubarItem>
                      <FileImage className="mr-2 h-4 w-4" />
                      Anexar Exames
                    </MenubarItem>
                  </MenubarSubContent>
                </MenubarSub>
                <MenubarSeparator />
                <MenubarItem>
                  <Heart className="mr-2 h-4 w-4" />
                  Monitoramento Vital
                </MenubarItem>
                <MenubarItem>
                  <Pill className="mr-2 h-4 w-4" />
                  Prescrições
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>

            {/* Menu Exames */}
            <MenubarMenu>
              <MenubarTrigger className="flex items-center gap-2">
                <Microscope className="h-4 w-4" />
                Exames
              </MenubarTrigger>
              <MenubarContent>
                <MenubarItem>
                  <FileText className="mr-2 h-4 w-4" />
                  Solicitar Exame
                </MenubarItem>
                <MenubarItem>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Resultado
                </MenubarItem>
                <MenubarSeparator />
                <MenubarSub>
                  <MenubarSubTrigger>
                    <Activity className="mr-2 h-4 w-4" />
                    Tipos de Exame
                  </MenubarSubTrigger>
                  <MenubarSubContent>
                    <MenubarItem>
                      <Heart className="mr-2 h-4 w-4" />
                      Cardiológicos
                    </MenubarItem>
                    <MenubarItem>
                      <Microscope className="mr-2 h-4 w-4" />
                      Laboratoriais
                    </MenubarItem>
                    <MenubarItem>
                      <FileImage className="mr-2 h-4 w-4" />
                      Imagem
                    </MenubarItem>
                  </MenubarSubContent>
                </MenubarSub>
                <MenubarSeparator />
                <MenubarItem>
                  <Download className="mr-2 h-4 w-4" />
                  Relatório de Exames
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>

            {/* Menu Configurações */}
            <MenubarMenu>
              <MenubarTrigger className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Sistema
              </MenubarTrigger>
              <MenubarContent>
                <MenubarLabel>Preferências</MenubarLabel>
                <MenubarCheckboxItem
                  checked={notifications}
                  onCheckedChange={setNotifications}
                >
                  <Bell className="mr-2 h-4 w-4" />
                  Notificações
                </MenubarCheckboxItem>
                <MenubarCheckboxItem
                  checked={autoSave}
                  onCheckedChange={setAutoSave}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Salvamento Automático
                </MenubarCheckboxItem>
                <MenubarSeparator />
                <MenubarLabel>Visualização</MenubarLabel>
                <MenubarRadioGroup value={viewMode} onValueChange={setViewMode}>
                  <MenubarRadioItem value="list">Lista</MenubarRadioItem>
                  <MenubarRadioItem value="grid">Grade</MenubarRadioItem>
                  <MenubarRadioItem value="card">Cartões</MenubarRadioItem>
                </MenubarRadioGroup>
                <MenubarSeparator />
                <MenubarItem>
                  <Database className="mr-2 h-4 w-4" />
                  Backup de Dados
                </MenubarItem>
                <MenubarItem>
                  <Shield className="mr-2 h-4 w-4" />
                  Segurança
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair do Sistema
                  <MenubarShortcut>⌘Q</MenubarShortcut>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </CardContent>
      </Card>
    );
  },
};

// Menubar de prontuário
export const MedicalRecordMenubar: Story = {
  render: () => (
    <Card className="w-[700px]">
      <CardHeader>
        <CardTitle>Prontuário Eletrônico</CardTitle>
        <CardDescription>Menu de ações para prontuário médico</CardDescription>
      </CardHeader>
      <CardContent>
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>Arquivo</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                <FileText className="mr-2 h-4 w-4" />
                Novo Prontuário
                <MenubarShortcut>⌘N</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                <Save className="mr-2 h-4 w-4" />
                Salvar
                <MenubarShortcut>⌘S</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                <Print className="mr-2 h-4 w-4" />
                Imprimir Prontuário
                <MenubarShortcut>⌘P</MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem>
                <Download className="mr-2 h-4 w-4" />
                Exportar PDF
              </MenubarItem>
              <MenubarItem>
                <Mail className="mr-2 h-4 w-4" />
                Enviar por Email
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger>Dados</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                <User className="mr-2 h-4 w-4" />
                Dados do Paciente
              </MenubarItem>
              <MenubarItem>
                <Heart className="mr-2 h-4 w-4" />
                Sinais Vitais
              </MenubarItem>
              <MenubarItem>
                <Activity className="mr-2 h-4 w-4" />
                Histórico Médico
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem>
                <Pill className="mr-2 h-4 w-4" />
                Medicações
              </MenubarItem>
              <MenubarItem>
                <Microscope className="mr-2 h-4 w-4" />
                Exames
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger>Ferramentas</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                <Search className="mr-2 h-4 w-4" />
                Buscar no Prontuário
                <MenubarShortcut>⌘F</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                <RefreshCw className="mr-2 h-4 w-4" />
                Atualizar Dados
                <MenubarShortcut>F5</MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem>
                <BarChart3 className="mr-2 h-4 w-4" />
                Gráficos de Evolução
              </MenubarItem>
              <MenubarItem>
                <Calendar className="mr-2 h-4 w-4" />
                Linha do Tempo
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </CardContent>
    </Card>
  ),
};

// Menubar de agendamento
export const AppointmentMenubar: Story = {
  render: () => (
    <Card className="w-[600px]">
      <CardHeader>
        <CardTitle>Sistema de Agendamento</CardTitle>
        <CardDescription>Menu para gerenciamento de consultas</CardDescription>
      </CardHeader>
      <CardContent>
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Agenda
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                <Calendar className="mr-2 h-4 w-4" />
                Nova Consulta
                <MenubarShortcut>⌘N</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                <Clock className="mr-2 h-4 w-4" />
                Reagendar
              </MenubarItem>
              <MenubarItem>
                <RefreshCw className="mr-2 h-4 w-4" />
                Atualizar Agenda
              </MenubarItem>
              <MenubarSeparator />
              <MenubarSub>
                <MenubarSubTrigger>
                  <Activity className="mr-2 h-4 w-4" />
                  Visualizações
                </MenubarSubTrigger>
                <MenubarSubContent>
                  <MenubarItem>Dia</MenubarItem>
                  <MenubarItem>Semana</MenubarItem>
                  <MenubarItem>Mês</MenubarItem>
                  <MenubarItem>Lista</MenubarItem>
                </MenubarSubContent>
              </MenubarSub>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Pacientes
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                <Search className="mr-2 h-4 w-4" />
                Buscar Paciente
                <MenubarShortcut>⌘F</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                <User className="mr-2 h-4 w-4" />
                Cadastrar Novo
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem>
                <Phone className="mr-2 h-4 w-4" />
                Lista de Contatos
              </MenubarItem>
              <MenubarItem>
                <MapPin className="mr-2 h-4 w-4" />
                Endereços
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notificações
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                <Bell className="mr-2 h-4 w-4" />
                Lembretes Ativos
              </MenubarItem>
              <MenubarItem>
                <Mail className="mr-2 h-4 w-4" />
                Confirmações
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem>
                <Settings className="mr-2 h-4 w-4" />
                Configurar Alertas
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </CardContent>
    </Card>
  ),
};

// Menubar simples
export const Simple: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>Início</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Dashboard</MenubarItem>
          <MenubarItem>Visão Geral</MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>Pacientes</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Lista de Pacientes</MenubarItem>
          <MenubarItem>Novo Paciente</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Buscar</MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>Relatórios</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Gerar Relatório</MenubarItem>
          <MenubarItem>Histórico</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};
