import fetch from 'node-fetch';

async function testMailpitAPI() {
  try {
    console.log('🔍 Testando API do Mailpit...');

    // Endpoints comuns do Mailpit
    const endpoints = [
      '/api/v1/messages',
      '/api/v1/search',
      '/api/v1/info',
      '/api/messages',
      '/messages',
      '/search',
    ];

    console.log('\n🔍 Testando endpoints do Mailpit:');
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`http://127.0.0.1:54324${endpoint}`);
        console.log(`${endpoint}: ${response.status} - ${response.statusText}`);
        if (response.ok) {
          const content = await response.text();
          try {
            const jsonContent = JSON.parse(content);
            console.log(`   JSON Response:`, jsonContent);
          } catch {
            console.log(
              `   Text Response (${content.length} chars): ${content.substring(0, 200)}...`
            );
          }
        }
      } catch (error) {
        console.log(`${endpoint}: ERRO - ${error.message}`);
      }
    }

    // Testar envio de email e verificar se aparece
    console.log('\n📧 Enviando email de teste via Mailpit SMTP...');

    // Importar nodemailer
    const nodemailer = await import('nodemailer');

    // Configurar transporter para Mailpit
    const transporter = nodemailer.default.createTransporter({
      host: '127.0.0.1',
      port: 54325, // Porta SMTP do Mailpit
      secure: false,
      auth: false, // Mailpit geralmente não requer autenticação
    });

    try {
      // Verificar conexão
      await transporter.verify();
      console.log('✅ Conexão SMTP OK!');

      // Enviar email
      const info = await transporter.sendMail({
        from: '"MedAssist Test" <test@localhost>',
        to: 'user@localhost',
        subject: 'Teste Mailpit API',
        text: 'Este é um teste para verificar se o Mailpit está funcionando.',
        html: '<p>Este é um <b>teste</b> para verificar se o Mailpit está funcionando.</p>',
      });

      console.log('✅ Email enviado!');
      console.log('📧 Message ID:', info.messageId);

      // Aguardar processamento
      console.log('\n⏳ Aguardando 3 segundos...');
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Verificar se o email apareceu
      console.log('\n🔍 Verificando emails no Mailpit...');
      const messagesResponse = await fetch(
        'http://127.0.0.1:54324/api/v1/messages'
      );
      if (messagesResponse.ok) {
        const messages = await messagesResponse.json();
        console.log('✅ Emails encontrados:', messages);
      } else {
        console.log('❌ Erro ao buscar emails:', messagesResponse.status);
      }
    } catch (error) {
      console.error('❌ Erro no SMTP:', error.message);
    }
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

testMailpitAPI();
