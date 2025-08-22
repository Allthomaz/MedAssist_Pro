// Script para testar o fluxo de cadastro de usuário
// Execute com: node test_signup_flow.js

import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase local
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSignUp() {
  console.log('🧪 Testando cadastro de usuário...');

  const testUser = {
    email: `teste${Date.now()}@example.com`,
    password: 'senha123456',
    fullName: 'Dr. Teste Silva',
    profession: 'medico',
  };

  try {
    // Teste de cadastro
    console.log('📝 Tentando cadastrar usuário:', testUser.email);

    const { data, error } = await supabase.auth.signUp({
      email: testUser.email,
      password: testUser.password,
      options: {
        emailRedirectTo: `http://localhost:8080/auth`,
        data: {
          full_name: testUser.fullName,
          profession: testUser.profession,
        },
      },
    });

    if (error) {
      console.error('❌ Erro no cadastro:', error.message);
      return;
    }

    console.log('✅ Cadastro realizado com sucesso!');
    console.log('👤 Usuário criado:', data.user?.id);
    console.log('📧 Email de confirmação enviado para:', testUser.email);

    // Verificar se o perfil foi criado
    if (data.user) {
      console.log('🔍 Verificando criação do perfil...');

      // Aguardar um pouco para o trigger executar
      await new Promise(resolve => setTimeout(resolve, 2000));

      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id);

      if (profileError) {
        console.error('❌ Erro ao buscar perfil:', profileError.message);
      } else if (profiles && profiles.length > 0) {
        console.log('✅ Perfil criado com sucesso!');
        console.log('👨‍⚕️ Dados do perfil:', profiles[0]);
      } else {
        console.log('❌ Perfil não encontrado');
      }
    }
  } catch (error) {
    console.error('💥 Erro inesperado:', error);
  }
}

async function testInviteUser() {
  console.log('\n🧪 Testando convite de usuário...');

  const inviteEmail = `convite${Date.now()}@example.com`;

  try {
    console.log('📧 Tentando enviar convite para:', inviteEmail);

    const { data, error } = await supabase.auth.admin.inviteUserByEmail(
      inviteEmail,
      {
        redirectTo: 'http://localhost:8080/auth',
        data: {
          full_name: 'Dr. Convidado Silva',
          profession: 'medico',
        },
      }
    );

    if (error) {
      console.error('❌ Erro no convite:', error.message);
      return;
    }

    console.log('✅ Convite enviado com sucesso!');
    console.log('👤 Usuário convidado:', data.user?.id);
  } catch (error) {
    console.error('💥 Erro inesperado no convite:', error);
  }
}

// Executar testes
async function runTests() {
  console.log('🚀 Iniciando testes de autenticação...');
  console.log('🔗 Supabase URL:', supabaseUrl);
  console.log('📧 Inbucket URL: http://127.0.0.1:54324');
  console.log('\n' + '='.repeat(50));

  await testSignUp();
  await testInviteUser();

  console.log('\n' + '='.repeat(50));
  console.log('✨ Testes concluídos!');
  console.log(
    '📧 Verifique o Inbucket em http://127.0.0.1:54324 para ver os e-mails enviados.'
  );
}

runTests().catch(console.error);
