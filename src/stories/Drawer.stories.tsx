import { Meta, StoryObj } from '@storybook/react-vite';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
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
  Calendar as CalendarIcon,
  Clock as ClockIcon,
} from 'lucide-react';
import { useState } from 'react';

const meta: Meta<typeof Drawer> = {
  title: 'UI/Drawer',
  component: Drawer,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Componente Drawer para criar painéis deslizantes que aparecem na parte inferior da tela, útil para formulários, detalhes e ações rápidas em aplicações médicas.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Abrir Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Drawer Padrão</DrawerTitle>
            <DrawerDescription>
              Este é um drawer básico com conteúdo simples.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="flex items-center justify-center space-x-2">
              <Button variant="outline" size="icon">
                <Minus className="h-4 w-4" />
              </Button>
              <div className="flex-1 text-center">
                <div className="text-7xl font-bold tracking-tighter">100</div>
                <div className="text-[0.70rem] uppercase text-muted-foreground">
                  Valor
                </div>
              </div>
              <Button variant="outline" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <DrawerFooter>
            <Button>Confirmar</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  ),
};

export const PatientDetails: Story = {
  render: () => {
    const [notes, setNotes] = useState('');

    return (
      <Drawer>
        <DrawerTrigger asChild>
          <Button className="w-full">
            <User className="mr-2 h-4 w-4" />
            Ver Detalhes do Paciente
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-2xl">
            <DrawerHeader>
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <DrawerTitle className="text-2xl">
                    João Silva Santos
                  </DrawerTitle>
                  <DrawerDescription className="text-base">
                    CPF: 123.456.789-00 • Idade: 45 anos • Masculino
                  </DrawerDescription>
                </div>
                <div className="flex space-x-2">
                  <Badge className="bg-green-100 text-green-800">
                    <Heart className="mr-1 h-3 w-3" />
                    Ativo
                  </Badge>
                  <Badge variant="outline">Cardiologia</Badge>
                </div>
              </div>
            </DrawerHeader>

            <ScrollArea className="h-96 px-4">
              <div className="space-y-6">
                {/* Informações de Contato */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Informações de Contato
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>(11) 99999-9999</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>joao.silva@email.com</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>Rua das Flores, 123 - São Paulo, SP</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Sinais Vitais */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Últimos Sinais Vitais
                    </CardTitle>
                    <CardDescription>
                      Registrados em 22/11/2024 às 14:30
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-red-500" />
                        <div>
                          <p className="font-medium">120/80 mmHg</p>
                          <p className="text-sm text-muted-foreground">
                            Pressão Arterial
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-blue-500" />
                        <div>
                          <p className="font-medium">72 bpm</p>
                          <p className="text-sm text-muted-foreground">
                            Frequência Cardíaca
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Thermometer className="h-4 w-4 text-orange-500" />
                        <div>
                          <p className="font-medium">36.5°C</p>
                          <p className="text-sm text-muted-foreground">
                            Temperatura
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Droplets className="h-4 w-4 text-cyan-500" />
                        <div>
                          <p className="font-medium">98%</p>
                          <p className="text-sm text-muted-foreground">
                            Saturação O2
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Próximas Consultas */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Próximas Consultas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div>
                          <p className="font-medium">Consulta Cardiológica</p>
                          <p className="text-sm text-muted-foreground">
                            Dr. Carlos Mendes
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">25/11/2024</p>
                        <p className="text-sm text-muted-foreground">14:30</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="font-medium">Exame de Sangue</p>
                          <p className="text-sm text-muted-foreground">
                            Laboratório Central
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">28/11/2024</p>
                        <p className="text-sm text-muted-foreground">08:00</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Notas Médicas */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Notas Médicas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Adicionar nova nota médica..."
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>

            <DrawerFooter>
              <div className="flex gap-2">
                <Button className="flex-1">
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Alterações
                </Button>
                <Button variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Button>
                <Button variant="outline">
                  <Share2 className="mr-2 h-4 w-4" />
                  Compartilhar
                </Button>
              </div>
              <DrawerClose asChild>
                <Button variant="outline">Fechar</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    );
  },
};

export const VitalSignsMonitor: Story = {
  render: () => {
    const [heartRate, setHeartRate] = useState(72);
    const [bloodPressure, setBloodPressure] = useState({
      systolic: 120,
      diastolic: 80,
    });
    const [temperature, setTemperature] = useState(36.5);
    const [oxygenSat, setOxygenSat] = useState(98);

    return (
      <Drawer>
        <DrawerTrigger asChild>
          <Button className="w-full">
            <Activity className="mr-2 h-4 w-4" />
            Monitor de Sinais Vitais
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-lg">
            <DrawerHeader>
              <DrawerTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5" />
                Sinais Vitais - João Silva
              </DrawerTitle>
              <DrawerDescription>
                Monitoramento em tempo real • Última atualização: agora
              </DrawerDescription>
            </DrawerHeader>

            <div className="p-4 space-y-6">
              {/* Frequência Cardíaca */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  Frequência Cardíaca
                </Label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setHeartRate(Math.max(40, heartRate - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="flex-1 text-center">
                    <div className="text-3xl font-bold">{heartRate}</div>
                    <div className="text-sm text-muted-foreground">bpm</div>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setHeartRate(Math.min(200, heartRate + 1))}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex justify-center">
                  <Badge
                    className={
                      heartRate >= 60 && heartRate <= 100
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }
                  >
                    {heartRate >= 60 && heartRate <= 100 ? 'Normal' : 'Atenção'}
                  </Badge>
                </div>
              </div>

              <Separator />

              {/* Pressão Arterial */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  Pressão Arterial
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {bloodPressure.systolic}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Sistólica
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {bloodPressure.diastolic}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Diastólica
                    </div>
                  </div>
                </div>
                <div className="flex justify-center">
                  <Badge className="bg-green-100 text-green-800">Normal</Badge>
                </div>
              </div>

              <Separator />

              {/* Temperatura */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-orange-500" />
                  Temperatura Corporal
                </Label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setTemperature(Math.max(35, temperature - 0.1))
                    }
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="flex-1 text-center">
                    <div className="text-3xl font-bold">
                      {temperature.toFixed(1)}
                    </div>
                    <div className="text-sm text-muted-foreground">°C</div>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setTemperature(Math.min(42, temperature + 0.1))
                    }
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex justify-center">
                  <Badge
                    className={
                      temperature >= 36 && temperature <= 37.5
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }
                  >
                    {temperature >= 36 && temperature <= 37.5
                      ? 'Normal'
                      : 'Febre'}
                  </Badge>
                </div>
              </div>

              <Separator />

              {/* Saturação de Oxigênio */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-cyan-500" />
                  Saturação de Oxigênio
                </Label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setOxygenSat(Math.max(80, oxygenSat - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="flex-1 text-center">
                    <div className="text-3xl font-bold">{oxygenSat}</div>
                    <div className="text-sm text-muted-foreground">%</div>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setOxygenSat(Math.min(100, oxygenSat + 1))}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex justify-center">
                  <Badge
                    className={
                      oxygenSat >= 95
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }
                  >
                    {oxygenSat >= 95 ? 'Normal' : 'Baixo'}
                  </Badge>
                </div>
              </div>
            </div>

            <DrawerFooter>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Registrar Sinais Vitais
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Printer className="mr-2 h-4 w-4" />
                  Imprimir
                </Button>
                <Button variant="outline" className="flex-1">
                  <Share2 className="mr-2 h-4 w-4" />
                  Compartilhar
                </Button>
              </div>
              <DrawerClose asChild>
                <Button variant="outline">Fechar Monitor</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    );
  },
};

export const QuickActions: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">
          <MoreHorizontal className="mr-2 h-4 w-4" />
          Ações Rápidas
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Ações Rápidas</DrawerTitle>
            <DrawerDescription>
              Selecione uma ação para executar rapidamente.
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-4 space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <UserPlus className="mr-2 h-4 w-4" />
              Novo Paciente
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="mr-2 h-4 w-4" />
              Agendar Consulta
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <TestTube className="mr-2 h-4 w-4" />
              Solicitar Exame
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Pill className="mr-2 h-4 w-4" />
              Prescrever Medicamento
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FileText className="mr-2 h-4 w-4" />
              Gerar Relatório
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Bell className="mr-2 h-4 w-4" />
              Enviar Lembrete
            </Button>
          </div>

          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  ),
};

export const AppointmentForm: Story = {
  render: () => {
    const [patientName, setPatientName] = useState('');
    const [appointmentDate, setAppointmentDate] = useState('');
    const [appointmentTime, setAppointmentTime] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [notes, setNotes] = useState('');

    return (
      <Drawer>
        <DrawerTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova Consulta
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-md">
            <DrawerHeader>
              <DrawerTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Agendar Nova Consulta
              </DrawerTitle>
              <DrawerDescription>
                Preencha os dados para agendar uma nova consulta médica.
              </DrawerDescription>
            </DrawerHeader>

            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="patient">Nome do Paciente</Label>
                <Input
                  id="patient"
                  placeholder="Digite o nome do paciente"
                  value={patientName}
                  onChange={e => setPatientName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Data</Label>
                  <Input
                    id="date"
                    type="date"
                    value={appointmentDate}
                    onChange={e => setAppointmentDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Horário</Label>
                  <Input
                    id="time"
                    type="time"
                    value={appointmentTime}
                    onChange={e => setAppointmentTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialty">Especialidade</Label>
                <Input
                  id="specialty"
                  placeholder="Ex: Cardiologia, Dermatologia..."
                  value={specialty}
                  onChange={e => setSpecialty(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  placeholder="Observações adicionais (opcional)"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
            </div>

            <DrawerFooter>
              <Button className="w-full">
                <Save className="mr-2 h-4 w-4" />
                Agendar Consulta
              </Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    );
  },
};

export const MedicalHistory: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">
          <BookOpen className="mr-2 h-4 w-4" />
          Histórico Médico
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-2xl">
          <DrawerHeader>
            <DrawerTitle className="flex items-center gap-2">
              <Clipboard className="h-5 w-5" />
              Histórico Médico - João Silva Santos
            </DrawerTitle>
            <DrawerDescription>
              Histórico completo de consultas, exames e tratamentos.
            </DrawerDescription>
          </DrawerHeader>

          <ScrollArea className="h-80 px-4">
            <div className="space-y-4">
              {/* Consulta Recente */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Stethoscope className="h-4 w-4" />
                      Consulta Cardiológica
                    </CardTitle>
                    <Badge className="bg-blue-100 text-blue-800">
                      22/11/2024
                    </Badge>
                  </div>
                  <CardDescription>
                    Dr. Carlos Mendes - CRM 12345
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Paciente apresentou melhora significativa nos sintomas.
                    Pressão arterial controlada. Manter medicação atual.
                  </p>
                  <div className="mt-2 flex gap-2">
                    <Badge variant="outline">Hipertensão</Badge>
                    <Badge variant="outline">Controlada</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Exame de Sangue */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TestTube className="h-4 w-4" />
                      Hemograma Completo
                    </CardTitle>
                    <Badge className="bg-green-100 text-green-800">
                      20/11/2024
                    </Badge>
                  </div>
                  <CardDescription>Laboratório Central</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Hemoglobina: 14.2 g/dL</div>
                    <div>Hematócrito: 42.1%</div>
                    <div>Leucócitos: 7.200/mm³</div>
                    <div>Plaquetas: 285.000/mm³</div>
                  </div>
                  <div className="mt-2">
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Resultados Normais
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Prescrição */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Pill className="h-4 w-4" />
                      Prescrição Médica
                    </CardTitle>
                    <Badge className="bg-purple-100 text-purple-800">
                      18/11/2024
                    </Badge>
                  </div>
                  <CardDescription>Dr. Carlos Mendes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Losartana 50mg</span>
                      <span className="text-muted-foreground">1x ao dia</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Hidroclorotiazida 25mg</span>
                      <span className="text-muted-foreground">1x ao dia</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ácido Acetilsalicílico 100mg</span>
                      <span className="text-muted-foreground">1x ao dia</span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <Badge variant="outline">Uso Contínuo</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Exame de Imagem */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileImage className="h-4 w-4" />
                      Ecocardiograma
                    </CardTitle>
                    <Badge className="bg-orange-100 text-orange-800">
                      15/11/2024
                    </Badge>
                  </div>
                  <CardDescription>
                    Centro de Diagnóstico por Imagem
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Função ventricular preservada. Fração de ejeção: 65%. Sem
                    alterações estruturais significativas.
                  </p>
                  <div className="mt-2">
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Normal
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>

          <DrawerFooter>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                Exportar PDF
              </Button>
              <Button variant="outline" className="flex-1">
                <Printer className="mr-2 h-4 w-4" />
                Imprimir
              </Button>
            </div>
            <DrawerClose asChild>
              <Button variant="outline">Fechar</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  ),
};
