import { useState, useEffect, useRef, useCallback } from 'react';
import { NotificationService } from '@/services/notificationService';
import { useAuth } from '@/hooks/useAuth';
import { getErrorMessage } from '../types/common';

/**
 * Interface que define a estrutura de uma notificação
 *
 * @interface Notification
 * @property {string} id - ID único da notificação
 * @property {string} user_id - ID do usuário destinatário
 * @property {string} type - Tipo da notificação (appointment_reminder, document_ready, etc.)
 * @property {string} title - Título da notificação
 * @property {string} message - Mensagem da notificação
 * @property {'unread' | 'read'} status - Status de leitura
 * @property {'low' | 'normal' | 'high' | 'urgent'} priority - Prioridade da notificação
 * @property {'in_app' | 'email' | 'sms'} channel - Canal de entrega
 * @property {'pending' | 'sent' | 'failed'} [delivery_status] - Status de entrega
 * @property {string} created_at - Data de criação
 * @property {string} [read_at] - Data de leitura
 * @property {string} [appointment_id] - ID do agendamento relacionado
 * @property {string} [consultation_id] - ID da consulta relacionada
 * @property {string} [document_id] - ID do documento relacionado
 * @property {string} [patient_id] - ID do paciente relacionado
 */
export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  status: 'unread' | 'read';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  channel: 'in_app' | 'email' | 'sms';
  delivery_status?: 'pending' | 'sent' | 'failed';
  created_at: string;
  read_at?: string;
  appointment_id?: string;
  consultation_id?: string;
  document_id?: string;
  patient_id?: string;
}

/**
 * Hook customizado para gerenciar notificações do usuário
 *
 * Este hook fornece funcionalidades completas para gerenciar notificações,
 * incluindo busca, marcação como lida, contagem de não lidas e atualizações
 * em tempo real.
 *
 * @returns {Object} Objeto contendo:
 *   - notifications: Array de notificações do usuário
 *   - unreadCount: Número de notificações não lidas
 *   - loading: Estado de carregamento
 *   - error: Mensagem de erro, se houver
 *   - fetchNotifications: Função para buscar notificações
 *   - markAsRead: Função para marcar notificação como lida
 *   - markAllAsRead: Função para marcar todas como lidas
 *   - deleteNotification: Função para deletar notificação
 *   - refreshNotifications: Função para atualizar notificações
 *
 * @example
 * ```tsx
 * function NotificationCenter() {
 *   const {
 *     notifications,
 *     unreadCount,
 *     loading,
 *     markAsRead,
 *     markAllAsRead
 *   } = useNotifications();
 *
 *   if (loading) return <div>Carregando notificações...</div>;
 *
 *   return (
 *     <div>
 *       <h2>Notificações ({unreadCount} não lidas)</h2>
 *       <button onClick={markAllAsRead}>Marcar todas como lidas</button>
 *       {notifications.map(notification => (
 *         <div key={notification.id} onClick={() => markAsRead(notification.id)}>
 *           <h3>{notification.title}</h3>
 *           <p>{notification.message}</p>
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isLoadingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Buscar notificações do usuário
  const fetchNotifications = useCallback(async () => {
    if (!user?.id) {
      console.log(
        'useNotifications: Usuário não encontrado, definindo loading como false'
      );
      setLoading(false);
      return;
    }

    // Evitar múltiplas requisições simultâneas
    if (isLoadingRef.current) {
      console.log(
        'useNotifications: Já existe uma requisição em andamento, ignorando'
      );
      return;
    }

    // Cancelar requisição anterior se existir
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Criar novo AbortController
    abortControllerRef.current = new AbortController();
    isLoadingRef.current = true;

    try {
      console.log(
        'useNotifications: Iniciando busca de notificações para usuário:',
        user.id
      );
      setLoading(true);

      const userNotifications = await NotificationService.getUserNotifications(
        user.id
      );
      console.log(
        'useNotifications: Notificações encontradas:',
        userNotifications?.length || 0
      );

      // Verificar se a requisição foi cancelada
      if (abortControllerRef.current?.signal.aborted) {
        console.log('useNotifications: Requisição cancelada');
        return;
      }

      setNotifications(
        (userNotifications || []).map(n => ({
          ...n,
          status: (n.status as 'read' | 'unread') || 'unread',
          priority:
            (n.priority as 'low' | 'normal' | 'high' | 'urgent') || 'normal',
          channel: (n.channel as 'in_app' | 'email' | 'sms') || 'in_app',
          delivery_status:
            (n.delivery_status as 'pending' | 'sent' | 'failed') || 'pending',
        }))
      );

      const unreadNotifications = await NotificationService.getUnreadCount(
        user.id
      );
      console.log(
        'useNotifications: Notificações não lidas:',
        unreadNotifications
      );
      setUnreadCount(unreadNotifications);

      setError(null);
      console.log('useNotifications: Busca concluída com sucesso');
    } catch (err: KnownError) {
      // Ignorar erros de cancelamento
      if (
        err.name === 'AbortError' ||
        abortControllerRef.current?.signal.aborted
      ) {
        console.log('useNotifications: Requisição cancelada pelo usuário');
        return;
      }

      console.error('useNotifications: Erro ao buscar notificações:', err);
      setError(`Erro ao carregar notificações: ${getErrorMessage(err)}`);
    } finally {
      console.log('useNotifications: Definindo loading como false');
      isLoadingRef.current = false;
      setLoading(false);
    }
  }, [user?.id]);

  /**
   * Marca uma notificação específica como lida
   *
   * @param {string} notificationId - ID da notificação a ser marcada como lida
   * @returns {Promise<void>}
   *
   * @example
   * ```tsx
   * const { markAsRead } = useNotifications();
   *
   * const handleNotificationClick = async (notificationId: string) => {
   *   await markAsRead(notificationId);
   * };
   * ```
   */
  const markAsRead = async (notificationId: string) => {
    if (!user) return;

    try {
      await NotificationService.markAsRead(notificationId);

      // Atualizar estado local
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? {
                ...notification,
                status: 'read' as const,
                read_at: new Date().toISOString(),
              }
            : notification
        )
      );

      // Atualizar contador
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Erro ao marcar notificação como lida:', err);
    }
  };

  /**
   * Marca todas as notificações do usuário como lidas
   *
   * @returns {Promise<void>}
   *
   * @example
   * ```tsx
   * const { markAllAsRead } = useNotifications();
   *
   * const handleMarkAllAsRead = async () => {
   *   await markAllAsRead();
   *   console.log('Todas as notificações foram marcadas como lidas');
   * };
   * ```
   */
  const markAllAsRead = async () => {
    if (!user) return;

    try {
      const unreadNotifications = notifications.filter(
        n => n.status === 'unread'
      );

      for (const notification of unreadNotifications) {
        await NotificationService.markAsRead(notification.id);
      }

      // Atualizar estado local
      setNotifications(prev =>
        prev.map(notification => ({
          ...notification,
          status: 'read' as const,
          read_at:
            notification.status === 'unread'
              ? new Date().toISOString()
              : notification.read_at,
        }))
      );

      setUnreadCount(0);
    } catch (err) {
      console.error('Erro ao marcar todas as notificações como lidas:', err);
    }
  };

  /**
   * Cria uma nova notificação para o usuário atual
   *
   * @param {string} type - Tipo da notificação (ex: 'appointment_reminder', 'document_ready')
   * @param {string} title - Título da notificação
   * @param {string} content - Conteúdo/mensagem da notificação
   * @param {'low' | 'normal' | 'high' | 'urgent'} [priority='normal'] - Prioridade da notificação
   * @param {Object} [relatedIds] - IDs relacionados à notificação
   * @param {string} [relatedIds.appointmentId] - ID do agendamento relacionado
   * @param {string} [relatedIds.consultationId] - ID da consulta relacionada
   * @param {string} [relatedIds.documentId] - ID do documento relacionado
   * @param {string} [relatedIds.patientId] - ID do paciente relacionado
   * @returns {Promise<void>}
   *
   * @example
   * ```tsx
   * const { createNotification } = useNotifications();
   *
   * const handleCreateReminder = async () => {
   *   await createNotification(
   *     'appointment_reminder',
   *     'Consulta Agendada',
   *     'Você tem uma consulta amanhã às 14:00',
   *     'high',
   *     { appointmentId: 'apt_123', patientId: 'pat_456' }
   *   );
   * };
   * ```
   */
  const createNotification = async (
    type: string,
    title: string,
    content: string,
    priority: 'low' | 'normal' | 'high' | 'urgent' = 'normal',
    relatedIds?: {
      appointmentId?: string;
      consultationId?: string;
      documentId?: string;
      patientId?: string;
    }
  ) => {
    if (!user) return;

    try {
      await NotificationService.createNotification({
        userId: user.id,
        type,
        title,
        message: content,
        priority,
        appointmentId: relatedIds?.appointmentId,
        consultationId: relatedIds?.consultationId,
        documentId: relatedIds?.documentId,
        patientId: relatedIds?.patientId,
      });

      // Recarregar notificações
      await fetchNotifications();
    } catch (err) {
      console.error('Erro ao criar notificação:', err);
    }
  };

  // Efeito para carregar notificações quando o usuário mudar
  useEffect(() => {
    console.log('useNotifications useEffect: user?.id =', user?.id);
    if (user?.id) {
      console.log('useNotifications useEffect: Chamando fetchNotifications');
      fetchNotifications();
    } else {
      console.log(
        'useNotifications useEffect: Usuário não encontrado, limpando estado'
      );
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
    }

    // Cleanup: cancelar requisições pendentes
    return () => {
      if (abortControllerRef.current) {
        console.log(
          'useNotifications cleanup: Cancelando requisições pendentes'
        );
        abortControllerRef.current.abort();
      }
      isLoadingRef.current = false;
    };
  }, [user?.id, fetchNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    createNotification,
    refresh: fetchNotifications,
  };
};
