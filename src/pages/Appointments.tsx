import { useState, useEffect, useRef, Suspense } from 'react';
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { v4 as uuidv4 } from 'uuid';
import {
  Brain,
  CalendarIcon,
  Check,
  Clock,
  ExternalLink,
  FileText,
  MapPin,
  Phone,
  Plus,
  X,
} from 'lucide-react';

import { MedicalLayout } from '@/components/layout/MedicalLayout';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
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
import {
  AppointmentsList,
  Appointment,
} from '@/components/appointments/AppointmentsList';
import { SyncModal } from '@/components/Agenda/SyncModal';
import { supabase } from '@/integrations/supabase/client';
import { NotificationService } from '@/services/notificationService';

// Interface para dados do banco
interface DatabaseAppointment {
  id: string;
  patient_name: string | null;
  patient_phone: string | null;
  appointment_date: string;
  appointment_time: string;
  duration: number;
  appointment_type: string;
  appointment_reason: string | null;
  location: string | null;
  status: string;
  consultation_mode: string;
}

const Appointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);
  const [isSyncOpen, setIsSyncOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Agendamentos | MedAssist Pro';
    fetchAppointments();
  }, []);

  // Função para buscar agendamentos do banco de dados
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
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
          appointmentDate: new Date(apt.appointment_date),
          appointmentTime: apt.appointment_time,
          appointmentDuration: `${apt.duration} min`,
          appointmentType: formatAppointmentType(apt.appointment_type),
          appointmentReason: apt.appointment_reason || '',
          appointmentLocation:
            apt.location || formatConsultationMode(apt.consultation_mode),
        })
      );

      setAppointments(formattedAppointments);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleOpenModal = () => setIsSyncOpen(true);
  const handleSyncGoogle = async () => {
    try {
      const redirectTo = `${window.location.origin}/auth/callback?provider=google`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          scopes: 'https://www.googleapis.com/auth/calendar.events',
          redirectTo,
        },
      });
      if (error) {
        alert(`Erro ao iniciar o login com Google: ${error.message}`);
      } else {
        setIsSyncOpen(false);
      }
    } catch (e) {
      alert('Erro inesperado ao iniciar autenticação com Google.');
    }
  };

  // Filtrar agendamentos para a data selecionada
  const filteredAppointments = selectedDate
    ? appointments.filter(app => {
        const appDate = new Date(app.appointmentDate);
        return (
          appDate.getDate() === selectedDate.getDate() &&
          appDate.getMonth() === selectedDate.getMonth() &&
          appDate.getFullYear() === selectedDate.getFullYear()
        );
      })
    : [];

  // Função para criar novo agendamento
  const handleCreateAppointment = async (values: AppointmentFormValues) => {
    try {
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) {
        alert('Usuário não autenticado');
        return;
      }

      const appointmentData = {
        doctor_id: currentUser.user.id,
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
        // Buscar informações do médico
        const { data: doctorProfile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', currentUser.user.id)
          .single();

        const doctorName = doctorProfile?.full_name || 'Médico';

        // Criar lembrete de consulta
        await NotificationService.createAppointmentReminder(
          currentUser.user.id,
          newAppointment.id, // Usando o ID do agendamento como patientId temporariamente
          newAppointment.id,
          values.appointmentDate,
          values.appointmentTime,
          values.patientName,
          doctorName
        );

        // Criar notificação de confirmação
        await NotificationService.createAppointmentConfirmation(
          currentUser.user.id,
          newAppointment.id,
          newAppointment.id,
          values.appointmentDate,
          values.appointmentTime,
          values.patientName
        );
      } catch (notificationError) {
        console.error('Erro ao criar notificações:', notificationError);
        // Não bloquear o fluxo se as notificações falharem
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
    if (!editingAppointment) return;

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
        .eq('id', editingAppointment.id);

      if (error) {
        console.error('Erro ao atualizar agendamento:', error);
        alert('Erro ao atualizar agendamento. Tente novamente.');
        return;
      }

      await fetchAppointments();
      setIsFormOpen(false);
      setEditingAppointment(null);
      alert('Agendamento atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar agendamento:', error);
      alert('Erro inesperado ao atualizar agendamento.');
    }
  };

  // Função para deletar agendamento
  const handleDeleteAppointment = async (appointmentId: string) => {
    if (!confirm('Tem certeza que deseja cancelar este agendamento?')) {
      return;
    }

    try {
      // Buscar dados do agendamento antes de cancelar
      const { data: appointmentToDelete } = await supabase
        .from('appointments')
        .select('*')
        .eq('id', appointmentId)
        .single();

      const { error } = await supabase
        .from('appointments')
        .update({
          status: 'cancelado',
          cancelled_by: 'doctor',
          cancelled_at: new Date().toISOString(),
        })
        .eq('id', appointmentId);

      if (error) {
        console.error('Erro ao cancelar agendamento:', error);
        alert('Erro ao cancelar agendamento. Tente novamente.');
        return;
      }

      // Criar notificação de cancelamento
      if (appointmentToDelete) {
        try {
          const { data: currentUser } = await supabase.auth.getUser();
          if (currentUser.user) {
            const appointmentDate = new Date(
              `${appointmentToDelete.appointment_date}T${appointmentToDelete.appointment_time}`
            );

            await NotificationService.createAppointmentCancellation(
              currentUser.user.id,
              appointmentToDelete.id,
              appointmentToDelete.id,
              appointmentDate,
              appointmentToDelete.appointment_time,
              appointmentToDelete.patient_name
            );
          }
        } catch (notificationError) {
          console.error(
            'Erro ao criar notificação de cancelamento:',
            notificationError
          );
        }
      }

      await fetchAppointments();
      alert('Agendamento cancelado com sucesso!');
    } catch (error) {
      console.error('Erro ao cancelar agendamento:', error);
      alert('Erro inesperado ao cancelar agendamento.');
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

  // Função para converter tipo de agendamento para o banco
  const convertAppointmentType = (type: string): string => {
    const types: Record<string, string> = {
      'Consulta Geral': 'consulta_geral',
      'Primeira Consulta': 'primeira_consulta',
      Retorno: 'retorno',
      Urgência: 'urgencia',
      Exame: 'exame',
      Procedimento: 'procedimento',
      Teleconsulta: 'teleconsulta',
      Avaliação: 'avaliacao',
    };
    return types[type] || 'consulta_geral';
  };

  // Função para abrir formulário de novo agendamento
  const handleNewAppointment = () => {
    setEditingAppointment(null);
    setIsFormOpen(true);
  };

  return (
    <MedicalLayout>
      {/* Main Container - Responsive padding and spacing */}
      <div className="container mx-auto px-4 py-6 space-y-8 max-w-7xl">
        {/* Header Section - Improved mobile layout and visual hierarchy */}
        <header className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between animate-fade-in">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              Agendamentos
            </h1>
            <p className="text-base text-muted-foreground max-w-md leading-relaxed">
              Gerencie consultas e acompanhe sua agenda médica em tempo real
            </p>
          </div>

          {/* Action Buttons - Better mobile stacking */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Button
              variant="medical"
              onClick={handleNewAppointment}
              className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="mr-2 h-4 w-4" />
              Novo Agendamento
            </Button>
          </div>
        </header>

        {/* Main Content Tabs - Improved spacing */}
        <Tabs defaultValue="calendar" className="w-full space-y-6">
          <TabsList className="grid w-full grid-cols-1 h-12 bg-muted/50">
            <TabsTrigger
              value="calendar"
              className="text-base font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              Visualização de Calendário
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-6 mt-6">
            {/* Grid Layout - Enhanced responsive behavior */}
            <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
              {/* Calendar Sidebar - Improved mobile display */}
              <Card className="xl:col-span-4 border-medical-blue/20 bg-card shadow-md hover:shadow-lg transition-shadow duration-300 xl:sticky xl:top-6 self-start animate-fade-in">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 rounded-lg bg-medical-blue/10">
                      <CalendarIcon className="w-5 h-5 text-medical-blue" />
                    </div>
                    Calendário
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Calendar Component */}
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-lg border-0 bg-background/50"
                    locale={ptBR}
                  />

                  {/* Selected Date Summary - Better visual design */}
                  {selectedDate && (
                    <div className="p-4 rounded-lg bg-accent/50 border border-accent text-center space-y-2">
                      <p className="font-semibold text-lg text-foreground">
                        {format(selectedDate, "EEEE, dd 'de' MMMM", {
                          locale: ptBR,
                        })}
                      </p>
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-medical-blue"></div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {filteredAppointments.length} agendamento
                          {filteredAppointments.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Appointments List - Enhanced mobile layout */}
              <div className="xl:col-span-8 space-y-6">
                <Card className="border-medical-blue/20 bg-card shadow-md hover:shadow-lg transition-shadow duration-300 animate-fade-in">
                  <CardHeader className="pb-4 border-b border-border/50">
                    <CardTitle className="text-xl font-semibold">
                      {selectedDate
                        ? `Agendamentos para ${format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}`
                        : 'Selecione uma data no calendário'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {/* Appointments Container - Improved scrolling and spacing */}
                    <div className="max-h-[60vh] xl:max-h-[70vh] overflow-y-auto">
                      <div className="p-6">
                        <AppointmentsList
                          appointments={filteredAppointments}
                          onEdit={handleEditAppointment}
                          onDelete={handleDeleteAppointment}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Modal de formulário para criar/editar agendamento */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingAppointment ? 'Editar Agendamento' : 'Novo Agendamento'}
              </DialogTitle>
            </DialogHeader>
            <Suspense fallback={<div>Carregando formulário...</div>}>
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

        <SyncModal
          open={isSyncOpen}
          onClose={() => setIsSyncOpen(false)}
          onSyncGoogle={handleSyncGoogle}
        />
      </div>
    </MedicalLayout>
  );
};

export default Appointments;
