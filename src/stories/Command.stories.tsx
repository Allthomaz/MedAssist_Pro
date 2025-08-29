import { Meta, StoryObj } from '@storybook/react-vite';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Search,
  User,
  Users,
  Stethoscope,
  Pill,
  Activity,
  FileText,
  Calendar,
  Settings,
  Bell,
  Heart,
  Microscope,
  Clipboard,
  Phone,
  Mail,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Share,
  Copy,
  Filter,
  Star,
  Bookmark,
  Archive,
  Folder,
  File,
  Image,
  Video,
  Music,
  Database,
  Server,
  Wifi,
  Shield,
  Lock,
  Unlock,
  Key,
  UserCheck,
  UserX,
  UserPlus,
  LogOut,
  LogIn,
  Home,
  Building,
  Car,
  Plane,
  Train,
  Bike,
  Truck,
  Ship,
} from 'lucide-react';
import { useState } from 'react';

const meta = {
  title: 'UI/Command',
  component: Command,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Componente Command para busca e navegação rápida no MedAssist Pro.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Command>;

export default meta;
type Story = StoryObj<typeof meta>;

// Command básico
export const Default: Story = {
  render: () => {
    return (
      <Command className="rounded-lg border shadow-md w-96">
        <CommandInput placeholder="Digite um comando ou busque..." />
        <CommandList>
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
          <CommandGroup heading="Sugestões">
            <CommandItem>
              <Calendar className="mr-2 h-4 w-4" />
              <span>Agenda</span>
            </CommandItem>
            <CommandItem>
              <User className="mr-2 h-4 w-4" />
              <span>Pacientes</span>
            </CommandItem>
            <CommandItem>
              <FileText className="mr-2 h-4 w-4" />
              <span>Prontuários</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Configurações">
            <CommandItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Preferências</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <Bell className="mr-2 h-4 w-4" />
              <span>Notificações</span>
              <CommandShortcut>⌘N</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    );
  },
};

// Command Dialog
export const Dialog: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <div className="space-y-4">
        <Button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2"
        >
          <Search className="h-4 w-4" />
          Busca Rápida
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>

        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Digite um comando ou busque..." />
          <CommandList>
            <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
            <CommandGroup heading="Navegação Rápida">
              <CommandItem onSelect={() => setOpen(false)}>
                <Home className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
                <CommandShortcut>⌘D</CommandShortcut>
              </CommandItem>
              <CommandItem onSelect={() => setOpen(false)}>
                <Calendar className="mr-2 h-4 w-4" />
                <span>Agenda</span>
                <CommandShortcut>⌘A</CommandShortcut>
              </CommandItem>
              <CommandItem onSelect={() => setOpen(false)}>
                <Users className="mr-2 h-4 w-4" />
                <span>Pacientes</span>
                <CommandShortcut>⌘U</CommandShortcut>
              </CommandItem>
              <CommandItem onSelect={() => setOpen(false)}>
                <FileText className="mr-2 h-4 w-4" />
                <span>Prontuários</span>
                <CommandShortcut>⌘R</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Ações">
              <CommandItem onSelect={() => setOpen(false)}>
                <Plus className="mr-2 h-4 w-4" />
                <span>Novo Paciente</span>
                <CommandShortcut>⌘⇧N</CommandShortcut>
              </CommandItem>
              <CommandItem onSelect={() => setOpen(false)}>
                <Calendar className="mr-2 h-4 w-4" />
                <span>Agendar Consulta</span>
                <CommandShortcut>⌘⇧A</CommandShortcut>
              </CommandItem>
              <CommandItem onSelect={() => setOpen(false)}>
                <Clipboard className="mr-2 h-4 w-4" />
                <span>Nova Prescrição</span>
                <CommandShortcut>⌘⇧P</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </div>
    );
  },
};

// Busca de Pacientes
export const PatientSearch: Story = {
  render: () => {
    const patients = [
      {
        id: '001',
        name: 'João Silva',
        age: 45,
        condition: 'Hipertensão',
        lastVisit: '2024-08-10',
      },
      {
        id: '002',
        name: 'Maria Santos',
        age: 32,
        condition: 'Diabetes',
        lastVisit: '2024-08-12',
      },
      {
        id: '003',
        name: 'Pedro Lima',
        age: 58,
        condition: 'Cardiopatia',
        lastVisit: '2024-08-14',
      },
      {
        id: '004',
        name: 'Ana Costa',
        age: 29,
        condition: 'Gravidez',
        lastVisit: '2024-08-15',
      },
      {
        id: '005',
        name: 'Carlos Rocha',
        age: 67,
        condition: 'Artrite',
        lastVisit: '2024-08-13',
      },
      {
        id: '006',
        name: 'Lucia Ferreira',
        age: 41,
        condition: 'Asma',
        lastVisit: '2024-08-11',
      },
    ];

    return (
      <Command className="rounded-lg border shadow-md w-[500px]">
        <CommandInput placeholder="Buscar pacientes por nome, ID ou condição..." />
        <CommandList>
          <CommandEmpty>
            <div className="text-center py-6">
              <User className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Nenhum paciente encontrado
              </p>
            </div>
          </CommandEmpty>
          <CommandGroup heading="Pacientes Recentes">
            {patients.map(patient => (
              <CommandItem
                key={patient.id}
                className="flex items-center justify-between p-3"
              >
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="font-medium">{patient.name}</p>
                    <p className="text-xs text-muted-foreground">
                      ID: {patient.id} • {patient.age} anos •{' '}
                      {patient.condition}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="text-xs">
                    {new Date(patient.lastVisit).toLocaleDateString('pt-BR')}
                  </Badge>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Ações">
            <CommandItem>
              <Plus className="mr-2 h-4 w-4" />
              <span>Cadastrar Novo Paciente</span>
              <CommandShortcut>⌘N</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <Search className="mr-2 h-4 w-4" />
              <span>Busca Avançada</span>
              <CommandShortcut>⌘⇧F</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    );
  },
};

// Busca de Medicamentos
export const MedicationSearch: Story = {
  render: () => {
    const medications = [
      {
        name: 'Losartana 50mg',
        category: 'Anti-hipertensivo',
        stock: 150,
        price: 'R$ 12,50',
      },
      {
        name: 'Metformina 850mg',
        category: 'Antidiabético',
        stock: 89,
        price: 'R$ 8,90',
      },
      {
        name: 'Sinvastatina 20mg',
        category: 'Hipolipemiante',
        stock: 200,
        price: 'R$ 15,30',
      },
      {
        name: 'Omeprazol 20mg',
        category: 'Protetor Gástrico',
        stock: 75,
        price: 'R$ 6,80',
      },
      {
        name: 'Dipirona 500mg',
        category: 'Analgésico',
        stock: 300,
        price: 'R$ 4,20',
      },
      {
        name: 'Amoxicilina 500mg',
        category: 'Antibiótico',
        stock: 45,
        price: 'R$ 18,90',
      },
    ];

    return (
      <Command className="rounded-lg border shadow-md w-[500px]">
        <CommandInput placeholder="Buscar medicamentos por nome ou categoria..." />
        <CommandList>
          <CommandEmpty>
            <div className="text-center py-6">
              <Pill className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Nenhum medicamento encontrado
              </p>
            </div>
          </CommandEmpty>
          <CommandGroup heading="Medicamentos Disponíveis">
            {medications.map((med, index) => (
              <CommandItem
                key={index}
                className="flex items-center justify-between p-3"
              >
                <div className="flex items-center gap-3">
                  <Pill className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="font-medium">{med.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {med.category}
                    </p>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-sm font-medium">{med.price}</p>
                  <Badge
                    variant={
                      med.stock > 100
                        ? 'default'
                        : med.stock > 50
                          ? 'secondary'
                          : 'destructive'
                    }
                    className="text-xs"
                  >
                    Estoque: {med.stock}
                  </Badge>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Ações">
            <CommandItem>
              <Plus className="mr-2 h-4 w-4" />
              <span>Cadastrar Medicamento</span>
            </CommandItem>
            <CommandItem>
              <Clipboard className="mr-2 h-4 w-4" />
              <span>Nova Prescrição</span>
            </CommandItem>
            <CommandItem>
              <Archive className="mr-2 h-4 w-4" />
              <span>Controle de Estoque</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    );
  },
};

// Busca de Procedimentos Médicos
export const ProcedureSearch: Story = {
  render: () => {
    const procedures = [
      {
        code: 'ECG001',
        name: 'Eletrocardiograma',
        specialty: 'Cardiologia',
        duration: '15 min',
        price: 'R$ 80,00',
      },
      {
        code: 'USG002',
        name: 'Ultrassom Abdominal',
        specialty: 'Radiologia',
        duration: '30 min',
        price: 'R$ 150,00',
      },
      {
        code: 'LAB003',
        name: 'Hemograma Completo',
        specialty: 'Laboratório',
        duration: '5 min',
        price: 'R$ 25,00',
      },
      {
        code: 'RX004',
        name: 'Raio-X Tórax',
        specialty: 'Radiologia',
        duration: '10 min',
        price: 'R$ 60,00',
      },
      {
        code: 'CON005',
        name: 'Consulta Cardiológica',
        specialty: 'Cardiologia',
        duration: '45 min',
        price: 'R$ 200,00',
      },
      {
        code: 'END006',
        name: 'Endoscopia Digestiva',
        specialty: 'Gastroenterologia',
        duration: '60 min',
        price: 'R$ 400,00',
      },
    ];

    return (
      <Command className="rounded-lg border shadow-md w-[550px]">
        <CommandInput placeholder="Buscar procedimentos por código, nome ou especialidade..." />
        <CommandList>
          <CommandEmpty>
            <div className="text-center py-6">
              <Stethoscope className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Nenhum procedimento encontrado
              </p>
            </div>
          </CommandEmpty>
          <CommandGroup heading="Procedimentos Disponíveis">
            {procedures.map((proc, index) => (
              <CommandItem
                key={index}
                className="flex items-center justify-between p-3"
              >
                <div className="flex items-center gap-3">
                  <Activity className="h-4 w-4 text-purple-500" />
                  <div>
                    <p className="font-medium">{proc.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {proc.code} • {proc.specialty} • {proc.duration}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{proc.price}</p>
                  <Badge variant="outline" className="text-xs mt-1">
                    {proc.specialty}
                  </Badge>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Ações">
            <CommandItem>
              <Calendar className="mr-2 h-4 w-4" />
              <span>Agendar Procedimento</span>
            </CommandItem>
            <CommandItem>
              <FileText className="mr-2 h-4 w-4" />
              <span>Solicitar Exame</span>
            </CommandItem>
            <CommandItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Gerenciar Procedimentos</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    );
  },
};

// Command com Atalhos do Sistema
export const SystemCommands: Story = {
  render: () => {
    return (
      <Command className="rounded-lg border shadow-md w-[450px]">
        <CommandInput placeholder="Digite um comando do sistema..." />
        <CommandList>
          <CommandEmpty>Comando não encontrado.</CommandEmpty>
          <CommandGroup heading="Navegação">
            <CommandItem>
              <Home className="mr-2 h-4 w-4" />
              <span>Ir para Dashboard</span>
              <CommandShortcut>⌘D</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <Calendar className="mr-2 h-4 w-4" />
              <span>Abrir Agenda</span>
              <CommandShortcut>⌘A</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <Users className="mr-2 h-4 w-4" />
              <span>Lista de Pacientes</span>
              <CommandShortcut>⌘U</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <FileText className="mr-2 h-4 w-4" />
              <span>Prontuários</span>
              <CommandShortcut>⌘R</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Ações Rápidas">
            <CommandItem>
              <Plus className="mr-2 h-4 w-4" />
              <span>Novo Paciente</span>
              <CommandShortcut>⌘⇧N</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <Calendar className="mr-2 h-4 w-4" />
              <span>Agendar Consulta</span>
              <CommandShortcut>⌘⇧A</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <Clipboard className="mr-2 h-4 w-4" />
              <span>Nova Prescrição</span>
              <CommandShortcut>⌘⇧P</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <Microscope className="mr-2 h-4 w-4" />
              <span>Solicitar Exame</span>
              <CommandShortcut>⌘⇧E</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Sistema">
            <CommandItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Configurações</span>
              <CommandShortcut>⌘,</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <Bell className="mr-2 h-4 w-4" />
              <span>Notificações</span>
              <CommandShortcut>⌘N</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <Download className="mr-2 h-4 w-4" />
              <span>Backup de Dados</span>
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair do Sistema</span>
              <CommandShortcut>⌘Q</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    );
  },
};

// Command com Status e Badges
export const WithStatusBadges: Story = {
  render: () => {
    const items = [
      {
        name: 'Consulta - João Silva',
        status: 'confirmed',
        time: '09:00',
        type: 'appointment',
      },
      {
        name: 'Exame - Maria Santos',
        status: 'pending',
        time: '10:30',
        type: 'exam',
      },
      {
        name: 'Cirurgia - Pedro Lima',
        status: 'urgent',
        time: '14:00',
        type: 'surgery',
      },
      {
        name: 'Retorno - Ana Costa',
        status: 'completed',
        time: '15:30',
        type: 'followup',
      },
      {
        name: 'Emergência - Carlos Rocha',
        status: 'urgent',
        time: '16:00',
        type: 'emergency',
      },
    ];

    const getStatusBadge = (status: string) => {
      switch (status) {
        case 'confirmed':
          return (
            <Badge className="bg-green-500 text-white text-xs">
              Confirmado
            </Badge>
          );
        case 'pending':
          return (
            <Badge className="bg-yellow-500 text-white text-xs">Pendente</Badge>
          );
        case 'urgent':
          return (
            <Badge className="bg-red-500 text-white text-xs">Urgente</Badge>
          );
        case 'completed':
          return (
            <Badge className="bg-blue-500 text-white text-xs">Concluído</Badge>
          );
        default:
          return (
            <Badge variant="outline" className="text-xs">
              Desconhecido
            </Badge>
          );
      }
    };

    const getTypeIcon = (type: string) => {
      switch (type) {
        case 'appointment':
          return <Calendar className="h-4 w-4 text-blue-500" />;
        case 'exam':
          return <Microscope className="h-4 w-4 text-purple-500" />;
        case 'surgery':
          return <Activity className="h-4 w-4 text-red-500" />;
        case 'followup':
          return <CheckCircle className="h-4 w-4 text-green-500" />;
        case 'emergency':
          return <AlertCircle className="h-4 w-4 text-orange-500" />;
        default:
          return <Clock className="h-4 w-4 text-gray-500" />;
      }
    };

    return (
      <Command className="rounded-lg border shadow-md w-[500px]">
        <CommandInput placeholder="Buscar por agendamentos, status ou horário..." />
        <CommandList>
          <CommandEmpty>Nenhum item encontrado.</CommandEmpty>
          <CommandGroup heading="Agenda de Hoje">
            {items.map((item, index) => (
              <CommandItem
                key={index}
                className="flex items-center justify-between p-3"
              >
                <div className="flex items-center gap-3">
                  {getTypeIcon(item.type)}
                  <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(item.status)}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Filtros">
            <CommandItem>
              <Filter className="mr-2 h-4 w-4" />
              <span>Apenas Urgentes</span>
            </CommandItem>
            <CommandItem>
              <CheckCircle className="mr-2 h-4 w-4" />
              <span>Apenas Confirmados</span>
            </CommandItem>
            <CommandItem>
              <Clock className="mr-2 h-4 w-4" />
              <span>Próximas 2 Horas</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    );
  },
};

// Command compacto
export const Compact: Story = {
  render: () => {
    return (
      <Command className="rounded-lg border shadow-md w-80">
        <CommandInput placeholder="Busca rápida..." className="h-9" />
        <CommandList className="max-h-48">
          <CommandEmpty>Nada encontrado.</CommandEmpty>
          <CommandGroup>
            <CommandItem className="py-2">
              <User className="mr-2 h-3 w-3" />
              <span className="text-sm">Pacientes</span>
            </CommandItem>
            <CommandItem className="py-2">
              <Calendar className="mr-2 h-3 w-3" />
              <span className="text-sm">Agenda</span>
            </CommandItem>
            <CommandItem className="py-2">
              <FileText className="mr-2 h-3 w-3" />
              <span className="text-sm">Prontuários</span>
            </CommandItem>
            <CommandItem className="py-2">
              <Settings className="mr-2 h-3 w-3" />
              <span className="text-sm">Configurações</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    );
  },
};
