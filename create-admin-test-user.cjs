const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase com service_role key para operações administrativas
const supabaseUrl = 'http://127.0.0.1:54321';
const serviceRoleKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Dados do usuário de teste
const testUser = {
  email: 'teste@medassist.com',
  password: 'Teste123!@#',
  fullName: 'Dr. João Silva',
  profession: 'medico',
};

async function createTestUser() {
  try {
    console.log('🚀 Criando usuário de teste com service_role...');
    console.log('📧 Email:', testUser.email);
    console.log('🔑 Senha:', testUser.password);
    console.log('👨‍⚕️ Nome:', testUser.fullName);
    console.log('💼 Profissão:', testUser.profession);
    console.log('');

    // 1. Criar usuário no auth.users usando service_role
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email: testUser.email,
        password: testUser.password,
        email_confirm: true, // Confirmar email automaticamente
        user_metadata: {
          full_name: testUser.fullName,
          profession: testUser.profession,
        },
      });

    if (authError) {
      console.error('❌ Erro ao criar usuário:', authError);
      return;
    }

    console.log('✅ Usuário criado no auth!');
    console.log('🆔 ID do usuário:', authData.user.id);
    console.log(
      '📧 Email confirmado:',
      authData.user.email_confirmed_at ? 'Sim' : 'Não'
    );
    console.log('');

    // 2. Criar perfil na tabela profiles
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        full_name: testUser.fullName,
        role: testUser.profession,
        email: testUser.email,
      })
      .select()
      .single();

    if (profileError) {
      console.error('❌ Erro ao criar perfil:', profileError);
      return;
    }

    console.log('✅ Perfil criado com sucesso!');
    console.log('👤 Perfil:', profileData);
    console.log('');

    console.log('==================================================');
    console.log('🎉 USUÁRIO DE TESTE CRIADO COM SUCESSO!');
    console.log('');
    console.log('📋 CREDENCIAIS PARA LOGIN:');
    console.log('Email:', testUser.email);
    console.log('Senha:', testUser.password);
    console.log('');
    console.log('🔗 Acesse: http://localhost:5173/auth');
    console.log('==================================================');
  } catch (error) {
    console.error('❌ Erro inesperado:', error);
  }
}

// Executar a função
createTestUser();
