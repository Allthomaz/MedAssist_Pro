import type { Meta, StoryObj } from '@storybook/react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
} from '@/components/ui/context-menu';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  User,
  Edit,
  Trash2,
  Copy,
  Share,
  Download,
  Print,
  Eye,
  EyeOff,
  Star,
  StarOff,
  Calendar,
  Clock,
  Phone,
  Mail,
  MapPin,
  FileText,
  Image,
  Archive,
  MoreHorizontal,
  Settings,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Heart,
  Activity,
  Stethoscope,
  Pill,
  TestTube,
  FileImage,
  UserPlus,
  UserMinus,
  Send,
  Bookmark,
  BookmarkCheck,
  Flag,
  MessageSquare,
  Clipboard,
  RefreshCw,
} from 'lucide-react';
import { useState } from 'react';

const meta: Meta<typeof ContextMenu> = {
  title: 'UI/ContextMenu',
  component: ContextMenu,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Componente ContextMenu para criar menus contextuais acionados por clique direito, útil para ações rápidas em elementos da interface médica.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex items-center justify-center p-8">
      <ContextMenu>
        <ContextMenuTrigger className="flex h-32 w-64 items-center justify-center rounded-md border border-dashed text-sm">
          Clique com o botão direito aqui
        </ContextMenuTrigger>
        <ContextMenuContent className="w-64">
          <ContextMenuItem inset>
            <User className="mr-2 h-4 w-4" />
            Perfil
            <ContextMenuShortcut>⇧⌘P</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem inset>
            <Settings className="mr-2 h-4 w-4" />
            Configurações
            <ContextMenuShortcut>⌘,</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem inset>
            <Copy className="mr-2 h-4 w-4" />
            Copiar
            <ContextMenuShortcut>⌘C</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem inset>
            <Share className="mr-2 h-4 w-4" />
            Compartilhar
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem inset className="text-red-600">
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir
            <ContextMenuShortcut>⌘⌫</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  ),
};

export const PatientCard: Story = {
  render: () => {
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isArchived, setIsArchived] = useState(false);
    const [priority, setPriority] = useState('normal');

    return (
      <div className="flex items-center justify-center p-8">
        <ContextMenu>
          <ContextMenuTrigger>
            <Card className="w-80 cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src="/placeholder-avatar.jpg" />
                    <AvatarFallback>JS</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-lg">João Silva Santos</CardTitle>
                    <CardDescription>CPF: 123.456.789-00</CardDescription>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant="outline">Cardiologia</Badge>
                    {isBookmarked && (
                      <Bookmark className="h-4 w-4 text-blue-500" />
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Próxima: 25/11</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>14:30</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>(11) 99999-9999</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span>Hipertensão</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ContextMenuTrigger>
          <ContextMenuContent className="w-64">
            <ContextMenuLabel>Ações do Paciente</ContextMenuLabel>
            <ContextMenuSeparator />
            <ContextMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              Ver Prontuário
              <ContextMenuShortcut>⌘V</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Editar Informações
              <ContextMenuShortcut>⌘E</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuSub>
              <ContextMenuSubTrigger>
                <Calendar className="mr-2 h-4 w-4" />
                Agendar
              </ContextMenuSubTrigger>
              <ContextMenuSubContent className="w-48">
                <ContextMenuItem>
                  <Stethoscope className="mr-2 h-4 w-4" />
                  Nova Consulta
                </ContextMenuItem>
                <ContextMenuItem>
                  <TestTube className="mr-2 h-4 w-4" />
                  Exame Laboratorial
                </ContextMenuItem>
                <ContextMenuItem>
                  <FileImage className="mr-2 h-4 w-4" />
                  Exame de Imagem
                </ContextMenuItem>
                <ContextMenuItem>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Retorno
                </ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>
            <ContextMenuSub>
              <ContextMenuSubTrigger>
                <Share className="mr-2 h-4 w-4" />
                Compartilhar
              </ContextMenuSubTrigger>
              <ContextMenuSubContent className="w-48">
                <ContextMenuItem>
                  <Mail className="mr-2 h-4 w-4" />
                  Enviar por E-mail
                </ContextMenuItem>
                <ContextMenuItem>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Enviar Mensagem
                </ContextMenuItem>
                <ContextMenuItem>
                  <Print className="mr-2 h-4 w-4" />
                  Imprimir Resumo
                </ContextMenuItem>
                <ContextMenuItem>
                  <Download className="mr-2 h-4 w-4" />
                  Exportar PDF
                </ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>
            <ContextMenuSeparator />
            <ContextMenuCheckboxItem
              checked={isBookmarked}
              onCheckedChange={setIsBookmarked}
            >
              <Bookmark className="mr-2 h-4 w-4" />
              Favoritar Paciente
            </ContextMenuCheckboxItem>
            <ContextMenuCheckboxItem
              checked={isArchived}
              onCheckedChange={setIsArchived}
            >
              <Archive className="mr-2 h-4 w-4" />
              Arquivar
            </ContextMenuCheckboxItem>
            <ContextMenuSeparator />
            <ContextMenuLabel>Prioridade</ContextMenuLabel>
            <ContextMenuRadioGroup value={priority} onValueChange={setPriority}>
              <ContextMenuRadioItem value="low">
                <Flag className="mr-2 h-4 w-4 text-green-500" />
                Baixa
              </ContextMenuRadioItem>
              <ContextMenuRadioItem value="normal">
                <Flag className="mr-2 h-4 w-4 text-yellow-500" />
                Normal
              </ContextMenuRadioItem>
              <ContextMenuRadioItem value="high">
                <Flag className="mr-2 h-4 w-4 text-red-500" />
                Alta
              </ContextMenuRadioItem>
              <ContextMenuRadioItem value="urgent">
                <AlertTriangle className="mr-2 h-4 w-4 text-red-600" />
                Urgente
              </ContextMenuRadioItem>
            </ContextMenuRadioGroup>
          </ContextMenuContent>
        </ContextMenu>
      </div>
    );
  },
};

export const ExamResults: Story = {
  render: () => {
    const [showSensitive, setShowSensitive] = useState(false);

    return (
      <div className="flex items-center justify-center p-8">
        <ContextMenu>
          <ContextMenuTrigger>
            <Card className="w-96 cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <TestTube className="h-5 w-5" />
                      Hemograma Completo
                    </CardTitle>
                    <CardDescription>Realizado em 22/11/2024</CardDescription>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Normal
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Hemoglobina:</span>
                    <span className="font-medium">14.2 g/dL</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hematócrito:</span>
                    <span className="font-medium">42.1%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Leucócitos:</span>
                    <span className="font-medium">7.200/mm³</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Plaquetas:</span>
                    <span className="font-medium">285.000/mm³</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ContextMenuTrigger>
          <ContextMenuContent className="w-64">
            <ContextMenuLabel>Ações do Exame</ContextMenuLabel>
            <ContextMenuSeparator />
            <ContextMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              Ver Detalhes Completos
            </ContextMenuItem>
            <ContextMenuItem>
              <FileText className="mr-2 h-4 w-4" />
              Ver Laudo Médico
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>
              <Download className="mr-2 h-4 w-4" />
              Baixar PDF
              <ContextMenuShortcut>⌘D</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>
              <Print className="mr-2 h-4 w-4" />
              Imprimir
              <ContextMenuShortcut>⌘P</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>
              <Copy className="mr-2 h-4 w-4" />
              Copiar Resultados
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuSub>
              <ContextMenuSubTrigger>
                <Send className="mr-2 h-4 w-4" />
                Enviar Para
              </ContextMenuSubTrigger>
              <ContextMenuSubContent className="w-48">
                <ContextMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Médico Solicitante
                </ContextMenuItem>
                <ContextMenuItem>
                  <Mail className="mr-2 h-4 w-4" />
                  E-mail do Paciente
                </ContextMenuItem>
                <ContextMenuItem>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Outro Profissional
                </ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>
            <ContextMenuSeparator />
            <ContextMenuCheckboxItem
              checked={showSensitive}
              onCheckedChange={setShowSensitive}
            >
              <Shield className="mr-2 h-4 w-4" />
              Mostrar Dados Sensíveis
            </ContextMenuCheckboxItem>
            <ContextMenuSeparator />
            <ContextMenuItem className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir Exame
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </div>
    );
  },
};

export const AppointmentSchedule: Story = {
  render: () => {
    const [status, setStatus] = useState('scheduled');

    return (
      <div className="flex items-center justify-center p-8">
        <ContextMenu>
          <ContextMenuTrigger>
            <Card className="w-80 cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Consulta Cardiológica</p>
                      <p className="text-sm text-muted-foreground">
                        Dr. Carlos Mendes
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">25/11/2024</p>
                    <p className="text-sm text-muted-foreground">
                      14:30 - 15:00
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>João Silva</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>Sala 205</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ContextMenuTrigger>
          <ContextMenuContent className="w-64">
            <ContextMenuLabel>Ações da Consulta</ContextMenuLabel>
            <ContextMenuSeparator />
            <ContextMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              Ver Detalhes
            </ContextMenuItem>
            <ContextMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Editar Agendamento
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuSub>
              <ContextMenuSubTrigger>
                <Clock className="mr-2 h-4 w-4" />
                Reagendar
              </ContextMenuSubTrigger>
              <ContextMenuSubContent className="w-48">
                <ContextMenuItem>
                  <Calendar className="mr-2 h-4 w-4" />
                  Escolher Nova Data
                </ContextMenuItem>
                <ContextMenuItem>
                  <Clock className="mr-2 h-4 w-4" />
                  Próximo Horário Disponível
                </ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>
            <ContextMenuItem>
              <Phone className="mr-2 h-4 w-4" />
              Ligar para Paciente
            </ContextMenuItem>
            <ContextMenuItem>
              <Mail className="mr-2 h-4 w-4" />
              Enviar Lembrete
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuLabel>Status da Consulta</ContextMenuLabel>
            <ContextMenuRadioGroup value={status} onValueChange={setStatus}>
              <ContextMenuRadioItem value="scheduled">
                <Clock className="mr-2 h-4 w-4 text-blue-500" />
                Agendada
              </ContextMenuRadioItem>
              <ContextMenuRadioItem value="confirmed">
                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                Confirmada
              </ContextMenuRadioItem>
              <ContextMenuRadioItem value="in-progress">
                <Activity className="mr-2 h-4 w-4 text-yellow-500" />
                Em Andamento
              </ContextMenuRadioItem>
              <ContextMenuRadioItem value="completed">
                <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                Concluída
              </ContextMenuRadioItem>
              <ContextMenuRadioItem value="cancelled">
                <XCircle className="mr-2 h-4 w-4 text-red-500" />
                Cancelada
              </ContextMenuRadioItem>
            </ContextMenuRadioGroup>
            <ContextMenuSeparator />
            <ContextMenuItem className="text-red-600">
              <XCircle className="mr-2 h-4 w-4" />
              Cancelar Consulta
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </div>
    );
  },
};

export const MedicalImage: Story = {
  render: () => {
    const [isStarred, setIsStarred] = useState(false);
    const [viewMode, setViewMode] = useState('normal');

    return (
      <div className="flex items-center justify-center p-8">
        <ContextMenu>
          <ContextMenuTrigger>
            <Card className="w-72 cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileImage className="h-5 w-5" />
                      Raio-X Tórax
                    </CardTitle>
                    <CardDescription>PA e Perfil - 20/11/2024</CardDescription>
                  </div>
                  {isStarred && (
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                  <Image className="h-16 w-16 text-gray-400" />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">João Silva</span>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Normal
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </ContextMenuTrigger>
          <ContextMenuContent className="w-64">
            <ContextMenuLabel>Ações da Imagem</ContextMenuLabel>
            <ContextMenuSeparator />
            <ContextMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              Visualizar em Tela Cheia
              <ContextMenuShortcut>Space</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuSub>
              <ContextMenuSubTrigger>
                <Settings className="mr-2 h-4 w-4" />
                Ferramentas de Visualização
              </ContextMenuSubTrigger>
              <ContextMenuSubContent className="w-48">
                <ContextMenuItem>
                  <Eye className="mr-2 h-4 w-4" />
                  Zoom In
                  <ContextMenuShortcut>+</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuItem>
                  <EyeOff className="mr-2 h-4 w-4" />
                  Zoom Out
                  <ContextMenuShortcut>-</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuItem>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Rotacionar
                  <ContextMenuShortcut>R</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuItem>
                  <Clipboard className="mr-2 h-4 w-4" />
                  Medir Distância
                </ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>
            <ContextMenuSeparator />
            <ContextMenuItem>
              <Download className="mr-2 h-4 w-4" />
              Baixar Original
              <ContextMenuShortcut>⌘D</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>
              <Copy className="mr-2 h-4 w-4" />
              Copiar Imagem
            </ContextMenuItem>
            <ContextMenuItem>
              <Print className="mr-2 h-4 w-4" />
              Imprimir
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuLabel>Modo de Visualização</ContextMenuLabel>
            <ContextMenuRadioGroup value={viewMode} onValueChange={setViewMode}>
              <ContextMenuRadioItem value="normal">Normal</ContextMenuRadioItem>
              <ContextMenuRadioItem value="enhanced">
                Contraste Aprimorado
              </ContextMenuRadioItem>
              <ContextMenuRadioItem value="inverted">
                Cores Invertidas
              </ContextMenuRadioItem>
            </ContextMenuRadioGroup>
            <ContextMenuSeparator />
            <ContextMenuCheckboxItem
              checked={isStarred}
              onCheckedChange={setIsStarred}
            >
              <Star className="mr-2 h-4 w-4" />
              Marcar como Importante
            </ContextMenuCheckboxItem>
            <ContextMenuSeparator />
            <ContextMenuItem>
              <MessageSquare className="mr-2 h-4 w-4" />
              Adicionar Anotação
            </ContextMenuItem>
            <ContextMenuItem>
              <Share className="mr-2 h-4 w-4" />
              Compartilhar com Especialista
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </div>
    );
  },
};

export const SimpleContextMenu: Story = {
  render: () => (
    <div className="flex items-center justify-center p-8">
      <ContextMenu>
        <ContextMenuTrigger className="flex h-24 w-48 items-center justify-center rounded-md border border-dashed text-sm">
          Menu Simples
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>
            <Copy className="mr-2 h-4 w-4" />
            Copiar
          </ContextMenuItem>
          <ContextMenuItem>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem className="text-red-600">
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  ),
};
