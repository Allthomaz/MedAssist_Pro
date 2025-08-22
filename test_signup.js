// Script para testar o cadastro de usuário
// Execute com: node test_signup.js

import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase (usando as mesmas configurações do projeto)
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTestUser() {
  console.log('🚀 Criando usuário de teste...');
  
  const testUser = {
    email: 'test@localhost',
    password: '123456',
    fullName: 'Dr. Teste',
    profession: 'medico'
  };
  
  try {
    // Primeiro, tentar fazer signup
    const { data, error } = await supabase.auth.signUp({
      email: testUser.email,
      password: testUser.password,
      options: {
        data: { 
          full_name: testUser.fullName, 
          profession: testUser.profession 
        },
      },
    });
    
    if (error) {
      console.error('❌ Erro no signup:', error.message);
      return;
    }
    
    console.log('✅ Usuário criado com sucesso!');
    console.log('📧 Email:', testUser.email);
    console.log('🔑 Senha:', testUser.password);
    console.log('👤 ID:', data.user?.id);
    
    // Se o usuário foi criado, criar o perfil
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          full_name: testUser.fullName,
          role: 'doctor',
          email: testUser.email
        });
      
      if (profileError) {
        console.error('❌ Erro ao criar perfil:', profileError.message);
      } else {
        console.log('✅ Perfil criado com sucesso!');
      }
    }
    
  } catch (err) {
    console.error('❌ Erro inesperado:', err);
  }
}

// Executar o script
createTestUser().then(() => {
  console.log('\n🎯 Script finalizado. Agora você pode fazer login com:');
  console.log('📧 Email: test@medassist.com');
  console.log('🔑 Senha: 123456');
  process.exit(0);
});