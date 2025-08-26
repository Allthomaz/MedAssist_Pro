const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase com service_role key para operações administrativas
const supabaseUrl = 'http://127.0.0.1:54321';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Dados do usuário de teste
const testUser = {
  email: 'teste@medassist.com',
  password: 'Teste123!@#',
  fullName: 'Dr. João Silva',
  profession: 'doctor'
};

async function resetAndCreateTestUser() {
  try {
    console.log('🧹 Limpando usuários existentes...');
    
    // 1. Listar todos os usuários
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error('❌ Erro ao listar usuários:', listError);
      return;
    }
    
    console.log(`📋 Encontrados ${users.users.length} usuários`);
    
    // 2. Deletar todos os usuários existentes
    for (const user of users.users) {
      console.log(`🗑️ Deletando usuário: ${user.email}`);
      
      // Deletar perfil primeiro
      const { error: profileDeleteError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);
      
      if (profileDeleteError) {
        console.warn('⚠️ Erro ao deletar perfil:', profileDeleteError);
      }
      
      // Deletar usuário do auth
      const { error: userDeleteError } = await supabase.auth.admin.deleteUser(user.id);
      
      if (userDeleteError) {
        console.error('❌ Erro ao deletar usuário:', userDeleteError);
      } else {
        console.log('✅ Usuário deletado com sucesso');
      }
    }
    
    console.log('');
    console.log('🚀 Criando usuário de teste...');
    console.log('📧 Email:', testUser.email);
    console.log('🔑 Senha:', testUser.password);
    console.log('👨‍⚕️ Nome:', testUser.fullName);
    console.log('💼 Profissão:', testUser.profession);
    console.log('');

    // 3. Criar usuário no auth.users usando service_role
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: testUser.email,
      password: testUser.password,
      email_confirm: true, // Confirmar email automaticamente
      user_metadata: {
        full_name: testUser.fullName,
        role: testUser.profession
      }
    });

    if (authError) {
      console.error('❌ Erro ao criar usuário:', authError);
      return;
    }

    console.log('✅ Usuário criado no auth!');
    console.log('🆔 ID do usuário:', authData.user.id);
    console.log('📧 Email confirmado:', authData.user.email_confirmed_at ? 'Sim' : 'Não');
    console.log('');

    // 4. Verificar se o perfil foi criado pelo trigger
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError) {
      console.error('❌ Erro ao buscar perfil:', profileError);
      return;
    }

    console.log('✅ Perfil criado automaticamente pelo trigger!');
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
resetAndCreateTestUser();