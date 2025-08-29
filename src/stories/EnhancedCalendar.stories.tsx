import { Meta, StoryObj } from '@storybook/react-vite';
import { EnhancedCalendar } from '@/components/ui/enhanced-calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  Activity,
  Heart,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Pill,
  TestTube,
  FileText,
} from 'lucide-react';
import { useState } from 'react';
import { addDays, subDays, isWeekend, isBefore, isAfter } from 'date-fns';

const meta: Meta<typeof EnhancedCalendar> = {
  title: 'UI/EnhancedCalendar',
  component: EnhancedCalendar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Componente EnhancedCalendar com funcionalidades avançadas para seleção de datas no MedAssist Pro. Inclui digitação direta, seletores de ano/mês e validações médicas.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    showOutsideDays: {
      control: 'boolean',
      description: 'Mostrar dias de outros meses',
    },
    onDateChange: {
      action: 'dateChanged',
      description: 'Callback executado quando a data é alterada',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Calendário básico
export const Default: Story = {
  render: () => {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
      new Date()
    );

    return (
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Calendário Avançado
          </CardTitle>
          <CardDescription>
            Selecione uma data usando digitação direta ou navegação visual
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EnhancedCalendar
            value={selectedDate}
            onDateChange={setSelectedDate}
          />
          {selectedDate && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium">Data selecionada:</p>
              <p className="text-sm text-muted-foreground">
                {selectedDate.toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  },
};

// Agendamento de consultas
export const AppointmentScheduling: Story = {
  render: () => {
    const [appointmentDate, setAppointmentDate] = useState<Date | undefined>();
    const today = new Date();

    // Desabilitar fins de semana e datas passadas
    const isDateDisabled = (date: Date) => {
      return isBefore(date, today) || isWeekend(date);
    };

    return (
      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5" />
            Agendamento de Consulta
          </CardTitle>
          <CardDescription>
            Selecione uma data para agendar sua consulta (apenas dias úteis)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <EnhancedCalendar
            value={appointmentDate}
            onDateChange={setAppointmentDate}
            disabled={isDateDisabled}
          />

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Dias úteis disponíveis
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <XCircle className="h-3 w-3" />
              Fins de semana bloqueados
            </Badge>
          </div>

          {appointmentDate && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800">
                  Data disponível
                </span>
              </div>
              <p className="text-sm text-green-700">
                Consulta agendada para{' '}
                {appointmentDate.toLocaleDateString('pt-BR')}
              </p>
              <Button className="mt-3 w-full" size="sm">
                Confirmar Agendamento
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  },
};

// Seleção de data de nascimento
export const BirthDateSelection: Story = {
  render: () => {
    const [birthDate, setBirthDate] = useState<Date | undefined>();
    const today = new Date();
    const maxDate = subDays(today, 365); // Pelo menos 1 ano atrás

    // Desabilitar datas futuras e muito recentes
    const isDateDisabled = (date: Date) => {
      return isAfter(date, maxDate);
    };

    const calculateAge = (birth: Date) => {
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birth.getDate())
      ) {
        age--;
      }

      return age;
    };

    return (
      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Data de Nascimento
          </CardTitle>
          <CardDescription>
            Selecione a data de nascimento do paciente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <EnhancedCalendar
            value={birthDate}
            onDateChange={setBirthDate}
            disabled={isDateDisabled}
          />

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Datas válidas
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <XCircle className="h-3 w-3" />
              Datas futuras bloqueadas
            </Badge>
          </div>

          {birthDate && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-800">
                  Informações do Paciente
                </span>
              </div>
              <div className="space-y-1 text-sm text-blue-700">
                <p>
                  Data de nascimento: {birthDate.toLocaleDateString('pt-BR')}
                </p>
                <p>Idade: {calculateAge(birthDate)} anos</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  },
};

// Agendamento de exames
export const ExamScheduling: Story = {
  render: () => {
    const [examDate, setExamDate] = useState<Date | undefined>();
    const today = new Date();
    const minDate = addDays(today, 1); // Pelo menos 1 dia de antecedência
    const maxDate = addDays(today, 90); // Máximo 90 dias no futuro

    // Desabilitar datas inválidas para exames
    const isDateDisabled = (date: Date) => {
      return (
        isBefore(date, minDate) || isAfter(date, maxDate) || isWeekend(date)
      );
    };

    return (
      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Agendamento de Exame
          </CardTitle>
          <CardDescription>
            Selecione uma data para realizar o exame laboratorial
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <EnhancedCalendar
            value={examDate}
            onDateChange={setExamDate}
            disabled={isDateDisabled}
          />

          <div className="grid grid-cols-2 gap-2">
            <Badge
              variant="outline"
              className="flex items-center gap-1 justify-center"
            >
              <CheckCircle className="h-3 w-3" />
              Disponível
            </Badge>
            <Badge
              variant="secondary"
              className="flex items-center gap-1 justify-center"
            >
              <XCircle className="h-3 w-3" />
              Indisponível
            </Badge>
            <Badge
              variant="outline"
              className="flex items-center gap-1 justify-center col-span-2"
            >
              <AlertTriangle className="h-3 w-3" />
              Prazo: 1 a 90 dias úteis
            </Badge>
          </div>

          {examDate && (
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TestTube className="h-4 w-4 text-purple-600" />
                <span className="font-medium text-purple-800">
                  Exame Agendado
                </span>
              </div>
              <div className="space-y-2 text-sm text-purple-700">
                <p>Data: {examDate.toLocaleDateString('pt-BR')}</p>
                <p>Tipo: Exames laboratoriais completos</p>
                <p>Jejum: 12 horas obrigatório</p>
              </div>
              <Button className="mt-3 w-full" size="sm" variant="outline">
                Confirmar Agendamento
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  },
};

// Histórico médico com data
export const MedicalHistoryDate: Story = {
  render: () => {
    const [historyDate, setHistoryDate] = useState<Date | undefined>();
    const today = new Date();

    // Permitir apenas datas passadas para histórico médico
    const isDateDisabled = (date: Date) => {
      return isAfter(date, today);
    };

    return (
      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Data do Evento Médico
          </CardTitle>
          <CardDescription>
            Registre quando ocorreu o evento médico ou diagnóstico
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <EnhancedCalendar
            value={historyDate}
            onDateChange={setHistoryDate}
            disabled={isDateDisabled}
          />

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Datas passadas válidas
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <XCircle className="h-3 w-3" />
              Datas futuras bloqueadas
            </Badge>
          </div>

          {historyDate && (
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-orange-600" />
                <span className="font-medium text-orange-800">
                  Evento Registrado
                </span>
              </div>
              <div className="space-y-2 text-sm text-orange-700">
                <p>Data do evento: {historyDate.toLocaleDateString('pt-BR')}</p>
                <p>Tipo: Diagnóstico médico</p>
                <p>Status: Aguardando detalhes</p>
              </div>
              <Button className="mt-3 w-full" size="sm" variant="outline">
                Adicionar Detalhes
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  },
};

// Calendário compacto
export const Compact: Story = {
  render: () => {
    const [compactDate, setCompactDate] = useState<Date | undefined>();

    return (
      <Card className="w-[350px]">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Seleção Rápida
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EnhancedCalendar
            value={compactDate}
            onDateChange={setCompactDate}
            className="scale-90 origin-top"
          />
          {compactDate && (
            <div className="mt-2 p-2 bg-muted rounded text-center">
              <p className="text-xs font-medium">
                {compactDate.toLocaleDateString('pt-BR')}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  },
};
