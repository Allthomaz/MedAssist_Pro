import * as React from 'react';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { authService } from '@/services/auth';

interface UserProfile {
  id: string;
  full_name: string;
  role: string;
  email: string;
  crm?: string;
  specialty?: string;
  clinic_name?: string;
  custom_title?: string;
  phone?: string;
  theme_preference?: 'light' | 'dark' | 'system';
  compact_mode?: boolean;
  first_login_at?: string | null;
}

interface SupabaseError {
  name: string;
  message: string;
  status: number;
  code?: string;
}

interface AuthState {
  // Estado
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  initializing: boolean;

  // Ações
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setInitializing: (initializing: boolean) => void;

  // Funções de autenticação
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: SupabaseError | null }>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    profession: 'medico' | 'psicologo' | 'terapeuta'
  ) => Promise<{ error: SupabaseError | null }>;
  signOut: () => Promise<void>;
  resendConfirmation: (
    email: string
  ) => Promise<{ error: SupabaseError | null }>;
  requestPasswordReset: (
    email: string
  ) => Promise<{ error: SupabaseError | null }>;
  updatePassword: (
    newPassword: string
  ) => Promise<{ error: SupabaseError | null }>;

  // Funções auxiliares
  fetchUserProfile: (userId: string) => Promise<UserProfile | null>;
  createWelcomeNotification: (userProfile: UserProfile) => Promise<void>;
  markFirstLogin: (userId: string) => Promise<void>;
  initializeAuth: () => Promise<void>;
  setupAuthListener: () => () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // Estado inicial
        user: null,
        session: null,
        profile: null,
        initializing: true,

        // Setters
        setUser: user => set({ user }),
        setSession: session => set({ session }),
        setProfile: profile => set({ profile }),
        setInitializing: initializing => set({ initializing }),

        // Função para buscar perfil do usuário
        fetchUserProfile: async (
          userId: string
        ): Promise<UserProfile | null> => {
          try {
            type ProfileQueryResult = {
              id: string;
              full_name: string;
              role: string;
              email: string;
              crm: string | null;
              specialty: string | null;
              clinic_name: string | null;
              custom_title: string | null;
              phone: string | null;
              theme_preference: string | null;
              compact_mode: boolean | null;
              first_login_at: string | null;
            };

            const { data, error } = (await supabase
              .from('profiles')
              .select(
                'id, full_name, role, email, crm, specialty, clinic_name, custom_title, phone, theme_preference, compact_mode, first_login_at'
              )
              .eq('id', userId)
              .maybeSingle()) as {
              data: ProfileQueryResult | null;
              error: Error | null;
            };

            if (error) {
              console.error('Error fetching user profile:', error);
              const supabaseError = error as SupabaseError;
              if (
                supabaseError.code === 'PGRST116' ||
                error.message?.includes('0 rows')
              ) {
                console.warn(
                  'Usuário não encontrado no banco, limpando sessão'
                );
                await supabase.auth.signOut();
              }
              return null;
            }

            if (!data) {
              console.warn(`No profile found for user ID: ${userId}`);
              console.warn('Perfil não encontrado, limpando sessão');
              await supabase.auth.signOut();
              return null;
            }

            const userProfile: UserProfile = {
              id: data.id,
              full_name: data.full_name || '',
              role: data.role as 'doctor' | 'admin',
              email: data.email || '',
              crm: data.crm || '',
              specialty: data.specialty || '',
              clinic_name: data.clinic_name || '',
              custom_title: data.custom_title || '',
              phone: data.phone || '',
              theme_preference:
                (data.theme_preference as 'light' | 'dark' | 'system') ||
                'light',
              compact_mode: data.compact_mode || false,
              first_login_at: data.first_login_at || null,
            };

            return userProfile;
          } catch (error) {
            console.error('Error fetching user profile:', error);
            return null;
          }
        },

        // Função para criar notificação de boas-vindas
        createWelcomeNotification: async (userProfile: UserProfile) => {
          try {
            const welcomeTitle: string = 'Bem-vindo ao Doctor Brief AI!';
            let welcomeMessage = '';

            if (userProfile.role === 'doctor') {
              welcomeMessage = `Olá Dr(a). ${userProfile.full_name}! É uma honra tê-lo(a) conosco. Estamos aqui para ser uma extensão do seu consultório, oferecendo as melhores ferramentas de IA para otimizar seu atendimento médico. Seja bem-vindo(a) à nossa plataforma!`;
            } else {
              welcomeMessage = `Olá ${userProfile.full_name}! É uma honra tê-lo(a) conosco. Nossa plataforma está aqui para facilitar seu acompanhamento médico e oferecer a melhor experiência em cuidados de saúde. Seja bem-vindo(a)!`;
            }

            const { error } = await supabase.from('notifications').insert({
              user_id: userProfile.id,
              type: 'welcome_message',
              title: welcomeTitle,
              message: welcomeMessage,
              priority: 'high',
              channel: 'in_app',
              status: 'unread',
            });

            if (error) {
              console.error('Error creating welcome notification:', error);
            }
          } catch (error) {
            console.error('Error creating welcome notification:', error);
          }
        },

        // Função para marcar primeiro login
        markFirstLogin: async (userId: string) => {
          try {
            const { error } = await supabase
              .from('profiles')
              .update({
                first_login_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              })
              .eq('id', userId);

            if (error) {
              console.error('Error marking first login:', error);
            }
          } catch (error) {
            console.error('Error marking first login:', error);
          }
        },

        // Funções de autenticação
        signIn: async (email: string, password: string) => {
          const { error } = await authService.signIn(email, password);
          return {
            error: error
              ? {
                  name: error.name,
                  message: error.message,
                  status:
                    error instanceof Error
                      ? 500
                      : ((error as { status?: number }).status ?? 500),
                }
              : null,
          };
        },

        signUp: async (
          email: string,
          password: string,
          fullName: string,
          profession: 'medico' | 'psicologo' | 'terapeuta'
        ) => {
          const { error } = await authService.signUp({
            email,
            password,
            fullName,
            profession,
          });
          return {
            error: error
              ? {
                  name: error.name,
                  message: error.message,
                  status:
                    error instanceof Error
                      ? 500
                      : ((error as { status?: number }).status ?? 500),
                }
              : null,
          };
        },

        signOut: async () => {
          await authService.signOut();
          set({ profile: null });
        },

        resendConfirmation: async (email: string) => {
          const { error } = await authService.resendConfirmation(email);
          return {
            error: error
              ? {
                  name: error.name,
                  message: error.message,
                  status:
                    error instanceof Error
                      ? 500
                      : ((error as { status?: number }).status ?? 500),
                }
              : null,
          };
        },

        requestPasswordReset: async (email: string) => {
          const { error } = await authService.requestPasswordReset(email);
          return {
            error: error
              ? {
                  name: error.name,
                  message: error.message,
                  status:
                    error instanceof Error
                      ? 500
                      : ((error as { status?: number }).status ?? 500),
                }
              : null,
          };
        },

        updatePassword: async (newPassword: string) => {
          const { error } = await authService.updatePassword(newPassword);
          return {
            error: error
              ? {
                  name: error.name,
                  message: error.message,
                  status:
                    error instanceof Error
                      ? 500
                      : ((error as { status?: number }).status ?? 500),
                }
              : null,
          };
        },

        // Inicialização da autenticação
        initializeAuth: async () => {
          const {
            setUser,
            setSession,
            setProfile,
            setInitializing,
            fetchUserProfile,
            markFirstLogin,
            createWelcomeNotification,
          } = get();

          try {
            const {
              data: { session },
              error,
            } = await supabase.auth.getSession();

            if (error && error.message?.includes('Invalid Refresh Token')) {
              console.warn('Invalid refresh token detected, clearing session');
              await supabase.auth.signOut();
              setSession(null);
              setUser(null);
              setProfile(null);
            } else {
              setSession(session);
              setUser(session?.user ?? null);

              if (session?.user) {
                const userProfile = await fetchUserProfile(session.user.id);
                setProfile(userProfile);

                if (userProfile && !userProfile.first_login_at) {
                  await markFirstLogin(userProfile.id);
                  await createWelcomeNotification(userProfile);

                  setProfile({
                    ...userProfile,
                    first_login_at: new Date().toISOString(),
                  });
                }
              }
            }

            setInitializing(false);
          } catch (error) {
            console.error('Erro na inicialização da autenticação:', error);
            setSession(null);
            setUser(null);
            setProfile(null);
            setInitializing(false);
          }
        },

        // Setup do listener de autenticação
        setupAuthListener: () => {
          const {
            setUser,
            setSession,
            setProfile,
            setInitializing,
            fetchUserProfile,
            markFirstLogin,
            createWelcomeNotification,
          } = get();
          let initialized = false;

          const { data: listener } = supabase.auth.onAuthStateChange(
            async (event, newSession) => {
              if (event === 'TOKEN_REFRESHED' && !newSession) {
                console.warn('Token refresh failed, clearing local session');
                await supabase.auth.signOut();
                return;
              }

              if (!initialized && event !== 'INITIAL_SESSION') {
                return;
              }

              setSession(newSession);
              setUser(newSession?.user ?? null);

              if (newSession?.user) {
                const userProfile = await fetchUserProfile(newSession.user.id);
                setProfile(userProfile);

                if (
                  userProfile &&
                  !userProfile.first_login_at &&
                  event === 'SIGNED_IN'
                ) {
                  await markFirstLogin(userProfile.id);
                  await createWelcomeNotification(userProfile);

                  setProfile({
                    ...userProfile,
                    first_login_at: new Date().toISOString(),
                  });
                }
              } else {
                setProfile(null);
              }

              if (!initialized) {
                setInitializing(false);
                initialized = true;
              }
            }
          );

          return () => {
            listener?.subscription?.unsubscribe();
          };
        },
      }),
      {
        name: 'auth-store',
        partialize: (state: AuthState) => ({
          user: state.user,
          session: state.session,
          profile: state.profile,
        }),
      }
    )
  )
);

// Hook para compatibilidade com useAuth existente
export const useAuth = () => {
  const store = useAuthStore();

  return {
    user: store.user,
    session: store.session,
    profile: store.profile,
    initializing: store.initializing,
    signIn: store.signIn,
    signUp: store.signUp,
    signOut: store.signOut,
    resendConfirmation: store.resendConfirmation,
    requestPasswordReset: store.requestPasswordReset,
    updatePassword: store.updatePassword,
    setProfile: store.setProfile,
    fetchUserProfile: store.fetchUserProfile,
  };
};
