import React, { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

const emailSchema = z.string().email("Informe um e-mail válido");
const passwordSchema = z
  .string()
  .min(8, "Mínimo de 8 caracteres")
  .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, "Use letras e números");

const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Informe sua senha"),
});

const signUpSchema = z
  .object({
    fullName: z.string().min(2, "Informe seu nome completo"),
    profession: z.enum(["medico", "psicologo", "terapeuta"], { required_error: "Selecione sua profissão" }),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Senhas não conferem",
  });

const forgotSchema = z.object({ email: emailSchema });

const useDebouncedLock = (delayMs = 1200) => {
  const [locked, setLocked] = useState(false);
  const acquire = () => {
    if (locked) return false;
    setLocked(true);
    setTimeout(() => setLocked(false), delayMs);
    return true;
  };
  return { locked, acquire };
};

const useSeo = () => {
  useEffect(() => {
    document.title = "Entrar ou criar conta | MedAssist Pro";
    const desc = "Autenticação segura para médicos e pacientes";
    const canonicalHref = `${window.location.origin}/auth`;

    const metaDesc = document.querySelector('meta[name="description"]') || document.createElement("meta");
    metaDesc.setAttribute("name", "description");
    metaDesc.setAttribute("content", desc);
    document.head.appendChild(metaDesc);

    const canonical = document.querySelector('link[rel="canonical"]') || document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    canonical.setAttribute("href", canonicalHref);
    document.head.appendChild(canonical);
  }, []);
};

export const AuthPage: React.FC = () => {
  const { signIn, signUp, resendConfirmation, requestPasswordReset, user } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [tab, setTab] = useState<"signin" | "signup" | "forgot">("signin");
  useSeo();

  // If already logged in, redirect to home
  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  // If coming from email confirmation
  useEffect(() => {
    if (params.get("mode") === "confirm") {
      toast.success("E-mail confirmado com sucesso. Faça login.");
    }
  }, [params]);

  const { locked, acquire } = useDebouncedLock();

  // Sign In form
  const signInForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSignIn = async (values: z.infer<typeof signInSchema>) => {
    if (!acquire()) return;
    const { error } = await signIn(values.email, values.password);
    if (error) {
      toast.error("Credenciais inválidas ou conta não confirmada.");
      return;
    }
    toast.success("Bem-vindo de volta!");
    navigate("/", { replace: true });
  };

  // Sign Up form
  const signUpForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { fullName: "", profession: "medico", email: "", password: "", confirmPassword: "" },
  });

  const onSignUp = async (values: z.infer<typeof signUpSchema>) => {
    if (!acquire()) return;
    const { error } = await signUp(values.email, values.password, values.fullName, values.profession);
    if (error) {
      toast.error("Não foi possível criar a conta. Tente novamente.");
      return;
    }
    toast.info("Verifique seu e-mail para confirmar a conta.");
    setTab("signin");
  };

  // Forgot Password form
  const forgotForm = useForm<z.infer<typeof forgotSchema>>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  const onForgot = async (values: z.infer<typeof forgotSchema>) => {
    if (!acquire()) return;
    const { error } = await requestPasswordReset(values.email);
    if (error) {
      toast.info("Se existir uma conta, você receberá um e-mail para redefinir a senha.");
    } else {
      toast.info("Se existir uma conta, você receberá um e-mail para redefinir a senha.");
    }
    setTab("signin");
  };

  const resend = async () => {
    const email = signInForm.getValues("email") || signUpForm.getValues("email");
    if (!email) return toast.info("Informe seu e-mail primeiro");
    const { error } = await resendConfirmation(email);
    if (error) return toast.error("Não foi possível reenviar. Tente mais tarde.");
    toast.success("E-mail de confirmação reenviado (se aplicável).");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <Card className="w-full max-w-md shadow-lg border-blue-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-blue-900">Acesso Profissional</CardTitle>
          <CardDescription className="text-blue-700">
            Plataforma exclusiva para profissionais da saúde
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="signin">Entrar</TabsTrigger>
              <TabsTrigger value="signup">Criar conta</TabsTrigger>
              <TabsTrigger value="forgot">Esqueci</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <Form {...signInForm}>
                <form onSubmit={signInForm.handleSubmit(onSignIn)} className="space-y-4" noValidate>
                  <FormField
                    control={signInForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail</FormLabel>
                        <FormControl>
                          <Input type="email" autoComplete="email" placeholder="voce@clinica.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signInForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                          <Input type="password" autoComplete="current-password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center justify-between">
                    <Button type="button" variant="ghost" onClick={() => setTab("forgot")}>Esqueci a senha</Button>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={locked}>Entrar</Button>
                  </div>

                  <div className="text-xs text-muted-foreground text-right">
                    <button type="button" onClick={resend} className="underline">Reenviar confirmação</button>
                  </div>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="signup">
              <Form {...signUpForm}>
                <form onSubmit={signUpForm.handleSubmit(onSignUp)} className="space-y-4" noValidate>
                  <FormField
                    control={signUpForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome completo</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Dr(a). Nome Sobrenome" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signUpForm.control}
                    name="profession"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profissão</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione sua profissão" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="medico">Médico</SelectItem>
                            <SelectItem value="psicologo">Psicólogo</SelectItem>
                            <SelectItem value="terapeuta">Terapeuta</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signUpForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail</FormLabel>
                        <FormControl>
                          <Input type="email" autoComplete="email" placeholder="voce@clinica.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signUpForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                          <Input type="password" autoComplete="new-password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signUpForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmar senha</FormLabel>
                        <FormControl>
                          <Input type="password" autoComplete="new-password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={locked}>Criar conta</Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Ao continuar, você concorda com nossos termos de uso e política de privacidade.
                  </p>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="forgot">
              <Form {...forgotForm}>
                <form onSubmit={forgotForm.handleSubmit(onForgot)} className="space-y-4" noValidate>
                  <FormField
                    control={forgotForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail</FormLabel>
                        <FormControl>
                          <Input type="email" autoComplete="email" placeholder="voce@clinica.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={locked}>Enviar link de redefinição</Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  );
};

export default AuthPage;
