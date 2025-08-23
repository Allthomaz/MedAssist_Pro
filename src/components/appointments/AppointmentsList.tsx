import React, { useCallback, useMemo } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Phone, User } from 'lucide-react';
import { VirtualizedList } from '@/components/ui/VirtualizedList';

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
  status?: string;
}

interface AppointmentsListProps {
  appointments: Appointment[];
  onEdit?: (appointment: Appointment) => void;
  onDelete?: (appointmentId: string) => void;
  enableVirtualization?: boolean;
}

// Constantes para virtualização
const APPOINTMENT_ITEM_HEIGHT = 400; // Altura aproximada de cada item de agendamento
const VIRTUALIZATION_THRESHOLD = 20; // Número mínimo de itens para ativar virtualização

/**
 * Componente otimizado para renderizar item individual de agendamento
 * Suporta virtualização com react-window
 */
const AppointmentItem = React.memo<{
  appointment: Appointment;
  index: number;
  onEdit?: (appointment: Appointment) => void;
  onDelete?: (appointmentId: string) => void;
  style?: React.CSSProperties;
}>(({ appointment, index, onEdit, onDelete, style }) => {
  return (
    <div style={style} className="px-2 pb-6">
      <Card
        className="border-medical-blue/20 hover:border-medical-blue/40 hover:shadow-md transition-all duration-300 medical-card-hover bg-card"
        style={{
          animationDelay: `${index * 100}ms`,
        }}
      >
        {/* Card Header - Improved mobile layout */}
        <CardHeader className="pb-4 border-b border-border/30">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-medical-blue/10 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-medical-blue" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold text-foreground">
                  {appointment.patientName}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Paciente</p>
              </div>
            </div>

            {/* Appointment Type Badge */}
            <div className="flex items-center">
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-medical-blue/10 text-medical-blue border border-medical-blue/20">
                {appointment.appointmentType}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Appointment Details Grid - Enhanced responsive design */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Date and Time Information */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/30">
                  <Calendar className="h-5 w-5 text-medical-blue flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {format(
                        appointment.appointmentDate,
                        'EEEE, dd \'de\' MMMM',
                        { locale: ptBR }
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Data da consulta
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/30">
                  <Clock className="h-5 w-5 text-medical-blue flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {appointment.appointmentTime}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Duração: {appointment.appointmentDuration}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact and Location Information */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/30">
                  <Phone className="h-5 w-5 text-medical-blue flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {appointment.patientPhone}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Telefone de contato
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/30">
                  <MapPin className="h-5 w-5 text-medical-blue flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {appointment.appointmentLocation}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Local da consulta
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Appointment Reason - Enhanced design */}
            {appointment.appointmentReason && (
              <div className="p-4 rounded-lg border border-border/50 bg-muted/30">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-medical-blue mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">
                      Motivo da Consulta
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {appointment.appointmentReason}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons - Improved mobile layout */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-border/30">
              {onEdit && (
                <Button
                  variant="medical-outline"
                  size="sm"
                  onClick={() => onEdit(appointment)}
                  className="w-full sm:w-auto transition-all duration-200 hover:scale-105"
                >
                  Editar Agendamento
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="medical-alert"
                  size="sm"
                  onClick={() => onDelete(appointment.id)}
                  className="w-full sm:w-auto transition-all duration-200 hover:scale-105"
                >
                  Cancelar Consulta
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

AppointmentItem.displayName = 'AppointmentItem';

export function AppointmentsList({
  appointments,
  onEdit,
  onDelete,
  enableVirtualization = true,
}: AppointmentsListProps) {
  /**
   * Componente de item virtualizado para react-window
   */
  const VirtualizedAppointmentItem = useCallback(
    ({
      index,
      style,
      data,
    }: {
      index: number;
      style: React.CSSProperties;
      data: Appointment[];
    }) => {
      const appointment = data[index];
      return (
        <AppointmentItem
          key={appointment.id}
          appointment={appointment}
          index={index}
          onEdit={onEdit}
          onDelete={onDelete}
          style={style}
        />
      );
    },
    [onEdit, onDelete]
  );

  /**
   * Determina se deve usar virtualização baseado no número de itens e configuração
   */
  const shouldUseVirtualization = useMemo(
    () =>
      enableVirtualization && appointments.length >= VIRTUALIZATION_THRESHOLD,
    [enableVirtualization, appointments.length]
  );
  // Empty State - Enhanced design with better visual hierarchy
  if (appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-2">
          <Calendar className="w-8 h-8 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            Nenhum agendamento encontrado
          </h3>
          <p className="text-muted-foreground max-w-sm">
            Não há consultas agendadas para esta data. Selecione outra data ou
            crie um novo agendamento.
          </p>
        </div>
      </div>
    );
  }

  return shouldUseVirtualization ? (
    // Lista virtualizada para muitos agendamentos
    <div className="border rounded-lg">
      <VirtualizedList
        items={appointments}
        itemHeight={APPOINTMENT_ITEM_HEIGHT}
        height={Math.min(800, appointments.length * APPOINTMENT_ITEM_HEIGHT)}
        renderItem={VirtualizedAppointmentItem}
        className="p-2"
        overscanCount={2}
      />
    </div>
  ) : (
    // Lista normal para poucos agendamentos
    <div className="space-y-6">
      {appointments.map((appointment, index) => (
        <AppointmentItem
          key={appointment.id}
          appointment={appointment}
          index={index}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
