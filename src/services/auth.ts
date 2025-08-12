import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

export type UserRole = "doctor" | "patient";

export interface SignUpPayload {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
}

export const authService = {
  // Sign up and attach metadata. Supabase will send a confirmation email if configured.
  async signUp({ email, password, fullName, role }: SignUpPayload) {
    const redirectUrl = `${window.location.origin}/auth`;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: { full_name: fullName, role },
      },
    });
    return { user: data.user, session: data.session, error };
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { user: data.user, session: data.session, error };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async resendConfirmation(email: string) {
    // Resend the confirmation (signup) email
    const { data, error } = await supabase.auth.resend({
      type: "signup",
      email,
    });
    return { data, error };
  },

  async requestPasswordReset(email: string) {
    const redirectUrl = `${window.location.origin}/auth/reset`;
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });
    return { data, error };
  },

  async updatePassword(newPassword: string) {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    return { data, error };
  },

  async getSession(): Promise<{ session: Session | null; user: User | null }> {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return { session, user: session?.user ?? null };
  },
};
