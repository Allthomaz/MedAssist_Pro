import { supabase } from '@/integrations/supabase/client';

export interface CreateNotificationParams {
  userId: string;
  type: string;
  title: string;
  message: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  appointmentId?: string;
  consultationId?: string;
  documentId?: string;
  patientId?: string;
  scheduledFor?: Date;
}

export class NotificationService {
  /**
   * Criar uma nova notificação
   */
  static async createNotification(params: CreateNotificationParams) {
    try {
      const { data, error } = await supabase.rpc('create_notification', {
        p_user_id: params.userId,
        p_type: params.type,
        p_title: params.title,
        p_message: params.message,
        p_priority: params.priority || 'normal',
        p_appointment_id: params.appointmentId || null,
        p_consultation_id: params.consultationId || null,
        p_document_id: params.documentId || null,
        p_patient_id: params.patientId || null,
        p_scheduled_for: params.scheduledFor?.toISOString() || null
      });

      if (error) {
        console.error('Erro ao criar notificação:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Erro ao criar notificação:', error);
      return null;
    }
  }

  /**
   * Criar lembrete de consulta
   */
  static async createAppointmentReminder(
    doctorId: string,
    patientId: string,
    appointmentId: string,
    appointmentDate: Date,
    appointmentTime: string,
    patientName: string,
    doctorName: string
  ) {
    const reminderDate = new Date(appointmentDate);
    reminderDate.setDate(reminderDate.getDate() - 1); // 24 horas antes
    reminderDate.setHours(9, 0, 0, 0); // 9:00 AM

    // Lembrete para o médico
    await this.createNotification({
      userId: doctorId,
      type: 'appointment_reminder',
      title: 'Lembrete de Consulta',
      message: `Você tem uma consulta agendada com ${patientName} amanhã às ${appointmentTime}`,
      priority: 'normal',
      appointmentId,
      patientId,
      scheduledFor: reminderDate
    });

    // Lembrete para o paciente (se tiver profile_id)
    try {
      const { data: patient } = await supabase
        .from('patients')
        .select('profile_id')
        .eq('id', patientId)
        .single();

      if (patient?.profile_id) {
        await this.createNotification({
          userId: patient.profile_id,
          type: 'appointment_reminder',
          title: 'Lembrete de Consulta',
          message: `Você tem uma consulta agendada com Dr. ${doctorName} amanhã às ${appointmentTime}`,
          priority: 'high',
          appointmentId,
          patientId,
          scheduledFor: reminderDate
        });
      }
    } catch (error) {
      console.error('Erro ao criar lembrete para paciente:', error);
    }
  }

  /**
   * Criar notificação de confirmação de consulta
   */
  static async createAppointmentConfirmation(
    doctorId: string,
    patientId: string,
    appointmentId: string,
    appointmentDate: Date,
    appointmentTime: string,
    patientName: string
  ) {
    const formattedDate = appointmentDate.toLocaleDateString('pt-BR');

    await this.createNotification({
      userId: doctorId,
      type: 'appointment_confirmation',
      title: 'Consulta Confirmada',
      message: `Consulta com ${patientName} confirmada para ${formattedDate} às ${appointmentTime}`,
      priority: 'normal',
      appointmentId,
      patientId
    });
  }

  /**
   * Criar notificação de cancelamento de consulta
   */
  static async createAppointmentCancellation(
    doctorId: string,
    patientId: string,
    appointmentId: string,
    appointmentDate: Date,
    appointmentTime: string,
    patientName: string,
    reason?: string
  ) {
    const formattedDate = appointmentDate.toLocaleDateString('pt-BR');
    const message = reason 
      ? `Consulta com ${patientName} cancelada para ${formattedDate} às ${appointmentTime}. Motivo: ${reason}`
      : `Consulta com ${patientName} cancelada para ${formattedDate} às ${appointmentTime}`;

    await this.createNotification({
      userId: doctorId,
      type: 'appointment_cancelled',
      title: 'Consulta Cancelada',
      message,
      priority: 'high',
      appointmentId,
      patientId
    });
  }

  /**
   * Criar notificação de documento pronto
   */
  static async createDocumentReady(
    userId: string,
    documentId: string,
    documentType: string,
    patientName?: string
  ) {
    const message = patientName 
      ? `${documentType} de ${patientName} está pronto para download`
      : `${documentType} está pronto para download`;

    await this.createNotification({
      userId,
      type: 'document_ready',
      title: 'Documento Pronto',
      message,
      priority: 'normal',
      documentId
    });
  }

  /**
   * Criar notificação de consulta finalizada
   */
  static async createConsultationCompleted(
    doctorId: string,
    patientId: string,
    consultationId: string,
    patientName: string
  ) {
    await this.createNotification({
      userId: doctorId,
      type: 'consultation_completed',
      title: 'Consulta Finalizada',
      message: `Consulta com ${patientName} foi finalizada com sucesso`,
      priority: 'normal',
      consultationId,
      patientId
    });
  }

  /**
   * Buscar notificações do usuário
   */
  static async getUserNotifications(userId: string, limit = 20) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select(`
          id,
          user_id,
          type,
          title,
          message,
          status,
          priority,
          channel,
          delivery_status,
          created_at,
          read_at,
          appointment_id,
          consultation_id,
          document_id,
          patient_id
        `)
        .eq('user_id', userId)
        .neq('status', 'deleted')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Erro ao buscar notificações:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
      return [];
    }
  }

  /**
   * Marcar notificação como lida
   */
  static async markAsRead(notificationId: string) {
    try {
      const { error } = await supabase.rpc('mark_notification_as_read', {
        notification_uuid: notificationId
      });

      if (error) {
        console.error('Erro ao marcar notificação como lida:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
      return false;
    }
  }

  /**
   * Contar notificações não lidas
   */
  static async getUnreadCount(userId: string) {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', 'unread');

      if (error) {
        console.error('Erro ao contar notificações não lidas:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Erro ao contar notificações não lidas:', error);
      return 0;
    }
  }
}