import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService, type SignUpPayload } from '../services/auth';
import { supabase } from '../integrations/supabase/client';

// Mock do Supabase client
vi.mock('../integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      getSession: vi.fn(),
    },
    from: vi.fn(() => ({
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn(),
    })),
  },
}));

describe('Auth Service Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('signUp', () => {
    it('should successfully sign up a new user and create profile', async () => {
      const mockUser = {
        id: 'test-user-id',
        email: 'test@example.com',
        created_at: new Date().toISOString(),
      };

      const mockSession = {
        access_token: 'mock-token',
        user: mockUser,
      };

      const signUpPayload: SignUpPayload = {
        email: 'test@example.com',
        password: 'password123',
        fullName: 'Dr. Test User',
        profession: 'medico',
      };

      // Mock successful signup
      vi.mocked(supabase.auth.signUp).mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null,
      });

      // Mock successful profile creation
      const mockInsert = vi.fn().mockResolvedValue({ error: null });
      vi.mocked(supabase.from).mockReturnValue({
        insert: mockInsert,
      } as any);

      const result = await authService.signUp(signUpPayload);

      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: signUpPayload.email,
        password: signUpPayload.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`,
          data: {
            full_name: signUpPayload.fullName,
            profession: signUpPayload.profession,
          },
        },
      });

      expect(supabase.from).toHaveBeenCalledWith('profiles');
      expect(mockInsert).toHaveBeenCalledWith({
        id: mockUser.id,
        full_name: signUpPayload.fullName,
        role: signUpPayload.profession,
        email: signUpPayload.email,
      });

      expect(result.user).toEqual(mockUser);
      expect(result.session).toEqual(mockSession);
      expect(result.error).toBeNull();
    });

    it('should handle signup errors', async () => {
      const signUpPayload: SignUpPayload = {
        email: 'invalid@example.com',
        password: 'weak',
        fullName: 'Test User',
        profession: 'medico',
      };

      const mockError = { message: 'Password too weak' };

      vi.mocked(supabase.auth.signUp).mockResolvedValue({
        data: { user: null, session: null },
        error: mockError,
      });

      const result = await authService.signUp(signUpPayload);

      expect(result.user).toBeNull();
      expect(result.session).toBeNull();
      expect(result.error).toEqual(mockError);
    });
  });

  describe('signIn', () => {
    it('should successfully sign in a user', async () => {
      const mockUser = {
        id: 'test-user-id',
        email: 'test@example.com',
      };

      const mockSession = {
        access_token: 'mock-token',
        user: mockUser,
      };

      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null,
      });

      const result = await authService.signIn(
        'test@example.com',
        'password123'
      );

      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.user).toEqual(mockUser);
      expect(result.session).toEqual(mockSession);
      expect(result.error).toBeNull();
    });

    it('should handle signin errors', async () => {
      const mockError = { message: 'Invalid credentials' };

      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
        data: { user: null, session: null },
        error: mockError,
      });

      const result = await authService.signIn(
        'wrong@example.com',
        'wrongpassword'
      );

      expect(result.user).toBeNull();
      expect(result.session).toBeNull();
      expect(result.error).toEqual(mockError);
    });
  });

  describe('signOut', () => {
    it('should successfully sign out', async () => {
      vi.mocked(supabase.auth.signOut).mockResolvedValue({ error: null });

      const result = await authService.signOut();

      expect(supabase.auth.signOut).toHaveBeenCalled();
      expect(result.error).toBeNull();
    });

    it('should handle signout errors', async () => {
      const mockError = { message: 'Signout failed' };
      vi.mocked(supabase.auth.signOut).mockResolvedValue({ error: mockError });

      const result = await authService.signOut();

      expect(result.error).toEqual(mockError);
    });
  });

  describe('getSession', () => {
    it('should return current session', async () => {
      const mockUser = { id: 'test-user-id', email: 'test@example.com' };
      const mockSession = { access_token: 'mock-token', user: mockUser };

      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });

      const result = await authService.getSession();

      expect(supabase.auth.getSession).toHaveBeenCalled();
      expect(result.session).toEqual(mockSession);
      expect(result.user).toEqual(mockUser);
    });

    it('should handle no session', async () => {
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: null },
        error: null,
      });

      const result = await authService.getSession();

      expect(result.session).toBeNull();
      expect(result.user).toBeNull();
    });
  });
});
