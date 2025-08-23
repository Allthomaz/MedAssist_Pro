import { useAuth } from '@/hooks/useAuth';

/**
 * Hook customizado para gerenciar perfil do usuário
 * 
 * Este hook fornece acesso ao perfil do usuário autenticado e utilitários
 * para formatação de informações profissionais.
 * 
 * @returns {Object} Objeto contendo:
 *   - profile: Perfil completo do usuário (UserProfile | null)
 *   - displayName: Nome de exibição do usuário (string)
 *   - professionalTitle: Título profissional (Dr., Psic., etc.) (string)
 *   - professionName: Nome da profissão (Médico, Psicólogo, etc.) (string)
 *   - professionNamePlural: Nome da profissão no plural (string)
 *   - fullDisplayName: Nome completo com título profissional (string)
 *   - getProfessionalTitle: Função para obter título profissional baseado no role
 *   - getProfessionName: Função para obter nome da profissão
 *   - getProfessionNamePlural: Função para obter nome da profissão no plural
 * 
 * @example
 * ```tsx
 * function ProfileCard() {
 *   const { 
 *     profile, 
 *     fullDisplayName, 
 *     professionName,
 *     professionalTitle
 *   } = useProfile();
 * 
 *   if (!profile) return <div>Carregando perfil...</div>;
 * 
 *   return (
 *     <div>
 *       <h2>{fullDisplayName}</h2>
 *       <p>Profissão: {professionName}</p>
 *       <p>Título: {professionalTitle}</p>
 *       {profile.role === 'doctor' && <p>CRM: {profile.crm}</p>}
 *     </div>
 *   );
 * }
 * ```
 * 
 * @example
 * ```tsx
 * // Usando as funções utilitárias
 * function ProfessionSelector() {
 *   const { getProfessionName, getProfessionNamePlural } = useProfile();
 * 
 *   const roles = ['doctor', 'psychologist', 'therapist'];
 * 
 *   return (
 *     <div>
 *       {roles.map(role => (
 *         <div key={role}>
 *           <p>Singular: {getProfessionName(role)}</p>
 *           <p>Plural: {getProfessionNamePlural(role)}</p>
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export const useProfile = () => {
  const { profile } = useAuth();

  /**
   * Formata o título profissional baseado no role do usuário
   * 
   * @param {string} role - Role do usuário (doctor, psychologist, etc.)
   * @returns {string} Título profissional formatado
   * 
   * @example
   * ```tsx
   * const title = getProfessionalTitle('doctor'); // Retorna "Dr."
   * const title2 = getProfessionalTitle('psychologist'); // Retorna "Psic."
   * ```
   */
  const getProfessionalTitle = (role: string) => {
    switch (role) {
      case 'medico':
      case 'doctor':
        return 'Dr.';
      case 'psicologo':
      case 'psychologist':
        return 'Psic.';
      case 'terapeuta':
      case 'therapist':
        return 'Ter.';
      case 'nutricionista':
      case 'nutritionist':
        return 'Nutr.';
      default:
        return 'Prof.';
    }
  };

  /**
   * Formata o nome da profissão baseado no role do usuário
   * 
   * @param {string} role - Role do usuário (doctor, psychologist, etc.)
   * @returns {string} Nome da profissão formatado
   * 
   * @example
   * ```tsx
   * const profession = getProfessionName('doctor'); // Retorna "Médico"
   * const profession2 = getProfessionName('psychologist'); // Retorna "Psicólogo"
   * ```
   */
  const getProfessionName = (role: string) => {
    switch (role) {
      case 'medico':
      case 'doctor':
        return 'Médico';
      case 'psicologo':
      case 'psychologist':
        return 'Psicólogo';
      case 'terapeuta':
      case 'therapist':
        return 'Terapeuta';
      case 'nutricionista':
      case 'nutritionist':
        return 'Nutricionista';
      default:
        return 'Profissional da Saúde';
    }
  };

  /**
   * Formata o nome da profissão no plural baseado no role do usuário
   * 
   * @param {string} role - Role do usuário (doctor, psychologist, etc.)
   * @returns {string} Nome da profissão no plural formatado
   * 
   * @example
   * ```tsx
   * const professions = getProfessionNamePlural('doctor'); // Retorna "Médicos"
   * const professions2 = getProfessionNamePlural('psychologist'); // Retorna "Psicólogos"
   * ```
   */
  const getProfessionNamePlural = (role: string) => {
    switch (role) {
      case 'medico':
      case 'doctor':
        return 'Médicos';
      case 'psicologo':
      case 'psychologist':
        return 'Psicólogos';
      case 'terapeuta':
      case 'therapist':
        return 'Terapeutas';
      case 'nutricionista':
      case 'nutritionist':
        return 'Nutricionistas';
      default:
        return 'Profissionais da Saúde';
    }
  };

  const displayName = profile?.full_name || 'Usuário';
  const professionalTitle =
    profile?.custom_title ||
    (profile?.role ? getProfessionalTitle(profile.role) : 'Dr.');
  const professionName = profile?.role
    ? getProfessionName(profile.role)
    : 'Profissional da Saúde';
  const professionNamePlural = profile?.role
    ? getProfessionNamePlural(profile.role)
    : 'Profissionais da Saúde';
  const fullDisplayName = `${professionalTitle} ${displayName}`;

  return {
    profile,
    displayName,
    professionalTitle,
    professionName,
    professionNamePlural,
    fullDisplayName,
    getProfessionalTitle,
    getProfessionName,
    getProfessionNamePlural,
  };
};
