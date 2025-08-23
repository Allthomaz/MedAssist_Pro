import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/hooks/useAuth';

/**
 * Hook customizado para gerenciar preferências de tema do usuário
 * 
 * Este hook aplica automaticamente as preferências de tema e modo compacto
 * do usuário quando o perfil é carregado. Sincroniza as configurações
 * salvas no banco de dados com o estado da aplicação.
 * 
 * @returns {Object} Objeto contendo:
 *   - themePreference: Preferência de tema do usuário ('light' | 'dark' | 'system' | undefined)
 *   - compactMode: Estado do modo compacto (boolean | undefined)
 * 
 * @example
 * ```tsx
 * function ThemeStatus() {
 *   const { themePreference, compactMode } = useThemePreferences();
 * 
 *   return (
 *     <div>
 *       <p>Tema atual: {themePreference || 'Não definido'}</p>
 *       <p>Modo compacto: {compactMode ? 'Ativado' : 'Desativado'}</p>
 *     </div>
 *   );
 * }
 * ```
 * 
 * 
 * // O bloco @example com sintaxe JSX foi removido para evitar erros de build.

 */
export const useThemePreferences = () => {
  const { setTheme } = useTheme();
  const { profile } = useAuth();

  /**
   * Aplica as preferências de tema quando o perfil é carregado
   * Sincroniza a preferência salva no banco com o estado do next-themes
   */
  useEffect(() => {
    if (profile?.theme_preference) {
      setTheme(profile.theme_preference);
    }
  }, [profile?.theme_preference, setTheme]);

  /**
   * Aplica o modo compacto adicionando/removendo classe CSS no body
   * O modo compacto pode ser usado para reduzir espaçamentos e tamanhos
   */
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
