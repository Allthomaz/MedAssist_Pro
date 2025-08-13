import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Phone, User } from 'lucide-react';

export interface Appointment {
  id: string;
  patientName: string;
  patientPhone: string;
  appointmentDate: Date;
  appointmentTime: string;
  appointmentDuration: string;
  appointmentType: string;
  appointmentReason?: string;
  appointmentLocation: string;
}

interface AppointmentsListProps {
  appointments: Appointment[];
  onEdit?: (appointment: Appointment) => void;
  onDelete?: (appointmentId: string) => void;
}

export function AppointmentsList({ appointments, onEdit, onDelete }: AppointmentsListProps) {
  if (appointments.length === 0) {
    return (
      <Card className="border-medical-blue/20">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Nenhum agendamento encontrado.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <Card key={appointment.id} className="border-medical-blue/20 hover:border-medical-blue/40 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex justify-between items-center">
              <span>{appointment.patientName}</span>
              <span className="text-sm font-medium text-medical-blue">
                {appointment.appointmentType}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-medical-blue" />
                  <span className="text-sm">
                    {format(appointment.appointmentDate, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-medical-blue" />
                  <span className="text-sm">
                    {appointment.appointmentTime} ({appointment.appointmentDuration})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-medical-blue" />
                  <span className="text-sm">{appointment.patientName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-medical-blue" />
                  <span className="text-sm">{appointment.patientPhone}</span>
                </div>
                <div className="flex items-center gap-2 md:col-span-2">
                  <MapPin className="h-4 w-4 text-medical-blue" />
                  <span className="text-sm">{appointment.appointmentLocation}</span>
                </div>
              </div>
              
              {appointment.appointmentReason && (
                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Motivo:</span> {appointment.appointmentReason}
                  </p>
                </div>
              )}
              
              <div className="flex justify-end gap-2 pt-2">
                {onEdit && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onEdit(appointment)}
                  >
                    Editar
                  </Button>
                )}
                {onDelete && (
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => onDelete(appointment.id)}
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}