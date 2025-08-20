import { useAuth } from '@/hooks/useAuth';

export const useProfile = () => {
  const { profile } = useAuth();

  // Função para formatar o título profissional
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

  // Função para formatar o nome da profissão
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

  // Função para formatar o nome da profissão no plural
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
  const professionalTitle = profile?.role ? getProfessionalTitle(profile.role) : 'Prof.';
  const professionName = profile?.role ? getProfessionName(profile.role) : 'Profissional da Saúde';
  const professionNamePlural = profile?.role ? getProfessionNamePlural(profile.role) : 'Profissionais da Saúde';
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