/**
 * Script para criar usuário de teste no MedAssist Pro
 * Execute com: node create-test-user.js
 */

import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase (usando variáveis locais)
const SUPABASE_URL = 'http://127.0.0.1:54321';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Dados do usuário de teste
const testUser = {
  email: 'teste@medassist.com',
  password: 'Teste123!@#',
  fullName: 'Dr. João Silva',
  profession: 'medico',
};

async function createTestUser() {
  console.log('🚀 Criando usuário de teste...');
  console.log('📧 Email:', testUser.email);
  console.log('🔑 Senha:', testUser.password);
  console.log('👨‍⚕️ Nome:', testUser.fullName);
  console.log('💼 Profissão:', testUser.profession);
  console.log('\n' + '='.repeat(50));

  try {
    // Criar usuário no Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: testUser.email,
      password: testUser.password,
      options: {
        data: {
          full_name: testUser.fullName,
          profession: testUser.profession,
        },
      },
    });

    if (error) {
      console.error('❌ Erro ao criar usuário:', error);
      console.error('📝 Detalhes do erro:', JSON.stringify(error, null, 2));
      return;
    }

    if (data.user) {
      console.log('✅ Usuário criado com sucesso!');
      console.log('🆔 ID do usuário:', data.user.id);
      console.log(
        '📧 Email confirmado:',
        data.user.email_confirmed_at ? 'Sim' : 'Não'
      );

      // Aguardar um pouco para o trigger criar o perfil
      console.log('\n⏳ Aguardando criação do perfil...');
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Verificar se o perfil foi criado
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        console.log('⚠️  Perfil não encontrado, será criado no primeiro login');
      } else {
        console.log('✅ Perfil criado automaticamente!');
        console.log('👤 Nome:', profile.full_name);
        console.log('🏥 Role:', profile.role);
      }

      console.log('\n' + '='.repeat(50));
      console.log('🎉 USUÁRIO DE TESTE CRIADO COM SUCESSO!');
      console.log('\n📋 CREDENCIAIS PARA LOGIN:');
      console.log('Email: teste@medassist.com');
      console.log('Senha: Teste123!@#');
      console.log('\n🔗 Acesse: http://localhost:5173/login');
      console.log('='.repeat(50));
    }
  } catch (err) {
    console.error('💥 Erro inesperado:', err);
    console.error('📝 Stack trace:', err.stack);
  }
}

// Executar o script
createTestUser().catch(console.error);
