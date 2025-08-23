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
        p_scheduled_for: params.scheduledFor?.toISOString() || null,
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
   * 
   * Esta função implementa um sistema inteligente de lembretes automáticos:
   * 1. Calcula automaticamente o horário do lembrete (24h antes às 9:00 AM)
   * 2. Cria notificação para o médico com prioridade normal
   * 3. Verifica se o paciente tem perfil no sistema (profile_id)
   * 4. Cria notificação para o paciente com prioridade alta (se aplicável)
   * 5. Trata erros graciosamente para não interromper o fluxo principal
   * 
   * O sistema de lembretes melhora a aderência às consultas e reduz faltas,
   * sendo essencial para a gestão eficiente da agenda médica.
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
    // Cálculo inteligente do horário do lembrete
    // Define para 24 horas antes da consulta, sempre às 9:00 AM
    // Horário otimizado para máxima visualização pelos usuários
    const reminderDate = new Date(appointmentDate);
    reminderDate.setDate(reminderDate.getDate() - 1); // 24 horas antes
    reminderDate.setHours(9, 0, 0, 0); // 9:00 AM - horário comercial

    // Criação de lembrete para o médico
    // Prioridade normal pois faz parte da rotina profissional
    await this.createNotification({
      userId: doctorId,
      type: 'appointment_reminder',
      title: 'Lembrete de Consulta',
      message: `Você tem uma consulta agendada com ${patientName} amanhã às ${appointmentTime}`,
      priority: 'normal',
      appointmentId,
      patientId,
      scheduledFor: reminderDate,
    });

    // Tentativa de criar lembrete para o paciente
    // Nem todos os pacientes têm perfil no sistema (podem ser cadastrados apenas pelo médico)
    try {
      const { data: patient } = await supabase
        .from('patients')
        .select('profile_id')
        .eq('id', patientId)
        .single();

      // Só cria lembrete se o paciente tiver perfil ativo no sistema
      if (patient?.profile_id) {
        await this.createNotification({
          userId: patient.profile_id,
          type: 'appointment_reminder',
          title: 'Lembrete de Consulta',
          message: `Você tem uma consulta agendada com Dr. ${doctorName} amanhã às ${appointmentTime}`,
          priority: 'high', // Prioridade alta para pacientes (mais crítico)
          appointmentId,
          patientId,
          scheduledFor: reminderDate,
        });
      }
    } catch (error) {
      // Falha silenciosa - não deve interromper o processo principal
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
      patientId,
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
      patientId,
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
      documentId,
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
      patientId,
    });
  }

  /**
   * Buscar notificações do usuário
   * 
   * Esta função implementa uma consulta otimizada para recuperar notificações:
   * 1. Seleciona apenas campos necessários para performance
   * 2. Filtra por usuário específico e exclui notificações deletadas
   * 3. Ordena por data de criação (mais recentes primeiro)
   * 4. Aplica limite configurável para paginação
   * 5. Inclui metadados de relacionamento (appointment_id, consultation_id, etc.)
   * 
   * A consulta é otimizada para interfaces de notificação em tempo real,
   * permitindo carregamento rápido e experiência fluida do usuário.
   */
  static async getUserNotifications(userId: string, limit = 20) {
    try {
      // Consulta otimizada com seleção específica de campos
      // Evita carregar dados desnecessários para melhor performance
      const { data, error } = await supabase
        .from('notifications')
        .select(
          `
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
        `
        )
        .eq('user_id', userId) // Filtro por usuário específico
        .neq('status', 'deleted') // Exclui notificações deletadas (soft delete)
        .order('created_at', { ascending: false }) // Mais recentes primeiro
        .limit(limit); // Paginação para performance

      if (error) {
        console.error('Erro ao buscar notificações:', error);
        return [];
      }

      // Retorna array vazio como fallback seguro
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
        notification_uuid: notificationId,
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
