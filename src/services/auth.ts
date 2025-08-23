import { supabase } from '@/integrations/supabase/client';
import type { Session, User } from '@supabase/supabase-js';

/**
 * Tipos de profissão suportados pelo sistema
 * @typedef {('medico'|'psicologo'|'terapeuta')} UserProfession
 */
export type UserProfession = 'medico' | 'psicologo' | 'terapeuta';

/**
 * Payload para cadastro de novos usuários
 * @interface SignUpPayload
 */
export interface SignUpPayload {
  /** Email do usuário (será sanitizado automaticamente) */
  email: string;
  /** Senha do usuário (mínimo 8 caracteres) */
  password: string;
  /** Nome completo do usuário (será sanitizado automaticamente) */
  fullName: string;
  /** Profissão do usuário (deve ser um valor válido) */
  profession: UserProfession;
}

/**
 * Utilitários de sanitização para prevenir XSS e outros ataques
 *
 * Conjunto de funções para sanitizar e validar inputs do usuário,
 * garantindo segurança contra ataques de injeção e XSS.
 *
 * @namespace sanitizeUtils
 */
const sanitizeUtils = {
  /**
   * Remove caracteres perigosos e sanitiza strings genéricas
   *
   * Remove caracteres HTML perigosos, normaliza espaços e limita o tamanho.
   * Usado para campos de texto geral que não têm validação específica.
   *
   * @param {string} input - String a ser sanitizada
   * @returns {string} String sanitizada e segura
   *
   * @example
   * ```typescript
   * const safe = sanitizeUtils.sanitizeString('<script>alert("xss")</script>Hello');
   * // Retorna: 'scriptalert(xss)/scriptHello'
   * ```
   */
  sanitizeString(input: string): string {
    if (!input || typeof input !== 'string') return '';

    return input
      .trim()
      .replace(/[<>"'&]/g, '') // Remove caracteres HTML perigosos
      .replace(/\s+/g, ' ') // Normaliza espaços
      .substring(0, 255); // Limita tamanho
  },

  /**
   * Sanitiza e valida endereços de email
   *
   * Remove caracteres não permitidos em emails, converte para minúsculas
   * e aplica limite de tamanho conforme RFC 5321.
   *
   * @param {string} email - Email a ser sanitizado
   * @returns {string} Email sanitizado ou string vazia se inválido
   *
   * @example
   * ```typescript
   * const email = sanitizeUtils.sanitizeEmail('  USER@EXAMPLE.COM  ');
   * // Retorna: 'user@example.com'
   * ```
   */
  sanitizeEmail(email: string): string {
    if (!email || typeof email !== 'string') return '';

    return email
      .toLowerCase()
      .trim()
      .replace(/[^a-zA-Z0-9@._-]/g, '') // Remove caracteres não permitidos
      .substring(0, 254); // RFC 5321 limit
  },

  /**
   * Sanitiza nomes completos de usuários
   *
   * Remove caracteres HTML perigosos, permite apenas letras (incluindo acentos),
   * espaços e pontos. Normaliza espaços múltiplos e limita o tamanho.
   *
   * @param {string} name - Nome a ser sanitizado
   * @returns {string} Nome sanitizado ou string vazia se inválido
   *
   * @example
   * ```typescript
   * const name = sanitizeUtils.sanitizeFullName('  Dr. João<script> Silva  ');
   * // Retorna: 'Dr. João Silva'
   * ```
   */
  sanitizeFullName(name: string): string {
    if (!name || typeof name !== 'string') return '';

    return name
      .trim()
      .replace(/[<>"'&]/g, '') // Remove caracteres HTML perigosos
      .replace(/[^a-zA-ZÀ-ÿ\s.]/g, '') // Permite apenas letras, espaços e pontos
      .replace(/\s+/g, ' ') // Normaliza espaços
      .substring(0, 100); // Limita tamanho
  },

  /**
   * Valida se a profissão informada é suportada pelo sistema
   *
   * Verifica se a profissão está na lista de valores permitidos.
   *
   * @param {string} profession - Profissão a ser validada
   * @returns {UserProfession|null} Profissão válida ou null se inválida
   *
   * @example
   * ```typescript
   * const prof = sanitizeUtils.validateProfession('medico');
   * // Retorna: 'medico'
   *
   * const invalid = sanitizeUtils.validateProfession('invalid');
   * // Retorna: null
   * ```
   */
  validateProfession(profession: string): UserProfession | null {
    const validProfessions: UserProfession[] = [
      'medico',
      'psicologo',
      'terapeuta',
    ];
    return validProfessions.includes(profession as UserProfession)
      ? (profession as UserProfession)
      : null;
  },
};

/**
 * Serviço de autenticação e gerenciamento de usuários
 *
 * Fornece funcionalidades completas para:
 * - Cadastro seguro de usuários com sanitização automática
 * - Login e logout com validação
 * - Recuperação de senha
 * - Reenvio de confirmação de email
 * - Gerenciamento de sessões
 * - Criação automática de perfis no banco de dados
 *
 * Todos os inputs são automaticamente sanitizados para prevenir ataques XSS.
 *
 * @namespace authService
 * @example
 * ```typescript
 * // Cadastrar novo usuário
 * const result = await authService.signUp({
 *   email: 'medico@exemplo.com',
 *   password: 'senhaSegura123',
 *   fullName: 'Dr. João Silva',
 *   profession: 'medico'
 * });
 *
 * // Fazer login
 * const loginResult = await authService.signIn('medico@exemplo.com', 'senhaSegura123');
 * ```
 */
export const authService = {
  /**
   * Cadastra um novo usuário no sistema
   *
   * Realiza as seguintes operações:
   * 1. Sanitiza e valida todos os inputs
   * 2. Cria conta no Supabase Auth
   * 3. Cria perfil na tabela 'profiles'
   * 4. Define role baseada na profissão
   *
   * @param {SignUpPayload} payload - Dados do usuário para cadastro
   * @returns {Promise<{user: User|null, session: Session|null, error: Error|null}>}
   * @throws {Error} Quando dados são inválidos ou senha é muito fraca
   *
   * @example
   * ```typescript
   * const result = await authService.signUp({
   *   email: 'dr.silva@hospital.com',
   *   password: 'minhasenha123',
   *   fullName: 'Dr. João Silva',
   *   profession: 'medico'
   * });
   *
   * if (result.error) {
   *   console.error('Erro no cadastro:', result.error.message);
   * } else {
   *   console.log('Usuário cadastrado:', result.user?.email);
   * }
   * ```
   */
  async signUp({ email, password, fullName, profession }: SignUpPayload) {
    console.log('AuthService: Iniciando processo de cadastro para:', {
      email,
      fullName,
      profession,
    });

    // Sanitizar e validar inputs
    const sanitizedEmail = sanitizeUtils.sanitizeEmail(email);
    const sanitizedFullName = sanitizeUtils.sanitizeFullName(fullName);
    const validatedProfession = sanitizeUtils.validateProfession(profession);

    // Validações de segurança
    if (!sanitizedEmail || !sanitizedFullName || !validatedProfession) {
      console.error('AuthService: Falha na validação dos dados de cadastro.', {
        email: sanitizedEmail,
        fullName: sanitizedFullName,
        profession: validatedProfession,
      });
      return {
        user: null,
        session: null,
        error: new Error('Dados inválidos fornecidos'),
      };
    }
    console.log('AuthService: Dados de cadastro validados com sucesso.');

    if (!password || password.length < 8) {
      console.error('AuthService: Senha fornecida é muito fraca.');
      return {
        user: null,
        session: null,
        error: new Error('Senha deve ter pelo menos 8 caracteres'),
      };
    }

    const redirectUrl = `${window.location.origin}/auth`;

    const getRoleFromProfession = (prof: UserProfession) => {
      if (['medico', 'psicologo', 'terapeuta'].includes(prof)) {
        return 'doctor';
      }
      return 'patient'; // Default role
    };

    const role = getRoleFromProfession(validatedProfession);

    console.log(
      `AuthService: Tentando criar usuário no Supabase com role: ${role}`
    );
    const { data, error } = await supabase.auth.signUp({
      email: sanitizedEmail,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: { full_name: sanitizedFullName, profession: validatedProfession },
      },
    });

    if (error) {
      console.error('AuthService: Erro ao criar usuário no Supabase Auth:', {
        message: error.message,
        status: (error as { status?: number }).status,
      });
    } else if (data.user) {
      console.log(
        'AuthService: Usuário criado com sucesso no Supabase Auth:',
        data.user.id
      );
    }

    // Profile creation is handled automatically by database trigger
    // The trigger 'on_auth_user_created' will create the profile using raw_user_meta_data
    if (data.user && !error) {
      console.log(
        'AuthService: Usuário cadastrado com sucesso. Perfil será criado automaticamente pelo trigger do banco.'
      );
    }

    return { user: data.user, session: data.session, error };
  },

  /**
   * Autentica um usuário no sistema
   *
   * Sanitiza o email automaticamente e realiza login seguro.
   * Inclui logs detalhados para debugging e monitoramento.
   *
   * @param {string} email - Email do usuário (será sanitizado)
   * @param {string} password - Senha do usuário
   * @returns {Promise<{user: User|null, session: Session|null, error: Error|null}>}
   *
   * @example
   * ```typescript
   * const result = await authService.signIn('medico@exemplo.com', 'minhasenha');
   *
   * if (result.error) {
   *   console.error('Falha no login:', result.error.message);
   * } else {
   *   console.log('Login realizado:', result.user?.email);
   *   // Redirecionar para dashboard
   * }
   * ```
   */
  async signIn(email: string, password: string) {
    // Sanitizar e validar inputs
    const sanitizedEmail = sanitizeUtils.sanitizeEmail(email);

    // Validações de segurança
    if (!sanitizedEmail || !password) {
      return {
        user: null,
        session: null,
        error: new Error('Email e senha são obrigatórios'),
      };
    }

    console.log('AuthService: Iniciando login para:', sanitizedEmail);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password,
      });

      if (error) {
        console.error('AuthService: Erro no login:', {
          message: error.message,
          status: error.status,
          name: error.name,
        });
      } else {
        console.log('AuthService: Login bem-sucedido para:', sanitizedEmail);
      }

      return { user: data.user, session: data.session, error };
    } catch (err) {
      console.error('AuthService: Erro inesperado no login:', err);
      return { user: null, session: null, error: err as Error };
    }
  },

  /**
   * Realiza logout do usuário atual
   *
   * Encerra a sessão ativa no Supabase Auth.
   *
   * @returns {Promise<{error: Error|null}>}
   *
   * @example
   * ```typescript
   * const result = await authService.signOut();
   *
   * if (result.error) {
   *   console.error('Erro no logout:', result.error.message);
   * } else {
   *   // Redirecionar para página de login
   *   window.location.href = '/auth';
   * }
   * ```
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  /**
   * Reenvia email de confirmação de cadastro
   *
   * Útil quando o usuário não recebeu o email inicial ou ele expirou.
   * O email é automaticamente sanitizado antes do envio.
   *
   * @param {string} email - Email para reenvio (será sanitizado)
   * @returns {Promise<{data: any, error: Error|null}>}
   *
   * @example
   * ```typescript
   * const result = await authService.resendConfirmation('medico@exemplo.com');
   *
   * if (result.error) {
   *   console.error('Erro ao reenviar:', result.error.message);
   * } else {
   *   console.log('Email de confirmação reenviado com sucesso');
   * }
   * ```
   */
  async resendConfirmation(email: string) {
    // Sanitizar e validar input
    const sanitizedEmail = sanitizeUtils.sanitizeEmail(email);

    if (!sanitizedEmail) {
      return {
        data: null,
        error: new Error('Email inválido fornecido'),
      };
    }

    // Resend the confirmation (signup) email
    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email: sanitizedEmail,
    });
    return { data, error };
  },

  /**
   * Solicita redefinição de senha via email
   *
   * Envia email com link seguro para redefinição de senha.
   * O usuário será redirecionado para /auth/reset após clicar no link.
   *
   * @param {string} email - Email do usuário (será sanitizado)
   * @returns {Promise<{data: any, error: Error|null}>}
   *
   * @example
   * ```typescript
   * const result = await authService.requestPasswordReset('medico@exemplo.com');
   *
   * if (result.error) {
   *   console.error('Erro na solicitação:', result.error.message);
   * } else {
   *   console.log('Email de redefinição enviado');
   * }
   * ```
   */
  async requestPasswordReset(email: string) {
    // Sanitizar e validar input
    const sanitizedEmail = sanitizeUtils.sanitizeEmail(email);

    if (!sanitizedEmail) {
      return {
        data: null,
        error: new Error('Email inválido fornecido'),
      };
    }

    const redirectUrl = `${window.location.origin}/auth/reset`;
    const { data, error } = await supabase.auth.resetPasswordForEmail(
      sanitizedEmail,
      {
        redirectTo: redirectUrl,
      }
    );
    return { data, error };
  },

  /**
   * Atualiza a senha do usuário autenticado
   *
   * Requer que o usuário esteja logado. Usado principalmente
   * no fluxo de redefinição de senha.
   *
   * @param {string} newPassword - Nova senha do usuário
   * @returns {Promise<{data: any, error: Error|null}>}
   *
   * @example
   * ```typescript
   * const result = await authService.updatePassword('novaSenhaSegura123');
   *
   * if (result.error) {
   *   console.error('Erro ao atualizar senha:', result.error.message);
   * } else {
   *   console.log('Senha atualizada com sucesso');
   * }
   * ```
   */
  async updatePassword(newPassword: string) {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    return { data, error };
  },

  /**
   * Obtém a sessão atual do usuário
   *
   * Verifica se existe uma sessão ativa e retorna os dados do usuário.
   * Usado para verificar estado de autenticação.
   *
   * @returns {Promise<{session: Session|null, user: User|null}>}
   *
   * @example
   * ```typescript
   * const { session, user } = await authService.getSession();
   *
   * if (session && user) {
   *   console.log('Usuário logado:', user.email);
   * } else {
   *   console.log('Usuário não autenticado');
   *   // Redirecionar para login
   * }
   * ```
   */
  async getSession(): Promise<{ session: Session | null; user: User | null }> {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return { session, user: session?.user ?? null };
  },
};
