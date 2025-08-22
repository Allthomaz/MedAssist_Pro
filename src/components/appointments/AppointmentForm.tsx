import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Check, X } from 'lucide-react';

// Form schema for appointment creation
const appointmentSchema = z.object({
  patientName: z.string().min(2, 'Nome do paciente é obrigatório'),
  patientPhone: z.string().min(8, 'Telefone é obrigatório'),
  patientEmail: z
    .string()
    .email('E-mail inválido')
    .optional()
    .or(z.literal('')),
  appointmentDate: z.date({
    required_error: 'Data é obrigatória',
  }),
  appointmentTime: z.string().min(1, 'Horário é obrigatório'),
  appointmentDuration: z.string().min(1, 'Duração é obrigatória'),
  appointmentType: z.string().min(1, 'Tipo de consulta é obrigatório'),
  appointmentReason: z.string().optional(),
  appointmentLocation: z.string().min(1, 'Local é obrigatório'),
});

export type AppointmentFormValues = z.infer<typeof appointmentSchema>;

interface AppointmentFormProps {
  onSubmit: (data: AppointmentFormValues) => void;
  onCancel?: () => void;
  defaultValues?: Partial<AppointmentFormValues>;
}

export function AppointmentForm({
  onSubmit,
  onCancel,
  defaultValues,
}: AppointmentFormProps) {
  // Initialize form
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patientName: defaultValues?.patientName || '',
      patientPhone: defaultValues?.patientPhone || '',
      appointmentDate: defaultValues?.appointmentDate || new Date(),
      appointmentTime: defaultValues?.appointmentTime || '',
      appointmentDuration: defaultValues?.appointmentDuration || '30 min',
      appointmentType: defaultValues?.appointmentType || 'Consulta Geral',
      appointmentReason: defaultValues?.appointmentReason || '',
      appointmentLocation:
        defaultValues?.appointmentLocation ||
        'Consultório Principal - Sala 302',
    },
  });

  const handleFormSubmit = (data: AppointmentFormValues) => {
    onSubmit(data);
  };

  const handleCancel = () => {
    form.reset();
    if (onCancel) onCancel();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-8"
      >
        {/* Personal Information Section */}
        <div className="space-y-6">
          <div className="border-b border-border/30 pb-3">
            <h3 className="text-lg font-semibold text-foreground">
              Informações do Paciente
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Dados pessoais e de contato do paciente
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="patientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Nome do Paciente *
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite o nome completo do paciente"
                      className="h-11 transition-all duration-200 focus:ring-2 focus:ring-medical-blue/20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="patientPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Telefone de Contato *
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="(00) 00000-0000"
                      className="h-11 transition-all duration-200 focus:ring-2 focus:ring-medical-blue/20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="patientEmail"
              render={({ field }) => (
                <FormItem className="lg:col-span-2">
                  <FormLabel className="text-sm font-medium">
                    E-mail (Opcional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email@exemplo.com"
                      type="email"
                      className="h-11 transition-all duration-200 focus:ring-2 focus:ring-medical-blue/20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Appointment Details Section */}
        <div className="space-y-6">
          <div className="border-b border-border/30 pb-3">
            <h3 className="text-lg font-semibold text-foreground">
              Detalhes do Agendamento
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Configure data, horário e tipo da consulta
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Date Selection */}
            <FormField
              control={form.control}
              name="appointmentDate"
              render={({ field }) => (
                <FormItem className="flex flex-col lg:col-span-1">
                  <FormLabel className="text-sm font-medium">
                    Data do Agendamento *
                  </FormLabel>
                  <FormControl>
                    <div className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm transition-all duration-200 hover:border-medical-blue/40 focus-within:border-medical-blue">
                      {field.value ? (
                        <span className="flex items-center text-foreground font-medium">
                          {format(field.value, 'dd/MM/yyyy')}
                        </span>
                      ) : (
                        <span className="flex items-center text-muted-foreground">
                          Selecione uma data
                        </span>
                      )}
                    </div>
                  </FormControl>
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={date => date < new Date()}
                    initialFocus
                    className="rounded-lg border border-border/50 mt-3 bg-background"
                    locale={ptBR}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Time and Duration Selection */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="appointmentTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Horário *
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11 transition-all duration-200 hover:border-medical-blue/40 focus:border-medical-blue">
                            <SelectValue placeholder="Selecione um horário" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[
                            '08:00',
                            '08:30',
                            '09:00',
                            '09:30',
                            '10:00',
                            '10:30',
                            '11:00',
                            '11:30',
                            '13:00',
                            '13:30',
                            '14:00',
                            '14:30',
                            '15:00',
                            '15:30',
                            '16:00',
                            '16:30',
                            '17:00',
                          ].map(time => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="appointmentDuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Duração *
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11 transition-all duration-200 hover:border-medical-blue/40 focus:border-medical-blue">
                            <SelectValue placeholder="Selecione a duração" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[
                            '15 min',
                            '30 min',
                            '45 min',
                            '60 min',
                            '90 min',
                          ].map(duration => (
                            <SelectItem key={duration} value={duration}>
                              {duration}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="appointmentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Tipo de Consulta *
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11 transition-all duration-200 hover:border-medical-blue/40 focus:border-medical-blue">
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[
                            'Consulta Geral',
                            'Primeira Consulta',
                            'Retorno',
                            'Emergência',
                            'Exame',
                          ].map(type => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="appointmentLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Local *
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11 transition-all duration-200 hover:border-medical-blue/40 focus:border-medical-blue">
                            <SelectValue placeholder="Selecione o local" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[
                            'Consultório Principal - Sala 302',
                            'Clínica Central - Sala 105',
                            'Atendimento Online',
                          ].map(location => (
                            <SelectItem key={location} value={location}>
                              {location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="appointmentReason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Motivo da Consulta
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Descreva brevemente o motivo da consulta (opcional)"
                        className="h-11 transition-all duration-200 focus:ring-2 focus:ring-medical-blue/20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons - Enhanced design */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-border/30">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="w-full sm:w-auto transition-all duration-200 hover:scale-105"
          >
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="medical"
            className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Check className="w-4 h-4 mr-2" />
            Salvar Agendamento
          </Button>
        </div>
      </form>
    </Form>
  );
}
