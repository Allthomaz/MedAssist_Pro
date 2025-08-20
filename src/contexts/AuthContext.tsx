import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { authService } from "@/services/auth";

interface UserProfile {
  id: string;
  full_name: string;
  role: string;
  email: string;
  crm?: string;
  specialty?: string;
  clinic_name?: string;
}

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  initializing: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    profession: "medico" | "psicologo" | "terapeuta"
  ) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
  resendConfirmation: (email: string) => Promise<{ error: any | null }>;
  requestPasswordReset: (email: string) => Promise<{ error: any | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: any | null }>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [initializing, setInitializing] = useState(true);

  // Função para buscar perfil do usuário
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, role, email, crm, specialty, clinic_name')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Erro ao buscar perfil:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;
    let initialized = false;
    
    // Listener FIRST per best practices
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return;
      
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
    });

    // Then check existing session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const userProfile = await fetchUserProfile(session.user.id);
          if (mounted) {
            setProfile(userProfile);
          }
        }
        
        if (mounted) {
          setInitializing(false);
          initialized = true;
        }
      } catch (error) {
        console.error('Erro na inicialização da autenticação:', error);
        if (mounted) {
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
        const { error } = await authService.signUp({ email, password, fullName, profession });
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
