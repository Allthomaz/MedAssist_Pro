import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase local
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAuthEmail() {
  console.log('🔍 Testando envio de email através do Supabase Auth...');

  try {
    // Tentar enviar email de recuperação
    const { data, error } = await supabase.auth.resetPasswordForEmail(
      'test@medassist.com',
      {
        redirectTo: 'http://localhost:5173/reset-password',
      }
    );

    if (error) {
      console.error('❌ Erro ao enviar email:', error.message);
      return;
    }

    console.log('✅ Email de recuperação enviado com sucesso!');
    console.log('📧 Dados:', data);

    // Aguardar um pouco
    console.log('⏳ Aguardando 3 segundos...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Verificar no Inbucket
    console.log('🔍 Verificando no Inbucket...');

    const mailboxes = ['test', 'test@medassist.com', 'medassist.com'];

    for (const mailbox of mailboxes) {
      try {
        const response = await fetch(
          `http://localhost:54324/api/v1/mailbox/${mailbox}`
        );
        console.log(`🔍 Testando mailbox: ${mailbox}`);
        console.log(`   - Status: ${response.status} ${response.statusText}`);

        if (response.ok) {
          const emails = await response.json();
          console.log(`   - Emails encontrados: ${emails.length}`);
          if (emails.length > 0) {
            console.log('✅ EMAIL ENCONTRADO!');
            emails.forEach((email, index) => {
              console.log(`   Email ${index + 1}:`);
              console.log(`     - De: ${email.from}`);
              console.log(`     - Para: ${email.to}`);
              console.log(`     - Assunto: ${email.subject}`);
              console.log(`     - Data: ${email.date}`);
            });
            return;
          }
        }
      } catch (err) {
        console.log(`   - Erro: ${err.message}`);
      }
    }

    console.log('❌ Nenhum email encontrado em nenhum mailbox');
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

testAuthEmail();
