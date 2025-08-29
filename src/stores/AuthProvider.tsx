import * as React from 'react';
import { useAuthStore } from './useAuthStore';

// Provider para inicialização
export const AuthStoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const initializeAuth = useAuthStore(state => state.initializeAuth);
  const setupAuthListener = useAuthStore(state => state.setupAuthListener);

  React.useEffect(() => {
    // Inicializar autenticação
    initializeAuth();

    // Setup do listener
    const cleanup = setupAuthListener();

    return cleanup;
  }, [initializeAuth, setupAuthListener]);

  return <>{children}</>;
};
