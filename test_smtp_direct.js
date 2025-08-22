import nodemailer from 'nodemailer';
import fetch from 'node-fetch';

async function testSMTPDirect() {
  try {
    console.log('🚀 Testando SMTP direto com Inbucket...');
    
    // Configurar transporter para Inbucket
    const transporter = nodemailer.createTransport({
      host: '127.0.0.1', // Forçar IPv4
      port: 54325, // Porta mapeada do Inbucket SMTP
      secure: false, // Inbucket não usa SSL
      auth: false // Inbucket não requer autenticação
    });
    
    // Verificar conexão
    console.log('🔍 Verificando conexão SMTP...');
    await transporter.verify();
    console.log('✅ Conexão SMTP OK!');
    
    // Enviar email de teste
    console.log('📧 Enviando email de teste...');
    const info = await transporter.sendMail({
      from: '"MedAssist" <admin@localhost>',
      to: 'test@localhost',
      subject: 'Teste SMTP Direto',
      text: 'Este é um teste de email enviado diretamente via SMTP para o Inbucket.',
      html: '<p>Este é um <b>teste de email</b> enviado diretamente via SMTP para o Inbucket.</p>'
    });
    
    console.log('✅ Email enviado com sucesso!');
    console.log('📧 Message ID:', info.messageId);
    console.log('📧 Response:', info.response);
    
    // Aguardar um pouco para o email ser processado
    console.log('\n⏳ Aguardando 2 segundos para processamento...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Tentar verificar o email no Inbucket
    console.log('\n🔍 Verificando se o email chegou...');
    
    // Tentar diferentes formas de acessar o mailbox
    const mailboxVariations = [
      'test',
      'test@localhost', 
      'localhost',
      'admin',
      'admin@localhost'
    ];
    
    for (const mailbox of mailboxVariations) {
      try {
        console.log(`\n📬 Tentando mailbox: ${mailbox}`);
        const response = await fetch(`http://127.0.0.1:54324/api/v1/mailbox/${encodeURIComponent(mailbox)}`);
        
        if (response.ok) {
          const emails = await response.json();
          console.log(`✅ Sucesso! Emails encontrados: ${emails.length}`);
          
          if (emails.length > 0) {
            emails.forEach((email, index) => {
              console.log(`\n📧 Email ${index + 1}:`);
              console.log(`   - De: ${email.from}`);
              console.log(`   - Para: ${email.to}`);
              console.log(`   - Assunto: ${email.subject}`);
              console.log(`   - Data: ${email.date}`);
            });
          }
        } else {
          console.log(`   - Status: ${response.status}`);
        }
      } catch (error) {
        console.log(`   - Erro: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Erro no teste SMTP:', error.message);
    console.error('🔍 Detalhes:', error);
  }
}

testSMTPDirect();