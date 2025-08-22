import { createClient } from '@supabase/supabase-js';
// Usando fetch nativo do Node.js

// Configurações do Supabase local
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';
const inbucketUrl = 'http://localhost:54324';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testEmailRecovery() {
  console.log('🔍 Testando envio de email de recuperação...');

  const testEmail = 'test@medassist.com';

  try {
    // 1. Primeiro, vamos limpar emails antigos no Inbucket
    console.log('🧹 Limpando emails antigos do Inbucket...');
    try {
      const deleteResponse = await fetch(`${inbucketUrl}/api/v1/mailbox/test`, {
        method: 'DELETE',
      });
      if (deleteResponse.ok) {
        console.log('✅ Emails antigos limpos');
      }
    } catch (error) {
      console.log('⚠️  Não foi possível limpar emails antigos:', error.message);
    }

    // 2. Enviar email de recuperação
    console.log(`📧 Enviando email de recuperação para: ${testEmail}`);
    const { data, error } = await supabase.auth.resetPasswordForEmail(
      testEmail,
      {
        redirectTo: 'http://localhost:8080/auth/reset',
      }
    );

    if (error) {
      console.error('❌ Erro ao enviar email:', error.message);
      return;
    }

    console.log('✅ Email enviado com sucesso!');

    // 3. Aguardar um pouco para o email chegar
    console.log('⏳ Aguardando 3 segundos para o email chegar...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 4. Verificar se o email chegou no Inbucket
    console.log('🔍 Verificando emails no Inbucket...');

    // Testar diferentes nomes de mailbox baseado na configuração do Inbucket
    const mailboxNames = ['test', 'test@medassist.com', 'medassist.com'];

    for (const mailboxName of mailboxNames) {
      try {
        console.log(`🔍 Testando mailbox: ${mailboxName}`);
        const response = await fetch(
          `${inbucketUrl}/api/v1/mailbox/${encodeURIComponent(mailboxName)}`
        );

        if (response.ok) {
          const emails = await response.json();
          console.log(
            `📬 Encontrados ${emails.length} emails no mailbox '${mailboxName}'`
          );

          if (emails.length > 0) {
            console.log('✅ SUCESSO: Emails estão chegando no Inbucket!');

            // Mostrar detalhes do último email
            const latestEmail = emails[0];
            console.log('📧 Último email:');
            console.log(`   - De: ${latestEmail.from}`);
            console.log(`   - Para: ${latestEmail.to}`);
            console.log(`   - Assunto: ${latestEmail.subject}`);
            console.log(`   - Data: ${latestEmail.date}`);

            // Buscar conteúdo do email
            try {
              const emailResponse = await fetch(
                `${inbucketUrl}/api/v1/mailbox/${encodeURIComponent(mailboxName)}/${latestEmail.id}`
              );
              if (emailResponse.ok) {
                const emailContent = await emailResponse.json();
                console.log('📄 Conteúdo do email:');
                console.log(
                  '   - HTML:',
                  emailContent.body.html ? 'Presente' : 'Ausente'
                );
                console.log(
                  '   - Texto:',
                  emailContent.body.text ? 'Presente' : 'Ausente'
                );

                if (emailContent.body.text) {
                  const textContent = emailContent.body.text.substring(0, 200);
                  console.log(`   - Prévia: ${textContent}...`);
                }
              }
            } catch (error) {
              console.log(
                '⚠️  Não foi possível buscar conteúdo do email:',
                error.message
              );
            }

            return; // Encontrou emails, pode parar
          }
        } else {
          console.log(`   - Status: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        console.log(`   - Erro: ${error.message}`);
      }
    }

    console.log('❌ PROBLEMA: Nenhum email encontrado em nenhum mailbox!');
    console.log('💡 Possíveis causas:');
    console.log('   - SMTP não está configurado corretamente');
    console.log('   - Inbucket não está capturando os emails');
    console.log('   - Configuração de email do Supabase está incorreta');
    console.log(
      '   - Configuração de naming do Inbucket diferente do esperado'
    );

    // 5. Informações úteis
    console.log('\n🔗 Links úteis:');
    console.log(`   - Interface do Inbucket: ${inbucketUrl}`);
    console.log(`   - API do Inbucket: ${inbucketUrl}/api/v1/mailbox/test`);
    console.log(`   - Supabase Studio: http://localhost:54323`);
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

// Executar teste
testEmailRecovery()
  .then(() => {
    console.log('\n✅ Teste concluído!');
  })
  .catch(error => {
    console.error('❌ Erro no teste:', error.message);
  });
