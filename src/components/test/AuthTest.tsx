import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Activity } from 'lucide-react';

interface TestUser {
  email: string;
  password: string;
  fullName: string;
  profession: 'medico' | 'psicologo' | 'terapeuta';
  role: string;
}

interface DatabaseTest {
  name: string;
  description: string;
  status: 'pending' | 'success' | 'error';
  result?: string;
}

const AuthTest: React.FC = () => {
  const { user, profile, signIn, signUp, signOut } = useAuth();
  const [testUsers] = useState<TestUser[]>([
    {
      email: 'medico.teste@example.com',
      password: 'MedicoTeste123',
      fullName: 'Dr. João Silva',
      profession: 'medico',
      role: 'doctor',
    },
    {
      email: 'psicologo.teste@example.com',
      password: 'PsicologoTeste123',
      fullName: 'Dra. Maria Santos',
      profession: 'psicologo',
      role: 'doctor',
    },
    {
      email: 'paciente.teste@example.com',
      password: 'PacienteTeste123',
      fullName: 'Ana Costa',
      profession: 'medico', // Será alterado para paciente após criação
      role: 'patient',
    },
  ]);

  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [databaseTests, setDatabaseTests] = useState<DatabaseTest[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [customPassword, setCustomPassword] = useState('');
  const [customName, setCustomName] = useState('');
  const [customProfession, setCustomProfession] = useState<
    'medico' | 'psicologo' | 'terapeuta'
  >('medico');

  // Função para criar usuário de teste
  const createTestUser = async (testUser: TestUser) => {
    setIsCreatingUser(true);
    try {
      const { error } = await signUp(
        testUser.email,
        testUser.password,
        testUser.fullName,
        testUser.profession
      );

      if (error) {
        toast.error(`Erro ao criar usuário: ${error.message}`);
      } else {
        toast.success(`Usuário ${testUser.fullName} criado com sucesso!`);

        // Se for paciente, atualizar o role no perfil
        if (testUser.role === 'patient') {
          // Aguardar um pouco para o perfil ser criado
          setTimeout(async () => {
            try {
              const { error: updateError } = await supabase
                .from('profiles')
                .update({ role: 'patient' })
                .eq('email', testUser.email);

              if (updateError) {
                console.error(
                  'Erro ao atualizar role para paciente:',
                  updateError
                );
              }
            } catch (err) {
              console.error('Erro ao atualizar perfil:', err);
            }
          }, 2000);
        }
      }
    } catch (err) {
      toast.error(`Erro inesperado: ${err}`);
    } finally {
      setIsCreatingUser(false);
    }
  };

  // Função para fazer login com usuário de teste
  const signInTestUser = async (testUser: TestUser) => {
    setIsSigningIn(true);
    try {
      const { error } = await signIn(testUser.email, testUser.password);

      if (error) {
        toast.error(`Erro no login: ${error.message}`);
      } else {
        toast.success(`Login realizado como ${testUser.fullName}`);
      }
    } catch (err) {
      toast.error(`Erro inesperado: ${err}`);
    } finally {
      setIsSigningIn(false);
    }
  };

  // Função para fazer login customizado
  const signInCustom = async () => {
    if (!customEmail || !customPassword) {
      toast.error('Preencha email e senha');
      return;
    }

    setIsSigningIn(true);
    try {
      const { error } = await signIn(customEmail, customPassword);

      if (error) {
        toast.error(`Erro no login: ${error.message}`);
      } else {
        toast.success('Login realizado com sucesso!');
      }
    } catch (err) {
      toast.error(`Erro inesperado: ${err}`);
    } finally {
      setIsSigningIn(false);
    }
  };

  // Função para criar usuário customizado
  const createCustomUser = async () => {
    if (!customEmail || !customPassword || !customName) {
      toast.error('Preencha todos os campos');
      return;
    }

    setIsCreatingUser(true);
    try {
      const { error } = await signUp(
        customEmail,
        customPassword,
        customName,
        customProfession
      );

      if (error) {
        toast.error(`Erro ao criar usuário: ${error.message}`);
      } else {
        toast.success(`Usuário ${customName} criado com sucesso!`);
        // Limpar campos
        setCustomEmail('');
        setCustomPassword('');
        setCustomName('');
      }
    } catch (err) {
      toast.error(`Erro inesperado: ${err}`);
    } finally {
      setIsCreatingUser(false);
    }
  };

  // Função para testar permissões do banco
  const testDatabasePermissions = async () => {
    const tests: DatabaseTest[] = [
      {
        name: 'Acesso à tabela profiles',
        description: 'Verificar se o usuário pode acessar seu próprio perfil',
        status: 'pending',
      },
      {
        name: 'Acesso à tabela patients',
        description: 'Verificar permissões na tabela de pacientes',
        status: 'pending',
      },
      {
        name: 'Acesso à tabela recordings',
        description: 'Verificar permissões na tabela de gravações',
        status: 'pending',
      },
      {
        name: 'Acesso à tabela transcriptions',
        description: 'Verificar permissões na tabela de transcrições',
        status: 'pending',
      },
    ];

    setDatabaseTests(tests);

    // Teste 1: Acesso ao próprio perfil
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      tests[0].status = error ? 'error' : 'success';
      tests[0].result = error
        ? error.message
        : `Perfil encontrado: ${data?.full_name}`;
    } catch (err) {
      tests[0].status = 'error';
      tests[0].result = `Erro: ${err}`;
    }

    // Teste 2: Acesso à tabela patients
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('count')
        .limit(1);

      tests[1].status = error ? 'error' : 'success';
      tests[1].result = error
        ? error.message
        : `Acesso permitido (${data?.length || 0} registros)`;
    } catch (err) {
      tests[1].status = 'error';
      tests[1].result = `Erro: ${err}`;
    }

    // Teste 3: Acesso à tabela recordings
    try {
      const { data, error } = await supabase
        .from('recordings')
        .select('count')
        .limit(1);

      tests[2].status = error ? 'error' : 'success';
      tests[2].result = error
        ? error.message
        : `Acesso permitido (${data?.length || 0} registros)`;
    } catch (err) {
      tests[2].status = 'error';
      tests[2].result = `Erro: ${err}`;
    }

    // Teste 4: Acesso à tabela transcriptions
    try {
      const { data, error } = await supabase
        .from('transcriptions')
        .select('count')
        .limit(1);

      tests[3].status = error ? 'error' : 'success';
      tests[3].result = error
        ? error.message
        : `Acesso permitido (${data?.length || 0} registros)`;
    } catch (err) {
      tests[3].status = 'error';
      tests[3].result = `Erro: ${err}`;
    }

    setDatabaseTests([...tests]);
  };

  // Executar testes automaticamente quando usuário fizer login
  useEffect(() => {
    if (user && profile) {
      testDatabasePermissions();
    }
  }, [user, profile]);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'doctor':
      case 'medico':
        return 'bg-blue-100 text-blue-800';
      case 'patient':
        return 'bg-green-100 text-green-800';
      case 'psicologo':
        return 'bg-purple-100 text-purple-800';
      case 'terapeuta':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="h-6 w-6 text-blue-600" />
        <h1 className="text-2xl font-bold">
          Teste de Autenticação e Autorização
        </h1>
      </div>

      {/* Status do usuário atual */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Status da Autenticação
          </CardTitle>
        </CardHeader>
        <CardContent>
          {user ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p>
                    <strong>Usuário:</strong>{' '}
                    {profile?.full_name || 'Carregando...'}
                  </p>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <strong>ID:</strong> {user.id}
                  </p>
                  {profile && (
                    <div className="flex items-center gap-2">
                      <strong>Role:</strong>
                      <Badge className={getRoleColor(profile.role)}>
                        {profile.role}
                      </Badge>
                    </div>
                  )}
                  {profile?.crm && (
                    <p>
                      <strong>CRM:</strong> {profile.crm}
                    </p>
                  )}
                  {profile?.specialty && (
                    <p>
                      <strong>Especialidade:</strong> {profile.specialty}
                    </p>
                  )}
                </div>
                <Button onClick={signOut} variant="outline">
                  <UserX className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          ) : (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Nenhum usuário logado. Use os controles abaixo para fazer login
                ou criar um usuário de teste.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Usuários de teste pré-definidos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Usuários de Teste Pré-definidos
          </CardTitle>
          <CardDescription>
            Crie e teste com diferentes tipos de usuários
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {testUsers.map((testUser, index) => (
              <Card key={index} className="border-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    {testUser.fullName}
                  </CardTitle>
                  <Badge
                    className={getRoleColor(testUser.role)}
                    variant="secondary"
                  >
                    {testUser.role}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm space-y-1">
                    <p>
                      <strong>Email:</strong> {testUser.email}
                    </p>
                    <p>
                      <strong>Profissão:</strong> {testUser.profession}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => createTestUser(testUser)}
                      disabled={isCreatingUser}
                      className="flex-1"
                    >
                      <UserPlus className="h-3 w-3 mr-1" />
                      Criar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => signInTestUser(testUser)}
                      disabled={isSigningIn}
                      className="flex-1"
                    >
                      <Key className="h-3 w-3 mr-1" />
                      Login
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Login/Criação customizada */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Login/Criação Customizada
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {/* Login customizado */}
            <div className="space-y-4">
              <h3 className="font-semibold">Login Customizado</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    value={customEmail}
                    onChange={e => setCustomEmail(e.target.value)}
                    placeholder="usuario@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="login-password">Senha</Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      value={customPassword}
                      onChange={e => setCustomPassword(e.target.value)}
                      placeholder="Sua senha"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={signInCustom}
                  disabled={isSigningIn}
                  className="w-full"
                >
                  <Key className="h-4 w-4 mr-2" />
                  Fazer Login
                </Button>
              </div>
            </div>

            {/* Criação customizada */}
            <div className="space-y-4">
              <h3 className="font-semibold">Criar Usuário Customizado</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="create-name">Nome Completo</Label>
                  <Input
                    id="create-name"
                    value={customName}
                    onChange={e => setCustomName(e.target.value)}
                    placeholder="Nome completo"
                  />
                </div>
                <div>
                  <Label htmlFor="create-email">Email</Label>
                  <Input
                    id="create-email"
                    type="email"
                    value={customEmail}
                    onChange={e => setCustomEmail(e.target.value)}
                    placeholder="usuario@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="create-password">Senha</Label>
                  <Input
                    id="create-password"
                    type="password"
                    value={customPassword}
                    onChange={e => setCustomPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                  />
                </div>
                <div>
                  <Label htmlFor="create-profession">Profissão</Label>
                  <Select
                    value={customProfession}
                    onValueChange={(
                      value: 'medico' | 'psicologo' | 'terapeuta'
                    ) => setCustomProfession(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="medico">Médico</SelectItem>
                      <SelectItem value="psicologo">Psicólogo</SelectItem>
                      <SelectItem value="terapeuta">Terapeuta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={createCustomUser}
                  disabled={isCreatingUser}
                  className="w-full"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Criar Usuário
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Testes de permissões do banco */}
      {user && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Testes de Permissões do Banco
            </CardTitle>
            <CardDescription>
              Verificação automática das permissões RLS para o usuário atual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button
                onClick={testDatabasePermissions}
                variant="outline"
                size="sm"
              >
                <Lock className="h-4 w-4 mr-2" />
                Executar Testes Novamente
              </Button>

              {databaseTests.length > 0 && (
                <div className="space-y-3">
                  {databaseTests.map((test, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 border rounded-lg"
                    >
                      {getStatusIcon(test.status)}
                      <div className="flex-1">
                        <h4 className="font-medium">{test.name}</h4>
                        <p className="text-sm text-gray-600">
                          {test.description}
                        </p>
                        {test.result && (
                          <p
                            className={`text-sm mt-1 ${
                              test.status === 'success'
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}
                          >
                            {test.result}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AuthTest;
