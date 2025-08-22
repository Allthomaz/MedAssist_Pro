import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSignupWithoutEmail() {
  console.log('🚀 Testando cadastro sem confirmação de email...');

  const testEmail = `test-${Date.now()}@localhost`;
  const testPassword = 'TestPassword123!';

  try {
    // Tentar cadastrar usuário
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          name: 'Usuário Teste',
          user_type: 'patient',
        },
      },
    });

    if (error) {
      console.log('❌ Erro no cadastro:', error.message);
      return;
    }

    console.log('✅ Cadastro realizado com sucesso!');
    console.log('📧 Email:', testEmail);
    console.log('👤 User ID:', data.user?.id);
    console.log('📋 Confirmação necessária:', !data.user?.email_confirmed_at);

    // Verificar se o usuário foi criado no banco
    const { data: users, error: fetchError } = await supabase
      .from('auth.users')
      .select('*')
      .eq('email', testEmail);

    if (fetchError) {
      console.log(
        '⚠️ Não foi possível verificar no banco:',
        fetchError.message
      );
    } else {
      console.log(
        '🗄️ Usuário no banco:',
        users?.length > 0 ? 'Encontrado' : 'Não encontrado'
      );
    }
  } catch (err) {
    console.log('💥 Erro inesperado:', err.message);
  }
}

testSignupWithoutEmail();
