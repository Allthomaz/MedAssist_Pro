import { useState, useEffect } from 'react';
import { NotificationService } from '@/services/notificationService';
import { useAuth } from '@/hooks/useAuth';

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

  // Buscar notificações do usuário
  const fetchNotifications = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const userNotifications = await NotificationService.getUserNotifications(user.id);
      setNotifications((userNotifications || []).map(n => ({
        ...n,
        status: (n.status as 'read' | 'unread') || 'unread',
        priority: (n.priority as 'low' | 'normal' | 'high' | 'urgent') || 'normal',
        channel: (n.channel as 'in_app' | 'email' | 'sms') || 'in_app',
        delivery_status: (n.delivery_status as 'pending' | 'sent' | 'failed') || 'pending'
      })));
      
      const unreadNotifications = await NotificationService.getUnreadCount(user.id);
      setUnreadCount(unreadNotifications);
      
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar notificações:', err);
      setError('Erro ao carregar notificações');
    } finally {
      setLoading(false);
    }
  };

  // Marcar notificação como lida
  const markAsRead = async (notificationId: string) => {
    if (!user) return;

    try {
      await NotificationService.markAsRead(notificationId);
      
      // Atualizar estado local
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, status: 'read' as const, read_at: new Date().toISOString() }
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
      const unreadNotifications = notifications.filter(n => n.status === 'unread');
      
      for (const notification of unreadNotifications) {
        await NotificationService.markAsRead(notification.id);
      }
      
      // Atualizar estado local
      setNotifications(prev => 
        prev.map(notification => ({
          ...notification,
          status: 'read' as const,
          read_at: notification.status === 'unread' ? new Date().toISOString() : notification.read_at
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
        patientId: relatedIds?.patientId
      });
      
      // Recarregar notificações
      await fetchNotifications();
    } catch (err) {
      console.error('Erro ao criar notificação:', err);
    }
  };

  // Efeito para carregar notificações quando o usuário mudar
  useEffect(() => {
    if (user) {
      fetchNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
    }
  }, [user]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    createNotification,
    refresh: fetchNotifications
  };
};