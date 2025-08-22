import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/hooks/useAuth';

export const useThemePreferences = () => {
  const { setTheme } = useTheme();
  const { profile } = useAuth();

  // Aplicar preferências de tema quando o perfil for carregado
  useEffect(() => {
    if (profile?.theme_preference) {
      setTheme(profile.theme_preference);
    }
  }, [profile?.theme_preference, setTheme]);

  // Aplicar modo compacto (pode ser usado para adicionar classes CSS)
  useEffect(() => {
    const body = document.body;

    if (profile?.compact_mode) {
      body.classList.add('compact-mode');
    } else {
      body.classList.remove('compact-mode');
    }

    // Cleanup quando o componente for desmontado
    return () => {
      body.classList.remove('compact-mode');
    };
  }, [profile?.compact_mode]);

  return {
    themePreference: profile?.theme_preference,
    compactMode: profile?.compact_mode,
  };
};
