import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabaseEmailFlow() {
  try {
    console.log('🚀 Testando fluxo completo de email do Supabase...');

    // 1. Verificar emails existentes no Mailpit
    console.log('\n📬 Verificando emails existentes no Mailpit...');
    const initialResponse = await fetch(
      'http://127.0.0.1:54324/api/v1/messages'
    );
    if (initialResponse.ok) {
      const initialMessages = await initialResponse.json();
      console.log(
        `📧 Emails existentes: ${initialMessages.messages ? initialMessages.messages.length : 0}`
      );
    }

    // 2. Tentar cadastrar um usuário de teste
    console.log('\n👤 Cadastrando usuário de teste...');
    const testEmail = `test-${Date.now()}@localhost`;
    const testPassword = 'TestPassword123!';

    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          full_name: 'Usuário Teste',
          user_type: 'patient',
        },
      },
    });

    if (error) {
      console.error('❌ Erro no cadastro:', error.message);
      return;
    }

    console.log('✅ Usuário cadastrado!');
    console.log('📧 Email:', testEmail);
    console.log('🆔 User ID:', data.user?.id);
    console.log(
      '✉️ Email confirmado:',
      data.user?.email_confirmed_at ? 'Sim' : 'Não'
    );

    // 3. Aguardar o email ser processado
    console.log('\n⏳ Aguardando 5 segundos para processamento do email...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // 4. Verificar se o email de confirmação chegou
    console.log('\n🔍 Verificando emails no Mailpit...');
    const finalResponse = await fetch('http://127.0.0.1:54324/api/v1/messages');
    if (finalResponse.ok) {
      const finalMessages = await finalResponse.json();
      const messages = finalMessages.messages || [];
      console.log(`📧 Total de emails: ${messages.length}`);

      // Procurar pelo email de confirmação mais recente
      const confirmationEmail = messages.find(
        msg =>
          msg.To.some(to => to.Address === testEmail) &&
          (msg.Subject.includes('Confirm') ||
            msg.Subject.includes('confirm') ||
            msg.Subject.includes('Verificar') ||
            msg.Subject.includes('verificar'))
      );

      if (confirmationEmail) {
        console.log('✅ Email de confirmação encontrado!');
        console.log('📧 Assunto:', confirmationEmail.Subject);
        console.log('📧 De:', confirmationEmail.From.Address);
        console.log(
          '📧 Para:',
          confirmationEmail.To.map(to => to.Address).join(', ')
        );
        console.log('📧 Data:', confirmationEmail.Created);

        // Tentar obter o conteúdo do email
        try {
          const emailContentResponse = await fetch(
            `http://127.0.0.1:54324/api/v1/message/${confirmationEmail.ID}`
          );
          if (emailContentResponse.ok) {
            const emailContent = await emailContentResponse.json();
            console.log('\n📄 Conteúdo do email:');
            console.log('--- HTML ---');
            console.log(emailContent.HTML || 'Sem conteúdo HTML');
            console.log('--- TEXT ---');
            console.log(emailContent.Text || 'Sem conteúdo texto');

            // Procurar por link de confirmação
            const htmlContent = emailContent.HTML || emailContent.Text || '';
            const confirmLinkMatch = htmlContent.match(
              /http[s]?:\/\/[^\s<>"]+/g
            );
            if (confirmLinkMatch) {
              console.log('\n🔗 Links encontrados:');
              confirmLinkMatch.forEach((link, index) => {
                console.log(`   ${index + 1}. ${link}`);
              });
            }
          }
        } catch (error) {
          console.log('⚠️ Erro ao obter conteúdo do email:', error.message);
        }
      } else {
        console.log('❌ Email de confirmação não encontrado');
        console.log('📧 Emails disponíveis:');
        messages.slice(0, 5).forEach((msg, index) => {
          console.log(
            `   ${index + 1}. ${msg.Subject} (para: ${msg.To.map(to => to.Address).join(', ')})`
          );
        });
      }
    }

    // 5. Limpar usuário de teste
    console.log('\n🧹 Limpando usuário de teste...');
    if (data.user?.id) {
      // Note: Em produção, você usaria o Admin API para deletar usuários
      console.log('ℹ️ Usuário criado com ID:', data.user.id);
      console.log(
        'ℹ️ Em ambiente de desenvolvimento, o usuário permanecerá no banco.'
      );
    }
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
    console.error('🔍 Detalhes:', error);
  }
}

testSupabaseEmailFlow();
