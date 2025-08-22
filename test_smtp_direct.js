import nodemailer from 'nodemailer';

// Configuração do transporter para o Inbucket
const transporter = nodemailer.createTransport({
  host: 'localhost',
  port: 54325,
  secure: false, // true para 465, false para outras portas
  auth: {
    user: 'inbucket',
    pass: 'inbucket'
  },
  tls: {
    rejectUnauthorized: false
  }
});

async function testSMTP() {
  console.log('🔍 Testando SMTP diretamente...');
  
  try {
    // Verificar conexão
    await transporter.verify();
    console.log('✅ Conexão SMTP estabelecida com sucesso!');
    
    // Enviar email de teste
    const info = await transporter.sendMail({
      from: '"MedAssist" <admin@medassist.com>',
      to: 'test@medassist.com',
      subject: 'Teste SMTP Direto',
      text: 'Este é um teste de envio direto via SMTP para o Inbucket.',
      html: '<p>Este é um <b>teste</b> de envio direto via SMTP para o Inbucket.</p>'
    });
    
    console.log('📧 Email enviado:', info.messageId);
    console.log('📬 Response:', info.response);
    
    // Aguardar um pouco
    console.log('⏳ Aguardando 2 segundos...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Verificar no Inbucket
    console.log('🔍 Verificando no Inbucket...');
    
    const mailboxNames = ['test', 'test@medassist.com', 'medassist.com'];
    
    for (const mailboxName of mailboxNames) {
      try {
        console.log(`🔍 Testando mailbox: ${mailboxName}`);
        const response = await fetch(`http://localhost:54324/api/v1/mailbox/${encodeURIComponent(mailboxName)}`);
        
        if (response.ok) {
          const emails = await response.json();
          console.log(`📬 Encontrados ${emails.length} emails no mailbox '${mailboxName}'`);
          
          if (emails.length > 0) {
            console.log('✅ SUCESSO: Email chegou no Inbucket!');
            
            const latestEmail = emails[0];
            console.log('📧 Último email:');
            console.log(`   - De: ${latestEmail.from}`);
            console.log(`   - Para: ${latestEmail.to}`);
            console.log(`   - Assunto: ${latestEmail.subject}`);
            console.log(`   - Data: ${latestEmail.date}`);
            return;
          }
        } else {
          console.log(`   - Status: ${response.status} ${response.statusText}`);
        }
        
      } catch (error) {
        console.log(`   - Erro: ${error.message}`);
      }
    }
    
    console.log('❌ Email não encontrado em nenhum mailbox');
    
  } catch (error) {
    console.error('❌ Erro no teste SMTP:', error.message);
    console.error('Stack:', error.stack);
  }
}

testSMTP();