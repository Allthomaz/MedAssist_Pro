import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';
const inbucketUrl = 'http://127.0.0.1:54324';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkInbucketEmails(mailbox) {
  try {
    const response = await fetch(`${inbucketUrl}/api/v1/mailbox/${mailbox}`);
    const emails = await response.json();
    return emails;
  } catch (error) {
    console.error('❌ Erro ao verificar Inbucket:', error.message);
    return [];
  }
}

async function testEmailFlow() {
  const testEmail = 'test@localhost';
  const testPassword = '123456';

  try {
    console.log('🚀 Iniciando teste de fluxo de email...');
    console.log(`📧 Email de teste: ${testEmail}`);

    // Verificar emails antes do cadastro
    console.log('\n📬 Verificando emails antes do cadastro...');
    const emailsBefore = await checkInbucketEmails('test');
    console.log(`📊 Emails encontrados antes: ${emailsBefore.length}`);

    // Tentar criar usuário
    console.log('\n🔐 Criando usuário...');
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          full_name: 'Usuário Teste',
          profession: 'medico',
        },
      },
    });

    if (error) {
      console.error('❌ Erro no cadastro:', error.message);
      return;
    }

    console.log('✅ Usuário criado!');
    console.log(`👤 ID: ${data.user?.id}`);
    console.log(
      `📧 Email confirmado: ${data.user?.email_confirmed_at ? 'Sim' : 'Não'}`
    );

    // Aguardar um pouco para o email chegar
    console.log('\n⏳ Aguardando 3 segundos para o email chegar...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Verificar emails após o cadastro
    console.log('\n📬 Verificando emails após o cadastro...');
    const emailsAfter = await checkInbucketEmails('test');
    console.log(`📊 Emails encontrados depois: ${emailsAfter.length}`);

    if (emailsAfter.length > emailsBefore.length) {
      console.log('✅ Novo email encontrado no Inbucket!');
      const newEmail = emailsAfter[emailsAfter.length - 1];
      console.log(`📧 Assunto: ${newEmail.subject}`);
      console.log(`📅 Data: ${newEmail.date}`);
      console.log(`👤 De: ${newEmail.from}`);
    } else {
      console.log('❌ Nenhum novo email encontrado no Inbucket');
    }

    // Verificar também outras caixas de email
    console.log('\n📬 Verificando outras caixas de email...');
    const adminEmails = await checkInbucketEmails('admin');
    const localhostEmails = await checkInbucketEmails('localhost');

    console.log(`📊 Emails em admin: ${adminEmails.length}`);
    console.log(`📊 Emails em localhost: ${localhostEmails.length}`);
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  }
}

testEmailFlow();
