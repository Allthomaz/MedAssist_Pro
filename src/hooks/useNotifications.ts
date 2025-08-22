import { useState, useEffect, useRef, useCallback } from 'react';
import { NotificationService } from '@/services/notificationService';
import { useAuth } from '@/hooks/useAuth';
import { KnownError, getErrorMessage } from '../types/common';

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

  // Marcar notificação como lida
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

  // Marcar todas as notificações como lidas
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

  // Criar nova notificação
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
