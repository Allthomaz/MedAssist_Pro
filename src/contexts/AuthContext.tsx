import { createContext, useContext, useEffect, useMemo, useState } from 'react';
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
      const { data, error } = await supabase
        .from('profiles')
        .select(
          'id, full_name, role, email, crm, specialty, custom_title, phone, theme_preference, compact_mode, first_login_at'
        )
        .eq('id', userId)
        .maybeSingle(); // Use maybeSingle() instead of single() to handle 0 rows gracefully

      if (error) {
        console.error('Error fetching user profile:', error);
        // Se o usuário não existe no banco, limpar a sessão
        if (error.code === 'PGRST116' || error.message?.includes('0 rows')) {
          console.warn('Usuário não encontrado no banco, limpando sessão');
          await supabase.auth.signOut();
        }
        return null;
      }

      // If no profile found, return null without error
      if (!data) {
        console.warn(`No profile found for user ID: ${userId}`);
        // Se não há perfil, limpar a sessão
        console.warn('Perfil não encontrado, limpando sessão');
        await supabase.auth.signOut();
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Função para criar notificação de boas-vindas
  const createWelcomeNotification = async (userProfile: UserProfile) => {
    try {
      const welcomeTitle = 'Bem-vindo ao Doctor Brief AI!';
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
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (!mounted) return;

        // Handle invalid refresh token errors
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
            if (mounted) {
              setProfile(userProfile);

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
          setInitializing(false);
          initialized = true;
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
      async signIn(email, password) {
        const { error } = await authService.signIn(email, password);
        return { error };
      },
      async signUp(email, password, fullName, profession) {
        const { error } = await authService.signUp({
          email,
          password,
          fullName,
          profession,
        });
        return { error };
      },
      async signOut() {
        await authService.signOut();
        setProfile(null);
      },
      async resendConfirmation(email) {
        const { error } = await authService.resendConfirmation(email);
        return { error };
      },
      async requestPasswordReset(email) {
        const { error } = await authService.requestPasswordReset(email);
        return { error };
      },
      async updatePassword(newPassword) {
        const { error } = await authService.updatePassword(newPassword);
        return { error };
      },
    }),
    [user, session, profile, initializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
export { AuthProvider, useAuth };
