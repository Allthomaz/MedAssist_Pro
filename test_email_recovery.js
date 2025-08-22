import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testEmailRecovery() {
  console.log('🔍 Testando envio de email de recuperação...');
  
  const testEmail = 'test@medassist.com';
  
  try {
    // Teste 1: Verificar se o usuário existe
    console.log('\n1. Verificando se o usuário existe...');
    const { data: users, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', testEmail);
    
    if (userError) {
      console.error('❌ Erro ao verificar usuário:', userError);
      return;
    }
    
    if (users && users.length > 0) {
      console.log('✅ Usuário encontrado:', users[0]);
    } else {
      console.log('⚠️ Usuário não encontrado, criando usuário de teste...');
      // Aqui você pode criar um usuário de teste se necessário
    }
    
    // Teste 2: Enviar email de recuperação
    console.log('\n2. Enviando email de recuperação...');
    const { data, error } = await supabase.auth.resetPasswordForEmail(testEmail, {
      redirectTo: 'http://localhost:8080/auth/reset'
    });
    
    if (error) {
      console.error('❌ Erro ao enviar email:', error);
    } else {
      console.log('✅ Email enviado com sucesso!');
      console.log('📧 Dados:', data);
    }
    
    // Teste 3: Verificar configurações de auth
    console.log('\n3. Verificando configurações de autenticação...');
    const { data: session } = await supabase.auth.getSession();
    console.log('🔐 Sessão atual:', session ? 'Ativa' : 'Inativa');
    
    console.log('\n📋 Resumo do teste:');
    console.log('- Email testado:', testEmail);
    console.log('- Inbucket URL: http://127.0.0.1:54324');
    console.log('- Redirect URL: http://localhost:8080/auth/reset');
    console.log('\n💡 Verifique o Inbucket para ver se o email chegou!');
    
  } catch (err) {
    console.error('💥 Erro inesperado:', err);
  }
}

testEmailRecovery();