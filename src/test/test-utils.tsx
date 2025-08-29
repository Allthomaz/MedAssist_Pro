import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { AuthStoreProvider } from '../stores/AuthStoreProvider';
// import { Toaster } from '../components/ui/sonner';

// // Criar um QueryClient para testes
// const createTestQueryClient = () =>
//   new QueryClient({
//     defaultOptions: {
//       queries: {
//         retry: false,
//         gcTime: 0,
//       },
//       mutations: {
//         retry: false,
//       },
//     },
//   });

// Provider wrapper para testes
interface AllTheProvidersProps {
  children: React.ReactNode;
}

const AllTheProviders = ({ children }: AllTheProvidersProps) => {
  return <MemoryRouter>{children}</MemoryRouter>;
};

// Função customizada de render
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-exportar tudo do testing-library
export * from '@testing-library/react';
export { customRender as render };

// Utilitários adicionais para testes
export const createMockUser = () => ({
  id: 'test-user-id',
  email: 'test@example.com',
  user_metadata: {
    full_name: 'Test User',
    avatar_url: null,
  },
  app_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString(),
});

export const createMockPatient = () => ({
  id: 'test-patient-id',
  name: 'João Silva',
  email: 'joao@example.com',
  phone: '(11) 99999-9999',
  birth_date: '1990-01-01',
  gender: 'M' as const,
  address: 'Rua Teste, 123',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});

// Mock para Supabase
export const mockSupabase = {
  auth: {
    getUser: jest.fn(),
    signInWithPassword: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    onAuthStateChange: jest.fn(),
  },
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
  })),
};
