import { useState, useEffect, Suspense, useCallback } from 'react';
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  parseISO,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  CalendarIcon,
  Plus,
  Clock,
  User,
  Phone,
  MapPin,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Edit,
  Trash2,
  Video,
  Stethoscope,
  Calendar as CalendarLucide,
} from 'lucide-react';

import { MedicalLayout } from '@/components/layout/MedicalLayout';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { LazyAppointmentForm } from '@/components/appointments/LazyAppointmentForm';
import { AppointmentFormValues } from '@/components/appointments/AppointmentForm';
import { supabase } from '@/integrations/supabase/client';
import { NotificationService } from '@/services/notificationService';
import { useAuth } from '@/hooks/useAuth';

// Interface para dados do banco
interface DatabaseAppointment {
  id: string;
  patient_name: string | null;
  patient_phone: string | null;
  patient_email: string | null;
  appointment_date: string;
  appointment_time: string;
  duration: number;
  appointment_type: string;
  appointment_reason: string | null;
  location: string | null;
  status: string;
  consultation_mode: string;
}

// Interface para exibição
interface Appointment {
  id: string;
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  appointmentDate: Date;
  appointmentTime: string;
  appointmentDuration: string;
  appointmentType: string;
  appointmentReason: string;
  appointmentLocation: string;
  status: string;
  consultationMode: string;
}

const Appointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<
    Appointment[]
  >([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'calendar' | 'week' | 'list'>(
    'calendar'
  );

  useEffect(() => {
    document.title = 'Agendamentos | MedAssist Pro';
    fetchAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [appointments, searchTerm, statusFilter, typeFilter]);

  // Função para buscar agendamentos do banco de dados
  const fetchAppointments = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('doctor_id', user.id)
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true });

      if (error) {
        console.error('Erro ao buscar agendamentos:', error);
        return;
      }

      // Converter dados do banco para o formato esperado pelo componente
      const formattedAppointments: Appointment[] = data.map(
        (apt: DatabaseAppointment) => ({
          id: apt.id,
          patientName: apt.patient_name || 'Paciente não informado',
          patientPhone: apt.patient_phone || '',
          patientEmail: apt.patient_email || '',
          appointmentDate: parseISO(apt.appointment_date),
          appointmentTime: apt.appointment_time,
          appointmentDuration: `${apt.duration} min`,
          appointmentType: formatAppointmentType(apt.appointment_type),
          appointmentReason: apt.appointment_reason || '',
          appointmentLocation:
            apt.location || formatConsultationMode(apt.consultation_mode),
          status: apt.status,
          consultationMode: apt.consultation_mode,
        })
      );

      setAppointments(formattedAppointments);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Função para filtrar agendamentos
  const filterAppointments = useCallback(() => {
    let filtered = appointments;

    // Filtro por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(
        apt =>
          apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          apt.patientPhone.includes(searchTerm) ||
          apt.appointmentReason.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(apt => apt.status === statusFilter);
    }

    // Filtro por tipo
    if (typeFilter !== 'all') {
      filtered = filtered.filter(apt => apt.appointmentType === typeFilter);
    }

    setFilteredAppointments(filtered);
  }, [appointments, searchTerm, statusFilter, typeFilter]);

  // Função para formatar tipo de agendamento
  const formatAppointmentType = (type: string): string => {
    const types: Record<string, string> = {
      consulta_geral: 'Consulta Geral',
      primeira_consulta: 'Primeira Consulta',
      retorno: 'Retorno',
      urgencia: 'Urgência',
      exame: 'Exame',
      procedimento: 'Procedimento',
      teleconsulta: 'Teleconsulta',
      avaliacao: 'Avaliação',
    };
    return types[type] || type;
  };

  // Função para formatar modo de consulta
  const formatConsultationMode = (mode: string): string => {
    const modes: Record<string, string> = {
      presencial: 'Consultório Principal',
      telemedicina: 'Atendimento Online',
      hibrida: 'Híbrida',
    };
    return modes[mode] || mode;
  };

  // Converter tipo de agendamento para o banco
  const convertAppointmentType = (type: string): string => {
    const typeMap: Record<string, string> = {
      'Consulta Geral': 'consulta_geral',
      'Primeira Consulta': 'primeira_consulta',
      Retorno: 'retorno',
      Urgência: 'urgencia',
      Exame: 'exame',
      Procedimento: 'procedimento',
      Teleconsulta: 'teleconsulta',
      Avaliação: 'avaliacao',
    };
    return typeMap[type] || type.toLowerCase().replace(' ', '_');
  };

  // Obter agendamentos para uma data específica
  const getAppointmentsForDate = (date: Date) => {
    return filteredAppointments.filter(apt =>
      isSameDay(apt.appointmentDate, date)
    );
  };

  // Obter agendamentos da semana atual
  const getWeekAppointments = () => {
    const weekStart = startOfWeek(currentWeek, { weekStartsOn: 0 });
    const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 0 });
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return weekDays.map(day => ({
      date: day,
      appointments: getAppointmentsForDate(day),
    }));
  };

  // Função para criar novo agendamento
  const handleCreateAppointment = async (values: AppointmentFormValues) => {
    if (!user) return;

    try {
      const appointmentData = {
        doctor_id: user.id,
        patient_name: values.patientName,
        patient_phone: values.patientPhone,
        patient_email: values.patientEmail || null,
        appointment_date: format(values.appointmentDate, 'yyyy-MM-dd'),
        appointment_time: values.appointmentTime,
        duration: parseInt(values.appointmentDuration.replace(' min', '')),
        appointment_type: convertAppointmentType(values.appointmentType),
        appointment_reason: values.appointmentReason,
        location: values.appointmentLocation,
        consultation_mode: values.appointmentLocation?.includes('Online')
          ? 'telemedicina'
          : 'presencial',
        status: 'agendado',
      };

      const { data: newAppointment, error } = await supabase
        .from('appointments')
        .insert([appointmentData])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar agendamento:', error);
        alert('Erro ao criar agendamento. Tente novamente.');
        return;
      }

      // Criar notificações de lembrete
      try {
        const { data: doctorProfile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();

        const doctorName = doctorProfile?.full_name || 'Médico';

        await NotificationService.createAppointmentReminder(
          user.id,
          newAppointment.id,
          newAppointment.id,
          values.appointmentDate,
          values.appointmentTime,
          values.patientName,
          doctorName
        );

        await NotificationService.createAppointmentConfirmation(
          user.id,
          newAppointment.id,
          newAppointment.id,
          values.appointmentDate,
          values.appointmentTime,
          values.patientName
        );
      } catch (notificationError) {
        console.error('Erro ao criar notificações:', notificationError);
      }

      await fetchAppointments();
      setIsFormOpen(false);
      alert('Agendamento criado com sucesso!');
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      alert('Erro inesperado ao criar agendamento.');
    }
  };

  // Função para atualizar agendamento
  const handleUpdateAppointment = async (values: AppointmentFormValues) => {
    if (!editingAppointment || !user) return;

    try {
      const appointmentData = {
        patient_name: values.patientName,
        patient_phone: values.patientPhone,
        patient_email: values.patientEmail || null,
        appointment_date: format(values.appointmentDate, 'yyyy-MM-dd'),
        appointment_time: values.appointmentTime,
        duration: parseInt(values.appointmentDuration.replace(' min', '')),
        appointment_type: convertAppointmentType(values.appointmentType),
        appointment_reason: values.appointmentReason,
        location: values.appointmentLocation,
        consultation_mode: values.appointmentLocation?.includes('Online')
          ? 'telemedicina'
          : 'presencial',
      };

      const { error } = await supabase
        .from('appointments')
        .update(appointmentData)
        .eq('id', editingAppointment.id)
        .eq('doctor_id', user.id);

      if (error) {
        console.error('Erro ao atualizar agendamento:', error);
        alert('Erro ao atualizar agendamento. Tente novamente.');
        return;
      }

      await fetchAppointments();
      handleCloseForm();
      alert('Agendamento atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar agendamento:', error);
      alert('Erro inesperado ao atualizar agendamento.');
    }
  };

  // Função para deletar agendamento
  const handleDeleteAppointment = async (appointmentId: string) => {
    if (!user || !confirm('Tem certeza que deseja excluir este agendamento?'))
      return;

    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', appointmentId)
        .eq('doctor_id', user.id);

      if (error) {
        console.error('Erro ao deletar agendamento:', error);
        alert('Erro ao deletar agendamento. Tente novamente.');
        return;
      }

      await fetchAppointments();
      alert('Agendamento excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar agendamento:', error);
      alert('Erro inesperado ao deletar agendamento.');
    }
  };

  // Função para editar agendamento
  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setIsFormOpen(true);
  };

  // Função para fechar formulário
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingAppointment(null);
  };

  // Obter cor do status
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      agendado: 'bg-blue-100 text-blue-800 border-blue-200',
      confirmado: 'bg-green-100 text-green-800 border-green-200',
      em_andamento: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      concluido: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      cancelado: 'bg-red-100 text-red-800 border-red-200',
      reagendado: 'bg-purple-100 text-purple-800 border-purple-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Obter ícone do tipo de consulta
  const getConsultationIcon = (mode: string) => {
    return mode === 'telemedicina' ? Video : Stethoscope;
  };

  // Renderizar card de agendamento
  const renderAppointmentCard = (appointment: Appointment) => {
    const Icon = getConsultationIcon(appointment.consultationMode);

    return (
      <Card
        key={appointment.id}
        className="premium-card hover:shadow-lg transition-all duration-300 border-l-4 border-l-medical-blue"
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4 flex-1">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-medical-blue/10 text-medical-blue font-semibold">
                  {appointment.patientName
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .substring(0, 2)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">
                      {appointment.patientName}
                    </h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {appointment.appointmentTime} (
                        {appointment.appointmentDuration})
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon className="w-4 h-4" />
                        {appointment.appointmentType}
                      </div>
                    </div>
                  </div>

                  <Badge
                    className={`${getStatusColor(appointment.status)} border`}
                  >
                    {appointment.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  {appointment.patientPhone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      {appointment.patientPhone}
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {appointment.appointmentLocation}
                  </div>
                </div>

                {appointment.appointmentReason && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong>Motivo:</strong> {appointment.appointmentReason}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => handleEditAppointment(appointment)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDeleteAppointment(appointment.id)}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <MedicalLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-blue mx-auto"></div>
            <p className="text-muted-foreground">Carregando agendamentos...</p>
          </div>
        </div>
      </MedicalLayout>
    );
  }

  return (
    <MedicalLayout>
      <div className="space-y-8 p-6">
        {/* Header Premium */}
        <div className="premium-fade-in">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <h1 className="medical-heading text-3xl font-bold">
                Agendamentos
              </h1>
              <p className="medical-subheading text-lg">
                Gerencie seus agendamentos de forma eficiente
              </p>
            </div>

            <Button
              onClick={() => setIsFormOpen(true)}
              className="premium-button bg-medical-blue hover:bg-medical-blue/90 text-white shadow-lg"
              size="lg"
            >
              <Plus className="mr-2 h-5 w-5" />
              Novo Agendamento
            </Button>
          </div>
        </div>

        {/* Filtros e Busca */}
        <Card className="premium-card premium-fade-in">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Buscar por paciente, telefone ou motivo..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-10 medical-input"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Status</SelectItem>
                    <SelectItem value="agendado">Agendado</SelectItem>
                    <SelectItem value="confirmado">Confirmado</SelectItem>
                    <SelectItem value="em_andamento">Em Andamento</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Tipos</SelectItem>
                    <SelectItem value="Consulta Geral">
                      Consulta Geral
                    </SelectItem>
                    <SelectItem value="Primeira Consulta">
                      Primeira Consulta
                    </SelectItem>
                    <SelectItem value="Retorno">Retorno</SelectItem>
                    <SelectItem value="Urgência">Urgência</SelectItem>
                    <SelectItem value="Teleconsulta">Teleconsulta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs de Visualização */}
        <Tabs
          value={viewMode}
          onValueChange={value =>
            setViewMode(value as 'calendar' | 'week' | 'list')
          }
          className="premium-fade-in"
        >
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <CalendarLucide className="w-4 h-4" />
              Calendário
            </TabsTrigger>
            <TabsTrigger value="week" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Semana
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Lista
            </TabsTrigger>
          </TabsList>

          {/* Visualização Calendário */}
          <TabsContent value="calendar" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
              {/* Sidebar do Calendário */}
              <Card className="xl:col-span-4 premium-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-medical-blue/10">
                      <CalendarIcon className="w-5 h-5 text-medical-blue" />
                    </div>
                    Calendário
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={date => date && setSelectedDate(date)}
                    className="rounded-lg border-0 bg-background/50"
                    locale={ptBR}
                  />

                  {selectedDate && (
                    <div className="p-4 rounded-lg bg-accent/50 border border-accent text-center space-y-2">
                      <p className="font-semibold text-lg">
                        {format(selectedDate, "EEEE, dd 'de' MMMM", {
                          locale: ptBR,
                        })}
                      </p>
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-medical-blue"></div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {getAppointmentsForDate(selectedDate).length}{' '}
                          agendamento
                          {getAppointmentsForDate(selectedDate).length !== 1
                            ? 's'
                            : ''}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Lista de Agendamentos do Dia */}
              <div className="xl:col-span-8 space-y-6">
                <Card className="premium-card">
                  <CardHeader>
                    <CardTitle>
                      Agendamentos para{' '}
                      {format(selectedDate, "dd 'de' MMMM 'de' yyyy", {
                        locale: ptBR,
                      })}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {getAppointmentsForDate(selectedDate).length === 0 ? (
                      <div className="text-center py-12">
                        <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                          Nenhum agendamento para esta data
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {getAppointmentsForDate(selectedDate)
                          .sort((a, b) =>
                            a.appointmentTime.localeCompare(b.appointmentTime)
                          )
                          .map(renderAppointmentCard)}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Visualização Semanal */}
          <TabsContent value="week" className="space-y-6">
            <Card className="premium-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-medical-blue" />
                    Visão Semanal
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentWeek(addDays(currentWeek, -7))}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-sm font-medium px-4">
                      {format(startOfWeek(currentWeek), 'dd MMM', {
                        locale: ptBR,
                      })}{' '}
                      -{' '}
                      {format(endOfWeek(currentWeek), 'dd MMM yyyy', {
                        locale: ptBR,
                      })}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentWeek(addDays(currentWeek, 7))}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                  {getWeekAppointments().map(({ date, appointments }) => (
                    <div key={date.toISOString()} className="space-y-2">
                      <div className="text-center p-2 rounded-lg bg-muted/50">
                        <p className="text-xs font-medium text-muted-foreground">
                          {format(date, 'EEE', { locale: ptBR }).toUpperCase()}
                        </p>
                        <p className="text-lg font-semibold">
                          {format(date, 'dd')}
                        </p>
                      </div>

                      <div className="space-y-1">
                        {appointments.slice(0, 3).map(apt => (
                          <div
                            key={apt.id}
                            className="p-2 rounded text-xs bg-medical-blue/10 text-medical-blue cursor-pointer hover:bg-medical-blue/20 transition-colors"
                            onClick={() => {
                              setSelectedDate(date);
                              setViewMode('calendar');
                            }}
                          >
                            <p className="font-medium truncate">
                              {apt.patientName}
                            </p>
                            <p className="text-xs opacity-75">
                              {apt.appointmentTime}
                            </p>
                          </div>
                        ))}

                        {appointments.length > 3 && (
                          <div className="text-xs text-center text-muted-foreground p-1">
                            +{appointments.length - 3} mais
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Visualização Lista */}
          <TabsContent value="list" className="space-y-6">
            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Filter className="w-5 h-5 text-medical-blue" />
                  Todos os Agendamentos
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredAppointments.length === 0 ? (
                  <div className="text-center py-12">
                    <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {searchTerm ||
                      statusFilter !== 'all' ||
                      typeFilter !== 'all'
                        ? 'Nenhum agendamento encontrado com os filtros aplicados'
                        : 'Nenhum agendamento cadastrado'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredAppointments
                      .sort((a, b) => {
                        const dateCompare =
                          a.appointmentDate.getTime() -
                          b.appointmentDate.getTime();
                        if (dateCompare !== 0) return dateCompare;
                        return a.appointmentTime.localeCompare(
                          b.appointmentTime
                        );
                      })
                      .map(renderAppointmentCard)}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modal de Formulário */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                {editingAppointment ? 'Editar Agendamento' : 'Novo Agendamento'}
              </DialogTitle>
            </DialogHeader>
            <Suspense
              fallback={
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-medical-blue"></div>
                </div>
              }
            >
              <LazyAppointmentForm
                onSubmit={
                  editingAppointment
                    ? handleUpdateAppointment
                    : handleCreateAppointment
                }
                onCancel={handleCloseForm}
                defaultValues={editingAppointment || undefined}
              />
            </Suspense>
          </DialogContent>
        </Dialog>
      </div>
    </MedicalLayout>
  );
};

export default Appointments;
