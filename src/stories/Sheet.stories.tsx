import { Meta, StoryObj } from '@storybook/react-vite';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  User,
  Calendar,
  Clock,
  Phone,
  Mail,
  MapPin,
  Heart,
  Activity,
  Thermometer,
  Droplets,
  Zap,
  Weight,
  Ruler,
  Stethoscope,
  Pill,
  TestTube,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Edit,
  Save,
  X,
  Plus,
  Minus,
  Eye,
  EyeOff,
  Star,
  MessageSquare,
  Send,
  Upload,
  Download,
  Printer,
  Share2,
  Settings,
  Bell,
  Shield,
  Lock,
  Unlock,
  UserPlus,
  UserMinus,
  Search,
  Filter,
  SortAsc,
  MoreHorizontal,
  ChevronRight,
  Info,
  HelpCircle,
  BookOpen,
  Clipboard,
  FileImage,
  Camera,
  Mic,
  Video,
} from 'lucide-react';

const meta = {
  title: 'UI/Sheet',
  component: Sheet,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Componente Sheet para painéis laterais deslizantes no MedAssist Pro. Ideal para formulários, detalhes de pacientes e configurações.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    side: {
      control: { type: 'radio' },
      options: ['top', 'right', 'bottom', 'left'],
      description: 'Lado de onde o sheet aparece',
    },
  },
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sheet básico
export const Default: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Abrir Sheet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Informações do Paciente</SheetTitle>
          <SheetDescription>
            Visualize e edite as informações do paciente selecionado.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nome
            </Label>
            <Input id="name" value="João Silva" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="age" className="text-right">
              Idade
            </Label>
            <Input id="age" value="45" className="col-span-3" />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Salvar alterações</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

// Sheet do lado esquerdo
export const LeftSide: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <User className="h-4 w-4 mr-2" />
          Perfil do Paciente
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Perfil Completo
          </SheetTitle>
          <SheetDescription>
            Informações detalhadas do paciente
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-200px)] mt-6">
          <div className="space-y-6">
            {/* Avatar e Info Básica */}
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="" alt="João Silva" />
                <AvatarFallback className="bg-blue-500 text-white text-lg">
                  JS
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">João Silva</h3>
                <p className="text-sm text-muted-foreground">Paciente #12345</p>
                <Badge variant="secondary">Ativo</Badge>
              </div>
            </div>

            <Separator />

            {/* Informações Pessoais */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Informações Pessoais
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <span>45 anos • 15/03/1979</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3 text-muted-foreground" />
                  <span>(11) 99999-9999</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-3 w-3 text-muted-foreground" />
                  <span>joao.silva@email.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <span>São Paulo, SP</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Sinais Vitais */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500" />
                Últimos Sinais Vitais
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <Card className="p-3">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <div>
                      <p className="text-lg font-bold">72</p>
                      <p className="text-xs text-muted-foreground">BPM</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-3">
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-orange-500" />
                    <div>
                      <p className="text-lg font-bold">36.8</p>
                      <p className="text-xs text-muted-foreground">°C</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            <Separator />

            {/* Medicações */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Pill className="h-4 w-4 text-blue-500" />
                Medicações Ativas
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">Losartana 50mg</span>
                  <Badge variant="outline" className="text-xs">
                    1x/dia
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">Metformina 850mg</span>
                  <Badge variant="outline" className="text-xs">
                    2x/dia
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
        <SheetFooter className="mt-6">
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Prontuário
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

// Sheet superior
export const TopSheet: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Bell className="h-4 w-4 mr-2" />
          Notificações
        </Button>
      </SheetTrigger>
      <SheetContent side="top" className="h-[400px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Central de Notificações
          </SheetTitle>
          <SheetDescription>
            Acompanhe todas as atualizações do sistema
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[280px] mt-4">
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Nova consulta agendada</p>
                <p className="text-xs text-muted-foreground">
                  João Silva - 15/08 às 14:30
                </p>
                <p className="text-xs text-muted-foreground">há 5 minutos</p>
              </div>
              <Button variant="ghost" size="sm">
                <Eye className="h-3 w-3" />
              </Button>
            </div>

            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <div className="h-2 w-2 bg-green-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Exame disponível</p>
                <p className="text-xs text-muted-foreground">
                  Hemograma completo - Maria Santos
                </p>
                <p className="text-xs text-muted-foreground">há 1 hora</p>
              </div>
              <Button variant="ghost" size="sm">
                <Download className="h-3 w-3" />
              </Button>
            </div>

            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <div className="h-2 w-2 bg-yellow-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Medicação vencendo</p>
                <p className="text-xs text-muted-foreground">
                  Losartana - Pedro Costa
                </p>
                <p className="text-xs text-muted-foreground">há 2 horas</p>
              </div>
              <Button variant="ghost" size="sm">
                <AlertTriangle className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </ScrollArea>
        <SheetFooter>
          <Button variant="outline" className="w-full">
            Ver todas as notificações
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

// Sheet inferior
export const BottomSheet: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Ação Rápida
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[300px]">
        <SheetHeader>
          <SheetTitle>Ações Rápidas</SheetTitle>
          <SheetDescription>
            Acesse rapidamente as funcionalidades mais utilizadas
          </SheetDescription>
        </SheetHeader>
        <div className="grid grid-cols-4 gap-4 mt-6">
          <Button variant="outline" className="h-20 flex-col gap-2">
            <UserPlus className="h-6 w-6" />
            <span className="text-xs">Novo Paciente</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col gap-2">
            <Calendar className="h-6 w-6" />
            <span className="text-xs">Agendar</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col gap-2">
            <Stethoscope className="h-6 w-6" />
            <span className="text-xs">Consulta</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col gap-2">
            <TestTube className="h-6 w-6" />
            <span className="text-xs">Exame</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col gap-2">
            <Pill className="h-6 w-6" />
            <span className="text-xs">Receita</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col gap-2">
            <FileText className="h-6 w-6" />
            <span className="text-xs">Relatório</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col gap-2">
            <Camera className="h-6 w-6" />
            <span className="text-xs">Foto</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col gap-2">
            <Settings className="h-6 w-6" />
            <span className="text-xs">Config</span>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  ),
};

// Sheet de formulário de novo paciente
export const NewPatientForm: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Novo Paciente
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[500px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Cadastrar Novo Paciente
          </SheetTitle>
          <SheetDescription>
            Preencha as informações básicas do paciente
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-200px)] mt-6">
          <div className="space-y-6">
            {/* Informações Pessoais */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Informações Pessoais
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nome</Label>
                  <Input id="firstName" placeholder="João" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Sobrenome</Label>
                  <Input id="lastName" placeholder="Silva" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Data de Nascimento</Label>
                  <Input id="birthDate" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Sexo</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Masculino</SelectItem>
                      <SelectItem value="F">Feminino</SelectItem>
                      <SelectItem value="O">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input id="cpf" placeholder="000.000.000-00" />
              </div>
            </div>

            <Separator />

            {/* Contato */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Contato
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" placeholder="(11) 99999-9999" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" type="email" placeholder="joao@email.com" />
                </div>
              </div>
            </div>

            <Separator />

            {/* Endereço */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Endereço
              </h4>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cep">CEP</Label>
                    <Input id="cep" placeholder="00000-000" />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="street">Rua</Label>
                    <Input id="street" placeholder="Rua das Flores" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="number">Número</Label>
                    <Input id="number" placeholder="123" />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="complement">Complemento</Label>
                    <Input id="complement" placeholder="Apto 45" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input id="city" placeholder="São Paulo" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">Estado</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="UF" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SP">São Paulo</SelectItem>
                        <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                        <SelectItem value="MG">Minas Gerais</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Informações Médicas */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Stethoscope className="h-4 w-4" />
                Informações Médicas
              </h4>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bloodType">Tipo Sanguíneo</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="allergies">Alergias</Label>
                  <Textarea
                    id="allergies"
                    placeholder="Descreva alergias conhecidas..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="medications">Medicações em Uso</Label>
                  <Textarea
                    id="medications"
                    placeholder="Liste medicações atuais..."
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Contato de Emergência */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Contato de Emergência
              </h4>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyName">Nome</Label>
                  <Input id="emergencyName" placeholder="Maria Silva" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Telefone</Label>
                    <Input id="emergencyPhone" placeholder="(11) 88888-8888" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="relationship">Parentesco</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spouse">Cônjuge</SelectItem>
                        <SelectItem value="parent">Pai/Mãe</SelectItem>
                        <SelectItem value="child">Filho(a)</SelectItem>
                        <SelectItem value="sibling">Irmão(ã)</SelectItem>
                        <SelectItem value="other">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Termos */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <Label htmlFor="terms" className="text-sm">
                  Aceito os termos de uso e política de privacidade
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="marketing" />
                <Label htmlFor="marketing" className="text-sm">
                  Aceito receber comunicações por e-mail e SMS
                </Label>
              </div>
            </div>
          </div>
        </ScrollArea>
        <SheetFooter className="mt-6">
          <SheetClose asChild>
            <Button variant="outline">Cancelar</Button>
          </SheetClose>
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            Cadastrar Paciente
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

// Sheet de configurações
export const SettingsSheet: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Configurações
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurações do Sistema
          </SheetTitle>
          <SheetDescription>
            Personalize sua experiência no MedAssist Pro
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-200px)] mt-6">
          <div className="space-y-6">
            {/* Perfil */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Perfil
              </h4>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-blue-500 text-white">
                      DR
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">Dr. Silva</p>
                    <p className="text-sm text-muted-foreground">
                      Cardiologista
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Edit className="h-3 w-3 mr-1" />
                    Editar
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            {/* Notificações */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notificações
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Consultas agendadas</p>
                    <p className="text-xs text-muted-foreground">
                      Receber notificações de novos agendamentos
                    </p>
                  </div>
                  <Checkbox defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Exames disponíveis</p>
                    <p className="text-xs text-muted-foreground">
                      Notificar quando exames estiverem prontos
                    </p>
                  </div>
                  <Checkbox defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      Lembretes de medicação
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Alertas para medicações dos pacientes
                    </p>
                  </div>
                  <Checkbox />
                </div>
              </div>
            </div>

            <Separator />

            {/* Segurança */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Segurança
              </h4>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Lock className="h-4 w-4 mr-2" />
                  Alterar senha
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="h-4 w-4 mr-2" />
                  Autenticação em duas etapas
                </Button>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Logout automático</p>
                    <p className="text-xs text-muted-foreground">
                      Sair após 30 minutos de inatividade
                    </p>
                  </div>
                  <Checkbox defaultChecked />
                </div>
              </div>
            </div>

            <Separator />

            {/* Aparência */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Aparência
              </h4>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Tema</Label>
                  <RadioGroup defaultValue="light" className="mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="light" id="light" />
                      <Label htmlFor="light" className="text-sm">
                        Claro
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dark" id="dark" />
                      <Label htmlFor="dark" className="text-sm">
                        Escuro
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="system" id="system" />
                      <Label htmlFor="system" className="text-sm">
                        Sistema
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
        <SheetFooter className="mt-6">
          <Button variant="outline">Restaurar padrões</Button>
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Salvar
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

// Sheet de chat/mensagens
export const ChatSheet: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <MessageSquare className="h-4 w-4 mr-2" />
          Chat Médico
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Chat com Paciente
          </SheetTitle>
          <SheetDescription>João Silva • Online</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col h-[calc(100vh-200px)] mt-6">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {/* Mensagem recebida */}
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-500 text-white text-xs">
                    JS
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                    <p className="text-sm">
                      Doutor, estou sentindo algumas dores no peito desde ontem.
                      Devo me preocupar?
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">14:30</p>
                </div>
              </div>

              {/* Mensagem enviada */}
              <div className="flex items-start gap-3 justify-end">
                <div className="flex-1 flex flex-col items-end">
                  <div className="bg-blue-500 text-white rounded-lg p-3 max-w-[80%]">
                    <p className="text-sm">
                      Olá João! Vamos avaliar isso com cuidado. Pode me
                      descrever melhor a dor? É uma dor aguda ou mais como um
                      desconforto?
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">14:32</p>
                </div>
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-green-500 text-white text-xs">
                    DR
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Mensagem recebida */}
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-500 text-white text-xs">
                    JS
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                    <p className="text-sm">
                      É mais como um desconforto, doutor. Não é uma dor muito
                      forte, mas está me incomodando.
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">14:35</p>
                </div>
              </div>

              {/* Mensagem com anexo */}
              <div className="flex items-start gap-3 justify-end">
                <div className="flex-1 flex flex-col items-end">
                  <div className="bg-blue-500 text-white rounded-lg p-3 max-w-[80%]">
                    <p className="text-sm">
                      Entendi. Vou te enviar algumas orientações e gostaria que
                      você agendasse uma consulta presencial para uma avaliação
                      mais detalhada.
                    </p>
                    <div className="mt-2 p-2 bg-blue-600 rounded border border-blue-400">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="text-xs">
                          orientacoes_dor_peito.pdf
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">14:38</p>
                </div>
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-green-500 text-white text-xs">
                    DR
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </ScrollArea>

          {/* Input de mensagem */}
          <div className="mt-4 space-y-2">
            <div className="flex gap-2">
              <Input placeholder="Digite sua mensagem..." className="flex-1" />
              <Button size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <FileImage className="h-3 w-3 mr-1" />
                Imagem
              </Button>
              <Button variant="outline" size="sm">
                <FileText className="h-3 w-3 mr-1" />
                Arquivo
              </Button>
              <Button variant="outline" size="sm">
                <Mic className="h-3 w-3 mr-1" />
                Áudio
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  ),
};

// Sheet simples
export const Simple: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Abrir</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Título do Sheet</SheetTitle>
          <SheetDescription>Descrição do conteúdo do sheet.</SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Conteúdo do sheet aqui.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  ),
};
