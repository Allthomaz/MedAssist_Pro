import { Meta, StoryObj } from '@storybook/react-vite';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  CalendarDays,
  Clock,
  User,
  Stethoscope,
  Activity,
  AlertCircle,
  CheckCircle,
  XCircle,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar as CalendarIcon,
  Users,
  MapPin,
  Phone,
  Mail,
  Star,
  Heart,
  Pill,
  Microscope,
  FileText,
  Bell,
  Settings,
  Filter,
  Search,
  Download,
  Upload,
  Share,
  Copy,
  MoreHorizontal,
} from 'lucide-react';
import { useState } from 'react';

const meta = {
  title: 'UI/Calendar',
  component: Calendar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Componente Calendar para seleção de datas e agendamentos no MedAssist Pro.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

// Calendar básico
export const Default: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());

    return (
      <div className="space-y-4">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
        />
        {date && (
          <p className="text-sm text-muted-foreground text-center">
            Data selecionada: {date.toLocaleDateString('pt-BR')}
          </p>
        )}
      </div>
    );
  },
};

// Calendar com seleção múltipla
export const Multiple: Story = {
  render: () => {
    const [dates, setDates] = useState<Date[] | undefined>([]);

    return (
      <div className="space-y-4">
        <Calendar
          mode="multiple"
          selected={dates}
          onSelect={setDates}
          className="rounded-md border"
        />
        {dates && dates.length > 0 && (
          <div className="text-sm text-muted-foreground text-center">
            <p>Datas selecionadas: {dates.length}</p>
            <div className="flex flex-wrap gap-1 justify-center mt-2">
              {dates.map((date, index) => (
                <Badge key={index} variant="outline">
                  {date.toLocaleDateString('pt-BR')}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  },
};

// Calendar com range de datas
export const Range: Story = {
  render: () => {
    const [dateRange, setDateRange] = useState<{
      from: Date | undefined;
      to: Date | undefined;
    }>({ from: undefined, to: undefined });

    return (
      <div className="space-y-4">
        <Calendar
          mode="range"
          selected={dateRange}
          onSelect={setDateRange}
          className="rounded-md border"
        />
        {dateRange?.from && (
          <div className="text-sm text-muted-foreground text-center">
            <p>
              Período: {dateRange.from.toLocaleDateString('pt-BR')}
              {dateRange.to && ` - ${dateRange.to.toLocaleDateString('pt-BR')}`}
            </p>
          </div>
        )}
      </div>
    );
  },
};

// Calendar de agendamento médico
export const MedicalScheduling: Story = {
  render: () => {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
      new Date()
    );

    // Simulando dados de agendamentos
    const appointments = {
      '2024-08-15': [
        {
          time: '09:00',
          patient: 'João Silva',
          type: 'Consulta',
          status: 'confirmed',
        },
        {
          time: '10:30',
          patient: 'Maria Santos',
          type: 'Retorno',
          status: 'confirmed',
        },
        {
          time: '14:00',
          patient: 'Pedro Lima',
          type: 'Exame',
          status: 'pending',
        },
      ],
      '2024-08-16': [
        {
          time: '08:30',
          patient: 'Ana Costa',
          type: 'Consulta',
          status: 'confirmed',
        },
        {
          time: '15:00',
          patient: 'Carlos Rocha',
          type: 'Cirurgia',
          status: 'confirmed',
        },
      ],
    };

    const getDateKey = (date: Date) => {
      return date.toISOString().split('T')[0];
    };

    const hasAppointments = (date: Date) => {
      const dateKey = getDateKey(date);
      return appointments[dateKey as keyof typeof appointments]?.length > 0;
    };

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'confirmed':
          return 'bg-green-500';
        case 'pending':
          return 'bg-yellow-500';
        case 'cancelled':
          return 'bg-red-500';
        default:
          return 'bg-gray-500';
      }
    };

    return (
      <div className="flex gap-6">
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="font-semibold flex items-center gap-2 justify-center">
              <CalendarDays className="h-4 w-4" />
              Agenda Médica
            </h3>
            <p className="text-sm text-muted-foreground">
              Selecione uma data para ver os agendamentos
            </p>
          </div>

          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
            modifiers={{
              hasAppointments: date => hasAppointments(date),
            }}
            modifiersStyles={{
              hasAppointments: {
                backgroundColor: 'rgb(59 130 246 / 0.1)',
                border: '1px solid rgb(59 130 246)',
                borderRadius: '6px',
              },
            }}
          />

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-3 h-3 bg-blue-100 border border-blue-500 rounded"></div>
            <span>Dias com agendamentos</span>
          </div>
        </div>

        {selectedDate && (
          <Card className="w-80">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {selectedDate.toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </CardTitle>
              <CardDescription>Agendamentos do dia</CardDescription>
            </CardHeader>
            <CardContent>
              {(() => {
                const dateKey = getDateKey(selectedDate);
                const dayAppointments =
                  appointments[dateKey as keyof typeof appointments];

                if (!dayAppointments || dayAppointments.length === 0) {
                  return (
                    <div className="text-center py-8">
                      <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Nenhum agendamento para este dia
                      </p>
                      <Button className="mt-4" size="sm">
                        <Plus className="h-3 w-3 mr-1" />
                        Agendar Consulta
                      </Button>
                    </div>
                  );
                }

                return (
                  <div className="space-y-3">
                    {dayAppointments.map((appointment, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-center">
                            <p className="font-medium text-sm">
                              {appointment.time}
                            </p>
                            <div
                              className={`w-2 h-2 rounded-full ${getStatusColor(appointment.status)} mx-auto mt-1`}
                            ></div>
                          </div>
                          <div>
                            <p className="font-medium text-sm">
                              {appointment.patient}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {appointment.type}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    <Button className="w-full" variant="outline" size="sm">
                      <Plus className="h-3 w-3 mr-1" />
                      Novo Agendamento
                    </Button>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        )}
      </div>
    );
  },
};

// Calendar com disponibilidade de horários
export const AvailabilityCalendar: Story = {
  render: () => {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
      new Date()
    );

    // Simulando disponibilidade de horários
    const availability = {
      '2024-08-15': {
        morning: [
          '08:00',
          '08:30',
          '09:00',
          '09:30',
          '10:00',
          '10:30',
          '11:00',
          '11:30',
        ],
        afternoon: [
          '14:00',
          '14:30',
          '15:00',
          '15:30',
          '16:00',
          '16:30',
          '17:00',
          '17:30',
        ],
        occupied: ['09:00', '10:30', '14:00'],
      },
      '2024-08-16': {
        morning: [
          '08:00',
          '08:30',
          '09:00',
          '09:30',
          '10:00',
          '10:30',
          '11:00',
          '11:30',
        ],
        afternoon: [
          '14:00',
          '14:30',
          '15:00',
          '15:30',
          '16:00',
          '16:30',
          '17:00',
          '17:30',
        ],
        occupied: ['08:30', '15:00'],
      },
    };

    const getDateKey = (date: Date) => {
      return date.toISOString().split('T')[0];
    };

    const isAvailable = (date: Date) => {
      const dateKey = getDateKey(date);
      return availability[dateKey as keyof typeof availability] !== undefined;
    };

    const isWeekend = (date: Date) => {
      const day = date.getDay();
      return day === 0 || day === 6; // Sunday or Saturday
    };

    return (
      <div className="flex gap-6">
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="font-semibold flex items-center gap-2 justify-center">
              <Stethoscope className="h-4 w-4" />
              Disponibilidade Dr. Carlos Santos
            </h3>
            <p className="text-sm text-muted-foreground">Cardiologia</p>
          </div>

          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
            disabled={isWeekend}
            modifiers={{
              available: date => isAvailable(date) && !isWeekend(date),
              unavailable: date => !isAvailable(date) && !isWeekend(date),
            }}
            modifiersStyles={{
              available: {
                backgroundColor: 'rgb(34 197 94 / 0.1)',
                border: '1px solid rgb(34 197 94)',
                borderRadius: '6px',
              },
              unavailable: {
                backgroundColor: 'rgb(239 68 68 / 0.1)',
                border: '1px solid rgb(239 68 68)',
                borderRadius: '6px',
              },
            }}
          />

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-3 h-3 bg-green-100 border border-green-500 rounded"></div>
              <span>Disponível</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-3 h-3 bg-red-100 border border-red-500 rounded"></div>
              <span>Indisponível</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-3 h-3 bg-gray-200 rounded"></div>
              <span>Fins de semana</span>
            </div>
          </div>
        </div>

        {selectedDate && isAvailable(selectedDate) && (
          <Card className="w-80">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Horários Disponíveis
              </CardTitle>
              <CardDescription>
                {selectedDate.toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {(() => {
                const dateKey = getDateKey(selectedDate);
                const dayAvailability =
                  availability[dateKey as keyof typeof availability];

                if (!dayAvailability) {
                  return (
                    <div className="text-center py-8">
                      <XCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Nenhum horário disponível
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        Manhã
                      </h4>
                      <div className="grid grid-cols-3 gap-2">
                        {dayAvailability.morning.map(time => {
                          const isOccupied =
                            dayAvailability.occupied.includes(time);
                          return (
                            <Button
                              key={time}
                              variant={isOccupied ? 'outline' : 'default'}
                              size="sm"
                              disabled={isOccupied}
                              className={isOccupied ? 'opacity-50' : ''}
                            >
                              {time}
                            </Button>
                          );
                        })}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        Tarde
                      </h4>
                      <div className="grid grid-cols-3 gap-2">
                        {dayAvailability.afternoon.map(time => {
                          const isOccupied =
                            dayAvailability.occupied.includes(time);
                          return (
                            <Button
                              key={time}
                              variant={isOccupied ? 'outline' : 'default'}
                              size="sm"
                              disabled={isOccupied}
                              className={isOccupied ? 'opacity-50' : ''}
                            >
                              {time}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        )}
      </div>
    );
  },
};

// Calendar compacto
export const Compact: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());

    return (
      <div className="w-64">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border p-2"
          classNames={{
            months: 'flex flex-col space-y-2',
            month: 'space-y-2',
            caption: 'flex justify-center pt-1 relative items-center',
            caption_label: 'text-xs font-medium',
            nav_button:
              'h-5 w-5 bg-transparent p-0 opacity-50 hover:opacity-100',
            table: 'w-full border-collapse space-y-1',
            head_row: 'flex',
            head_cell:
              'text-muted-foreground rounded-md w-6 font-normal text-[0.7rem]',
            row: 'flex w-full mt-1',
            cell: 'h-6 w-6 text-center text-xs p-0 relative',
            day: 'h-6 w-6 p-0 font-normal text-xs',
          }}
        />
      </div>
    );
  },
};

// Calendar com eventos médicos
export const MedicalEvents: Story = {
  render: () => {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
      new Date()
    );

    // Simulando eventos médicos
    const events = {
      '2024-08-15': [
        {
          type: 'surgery',
          title: 'Cirurgia Cardíaca',
          time: '08:00',
          priority: 'high',
        },
        {
          type: 'consultation',
          title: 'Consulta Rotina',
          time: '14:00',
          priority: 'normal',
        },
      ],
      '2024-08-16': [
        {
          type: 'exam',
          title: 'Exames Laboratoriais',
          time: '09:00',
          priority: 'normal',
        },
        {
          type: 'emergency',
          title: 'Emergência',
          time: '16:30',
          priority: 'urgent',
        },
      ],
      '2024-08-17': [
        {
          type: 'meeting',
          title: 'Reunião Equipe',
          time: '10:00',
          priority: 'low',
        },
      ],
    };

    const getDateKey = (date: Date) => {
      return date.toISOString().split('T')[0];
    };

    const hasEvents = (date: Date) => {
      const dateKey = getDateKey(date);
      return events[dateKey as keyof typeof events]?.length > 0;
    };

    const getEventTypeIcon = (type: string) => {
      switch (type) {
        case 'surgery':
          return <Activity className="h-3 w-3" />;
        case 'consultation':
          return <Stethoscope className="h-3 w-3" />;
        case 'exam':
          return <Microscope className="h-3 w-3" />;
        case 'emergency':
          return <AlertCircle className="h-3 w-3" />;
        case 'meeting':
          return <Users className="h-3 w-3" />;
        default:
          return <CalendarIcon className="h-3 w-3" />;
      }
    };

    const getPriorityColor = (priority: string) => {
      switch (priority) {
        case 'urgent':
          return 'bg-red-500';
        case 'high':
          return 'bg-orange-500';
        case 'normal':
          return 'bg-blue-500';
        case 'low':
          return 'bg-gray-500';
        default:
          return 'bg-gray-500';
      }
    };

    return (
      <div className="flex gap-6">
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="font-semibold flex items-center gap-2 justify-center">
              <Activity className="h-4 w-4" />
              Agenda de Eventos Médicos
            </h3>
            <p className="text-sm text-muted-foreground">Hospital São Lucas</p>
          </div>

          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
            modifiers={{
              hasEvents: date => hasEvents(date),
            }}
            modifiersStyles={{
              hasEvents: {
                backgroundColor: 'rgb(168 85 247 / 0.1)',
                border: '1px solid rgb(168 85 247)',
                borderRadius: '6px',
                fontWeight: 'bold',
              },
            }}
          />

          <div className="space-y-2">
            <h4 className="font-medium text-sm">Legenda:</h4>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <Activity className="h-3 w-3" />
                <span>Cirurgia</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Stethoscope className="h-3 w-3" />
                <span>Consulta</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Microscope className="h-3 w-3" />
                <span>Exame</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <AlertCircle className="h-3 w-3" />
                <span>Emergência</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Users className="h-3 w-3" />
                <span>Reunião</span>
              </div>
            </div>
          </div>
        </div>

        {selectedDate && (
          <Card className="w-80">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Eventos do Dia
              </CardTitle>
              <CardDescription>
                {selectedDate.toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {(() => {
                const dateKey = getDateKey(selectedDate);
                const dayEvents = events[dateKey as keyof typeof events];

                if (!dayEvents || dayEvents.length === 0) {
                  return (
                    <div className="text-center py-8">
                      <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Nenhum evento agendado
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-3">
                    {dayEvents.map((event, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          {getEventTypeIcon(event.type)}
                          <div
                            className={`w-2 h-2 rounded-full ${getPriorityColor(event.priority)}`}
                          ></div>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{event.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {event.time}
                          </p>
                        </div>
                        <Badge
                          className={`text-white text-xs ${getPriorityColor(event.priority)}`}
                        >
                          {event.priority === 'urgent'
                            ? 'Urgente'
                            : event.priority === 'high'
                              ? 'Alta'
                              : event.priority === 'normal'
                                ? 'Normal'
                                : 'Baixa'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        )}
      </div>
    );
  },
};

// Calendar desabilitado
export const Disabled: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());

    return (
      <div className="space-y-4">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border opacity-50"
          disabled
        />
        <p className="text-sm text-muted-foreground text-center">
          Calendar desabilitado
        </p>
      </div>
    );
  },
};
