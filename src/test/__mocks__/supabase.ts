// Mock do cliente Supabase para testes
const mockSupabaseClient = {
  auth: {
    getSession: jest
      .fn()
      .mockResolvedValue({ data: { session: null }, error: null }),
    getUser: jest.fn().mockResolvedValue({ data: { user: null }, error: null }),
    signInWithPassword: jest
      .fn()
      .mockResolvedValue({ data: { user: null, session: null }, error: null }),
    signUp: jest
      .fn()
      .mockResolvedValue({ data: { user: null, session: null }, error: null }),
    signOut: jest.fn().mockResolvedValue({ error: null }),
    resend: jest.fn().mockResolvedValue({ data: {}, error: null }),
    resetPasswordForEmail: jest
      .fn()
      .mockResolvedValue({ data: {}, error: null }),
    updateUser: jest
      .fn()
      .mockResolvedValue({ data: { user: null }, error: null }),
    onAuthStateChange: jest.fn().mockReturnValue({
      data: { subscription: { unsubscribe: jest.fn() } },
    }),
  },
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: null, error: null }),
    insert: jest.fn().mockResolvedValue({ data: null, error: null }),
    update: jest.fn().mockResolvedValue({ data: null, error: null }),
  })),
};

export const createClient = jest.fn(() => mockSupabaseClient);
export const supabase = mockSupabaseClient;
export default mockSupabaseClient;
