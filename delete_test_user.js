import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseServiceKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function deleteTestUser() {
  try {
    console.log('🗑️ Deletando usuário de teste...');

    // Deletar do auth.users usando service role
    const { data, error } = await supabase.auth.admin.deleteUser(
      '80e687b9-9874-42ee-87d5-e9dff9446cba'
    );

    if (error) {
      console.error('❌ Erro ao deletar usuário:', error.message);
    } else {
      console.log('✅ Usuário deletado com sucesso!');
    }
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

deleteTestUser();
