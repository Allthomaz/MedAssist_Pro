import { z } from 'zod';

/**
 * Schemas de validação robusta para autenticação
 * Implementa validações específicas para segurança e sanitização
 */
export const emailSchema = z
  .string()
  .min(1, 'E-mail é obrigatório')
  .email('Informe um e-mail válido')
  .max(254, 'E-mail muito longo') // RFC 5321 limit
  .transform(val => val.toLowerCase().trim()); // Sanitização

export const passwordSchema = z
  .string()
  .min(8, 'Senha deve ter pelo menos 8 caracteres')
  .max(128, 'Senha muito longa')
  .regex(/^(?=.*[a-z])/, 'Deve conter pelo menos uma letra minúscula')
  .regex(/^(?=.*[A-Z])/, 'Deve conter pelo menos uma letra maiúscula')
  .regex(/^(?=.*\d)/, 'Deve conter pelo menos um número')
  .regex(
    /^(?=.*[!@#$%^&*(),.?":{}|<>])/,
    'Deve conter pelo menos um caractere especial'
  )
  .refine(
    val => !/^(password|123456|qwerty|admin|letmein)$/i.test(val),
    'Senha muito comum, escolha uma mais segura'
  );

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Informe sua senha'),
});

export const signUpSchema = z
  .object({
    fullName: z
      .string()
      .min(2, 'Nome deve ter pelo menos 2 caracteres')
      .max(100, 'Nome muito longo')
      .regex(
        /^[a-zA-ZÀ-ÿ\s.]+$/,
        'Nome deve conter apenas letras, espaços e pontos'
      )
      .transform(val => val.trim().replace(/\s+/g, ' ')), // Sanitização
    profession: z.enum(['medico', 'psicologo', 'terapeuta'], {
      required_error: 'Selecione sua profissão',
    }),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirme sua senha'),
  })
  .refine(data => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Senhas não conferem',
  });

export const forgotSchema = z.object({
  email: emailSchema,
});
