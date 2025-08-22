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
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Shield,
  Database,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  Users,
  FileText,
  Mic,
  Activity,
  Lock,
  Unlock,
} from 'lucide-react';

interface RLSTest {
  id: string;
  name: string;
  description: string;
  table: string;
  operation: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE';
  expectedResult: 'success' | 'error';
  status: 'pending' | 'running' | 'success' | 'error';
  result?: string;
  executedAt?: Date;
}

interface TestPatient {
  full_name: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  gender?: string;
}

const RLSTest: React.FC = () => {
  const { user, profile } = useAuth();
  const [tests, setTests] = useState<RLSTest[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testPatient, setTestPatient] = useState<TestPatient>({
    full_name: 'Paciente Teste RLS',
    email: 'paciente.rls@test.com',
    phone: '(11) 99999-9999',
    date_of_birth: '1990-01-01',
    gender: 'M',
  });
  const [createdPatientId, setCreatedPatientId] = useState<string | null>(null);

  // Definir testes baseados no tipo de usuário
  const generateTests = (): RLSTest[] => {
    const baseTests: RLSTest[] = [
      {
        id: 'profiles_select_own',
        name: 'Visualizar próprio perfil',
        description: 'Usuário deve conseguir visualizar seu próprio perfil',
        table: 'profiles',
        operation: 'SELECT',
        expectedResult: 'success',
        status: 'pending',
      },
      {
        id: 'profiles_select_others',
        name: 'Visualizar perfis de outros',
        description:
          'Usuário NÃO deve conseguir visualizar perfis de outros usuários',
        table: 'profiles',
        operation: 'SELECT',
        expectedResult: 'error',
        status: 'pending',
      },
      {
        id: 'recordings_select',
        name: 'Visualizar gravações',
        description: 'Verificar acesso às gravações baseado no role',
        table: 'recordings',
        operation: 'SELECT',
        expectedResult: profile?.role === 'doctor' ? 'success' : 'error',
        status: 'pending',
      },
      {
        id: 'transcriptions_select',
        name: 'Visualizar transcrições',
        description: 'Verificar acesso às transcrições baseado no role',
        table: 'transcriptions',
        operation: 'SELECT',
        expectedResult: profile?.role === 'doctor' ? 'success' : 'error',
        status: 'pending',
      },
    ];

    // Testes específicos para médicos
    if (profile?.role === 'doctor') {
      baseTests.push(
        {
          id: 'patients_select_own',
          name: 'Visualizar pacientes próprios',
          description: 'Médico deve conseguir visualizar seus pacientes',
          table: 'patients',
          operation: 'SELECT',
          expectedResult: 'success',
          status: 'pending',
        },
        {
          id: 'patients_insert',
          name: 'Inserir novo paciente',
          description: 'Médico deve conseguir cadastrar novos pacientes',
          table: 'patients',
          operation: 'INSERT',
          expectedResult: 'success',
          status: 'pending',
        },
        {
          id: 'patients_update_own',
          name: 'Atualizar pacientes próprios',
          description:
            'Médico deve conseguir atualizar dados de seus pacientes',
          table: 'patients',
          operation: 'UPDATE',
          expectedResult: 'success',
          status: 'pending',
        },
        {
          id: 'patients_select_others',
          name: 'Visualizar pacientes de outros médicos',
          description:
            'Médico NÃO deve conseguir ver pacientes de outros médicos',
          table: 'patients',
          operation: 'SELECT',
          expectedResult: 'error',
          status: 'pending',
        }
      );
    }

    // Testes específicos para pacientes
    if (profile?.role === 'patient') {
      baseTests.push(
        {
          id: 'patients_select_own_data',
          name: 'Visualizar próprios dados como paciente',
          description: 'Paciente deve conseguir visualizar seus próprios dados',
          table: 'patients',
          operation: 'SELECT',
          expectedResult: 'success',
          status: 'pending',
        },
        {
          id: 'patients_update_own_data',
          name: 'Atualizar próprios dados básicos',
          description:
            'Paciente deve conseguir atualizar dados básicos (telefone, endereço)',
          table: 'patients',
          operation: 'UPDATE',
          expectedResult: 'success',
          status: 'pending',
        },
        {
          id: 'patients_insert_forbidden',
          name: 'Tentar inserir paciente (proibido)',
          description:
            'Paciente NÃO deve conseguir inserir novos registros de pacientes',
          table: 'patients',
          operation: 'INSERT',
          expectedResult: 'error',
          status: 'pending',
        }
      );
    }

    return baseTests;
  };

  // Executar um teste específico
  const executeTest = async (
    test: RLSTest
  ): Promise<{ success: boolean; result: string }> => {
    try {
      switch (test.id) {
        case 'profiles_select_own':
          const { data: ownProfile, error: ownProfileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user?.id)
            .single();

          if (ownProfileError) {
            return { success: false, result: ownProfileError.message };
          }
          return {
            success: true,
            result: `Perfil encontrado: ${ownProfile?.full_name}`,
          };

        case 'profiles_select_others':
          const { data: otherProfiles, error: otherProfilesError } =
            await supabase
              .from('profiles')
              .select('*')
              .neq('id', user?.id)
              .limit(1);

          if (otherProfilesError) {
            return { success: false, result: otherProfilesError.message };
          }
          // Se conseguiu buscar outros perfis, é um problema de segurança
          return {
            success: false,
            result: `FALHA DE SEGURANÇA: Conseguiu acessar ${otherProfiles?.length || 0} perfis de outros usuários`,
          };

        case 'recordings_select':
          const { data: recordings, error: recordingsError } = await supabase
            .from('recordings')
            .select('count')
            .limit(1);

          if (recordingsError) {
            return { success: false, result: recordingsError.message };
          }
          return {
            success: true,
            result: `Acesso permitido (${recordings?.length || 0} registros)`,
          };

        case 'transcriptions_select':
          const { data: transcriptions, error: transcriptionsError } =
            await supabase.from('transcriptions').select('count').limit(1);

          if (transcriptionsError) {
            return { success: false, result: transcriptionsError.message };
          }
          return {
            success: true,
            result: `Acesso permitido (${transcriptions?.length || 0} registros)`,
          };

        case 'patients_select_own':
          const { data: ownPatients, error: ownPatientsError } = await supabase
            .from('patients')
            .select('*')
            .eq('doctor_id', user?.id);

          if (ownPatientsError) {
            return { success: false, result: ownPatientsError.message };
          }
          return {
            success: true,
            result: `Encontrados ${ownPatients?.length || 0} pacientes próprios`,
          };

        case 'patients_insert':
          // Primeiro, criar um perfil de usuário para o paciente
          const { data: newUser, error: userError } =
            await supabase.auth.admin.createUser({
              email: testPatient.email,
              password: 'TempPassword123!',
              email_confirm: true,
            });

          if (userError) {
            return {
              success: false,
              result: `Erro ao criar usuário: ${userError.message}`,
            };
          }

          // Criar perfil do paciente
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: newUser.user.id,
              full_name: testPatient.full_name,
              role: 'patient',
              email: testPatient.email,
            });

          if (profileError) {
            return {
              success: false,
              result: `Erro ao criar perfil: ${profileError.message}`,
            };
          }

          // Inserir paciente
          const { data: newPatient, error: patientError } = await supabase
            .from('patients')
            .insert({
              profile_id: newUser.user.id,
              doctor_id: user?.id,
              full_name: testPatient.full_name,
              email: testPatient.email,
              phone: testPatient.phone,
              date_of_birth: testPatient.date_of_birth,
              gender: testPatient.gender,
              status: 'active',
            })
            .select()
            .single();

          if (patientError) {
            return { success: false, result: patientError.message };
          }

          setCreatedPatientId(newPatient.id);
          return {
            success: true,
            result: `Paciente criado com ID: ${newPatient.id}`,
          };

        case 'patients_update_own':
          if (!createdPatientId) {
            return {
              success: false,
              result: 'Nenhum paciente criado para testar atualização',
            };
          }

          const { error: updateError } = await supabase
            .from('patients')
            .update({ phone: '(11) 88888-8888' })
            .eq('id', createdPatientId)
            .eq('doctor_id', user?.id);

          if (updateError) {
            return { success: false, result: updateError.message };
          }
          return { success: true, result: 'Paciente atualizado com sucesso' };

        case 'patients_select_others':
          const { data: otherPatients, error: otherPatientsError } =
            await supabase
              .from('patients')
              .select('*')
              .neq('doctor_id', user?.id)
              .limit(1);

          if (otherPatientsError) {
            return { success: false, result: otherPatientsError.message };
          }
          // Se conseguiu buscar pacientes de outros médicos, é um problema
          return {
            success: false,
            result: `FALHA DE SEGURANÇA: Conseguiu acessar ${otherPatients?.length || 0} pacientes de outros médicos`,
          };

        case 'patients_select_own_data':
          const { data: ownData, error: ownDataError } = await supabase
            .from('patients')
            .select('*')
            .eq('profile_id', user?.id);

          if (ownDataError) {
            return { success: false, result: ownDataError.message };
          }
          return {
            success: true,
            result: `Dados próprios encontrados: ${ownData?.length || 0} registros`,
          };

        case 'patients_update_own_data':
          const { error: updateOwnError } = await supabase
            .from('patients')
            .update({ phone: '(11) 77777-7777' })
            .eq('profile_id', user?.id);

          if (updateOwnError) {
            return { success: false, result: updateOwnError.message };
          }
          return {
            success: true,
            result: 'Dados próprios atualizados com sucesso',
          };

        case 'patients_insert_forbidden':
          const { error: insertForbiddenError } = await supabase
            .from('patients')
            .insert({
              profile_id: user?.id,
              doctor_id: user?.id, // Tentativa inválida
              full_name: 'Teste Proibido',
              email: 'proibido@test.com',
              status: 'active',
            });

          if (insertForbiddenError) {
            return { success: false, result: insertForbiddenError.message };
          }
          // Se conseguiu inserir, é um problema de segurança
          return {
            success: false,
            result:
              'FALHA DE SEGURANÇA: Paciente conseguiu inserir registro na tabela patients',
          };

        default:
          return { success: false, result: 'Teste não implementado' };
      }
    } catch (error) {
      return { success: false, result: `Erro inesperado: ${error}` };
    }
  };

  // Executar todos os testes
  const runAllTests = async () => {
    if (!user || !profile) {
      toast.error('Usuário não autenticado');
      return;
    }

    setIsRunningTests(true);
    const currentTests = generateTests();
    setTests(currentTests);

    for (let i = 0; i < currentTests.length; i++) {
      const test = currentTests[i];

      // Marcar teste como executando
      setTests(prev =>
        prev.map(t => (t.id === test.id ? { ...t, status: 'running' } : t))
      );

      const result = await executeTest(test);
      const success = result.success === (test.expectedResult === 'success');

      // Atualizar resultado do teste
      setTests(prev =>
        prev.map(t =>
          t.id === test.id
            ? {
                ...t,
                status: success ? 'success' : 'error',
                result: result.result,
                executedAt: new Date(),
              }
            : t
        )
      );

      // Pequena pausa entre testes
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsRunningTests(false);
    toast.success('Testes de RLS concluídos');
  };

  // Gerar testes quando o perfil mudar
  useEffect(() => {
    if (profile) {
      setTests(generateTests());
    }
  }, [profile]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'running':
        return <Activity className="h-4 w-4 text-blue-600 animate-spin" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getTableIcon = (table: string) => {
    switch (table) {
      case 'profiles':
        return <User className="h-4 w-4" />;
      case 'patients':
        return <Users className="h-4 w-4" />;
      case 'recordings':
        return <Mic className="h-4 w-4" />;
      case 'transcriptions':
        return <FileText className="h-4 w-4" />;
      default:
        return <Database className="h-4 w-4" />;
    }
  };

  if (!user || !profile) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Você precisa estar logado para executar os testes de RLS.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="h-6 w-6 text-blue-600" />
        <h1 className="text-2xl font-bold">
          Testes de Row Level Security (RLS)
        </h1>
      </div>

      {/* Informações do usuário atual */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Usuário Atual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <p>
              <strong>Nome:</strong> {profile.full_name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <div className="flex items-center gap-2">
              <strong>Role:</strong>
              <Badge
                variant={profile.role === 'doctor' ? 'default' : 'secondary'}
              >
                {profile.role}
              </Badge>
            </div>
            {profile.crm && (
              <p>
                <strong>CRM:</strong> {profile.crm}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Controles de teste */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Controles de Teste
          </CardTitle>
          <CardDescription>
            Execute testes de segurança baseados no seu tipo de usuário
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button
              onClick={runAllTests}
              disabled={isRunningTests}
              className="flex items-center gap-2"
            >
              {isRunningTests ? (
                <Activity className="h-4 w-4 animate-spin" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
              {isRunningTests
                ? 'Executando Testes...'
                : 'Executar Todos os Testes'}
            </Button>

            {tests.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>
                  {tests.length} testes configurados para role: {profile.role}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Resultados dos testes */}
      {tests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Resultados dos Testes RLS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tests.map(test => (
                <div key={test.id} className="border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    {getStatusIcon(test.status)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getTableIcon(test.table)}
                        <h3 className="font-medium">{test.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {test.operation}
                        </Badge>
                        <Badge
                          variant={
                            test.expectedResult === 'success'
                              ? 'default'
                              : 'destructive'
                          }
                          className="text-xs"
                        >
                          {test.expectedResult === 'success' ? (
                            <>
                              <Unlock className="h-3 w-3 mr-1" />
                              Permitido
                            </>
                          ) : (
                            <>
                              <Lock className="h-3 w-3 mr-1" />
                              Bloqueado
                            </>
                          )}
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-600 mb-2">
                        {test.description}
                      </p>

                      {test.result && (
                        <div
                          className={`text-sm p-2 rounded ${
                            test.status === 'success'
                              ? 'bg-green-50 text-green-700 border border-green-200'
                              : 'bg-red-50 text-red-700 border border-red-200'
                          }`}
                        >
                          <strong>Resultado:</strong> {test.result}
                        </div>
                      )}

                      {test.executedAt && (
                        <p className="text-xs text-gray-500 mt-2">
                          Executado em: {test.executedAt.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Configuração de dados de teste */}
      {profile.role === 'doctor' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Dados de Teste - Paciente
            </CardTitle>
            <CardDescription>
              Configure os dados do paciente que será criado durante os testes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="patient-name">Nome Completo</Label>
                <Input
                  id="patient-name"
                  value={testPatient.full_name}
                  onChange={e =>
                    setTestPatient(prev => ({
                      ...prev,
                      full_name: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="patient-email">Email</Label>
                <Input
                  id="patient-email"
                  type="email"
                  value={testPatient.email}
                  onChange={e =>
                    setTestPatient(prev => ({ ...prev, email: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="patient-phone">Telefone</Label>
                <Input
                  id="patient-phone"
                  value={testPatient.phone || ''}
                  onChange={e =>
                    setTestPatient(prev => ({ ...prev, phone: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="patient-birth">Data de Nascimento</Label>
                <Input
                  id="patient-birth"
                  type="date"
                  value={testPatient.date_of_birth || ''}
                  onChange={e =>
                    setTestPatient(prev => ({
                      ...prev,
                      date_of_birth: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RLSTest;
