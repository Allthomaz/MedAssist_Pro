import { Meta, StoryObj } from '@storybook/react-vite';
import {
  VirtualizedList,
  AutoHeightVirtualizedList,
} from '@/components/ui/VirtualizedList';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Calendar,
  Clock,
  Phone,
  Stethoscope,
  TestTube,
  Eye,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { useRef } from 'react';

const meta: Meta<typeof VirtualizedList> = {
  title: 'UI/VirtualizedList',
  component: VirtualizedList,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Componente VirtualizedList para renderização otimizada de listas grandes no MedAssist Pro. Usa react-window para renderizar apenas os itens visíveis.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    itemHeight: {
      control: 'number',
      description: 'Altura de cada item em pixels',
    },
    height: {
      control: 'number',
      description: 'Altura total da lista em pixels',
    },
    overscanCount: {
      control: 'number',
      description: 'Número de itens extras para renderizar fora da viewport',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Dados de exemplo para pacientes
const generatePatients = (count: number) => {
  const names = [
    'Ana Silva',
    'João Santos',
    'Maria Oliveira',
    'Pedro Costa',
    'Carla Souza',
    'Lucas Pereira',
    'Fernanda Lima',
    'Rafael Alves',
    'Juliana Rocha',
    'Bruno Martins',
    'Camila Ferreira',
    'Diego Ribeiro',
    'Patrícia Gomes',
    'Rodrigo Barbosa',
    'Letícia Cardoso',
    'Gustavo Nascimento',
    'Vanessa Araújo',
    'Thiago Correia',
    'Priscila Dias',
    'Marcelo Teixeira',
  ];

  const conditions = [
    'Hipertensão',
    'Diabetes',
    'Asma',
    'Artrite',
    'Enxaqueca',
    'Gastrite',
    'Ansiedade',
    'Insônia',
    'Alergia',
    'Bronquite',
  ];

  const statuses = [
    { label: 'Ativo', variant: 'default' as const },
    { label: 'Em Tratamento', variant: 'secondary' as const },
    { label: 'Recuperado', variant: 'outline' as const },
    { label: 'Crítico', variant: 'destructive' as const },
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `patient-${i + 1}`,
    name: names[i % names.length],
    age: 20 + (i % 60),
    condition: conditions[i % conditions.length],
    status: statuses[i % statuses.length],
    phone: `(11) 9${String(i).padStart(4, '0')}-${String(i + 1000).slice(-4)}`,
    email: `${names[i % names.length].toLowerCase().replace(' ', '.')}@email.com`,
    lastVisit: new Date(
      Date.now() - i * 24 * 60 * 60 * 1000
    ).toLocaleDateString('pt-BR'),
  }));
};

// Dados de exemplo para consultas
const generateAppointments = (count: number) => {
  const types = [
    'Consulta Geral',
    'Cardiologia',
    'Dermatologia',
    'Neurologia',
    'Ortopedia',
    'Pediatria',
    'Ginecologia',
    'Oftalmologia',
    'Psiquiatria',
    'Endocrinologia',
  ];

  const doctors = [
    'Dr. Carlos Silva',
    'Dra. Ana Costa',
    'Dr. Pedro Santos',
    'Dra. Maria Lima',
    'Dr. João Oliveira',
    'Dra. Carla Pereira',
    'Dr. Lucas Alves',
    'Dra. Fernanda Rocha',
  ];

  const statuses = [
    { label: 'Agendado', variant: 'default' as const },
    { label: 'Confirmado', variant: 'secondary' as const },
    { label: 'Em Andamento', variant: 'outline' as const },
    { label: 'Concluído', variant: 'destructive' as const },
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `appointment-${i + 1}`,
    patient: `Paciente ${i + 1}`,
    doctor: doctors[i % doctors.length],
    type: types[i % types.length],
    date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString(
      'pt-BR'
    ),
    time: `${8 + (i % 10)}:${(i % 4) * 15 || '00'}`,
    status: statuses[i % statuses.length],
    duration: '30 min',
  }));
};

// Dados de exemplo para exames
const generateExams = (count: number) => {
  const types = [
    'Hemograma Completo',
    'Raio-X Tórax',
    'Ultrassom Abdominal',
    'Eletrocardiograma',
    'Ressonância Magnética',
    'Tomografia Computadorizada',
    'Ecocardiograma',
    'Colonoscopia',
    'Mamografia',
    'Densitometria Óssea',
  ];

  const results = [
    { label: 'Normal', variant: 'default' as const, icon: CheckCircle },
    { label: 'Alterado', variant: 'secondary' as const, icon: AlertTriangle },
    { label: 'Crítico', variant: 'destructive' as const, icon: XCircle },
    { label: 'Pendente', variant: 'outline' as const, icon: Clock },
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `exam-${i + 1}`,
    patient: `Paciente ${i + 1}`,
    type: types[i % types.length],
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString(
      'pt-BR'
    ),
    result: results[i % results.length],
    doctor: `Dr. Médico ${(i % 5) + 1}`,
    priority: i % 3 === 0 ? 'Alta' : i % 3 === 1 ? 'Média' : 'Baixa',
  }));
};

export const PatientsList: Story = {
  render: () => {
    const patients = generatePatients(1000);

    const renderPatientItem = ({
      index,
      style,
      data,
    }: {
      index: number;
      style: React.CSSProperties;
      data: typeof patients;
    }) => {
      const patient = data[index];

      return (
        <div style={style} className="p-2">
          <Card className="h-full">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {patient.name
                        .split(' ')
                        .map(n => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{patient.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {patient.age} anos • {patient.condition}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={patient.status.variant}>
                    {patient.status.label}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {patient.phone}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Última visita: {patient.lastVisit}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    };

    return (
      <div className="w-[600px]">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">
            Lista de Pacientes (1.000 itens)
          </h3>
          <p className="text-sm text-muted-foreground">
            Lista virtualizada para performance otimizada
          </p>
        </div>
        <VirtualizedList
          items={patients}
          itemHeight={120}
          height={400}
          renderItem={renderPatientItem}
          className="border rounded-lg"
          overscanCount={5}
        />
      </div>
    );
  },
};

export const AppointmentsList: Story = {
  render: () => {
    const appointments = generateAppointments(500);

    const renderAppointmentItem = ({
      index,
      style,
      data,
    }: {
      index: number;
      style: React.CSSProperties;
      data: typeof appointments;
    }) => {
      const appointment = data[index];

      return (
        <div style={style} className="p-2">
          <Card className="h-full">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Stethoscope className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">{appointment.type}</h4>
                    <p className="text-sm text-muted-foreground">
                      {appointment.patient} • {appointment.doctor}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={appointment.status.variant}>
                    {appointment.status.label}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    {appointment.duration}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {appointment.date}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {appointment.time}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    };

    return (
      <div className="w-[600px]">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">
            Lista de Consultas (500 itens)
          </h3>
          <p className="text-sm text-muted-foreground">
            Agendamentos com renderização otimizada
          </p>
        </div>
        <VirtualizedList
          items={appointments}
          itemHeight={110}
          height={400}
          renderItem={renderAppointmentItem}
          className="border rounded-lg"
          overscanCount={3}
        />
      </div>
    );
  },
};

export const ExamsList: Story = {
  render: () => {
    const exams = generateExams(750);

    const renderExamItem = ({
      index,
      style,
      data,
    }: {
      index: number;
      style: React.CSSProperties;
      data: typeof exams;
    }) => {
      const exam = data[index];
      const ResultIcon = exam.result.icon;

      return (
        <div style={style} className="p-2">
          <Card className="h-full">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                    <TestTube className="h-5 w-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-medium">{exam.type}</h4>
                    <p className="text-sm text-muted-foreground">
                      {exam.patient} • {exam.doctor}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={exam.result.variant}
                    className="flex items-center gap-1"
                  >
                    <ResultIcon className="h-3 w-3" />
                    {exam.result.label}
                  </Badge>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {exam.date}
                </div>
                <div
                  className={`px-2 py-1 rounded text-xs ${
                    exam.priority === 'Alta'
                      ? 'bg-red-100 text-red-700'
                      : exam.priority === 'Média'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                  }`}
                >
                  {exam.priority}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    };

    return (
      <div className="w-[600px]">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Lista de Exames (750 itens)</h3>
          <p className="text-sm text-muted-foreground">
            Resultados de exames com status visual
          </p>
        </div>
        <VirtualizedList
          items={exams}
          itemHeight={100}
          height={400}
          renderItem={renderExamItem}
          className="border rounded-lg"
          overscanCount={4}
        />
      </div>
    );
  },
};

export const AutoHeightList: Story = {
  render: () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const patients = generatePatients(200);

    const renderPatientItem = ({
      index,
      style,
      data,
    }: {
      index: number;
      style: React.CSSProperties;
      data: typeof patients;
    }) => {
      const patient = data[index];

      return (
        <div style={style} className="p-2">
          <Card className="h-full">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {patient.name
                      .split(' ')
                      .map(n => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">
                    {patient.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {patient.age} anos • {patient.condition}
                  </p>
                </div>
                <Badge variant={patient.status.variant} className="text-xs">
                  {patient.status.label}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    };

    return (
      <div className="w-[500px] h-[300px]" ref={containerRef}>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Lista com Altura Automática</h3>
          <p className="text-sm text-muted-foreground">
            Altura ajustada automaticamente ao container
          </p>
        </div>
        <AutoHeightVirtualizedList
          containerRef={containerRef}
          items={patients}
          itemHeight={80}
          renderItem={renderPatientItem}
          className="border rounded-lg"
          maxHeight={400}
          minHeight={150}
        />
      </div>
    );
  },
};

export const EmptyState: Story = {
  render: () => {
    const renderItem = () => <div />;

    return (
      <div className="w-[400px]">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Estado Vazio</h3>
          <p className="text-sm text-muted-foreground">
            Quando não há itens para exibir
          </p>
        </div>
        <VirtualizedList
          items={[]}
          itemHeight={80}
          height={200}
          renderItem={renderItem}
          className="border rounded-lg"
        />
      </div>
    );
  },
};

export const CompactList: Story = {
  render: () => {
    const items = Array.from({ length: 1000 }, (_, i) => ({
      id: i + 1,
      name: `Item ${i + 1}`,
      value: Math.floor(Math.random() * 100),
      status: ['Ativo', 'Inativo', 'Pendente'][i % 3],
    }));

    const renderItem = ({
      index,
      style,
      data,
    }: {
      index: number;
      style: React.CSSProperties;
      data: typeof items;
    }) => {
      const item = data[index];

      return (
        <div
          style={style}
          className="px-4 py-2 border-b flex items-center justify-between hover:bg-muted/50"
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
              {item.id}
            </div>
            <span className="font-medium">{item.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{item.value}%</span>
            <Badge
              variant={item.status === 'Ativo' ? 'default' : 'secondary'}
              className="text-xs"
            >
              {item.status}
            </Badge>
          </div>
        </div>
      );
    };

    return (
      <div className="w-[400px]">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">
            Lista Compacta (1.000 itens)
          </h3>
          <p className="text-sm text-muted-foreground">
            Layout compacto para máxima densidade de informação
          </p>
        </div>
        <VirtualizedList
          items={items}
          itemHeight={50}
          height={300}
          renderItem={renderItem}
          className="border rounded-lg overflow-hidden"
          overscanCount={10}
        />
      </div>
    );
  },
};
