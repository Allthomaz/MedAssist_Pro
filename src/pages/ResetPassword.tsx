import React, { useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

/**
 * Schema de validação robusta para redefinição de senha
 * Implementa validações específicas para segurança e sanitização
 */
const schema = z
  .object({
    password: z
      .string()
      .min(8, 'Senha deve ter pelo menos 8 caracteres')
      .max(128, 'Senha muito longa')
      .regex(/^(?=.*[a-z])/, 'Deve conter pelo menos uma letra minúscula')
      .regex(/^(?=.*[A-Z])/, 'Deve conter pelo menos uma letra maiúscula')
      .regex(/^(?=.*\d)/, 'Deve conter pelo menos um número')
      .regex(/^(?=.*[!@#$%^&*(),.?":{}|<>])/, 'Deve conter pelo menos um caractere especial')
      .refine(
        val => !/^(password|123456|qwerty|admin|letmein)$/i.test(val),
        'Senha muito comum, escolha uma mais segura'
      ),
    confirmPassword: z.string().min(1, 'Confirme sua nova senha'),
  })
  .refine(v => v.password === v.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Senhas não conferem',
  });

const useSeo = () => {
  useEffect(() => {
    document.title = 'Redefinir senha | MedAssist Pro';
    const desc = 'Atualize sua senha com segurança';
    const canonicalHref = `${window.location.origin}/auth/reset`;

    const metaDesc =
      document.querySelector('meta[name="description"]') ||
      document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    metaDesc.setAttribute('content', desc);
    document.head.appendChild(metaDesc);

    const canonical =
      document.querySelector('link[rel="canonical"]') ||
      document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', canonicalHref);
    document.head.appendChild(canonical);
  }, []);
};

const ResetPassword: React.FC = () => {
  const { updatePassword, session } = useAuth();
  const navigate = useNavigate();
  useSeo();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  useEffect(() => {
    // If no recovery session yet, user likely opened a stale link
    // We still allow them to attempt; Supabase will error if not allowed
  }, [session]);

  const onSubmit = async (values: z.infer<typeof schema>) => {
    const { error } = await updatePassword(values.password);
    if (error) {
      toast.error('Não foi possível atualizar a senha. Abra o link novamente.');
      return;
    }
    toast.success('Senha atualizada. Faça login.');
    navigate('/auth', { replace: true });
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card border border-border rounded-lg p-6">
        <h1 className="text-2xl font-semibold mb-2">Redefinir senha</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Defina uma nova senha para sua conta.
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nova senha</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar nova senha</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Atualizar senha
            </Button>
          </form>
        </Form>
      </div>
    </main>
  );
};

export default ResetPassword;
