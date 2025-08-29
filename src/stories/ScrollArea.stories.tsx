import type { Meta, StoryObj } from '@storybook/react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
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
import { Separator } from '@/components/ui/separator';
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
  Pill,
  TestTube,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Brain,
  Stethoscope,
  Zap,
  Weight,
  Ruler,
  Star,
  MessageSquare,
  Send,
  MoreHorizontal,
  ChevronRight,
  Info,
  Shield,
  Target,
  TrendingUp,
  Award,
} from 'lucide-react';

const meta = {
  title: 'UI/ScrollArea',
  component: ScrollArea,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Componente ScrollArea para criar áreas de conteúdo com scroll customizado no MedAssist Pro.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Classes CSS adicionais',
    },
  },
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

// ScrollArea básico
export const Default: Story = {
  render: () => (
    <ScrollArea className="h-72 w-48 rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">
          Lista de Pacientes
        </h4>
        {Array.from({ length: 50 }).map((_, i) => (
          <div key={i} className="text-sm">
            Paciente {i + 1}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

// Lista de pacientes
export const PatientList: Story = {
  render: () => {
    const patients = [
      {
        id: 1,
        name: 'Ana Silva',
        age: 45,
        condition: 'Hipertensão',
        priority: 'high',
        lastVisit: '2024-01-15',
      },
      {
        id: 2,
        name: 'João Santos',
        age: 32,
        condition: 'Diabetes',
        priority: 'medium',
        lastVisit: '2024-01-14',
      },
      {
        id: 3,
        name: 'Maria Oliveira',
        age: 67,
        condition: 'Artrite',
        priority: 'low',
        lastVisit: '2024-01-13',
      },
      {
        id: 4,
        name: 'Pedro Costa',
        age: 28,
        condition: 'Asma',
        priority: 'medium',
        lastVisit: '2024-01-12',
      },
      {
        id: 5,
        name: 'Carla Ferreira',
        age: 54,
        condition: 'Colesterol Alto',
        priority: 'low',
        lastVisit: '2024-01-11',
      },
      {
        id: 6,
        name: 'Roberto Lima',
        age: 41,
        condition: 'Gastrite',
        priority: 'medium',
        lastVisit: '2024-01-10',
      },
      {
        id: 7,
        name: 'Lucia Mendes',
        age: 39,
        condition: 'Enxaqueca',
        priority: 'high',
        lastVisit: '2024-01-09',
      },
      {
        id: 8,
        name: 'Carlos Rocha',
        age: 58,
        condition: 'Artrose',
        priority: 'medium',
        lastVisit: '2024-01-08',
      },
      {
        id: 9,
        name: 'Fernanda Alves',
        age: 33,
        condition: 'Ansiedade',
        priority: 'low',
        lastVisit: '2024-01-07',
      },
      {
        id: 10,
        name: 'Ricardo Souza',
        age: 46,
        condition: 'Insônia',
        priority: 'medium',
        lastVisit: '2024-01-06',
      },
      {
        id: 11,
        name: 'Juliana Barbosa',
        age: 29,
        condition: 'Alergia',
        priority: 'low',
        lastVisit: '2024-01-05',
      },
      {
        id: 12,
        name: 'Marcos Pereira',
        age: 52,
        condition: 'Bronquite',
        priority: 'high',
        lastVisit: '2024-01-04',
      },
    ];

    return (
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Lista de Pacientes
          </CardTitle>
          <CardDescription>Pacientes agendados para hoje</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-80 w-full rounded-md border p-4">
            <div className="space-y-3">
              {patients.map(patient => (
                <div
                  key={patient.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {patient.name
                          .split(' ')
                          .map(n => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{patient.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {patient.age} anos • {patient.condition}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        patient.priority === 'high'
                          ? 'destructive'
                          : patient.priority === 'medium'
                            ? 'default'
                            : 'secondary'
                      }
                      className="text-xs"
                    >
                      {patient.priority === 'high'
                        ? 'Alta'
                        : patient.priority === 'medium'
                          ? 'Média'
                          : 'Baixa'}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    );
  },
};

// Histórico médico
export const MedicalHistory: Story = {
  render: () => {
    const historyEntries = [
      {
        date: '2024-01-15',
        type: 'Consulta',
        doctor: 'Dr. Silva',
        description: 'Consulta de rotina - Pressão arterial controlada',
        status: 'completed',
      },
      {
        date: '2024-01-10',
        type: 'Exame',
        doctor: 'Lab. Central',
        description: 'Hemograma completo - Resultados normais',
        status: 'completed',
      },
      {
        date: '2024-01-05',
        type: 'Medicação',
        doctor: 'Dr. Silva',
        description: 'Prescrição de Losartana 50mg - 1x ao dia',
        status: 'active',
      },
      {
        date: '2023-12-20',
        type: 'Consulta',
        doctor: 'Dr. Santos',
        description: 'Consulta cardiológica - ECG normal',
        status: 'completed',
      },
      {
        date: '2023-12-15',
        type: 'Exame',
        doctor: 'Clínica Imagem',
        description: 'Ecocardiograma - Função cardíaca preservada',
        status: 'completed',
      },
      {
        date: '2023-12-01',
        type: 'Consulta',
        doctor: 'Dr. Silva',
        description: 'Ajuste de medicação - Redução da dose',
        status: 'completed',
      },
      {
        date: '2023-11-20',
        type: 'Exame',
        doctor: 'Lab. Central',
        description: 'Perfil lipídico - Colesterol elevado',
        status: 'completed',
      },
      {
        date: '2023-11-10',
        type: 'Consulta',
        doctor: 'Dr. Silva',
        description: 'Consulta de acompanhamento - Orientações dietéticas',
        status: 'completed',
      },
    ];

    return (
      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Histórico Médico
          </CardTitle>
          <CardDescription>
            Histórico completo do paciente Ana Silva
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96 w-full rounded-md border">
            <div className="p-4 space-y-4">
              {historyEntries.map((entry, index) => (
                <div key={index} className="flex gap-4 pb-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        entry.type === 'Consulta'
                          ? 'bg-blue-500'
                          : entry.type === 'Exame'
                            ? 'bg-green-500'
                            : 'bg-purple-500'
                      }`}
                    />
                    {index < historyEntries.length - 1 && (
                      <div className="w-px h-16 bg-gray-200 mt-2" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {entry.type}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {entry.date}
                        </span>
                      </div>
                      <Badge
                        variant={
                          entry.status === 'active' ? 'default' : 'secondary'
                        }
                        className="text-xs"
                      >
                        {entry.status === 'active' ? 'Ativo' : 'Concluído'}
                      </Badge>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{entry.doctor}</p>
                      <p className="text-sm text-muted-foreground">
                        {entry.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    );
  },
};

// Lista de medicamentos
export const MedicationList: Story = {
  render: () => {
    const medications = [
      {
        name: 'Losartana',
        dosage: '50mg',
        frequency: '1x ao dia',
        time: '08:00',
        status: 'active',
        sideEffects: 'Tontura leve',
      },
      {
        name: 'Metformina',
        dosage: '850mg',
        frequency: '2x ao dia',
        time: '08:00, 20:00',
        status: 'active',
        sideEffects: 'Náusea ocasional',
      },
      {
        name: 'Sinvastatina',
        dosage: '20mg',
        frequency: '1x ao dia',
        time: '22:00',
        status: 'active',
        sideEffects: 'Nenhum relatado',
      },
      {
        name: 'Omeprazol',
        dosage: '20mg',
        frequency: '1x ao dia',
        time: '07:00',
        status: 'active',
        sideEffects: 'Nenhum relatado',
      },
      {
        name: 'Ácido Acetilsalicílico',
        dosage: '100mg',
        frequency: '1x ao dia',
        time: '08:00',
        status: 'active',
        sideEffects: 'Irritação gástrica leve',
      },
      {
        name: 'Vitamina D3',
        dosage: '2000 UI',
        frequency: '1x ao dia',
        time: '08:00',
        status: 'active',
        sideEffects: 'Nenhum relatado',
      },
      {
        name: 'Captopril',
        dosage: '25mg',
        frequency: '2x ao dia',
        time: '08:00, 20:00',
        status: 'discontinued',
        sideEffects: 'Tosse seca',
      },
    ];

    return (
      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5" />
            Medicamentos Atuais
          </CardTitle>
          <CardDescription>
            Lista completa de medicamentos prescritos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-80 w-full rounded-md border">
            <div className="p-4 space-y-3">
              {medications.map((med, index) => (
                <div
                  key={index}
                  className={`p-3 border rounded-lg ${
                    med.status === 'discontinued'
                      ? 'opacity-60 bg-gray-50'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-sm">{med.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {med.dosage} • {med.frequency}
                      </p>
                    </div>
                    <Badge
                      variant={
                        med.status === 'active' ? 'default' : 'secondary'
                      }
                      className="text-xs"
                    >
                      {med.status === 'active' ? 'Ativo' : 'Descontinuado'}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <Clock className="h-3 w-3" />
                      <span>{med.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <AlertTriangle className="h-3 w-3" />
                      <span className="text-muted-foreground">
                        {med.sideEffects}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    );
  },
};

// Resultados de exames
export const ExamResults: Story = {
  render: () => {
    const examResults = [
      {
        exam: 'Hemograma Completo',
        date: '2024-01-15',
        status: 'normal',
        results: [
          {
            parameter: 'Hemoglobina',
            value: '14.2 g/dL',
            reference: '12.0-15.5',
            status: 'normal',
          },
          {
            parameter: 'Hematócrito',
            value: '42.1%',
            reference: '36.0-46.0',
            status: 'normal',
          },
          {
            parameter: 'Leucócitos',
            value: '7.200/mm³',
            reference: '4.000-11.000',
            status: 'normal',
          },
          {
            parameter: 'Plaquetas',
            value: '285.000/mm³',
            reference: '150.000-450.000',
            status: 'normal',
          },
        ],
      },
      {
        exam: 'Perfil Lipídico',
        date: '2024-01-10',
        status: 'altered',
        results: [
          {
            parameter: 'Colesterol Total',
            value: '220 mg/dL',
            reference: '<200',
            status: 'high',
          },
          {
            parameter: 'HDL',
            value: '45 mg/dL',
            reference: '>40',
            status: 'normal',
          },
          {
            parameter: 'LDL',
            value: '145 mg/dL',
            reference: '<100',
            status: 'high',
          },
          {
            parameter: 'Triglicerídeos',
            value: '150 mg/dL',
            reference: '<150',
            status: 'normal',
          },
        ],
      },
      {
        exam: 'Glicemia de Jejum',
        date: '2024-01-05',
        status: 'normal',
        results: [
          {
            parameter: 'Glicose',
            value: '95 mg/dL',
            reference: '70-99',
            status: 'normal',
          },
        ],
      },
    ];

    return (
      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Resultados de Exames
          </CardTitle>
          <CardDescription>Últimos resultados laboratoriais</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96 w-full rounded-md border">
            <div className="p-4 space-y-4">
              {examResults.map((exam, examIndex) => (
                <div key={examIndex} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-sm">{exam.exam}</h4>
                      <p className="text-xs text-muted-foreground">
                        {exam.date}
                      </p>
                    </div>
                    <Badge
                      variant={
                        exam.status === 'normal' ? 'secondary' : 'destructive'
                      }
                      className="text-xs"
                    >
                      {exam.status === 'normal' ? 'Normal' : 'Alterado'}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    {exam.results.map((result, resultIndex) => (
                      <div
                        key={resultIndex}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {result.parameter}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Ref: {result.reference}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {result.value}
                          </span>
                          {result.status === 'normal' ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {examIndex < examResults.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    );
  },
};

// Chat de mensagens
export const MessageChat: Story = {
  render: () => {
    const messages = [
      {
        id: 1,
        sender: 'Dr. Silva',
        message: 'Bom dia! Como está se sentindo hoje?',
        time: '09:00',
        type: 'received',
      },
      {
        id: 2,
        sender: 'Você',
        message: 'Bom dia, doutor! Estou me sentindo bem melhor.',
        time: '09:05',
        type: 'sent',
      },
      {
        id: 3,
        sender: 'Dr. Silva',
        message: 'Ótimo! E a pressão arterial, tem medido regularmente?',
        time: '09:06',
        type: 'received',
      },
      {
        id: 4,
        sender: 'Você',
        message: 'Sim, tenho medido todos os dias. Está em torno de 130/80.',
        time: '09:10',
        type: 'sent',
      },
      {
        id: 5,
        sender: 'Dr. Silva',
        message:
          'Perfeito! Continue com a medicação atual. Vamos agendar um retorno em 30 dias.',
        time: '09:12',
        type: 'received',
      },
      {
        id: 6,
        sender: 'Você',
        message: 'Certo, doutor. Posso agendar para o mesmo horário?',
        time: '09:15',
        type: 'sent',
      },
      {
        id: 7,
        sender: 'Dr. Silva',
        message: 'Claro! Vou pedir para a secretária entrar em contato.',
        time: '09:16',
        type: 'received',
      },
      {
        id: 8,
        sender: 'Você',
        message: 'Obrigada, doutor!',
        time: '09:18',
        type: 'sent',
      },
    ];

    return (
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Chat com Dr. Silva
          </CardTitle>
          <CardDescription>
            Conversa sobre acompanhamento médico
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-80 w-full rounded-md border">
            <div className="p-4 space-y-3">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.type === 'sent' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === 'sent'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.message}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.type === 'sent'
                          ? 'text-blue-100'
                          : 'text-gray-500'
                      }`}
                    >
                      {message.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              placeholder="Digite sua mensagem..."
              className="flex-1 px-3 py-2 border rounded-md text-sm"
            />
            <Button size="sm">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  },
};

// ScrollArea horizontal
export const HorizontalScroll: Story = {
  render: () => {
    const vitals = [
      {
        label: 'Pressão Arterial',
        value: '130/80 mmHg',
        icon: Heart,
        color: 'text-red-500',
      },
      {
        label: 'Frequência Cardíaca',
        value: '72 bpm',
        icon: Activity,
        color: 'text-blue-500',
      },
      {
        label: 'Temperatura',
        value: '36.5°C',
        icon: Thermometer,
        color: 'text-orange-500',
      },
      {
        label: 'Saturação O2',
        value: '98%',
        icon: Droplets,
        color: 'text-cyan-500',
      },
      {
        label: 'Peso',
        value: '70.2 kg',
        icon: Weight,
        color: 'text-purple-500',
      },
      {
        label: 'Altura',
        value: '1.65 m',
        icon: Ruler,
        color: 'text-green-500',
      },
      { label: 'IMC', value: '25.8', icon: Target, color: 'text-yellow-500' },
      {
        label: 'Glicemia',
        value: '95 mg/dL',
        icon: TestTube,
        color: 'text-pink-500',
      },
    ];

    return (
      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5" />
            Sinais Vitais
          </CardTitle>
          <CardDescription>Últimas medições registradas</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full whitespace-nowrap rounded-md border">
            <div className="flex w-max space-x-4 p-4">
              {vitals.map((vital, index) => {
                const IconComponent = vital.icon;
                return (
                  <div
                    key={index}
                    className="flex flex-col items-center p-4 border rounded-lg min-w-[120px]"
                  >
                    <IconComponent className={`h-8 w-8 mb-2 ${vital.color}`} />
                    <p className="text-sm font-medium text-center">
                      {vital.label}
                    </p>
                    <p className="text-lg font-bold text-center">
                      {vital.value}
                    </p>
                  </div>
                );
              })}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
      </Card>
    );
  },
};

// ScrollArea simples
export const Simple: Story = {
  render: () => (
    <ScrollArea className="h-[200px] w-[350px] rounded-md border p-4">
      <div className="space-y-2">
        <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
        {Array.from({ length: 50 }).map((_, i) => (
          <div key={i} className="text-sm">
            Tag {i + 1}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};
