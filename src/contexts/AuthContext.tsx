import { createContext, useEffect, useMemo, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { authService } from '@/services/auth';
import { setSentryUser, clearSentryUser, addBreadcrumb } from '@/sentry';

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
}

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  initializing: boolean;
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
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [initializing, setInitializing] = useState(true);

  // Função para buscar perfil do usuário
  const fetchUserProfile = async (
    userId: string
  ): Promise<UserProfile | null> => {
    try {
      // Tipagem explícita para evitar erros de inferência do TypeScript
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
        console.warn(
          '🔄 [DEBUG] Erro ao buscar perfil, mas não fazendo signOut para evitar loop'
        );
        return null;
      }

      // If no profile found, return null without error
      if (!data) {
        console.warn(`No profile found for user ID: ${userId}`);
        console.warn(
          '🔄 [DEBUG] Perfil não encontrado, mas não fazendo signOut para evitar loop'
        );
        return null;
      }

      // Validação robusta dos dados antes da conversão
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
          (data.theme_preference as 'light' | 'dark' | 'system') || 'light',
        compact_mode: data.compact_mode || false,
        first_login_at: data.first_login_at || null,
      };

      return userProfile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Função para criar notificação de boas-vindas
  const createWelcomeNotification = async (userProfile: UserProfile) => {
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
  };

  // Função para marcar primeiro login
  const markFirstLogin = async (userId: string) => {
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
  };

  useEffect(() => {
    let mounted = true;
    let initialized = false;

    // Listener FIRST per best practices
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!mounted) return;

        // Handle token refresh errors
        if (event === 'TOKEN_REFRESHED' && !newSession) {
          console.warn('Token refresh failed, clearing local session');
          await supabase.auth.signOut();
          return;
        }

        // Só processa mudanças após inicialização
        if (!initialized && event !== 'INITIAL_SESSION') {
          return;
        }

        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (newSession?.user) {
          const userProfile = await fetchUserProfile(newSession.user.id);
          if (mounted) {
            setProfile(userProfile);

            // Configurar usuário no Sentry
            if (userProfile) {
              setSentryUser({
                id: userProfile.id,
                email: userProfile.email,
                username: userProfile.full_name,
                role: userProfile.role,
                crm: userProfile.crm,
                specialty: userProfile.specialty,
                clinic_name: userProfile.clinic_name,
              });
            }

            // Verificar se é o primeiro login e criar notificação de boas-vindas
            if (
              userProfile &&
              !userProfile.first_login_at &&
              event === 'SIGNED_IN'
            ) {
              await markFirstLogin(userProfile.id);
              await createWelcomeNotification(userProfile);

              // Atualizar o perfil local com o first_login_at
              setProfile({
                ...userProfile,
                first_login_at: new Date().toISOString(),
              });
            }
          }
        } else {
          if (mounted) {
            setProfile(null);
            clearSentryUser();
          }
        }

        if (mounted && !initialized) {
          setInitializing(false);
          initialized = true;
        }
      }
    );

    // Then check existing session
    const initializeAuth = async () => {
      try {
        console.log('🔄 [DEBUG] Iniciando inicialização da autenticação...');
        const startTime = Date.now();

        console.log('🔄 [DEBUG] Chamando supabase.auth.getSession()...');
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        console.log(
          '🔄 [DEBUG] getSession() completado em',
          Date.now() - startTime,
          'ms'
        );
        console.log(
          '🔄 [DEBUG] Session:',
          session ? 'Encontrada' : 'Não encontrada'
        );
        console.log('🔄 [DEBUG] Error:', error ? error.message : 'Nenhum erro');

        if (!mounted) return;

        // Handle invalid refresh token errors
        if (error && error.message?.includes('Invalid Refresh Token')) {
          console.warn('Invalid refresh token detected, clearing session');
          await supabase.auth.signOut();
          setSession(null);
          setUser(null);
          setProfile(null);
        } else {
          console.log(
            '🔄 [DEBUG] Usuário encontrado na sessão, configurando estados...'
          );
          setSession(session);
          setUser(session?.user ?? null);

          if (session?.user) {
            console.log('🔄 [DEBUG] Buscando perfil do usuário...');
            const profileStartTime = Date.now();
            const userProfile = await fetchUserProfile(session.user.id);
            console.log(
              '🔄 [DEBUG] fetchUserProfile() completado em',
              Date.now() - profileStartTime,
              'ms'
            );

            if (mounted) {
              console.log('🔄 [DEBUG] Configurando perfil do usuário...');
              setProfile(userProfile);

              // Configurar usuário no Sentry na inicialização
              if (userProfile) {
                setSentryUser({
                  id: userProfile.id,
                  email: userProfile.email,
                  username: userProfile.full_name,
                  role: userProfile.role,
                  crm: userProfile.crm,
                  specialty: userProfile.specialty,
                  clinic_name: userProfile.clinic_name,
                });
              }

              // Verificar se é o primeiro login na inicialização
              if (userProfile && !userProfile.first_login_at) {
                await markFirstLogin(userProfile.id);
                await createWelcomeNotification(userProfile);

                // Atualizar o perfil local com o first_login_at
                setProfile({
                  ...userProfile,
                  first_login_at: new Date().toISOString(),
                });
              }
            }
          }
        }

        if (mounted) {
          console.log(
            '🔄 [DEBUG] Finalizando inicialização - setInitializing(false)'
          );
          setInitializing(false);
          initialized = true;
          console.log('🔄 [DEBUG] Inicialização completa!');
        }
      } catch (error) {
        console.error('Erro na inicialização da autenticação:', error);
        // Clear session on any auth error
        if (mounted) {
          setSession(null);
          setUser(null);
          setProfile(null);
          setInitializing(false);
          initialized = true;
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      profile,
      initializing,
      async signIn(
        email: string,
        password: string
      ): Promise<{ error: SupabaseError | null }> {
        addBreadcrumb({
          message: 'Tentativa de login',
          category: 'auth',
          level: 'info',
          data: { email },
        });

        const { error } = await authService.signIn(email, password);

        if (error) {
          addBreadcrumb({
            message: 'Falha no login',
            category: 'auth',
            level: 'error',
            data: { email, error: error.message },
          });
        } else {
          addBreadcrumb({
            message: 'Login realizado com sucesso',
            category: 'auth',
            level: 'info',
            data: { email },
          });
        }

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
      async signUp(
        email: string,
        password: string,
        fullName: string,
        profession: 'medico' | 'psicologo' | 'terapeuta'
      ): Promise<{ error: SupabaseError | null }> {
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
      async signOut() {
        addBreadcrumb({
          message: 'Logout realizado',
          category: 'auth',
          level: 'info',
        });

        await authService.signOut();
        clearSentryUser();
        setProfile(null);
      },
      async resendConfirmation(
        email: string
      ): Promise<{ error: SupabaseError | null }> {
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
      async requestPasswordReset(
        email: string
      ): Promise<{ error: SupabaseError | null }> {
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
      async updatePassword(
        newPassword: string
      ): Promise<{ error: SupabaseError | null }> {
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
    }),
    [user, session, profile, initializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
