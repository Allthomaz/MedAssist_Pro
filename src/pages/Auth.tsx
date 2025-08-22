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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Mail, 
  Lock, 
  User, 
  Stethoscope, 
  LogIn, 
  ArrowLeft, 
  UserPlus, 
  KeyRound, 
  Eye, 
  EyeOff,
  Loader2,
  Shield
} from "lucide-react";

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
    
    console.log('Tentando fazer login com:', values.email);
    const { error } = await signIn(values.email, values.password);
    
    if (error) {
      console.error('Erro de autenticação:', error);
      
      // Mensagens de erro mais específicas
      if (error.message?.includes('Invalid login credentials')) {
        toast.error("E-mail ou senha incorretos. Verifique suas credenciais.");
      } else if (error.message?.includes('Email not confirmed')) {
        toast.error("Conta não confirmada. Verifique seu e-mail e clique no link de confirmação.");
      } else if (error.message?.includes('Too many requests')) {
        toast.error("Muitas tentativas de login. Aguarde alguns minutos e tente novamente.");
      } else {
        toast.error(`Erro no login: ${error.message || 'Credenciais inválidas'}`);
      }
      return;
    }
    
    console.log('Login realizado com sucesso');
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
      toast.error("Erro ao enviar e-mail de recuperação. Tente novamente.", {
        description: "Verifique se o e-mail está correto e tente novamente."
      });
    } else {
      toast.success("E-mail de recuperação enviado!", {
        description: "Verifique sua caixa de entrada e spam. O link expira em 1 hora."
      });
      // Em desenvolvimento, mostrar link do Inbucket
      if (process.env.NODE_ENV === 'development') {
        toast.info("Desenvolvimento: Verifique o Inbucket", {
          description: "Acesse http://127.0.0.1:54324 para ver o e-mail."
        });
      }
    }
    setTab("signin");
  };

  const resend = async () => {
    const email = signInForm.getValues("email") || signUpForm.getValues("email");
    if (!email) {
      toast.warning("E-mail necessário", {
        description: "Digite seu e-mail primeiro para reenviar a confirmação."
      });
      return;
    }
    
    const { error } = await resendConfirmation(email);
    if (error) {
      toast.error("Erro ao reenviar confirmação", {
        description: "Tente novamente em alguns minutos."
      });
      return;
    }
    
    toast.success("E-mail de confirmação reenviado!", {
      description: "Verifique sua caixa de entrada e spam."
    });
    
    // Em desenvolvimento, mostrar link do Inbucket
    if (process.env.NODE_ENV === 'development') {
      toast.info("Desenvolvimento: Verifique o Inbucket", {
        description: "Acesse http://127.0.0.1:54324 para ver o e-mail."
      });
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <Card className="w-full max-w-md shadow-lg border-blue-200">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
              <Stethoscope className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-blue-900 flex items-center justify-center gap-2">
            <Shield className="w-5 h-5" />
            Acesso Profissional
          </CardTitle>
          <CardDescription className="text-blue-700">
            Plataforma exclusiva para profissionais da saúde
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="signin" className="flex items-center gap-2">
                <LogIn className="w-4 h-4" />
                Entrar
              </TabsTrigger>
              <TabsTrigger value="signup" className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Criar conta
              </TabsTrigger>
              <TabsTrigger value="forgot" className="flex items-center gap-2">
                <KeyRound className="w-4 h-4" />
                Esqueci
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <Form {...signInForm}>
                <form onSubmit={signInForm.handleSubmit(onSignIn)} className="space-y-4" noValidate>
                  <FormField
                    control={signInForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          E-mail
                        </FormLabel>
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
                        <FormLabel className="flex items-center gap-2">
                          <Lock className="w-4 h-4" />
                          Senha
                        </FormLabel>
                        <FormControl>
                          <Input type="password" autoComplete="current-password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center justify-between">
                    <Button type="button" variant="ghost" onClick={() => setTab("forgot")} className="flex items-center gap-2">
                      <KeyRound className="w-4 h-4" />
                      Esqueci a senha
                    </Button>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2" disabled={locked}>
                      {locked ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
                      Entrar
                    </Button>
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
                        <FormLabel className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Nome completo
                        </FormLabel>
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
                        <FormLabel className="flex items-center gap-2">
                          <Stethoscope className="w-4 h-4" />
                          Profissão
                        </FormLabel>
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
                        <FormLabel className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          E-mail
                        </FormLabel>
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
                        <FormLabel className="flex items-center gap-2">
                          <Lock className="w-4 h-4" />
                          Senha
                        </FormLabel>
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
                        <FormLabel className="flex items-center gap-2">
                          <Lock className="w-4 h-4" />
                          Confirmar senha
                        </FormLabel>
                        <FormControl>
                          <Input type="password" autoComplete="new-password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2" disabled={locked}>
                    {locked ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                    Criar conta
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Ao continuar, você concorda com nossos termos de uso e política de privacidade.
                  </p>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="forgot">
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 mx-auto">
                    <KeyRound className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Recuperar Senha</h3>
                  <p className="text-sm text-gray-600">
                    Digite seu e-mail e enviaremos um link seguro para redefinir sua senha.
                  </p>
                </div>
                
                <Form {...forgotForm}>
                  <form onSubmit={forgotForm.handleSubmit(onForgot)} className="space-y-4" noValidate>
                    <FormField
                      control={forgotForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            E-mail cadastrado
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              autoComplete="email" 
                              placeholder="seu.email@clinica.com" 
                              className="h-11"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <Shield className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="text-xs text-blue-700">
                          <p className="font-medium mb-1">Instruções importantes:</p>
                          <ul className="space-y-1 list-disc list-inside">
                            <li>Verifique sua caixa de entrada e spam</li>
                            <li>O link expira em 1 hora por segurança</li>
                            <li>Use apenas em dispositivos confiáveis</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center gap-2 h-11" 
                      disabled={locked}
                    >
                      {locked ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4" />
                          Enviar link de recuperação
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      type="button" 
                      variant="ghost" 
                      onClick={() => setTab("signin")} 
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Voltar ao login
                    </Button>
                  </form>
                </Form>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  );
};

export default AuthPage;
