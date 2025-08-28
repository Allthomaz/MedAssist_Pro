import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';

/**
 * Hook customizado para acessar o contexto de autenticação
 *
 * Este hook fornece acesso ao estado de autenticação e às funções relacionadas
 * à autenticação do usuário, incluindo login, logout, registro e gerenciamento
 * de perfil.
 *
 * @returns {AuthContextType} O contexto de autenticação contendo:
 *   - user: Usuário autenticado atual (User | null)
 *   - profile: Perfil do usuário com informações médicas (UserProfile | null)
 *   - loading: Estado de carregamento da autenticação (boolean)
 *   - signIn: Função para fazer login
 *   - signUp: Função para registrar novo usuário
 *   - signOut: Função para fazer logout
 *   - resendConfirmation: Função para reenviar confirmação de email
 *   - requestPasswordReset: Função para solicitar reset de senha
 *
 * @throws {Error} Lança erro se usado fora do AuthProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { user, profile, signIn, signOut, loading } = useAuth();
 *
 *   if (loading) return <div>Carregando...</div>;
 *
 *   if (!user) {
 *     return (
 *       <button onClick={() => signIn('email@example.com', 'password')}>
 *         Fazer Login
 *       </button>
 *     );
 *   }
 *
 *   return (
 *     <div>
 *       <h1>Bem-vindo, {profile?.full_name || user.email}!</h1>
 *       <button onClick={signOut}>Sair</button>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Verificando se o usuário é médico
 * function DoctorOnlyComponent() {
 *   const { profile } = useAuth();
 *
 *   if (profile?.role !== 'doctor') {
 *     return <div>Acesso restrito a médicos</div>;
 *   }
 *
 *   return <div>Conteúdo para médicos</div>;
 * }
 * ```
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
