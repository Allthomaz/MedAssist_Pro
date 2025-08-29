import { Meta, StoryObj } from '@storybook/react-vite';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Settings,
  Filter,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  Pill,
  Stethoscope,
  FileText,
  Heart,
  Activity,
  Thermometer,
  Droplets,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  Plus,
  Edit,
  Trash2,
  Search,
  Bell,
  MoreHorizontal,
  Download,
  Share,
  Copy,
  Star,
  BookOpen,
  Calculator,
  Target,
  TrendingUp,
  Zap,
} from 'lucide-react';

const meta = {
  title: 'UI/Popover',
  component: Popover,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Componente Popover para exibir conteúdo interativo no MedAssist Pro.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

// Popover básico
export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Configurações
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-4">
          <h4 className="font-medium leading-none">Configurações</h4>
          <p className="text-sm text-muted-foreground">
            Ajuste as configurações do sistema.
          </p>
          <div className="space-y-2">
            <Label htmlFor="theme">Tema</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tema" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Claro</SelectItem>
                <SelectItem value="dark">Escuro</SelectItem>
                <SelectItem value="system">Sistema</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

// Popover de filtros
export const FilterPopover: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filtros
          <Badge className="ml-2 bg-blue-500 text-white">3</Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium leading-none">Filtros de Pacientes</h4>
            <Button variant="ghost" size="sm">
              Limpar
            </Button>
          </div>

          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="specialty">Especialidade</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as especialidades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cardiology">Cardiologia</SelectItem>
                  <SelectItem value="endocrinology">Endocrinologia</SelectItem>
                  <SelectItem value="neurology">Neurologia</SelectItem>
                  <SelectItem value="orthopedics">Ortopedia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="critical">Crítico</SelectItem>
                  <SelectItem value="discharged">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="age-range">Faixa Etária</Label>
              <div className="flex gap-2">
                <Input placeholder="Min" type="number" />
                <Input placeholder="Max" type="number" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="last-visit">Última Consulta</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Últimos 7 dias</SelectItem>
                  <SelectItem value="30days">Últimos 30 dias</SelectItem>
                  <SelectItem value="90days">Últimos 90 dias</SelectItem>
                  <SelectItem value="1year">Último ano</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button className="flex-1">Aplicar Filtros</Button>
            <Button variant="outline">Cancelar</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

// Popover de agendamento rápido
export const QuickSchedule: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button>
          <Calendar className="h-4 w-4 mr-2" />
          Agendar Consulta
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h4 className="font-medium leading-none">Agendamento Rápido</h4>

          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="patient">Paciente</Label>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-500 text-white text-xs">
                    JS
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">João Silva</p>
                  <p className="text-xs text-muted-foreground">#12345</p>
                </div>
                <Button variant="ghost" size="sm">
                  <Search className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input type="date" defaultValue="2024-08-15" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Horário</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o horário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="09:00">09:00</SelectItem>
                  <SelectItem value="10:00">10:00</SelectItem>
                  <SelectItem value="11:00">11:00</SelectItem>
                  <SelectItem value="14:00">14:00</SelectItem>
                  <SelectItem value="15:00">15:00</SelectItem>
                  <SelectItem value="16:00">16:00</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Consulta</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="routine">Consulta de Rotina</SelectItem>
                  <SelectItem value="followup">Retorno</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                  <SelectItem value="exam">Avaliação de Exames</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                placeholder="Observações adicionais..."
                className="h-20"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button className="flex-1">
              <Calendar className="h-3 w-3 mr-1" />
              Agendar
            </Button>
            <Button variant="outline">Cancelar</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

// Popover de informações do paciente
export const PatientInfo: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Avatar>
        <AvatarFallback className="bg-blue-500 text-white">JS</AvatarFallback>
      </Avatar>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="p-0 h-auto">
            <div className="text-left">
              <p className="font-medium">João Silva</p>
              <p className="text-sm text-muted-foreground">#12345</p>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-blue-500 text-white">
                  JS
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-medium">João Silva</h4>
                <p className="text-sm text-muted-foreground">Paciente #12345</p>
                <div className="flex gap-1 mt-1">
                  <Badge className="bg-green-500 text-white">Ativo</Badge>
                  <Badge variant="outline">Cardiologia</Badge>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>45 anos, Masculino</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>(11) 99999-9999</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>joao.silva@email.com</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>São Paulo, SP</span>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h5 className="text-sm font-medium">Última Consulta</h5>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">10/08/2024</span>
                <Badge variant="outline">Cardiologia</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="text-sm font-medium">Condições Ativas</h5>
              <div className="flex flex-wrap gap-1">
                <Badge variant="outline" className="text-xs">
                  Hipertensão
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Diabetes Tipo 2
                </Badge>
              </div>
            </div>

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
          </div>
        </PopoverContent>
      </Popover>
    </div>
  ),
};

// Popover de sinais vitais
export const VitalSigns: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Activity className="h-4 w-4 mr-2" />
          Sinais Vitais
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium leading-none">Sinais Vitais</h4>
            <Badge variant="outline">Hoje 14:30</Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 border rounded-lg">
              <Heart className="h-6 w-6 text-red-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-red-500">72</p>
              <p className="text-xs text-muted-foreground">BPM</p>
              <Badge className="mt-1 bg-green-500 text-white text-xs">
                Normal
              </Badge>
            </div>

            <div className="text-center p-3 border rounded-lg">
              <Thermometer className="h-6 w-6 text-orange-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-orange-500">36.8</p>
              <p className="text-xs text-muted-foreground">°C</p>
              <Badge className="mt-1 bg-green-500 text-white text-xs">
                Normal
              </Badge>
            </div>

            <div className="text-center p-3 border rounded-lg">
              <Droplets className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-500">98</p>
              <p className="text-xs text-muted-foreground">SpO2 %</p>
              <Badge className="mt-1 bg-green-500 text-white text-xs">
                Normal
              </Badge>
            </div>

            <div className="text-center p-3 border rounded-lg">
              <Activity className="h-6 w-6 text-purple-500 mx-auto mb-2" />
              <p className="text-lg font-bold text-yellow-500">130/85</p>
              <p className="text-xs text-muted-foreground">mmHg</p>
              <Badge className="mt-1 bg-yellow-500 text-white text-xs">
                Elevada
              </Badge>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Peso:</span>
              <span className="font-medium">78.5 kg</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Altura:</span>
              <span className="font-medium">1.75 m</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>IMC:</span>
              <span className="font-medium">25.6 kg/m²</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button size="sm" className="flex-1">
              <Plus className="h-3 w-3 mr-1" />
              Registrar
            </Button>
            <Button size="sm" variant="outline">
              <TrendingUp className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

// Popover de medicações
export const MedicationPopover: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Pill className="h-4 w-4 mr-2" />
          Medicações
          <Badge className="ml-2 bg-green-500 text-white">3</Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium leading-none">Medicações Ativas</h4>
            <Button variant="ghost" size="sm">
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-sm">Losartana 50mg</p>
                <p className="text-xs text-muted-foreground">
                  1 comprimido, 1x ao dia
                </p>
                <p className="text-xs text-muted-foreground">Manhã, com água</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Badge className="bg-green-500 text-white text-xs">Ativo</Badge>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-sm">Metformina 850mg</p>
                <p className="text-xs text-muted-foreground">
                  1 comprimido, 2x ao dia
                </p>
                <p className="text-xs text-muted-foreground">
                  Café da manhã e jantar
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Badge className="bg-green-500 text-white text-xs">Ativo</Badge>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
              <div className="flex-1">
                <p className="font-medium text-sm text-muted-foreground">
                  Sinvastatina 20mg
                </p>
                <p className="text-xs text-muted-foreground">
                  1 comprimido, 1x ao dia
                </p>
                <p className="text-xs text-muted-foreground">
                  Pausado temporariamente
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Badge variant="outline" className="text-xs">
                  Pausado
                </Badge>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex gap-2">
            <Button size="sm" className="flex-1">
              <Plus className="h-3 w-3 mr-1" />
              Nova Medicação
            </Button>
            <Button size="sm" variant="outline">
              <FileText className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

// Popover de calculadora médica
export const MedicalCalculator: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Calculator className="h-4 w-4 mr-2" />
          Calculadoras
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h4 className="font-medium leading-none">Calculadoras Médicas</h4>

          <div className="space-y-3">
            <div className="p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-sm font-medium">Calculadora de IMC</h5>
                <Target className="h-4 w-4 text-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <Label htmlFor="weight" className="text-xs">
                    Peso (kg)
                  </Label>
                  <Input id="weight" placeholder="78.5" className="h-8" />
                </div>
                <div>
                  <Label htmlFor="height" className="text-xs">
                    Altura (m)
                  </Label>
                  <Input id="height" placeholder="1.75" className="h-8" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">IMC:</span>
                <span className="font-bold text-lg text-green-500">25.6</span>
              </div>
              <Badge className="w-full justify-center mt-1 bg-green-500 text-white">
                Normal
              </Badge>
            </div>

            <div className="p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-sm font-medium">Clearance de Creatinina</h5>
                <Zap className="h-4 w-4 text-purple-500" />
              </div>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <Label htmlFor="creatinine" className="text-xs">
                    Creatinina
                  </Label>
                  <Input id="creatinine" placeholder="1.2" className="h-8" />
                </div>
                <div>
                  <Label htmlFor="age" className="text-xs">
                    Idade
                  </Label>
                  <Input id="age" placeholder="45" className="h-8" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Clearance:
                </span>
                <span className="font-bold text-lg text-blue-500">85</span>
              </div>
              <Badge className="w-full justify-center mt-1 bg-blue-500 text-white">
                Normal
              </Badge>
            </div>

            <div className="p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-sm font-medium">Risco Cardiovascular</h5>
                <Heart className="h-4 w-4 text-red-500" />
              </div>
              <div className="space-y-2">
                <Select>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Sexo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Masculino</SelectItem>
                    <SelectItem value="female">Feminino</SelectItem>
                  </SelectContent>
                </Select>
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Idade" className="h-8" />
                  <Input placeholder="Colesterol" className="h-8" />
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-muted-foreground">Risco:</span>
                <span className="font-bold text-lg text-yellow-500">
                  Moderado
                </span>
              </div>
              <Badge className="w-full justify-center mt-1 bg-yellow-500 text-white">
                15%
              </Badge>
            </div>
          </div>

          <Button size="sm" className="w-full">
            <BookOpen className="h-3 w-3 mr-1" />
            Ver Todas as Calculadoras
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

// Popover de ações rápidas
export const QuickActions: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56">
        <div className="space-y-1">
          <Button variant="ghost" className="w-full justify-start">
            <FileText className="h-4 w-4 mr-2" />
            Ver Prontuário
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Calendar className="h-4 w-4 mr-2" />
            Agendar Consulta
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Phone className="h-4 w-4 mr-2" />
            Ligar para Paciente
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Mail className="h-4 w-4 mr-2" />
            Enviar Email
          </Button>

          <Separator className="my-2" />

          <Button variant="ghost" className="w-full justify-start">
            <Download className="h-4 w-4 mr-2" />
            Baixar Relatório
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Share className="h-4 w-4 mr-2" />
            Compartilhar
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Copy className="h-4 w-4 mr-2" />
            Copiar Informações
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Star className="h-4 w-4 mr-2" />
            Marcar como Favorito
          </Button>

          <Separator className="my-2" />

          <Button variant="ghost" className="w-full justify-start">
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button variant="ghost" className="w-full justify-start text-red-600">
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

// Popover de notificações
export const NotificationPopover: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
            5
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium leading-none">Notificações</h4>
            <Button variant="ghost" size="sm">
              Marcar todas como lidas
            </Button>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto">
            <div className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg">
              <div className="h-2 w-2 bg-red-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Consulta cancelada</p>
                <p className="text-xs text-muted-foreground">
                  Maria Santos cancelou a consulta de hoje às 14:30
                </p>
                <p className="text-xs text-muted-foreground">há 5 minutos</p>
              </div>
              <Button variant="ghost" size="sm">
                <XCircle className="h-3 w-3" />
              </Button>
            </div>

            <div className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg">
              <div className="h-2 w-2 bg-green-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Exame disponível</p>
                <p className="text-xs text-muted-foreground">
                  Hemograma completo de João Silva está disponível
                </p>
                <p className="text-xs text-muted-foreground">há 1 hora</p>
              </div>
              <Button variant="ghost" size="sm">
                <CheckCircle className="h-3 w-3" />
              </Button>
            </div>

            <div className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg">
              <div className="h-2 w-2 bg-yellow-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Medicação vencendo</p>
                <p className="text-xs text-muted-foreground">
                  Losartana de Pedro Costa vence em 3 dias
                </p>
                <p className="text-xs text-muted-foreground">há 2 horas</p>
              </div>
              <Button variant="ghost" size="sm">
                <AlertCircle className="h-3 w-3" />
              </Button>
            </div>

            <div className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg">
              <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Nova mensagem</p>
                <p className="text-xs text-muted-foreground">
                  Dr. Santos enviou uma mensagem sobre o caso
                </p>
                <p className="text-xs text-muted-foreground">há 3 horas</p>
              </div>
              <Button variant="ghost" size="sm">
                <Info className="h-3 w-3" />
              </Button>
            </div>

            <div className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg">
              <div className="h-2 w-2 bg-purple-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Lembrete de consulta</p>
                <p className="text-xs text-muted-foreground">
                  Ana Lima tem consulta amanhã às 09:00
                </p>
                <p className="text-xs text-muted-foreground">há 4 horas</p>
              </div>
              <Button variant="ghost" size="sm">
                <Clock className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <Button variant="outline" className="w-full">
            Ver todas as notificações
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  ),
};
