import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, X } from 'lucide-react';

// Form schema for appointment creation
const appointmentSchema = z.object({
  patientName: z.string().min(2, 'Nome do paciente é obrigatório'),
  patientPhone: z.string().min(8, 'Telefone é obrigatório'),
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

export function AppointmentForm({ onSubmit, onCancel, defaultValues }: AppointmentFormProps) {
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
      appointmentLocation: defaultValues?.appointmentLocation || 'Consultório Principal - Sala 302',
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
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="patientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Paciente</FormLabel>
                <FormControl>
                  <Input placeholder="Nome completo" {...field} />
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
                <FormLabel>Telefone de Contato</FormLabel>
                <FormControl>
                  <Input placeholder="(00) 00000-0000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="appointmentDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data do Agendamento</FormLabel>
                <FormControl>
                  <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    {field.value ? (
                      <span>{format(field.value, 'dd/MM/yyyy')}</span>
                    ) : (
                      <span className="text-muted-foreground">Selecione uma data</span>
                    )}
                  </div>
                </FormControl>
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="rounded-md border mt-2"
                  locale={ptBR}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="appointmentTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Horário</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um horário" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', 
                        '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'].map((time) => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
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
                  <FormLabel>Duração</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a duração" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {['15 min', '30 min', '45 min', '60 min', '90 min'].map((duration) => (
                        <SelectItem key={duration} value={duration}>{duration}</SelectItem>
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
            name="appointmentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Consulta</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {['Consulta Geral', 'Primeira Consulta', 'Retorno', 'Emergência', 'Exame'].map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
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
                <FormLabel>Local</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o local" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {['Consultório Principal - Sala 302', 'Clínica Central - Sala 105', 'Atendimento Online'].map((location) => (
                      <SelectItem key={location} value={location}>{location}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="appointmentReason"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Motivo da Consulta</FormLabel>
                <FormControl>
                  <Input placeholder="Descreva brevemente o motivo da consulta" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={handleCancel}>
            <X className="w-4 h-4 mr-1" />
            Cancelar
          </Button>
          <Button type="submit" variant="medical">
            <Check className="w-4 h-4 mr-1" />
            Salvar Agendamento
          </Button>
        </div>
      </form>
    </Form>
  );
}