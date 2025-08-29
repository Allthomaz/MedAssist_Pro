import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { NotificationService } from '@/services/notificationService';
import { getErrorMessage } from '@/types/common';

/**
 * Interface que define a estrutura de uma notificação
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
 * Interface do estado do store de notificações
 */
interface NotificationState {
  // Estado
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  initialized: boolean;

  // Ações
  initialize: (userId: string) => Promise<void>;
  fetchNotifications: (userId: string) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: (userId: string) => Promise<void>;
  createNotification: (
    userId: string,
    type: string,
    title: string,
    content: string,
    priority?: 'low' | 'normal' | 'high' | 'urgent',
    relatedIds?: {
      appointmentId?: string;
      consultationId?: string;
      documentId?: string;
      patientId?: string;
    }
  ) => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  clearNotifications: () => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

/**
 * Store Zustand para gerenciamento de notificações
 *
 * Este store centraliza o estado das notificações do usuário,
 * fornecendo funcionalidades para buscar, marcar como lida,
 * criar e gerenciar notificações.
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
 *   } = useNotificationStore();
 *
 *   if (loading) return <div>Carregando notificações...</div>;
 *
 *   return (
 *     <div>
 *       <h2>Notificações ({unreadCount} não lidas)</h2>
 *       <button onClick={() => markAllAsRead(userId)}>Marcar todas como lidas</button>
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
export const useNotificationStore = create<NotificationState>()();
devtools(
  (set, get) => ({
    // Estado inicial
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
    initialized: false,

    /**
     * Inicializa o store com as notificações do usuário
     */
    initialize: async (userId: string) => {
      if (!userId) {
        set({
          notifications: [],
          unreadCount: 0,
          loading: false,
          error: null,
          initialized: false,
        });
        return;
      }

      const { initialized } = get();
      if (initialized) return;

      set({ loading: true, error: null });

      try {
        await get().fetchNotifications(userId);
        set({ initialized: true });
      } catch (error) {
        console.error('Erro ao inicializar notificações:', error);
        set({
          error: `Erro ao inicializar notificações: ${getErrorMessage(error)}`,
          loading: false,
        });
      }
    },

    /**
     * Busca notificações do usuário
     */
    fetchNotifications: async (userId: string) => {
      if (!userId) {
        set({
          notifications: [],
          unreadCount: 0,
          loading: false,
          error: null,
        });
        return;
      }

      set({ loading: true, error: null });

      try {
        console.log(
          'NotificationStore: Buscando notificações para usuário:',
          userId
        );

        const userNotifications =
          await NotificationService.getUserNotifications(userId);
        console.log(
          'NotificationStore: Notificações encontradas:',
          userNotifications?.length || 0
        );

        const formattedNotifications = (userNotifications || []).map(n => ({
          ...n,
          status: (n.status as 'read' | 'unread') || 'unread',
          priority:
            (n.priority as 'low' | 'normal' | 'high' | 'urgent') || 'normal',
          channel: (n.channel as 'in_app' | 'email' | 'sms') || 'in_app',
          delivery_status:
            (n.delivery_status as 'pending' | 'sent' | 'failed') || 'pending',
        }));

        const unreadNotifications =
          await NotificationService.getUnreadCount(userId);
        console.log(
          'NotificationStore: Notificações não lidas:',
          unreadNotifications
        );

        set({
          notifications: formattedNotifications,
          unreadCount: unreadNotifications,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error('NotificationStore: Erro ao buscar notificações:', error);
        set({
          error: `Erro ao carregar notificações: ${getErrorMessage(error)}`,
          loading: false,
        });
      }
    },

    /**
     * Marca uma notificação específica como lida
     */
    markAsRead: async (notificationId: string) => {
      try {
        await NotificationService.markAsRead(notificationId);

        set(state => ({
          notifications: state.notifications.map(notification =>
            notification.id === notificationId
              ? {
                  ...notification,
                  status: 'read' as const,
                  read_at: new Date().toISOString(),
                }
              : notification
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        }));
      } catch (error) {
        console.error('Erro ao marcar notificação como lida:', error);
        set({
          error: `Erro ao marcar notificação como lida: ${getErrorMessage(error)}`,
        });
      }
    },

    /**
     * Marca todas as notificações do usuário como lidas
     */
    markAllAsRead: async (userId: string) => {
      if (!userId) return;

      try {
        const { notifications } = get();
        const unreadNotifications = notifications.filter(
          n => n.status === 'unread'
        );

        // Marcar todas como lidas no backend
        for (const notification of unreadNotifications) {
          await NotificationService.markAsRead(notification.id);
        }

        // Atualizar estado local
        set(state => ({
          notifications: state.notifications.map(notification => ({
            ...notification,
            status: 'read' as const,
            read_at:
              notification.status === 'unread'
                ? new Date().toISOString()
                : notification.read_at,
          })),
          unreadCount: 0,
        }));
      } catch (error) {
        console.error(
          'Erro ao marcar todas as notificações como lidas:',
          error
        );
        set({
          error: `Erro ao marcar todas como lidas: ${getErrorMessage(error)}`,
        });
      }
    },

    /**
     * Cria uma nova notificação
     */
    createNotification: async (
      userId: string,
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
      if (!userId) return;

      try {
        await NotificationService.createNotification({
          userId,
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
        await get().fetchNotifications(userId);
      } catch (error) {
        console.error('Erro ao criar notificação:', error);
        set({ error: `Erro ao criar notificação: ${getErrorMessage(error)}` });
      }
    },

    /**
     * Remove uma notificação
     */
    deleteNotification: async (notificationId: string) => {
      try {
        // Assumindo que existe um método no service para deletar
        // await NotificationService.deleteNotification(notificationId);

        set(state => ({
          notifications: state.notifications.filter(
            n => n.id !== notificationId
          ),
          unreadCount:
            state.notifications.find(n => n.id === notificationId)?.status ===
            'unread'
              ? Math.max(0, state.unreadCount - 1)
              : state.unreadCount,
        }));
      } catch (error) {
        console.error('Erro ao deletar notificação:', error);
        set({
          error: `Erro ao deletar notificação: ${getErrorMessage(error)}`,
        });
      }
    },

    /**
     * Limpa todas as notificações do estado
     */
    clearNotifications: () => {
      set({
        notifications: [],
        unreadCount: 0,
        error: null,
        initialized: false,
      });
    },

    /**
     * Define uma mensagem de erro
     */
    setError: (error: string | null) => {
      set({ error });
    },

    /**
     * Define o estado de loading
     */
    setLoading: (loading: boolean) => {
      set({ loading });
    },
  }),
  {
    name: 'notification-store',
  }
);

/**
 * Hook de conveniência que mantém compatibilidade com a API anterior
 * Automaticamente inicializa o store quando o usuário muda
 */
export const useNotifications = () => {
  const store = useNotificationStore();

  return {
    notifications: store.notifications,
    unreadCount: store.unreadCount,
    loading: store.loading,
    error: store.error,
    fetchNotifications: store.fetchNotifications,
    markAsRead: store.markAsRead,
    markAllAsRead: store.markAllAsRead,
    createNotification: store.createNotification,
    deleteNotification: store.deleteNotification,
    refresh: store.fetchNotifications,
  };
};
