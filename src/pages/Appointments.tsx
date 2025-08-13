import { useState, useEffect, useRef } from "react";
import { format, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  X 
} from "lucide-react";

import { MedicalLayout } from "@/components/layout/MedicalLayout";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { DoctoraliaWidget } from "@/components/appointments/DoctoraliaWidget";
import { AppointmentForm, AppointmentFormValues } from "@/components/appointments/AppointmentForm";
import { AppointmentsList, Appointment } from "@/components/appointments/AppointmentsList";
import { SyncModal } from "@/components/Agenda/SyncModal";
import { supabase } from "@/integrations/supabase/client";

// Função para gerar dados de exemplo para demonstração
const generateMockAppointments = (): Appointment[] => {
  const today = new Date();
  
  return [
    {
      id: uuidv4(),
      patientName: 'Maria Silva',
      patientPhone: '(11) 98765-4321',
      appointmentDate: today,
      appointmentTime: '09:00',
      appointmentDuration: '30 min',
      appointmentType: 'Consulta Geral',
      appointmentReason: 'Dor de cabeça recorrente',
      appointmentLocation: 'Consultório Principal - Sala 302'
    },
    {
      id: uuidv4(),
      patientName: 'João Oliveira',
      patientPhone: '(11) 91234-5678',
      appointmentDate: addDays(today, 1),
      appointmentTime: '14:30',
      appointmentDuration: '60 min',
      appointmentType: 'Primeira Consulta',
      appointmentReason: 'Avaliação inicial',
      appointmentLocation: 'Consultório Principal - Sala 302'
    },
    {
      id: uuidv4(),
      patientName: 'Ana Pereira',
      patientPhone: '(11) 99876-5432',
      appointmentDate: addDays(today, 2),
      appointmentTime: '10:00',
      appointmentDuration: '45 min',
      appointmentType: 'Retorno',
      appointmentReason: 'Acompanhamento de tratamento',
      appointmentLocation: 'Atendimento Online'
    },
  ];
};

const Appointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(generateMockAppointments());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [showDoctoralia, setShowDoctoralia] = useState(false);
  const [isSyncOpen, setIsSyncOpen] = useState(false);

  useEffect(() => {
    document.title = 'Agendamentos | MedAssist Pro';
  }, []);

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

  // Manipular criação de novo agendamento
  const handleCreateAppointment = (data: AppointmentFormValues) => {
    const newAppointment: Appointment = {
      id: uuidv4(),
      patientName: data.patientName,
      patientPhone: data.patientPhone,
      appointmentDate: data.appointmentDate,
      appointmentTime: data.appointmentTime,
      appointmentDuration: data.appointmentDuration,
      appointmentType: data.appointmentType || 'Consulta Geral',
      appointmentReason: data.appointmentReason || '',
      appointmentLocation: data.appointmentLocation
    };

    setAppointments([...appointments, newAppointment]);
    setIsFormOpen(false);
    setSelectedDate(data.appointmentDate);
    
    // Exibir mensagem de sucesso
    alert(`Agendamento criado com sucesso para ${data.patientName} em ${format(data.appointmentDate, 'dd/MM/yyyy')} às ${data.appointmentTime}`);
  };

  // Manipular edição de agendamento
  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setIsFormOpen(true);
  };

  // Manipular atualização de agendamento
  const handleUpdateAppointment = (data: AppointmentFormValues) => {
    if (!editingAppointment) return;

    const updatedAppointments = appointments.map(app =>
      app.id === editingAppointment.id ? {
        ...app,
        patientName: data.patientName,
        patientPhone: data.patientPhone,
        appointmentDate: data.appointmentDate,
        appointmentTime: data.appointmentTime,
        appointmentDuration: data.appointmentDuration,
        appointmentType: data.appointmentType || 'Consulta Geral',
        appointmentReason: data.appointmentReason || '',
        appointmentLocation: data.appointmentLocation
      } : app
    );

    setAppointments(updatedAppointments);
    setIsFormOpen(false);
    setEditingAppointment(null);
  };

  // Manipular exclusão de agendamento
  const handleDeleteAppointment = (appointmentId: string) => {
    if (confirm('Tem certeza que deseja cancelar este agendamento?')) {
      const updatedAppointments = appointments.filter(app => app.id !== appointmentId);
      setAppointments(updatedAppointments);
    }
  };

  // Fechar formulário e limpar estado de edição
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingAppointment(null);
  };

  return (
    <MedicalLayout>
      <div className="container mx-auto py-6 space-y-6">
        {/* Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Agendamentos</h1>
            <p className="text-muted-foreground">Gerencie consultas e integre com plataformas externas</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="medical" onClick={handleOpenModal}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Agendamento
            </Button>
          </div>
        </header>

        <Tabs defaultValue="calendar" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calendar">Calendário</TabsTrigger>
            <TabsTrigger value="doctoralia">Doctoralia</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calendar" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <Card className="border-medical-blue/20 lg:col-span-4 lg:sticky lg:top-24 self-start animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-medical-blue" />
                    Calendário
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                    locale={ptBR}
                  />
                  {selectedDate && (
                    <div className="mt-4 text-center">
                      <p className="font-medium">
                        {format(selectedDate, "EEEE, dd 'de' MMMM", { locale: ptBR })}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {filteredAppointments.length} agendamento(s)
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="lg:col-span-8">
                <Card className="border-medical-blue/20 animate-fade-in">
                  <CardHeader>
                    <CardTitle>
                      {selectedDate
                        ? `Agendamentos para ${format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}`
                        : 'Selecione uma data'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-[60vh] md:max-h-[70vh] overflow-y-auto pr-1">
                      <AppointmentsList
                        appointments={filteredAppointments}
                        onEdit={handleEditAppointment}
                        onDelete={handleDeleteAppointment}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="doctoralia">
            <DoctoraliaWidget doctorId="bruno-borges-paschoalini/psiquiatra/sorocaba" />
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
            <AppointmentForm
              onSubmit={editingAppointment ? handleUpdateAppointment : handleCreateAppointment}
              onCancel={handleCloseForm}
              defaultValues={editingAppointment || undefined}
            />
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