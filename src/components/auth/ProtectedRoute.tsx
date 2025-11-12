import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/stores/useAuthStore';
import { useThemePreferences } from '@/hooks/useThemePreferences';

const Loader = () => (
  <div className="flex items-center justify-center py-20">
    <div className="animate-pulse text-muted-foreground">Carregando…</div>
  </div>
);

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, initializing } = useAuth();
  const location = useLocation();

  // Aplicar preferências de tema quando o usuário estiver autenticado
  useThemePreferences();

  if (initializing) return <Loader />;
  if (!user) return <Navigate to="/auth" replace state={{ from: location }} />;

  // Se o usuário está autenticado mas sem perfil (usuário órfão),
  // não bloqueamos a navegação. Em vez de redirecionar forçadamente,
  // permitimos acesso às rotas para evitar o travamento em /settings.
  // A página de Configurações pode orientar o usuário a completar o perfil.
  // Caso seja necessário, futuros componentes podem checar `profile` diretamente.
  // if (!profile && location.pathname !== '/settings') {
  //   return (
  //     <Navigate
  //       to="/settings"
  //       replace
  //       state={{ from: location, missingProfile: true }}
  //     />
  //   );
  // }

  return <>{children}</>;
};
