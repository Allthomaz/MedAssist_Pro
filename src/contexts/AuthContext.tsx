import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { authService } from "@/services/auth";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  initializing: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    role: "doctor" | "patient"
  ) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
  resendConfirmation: (email: string) => Promise<{ error: any | null }>;
  requestPasswordReset: (email: string) => Promise<{ error: any | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: any | null }>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Listener FIRST per best practices
    const { data: listener } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
    });

    // Then check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setInitializing(false);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      initializing,
      async signIn(email, password) {
        const { error } = await authService.signIn(email, password);
        return { error };
      },
      async signUp(email, password, fullName, role) {
        const { error } = await authService.signUp({ email, password, fullName, role });
        return { error };
      },
      async signOut() {
        await authService.signOut();
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
    [user, session, initializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
