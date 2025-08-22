import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Carrega variáveis de ambiente
dotenv.config();

// Configurações do SendGrid
const SENDGRID_CONFIG = {
  host: 'smtp.sendgrid.net',
  port: 587,
  secure: false, // true para 465, false para outras portas
  auth: {
    user: 'apikey', // sempre 'apikey' para SendGrid
    pass: process.env.SENDGRID_API_KEY || 'SG.SUBSTITUA_PELA_SUA_API_KEY'
  }
};

// Configurações do AWS SES (alternativa)
const AWS_SES_CONFIG = {
  host: 'email-smtp.us-east-1.amazonaws.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.AWS_ACCESS_KEY_ID || 'SEU_ACCESS_KEY_ID',
    pass: process.env.AWS_SECRET_ACCESS_KEY || 'SUA_SECRET_ACCESS_KEY'
  }
};

async function testSMTPConnection(config, providerName) {
  console.log(`\n🚀 Testando conexão SMTP com ${providerName}...`);
  
  try {
    // Criar transporter
    const transporter = nodemailer.createTransporter(config);
    
    // Verificar conexão
    console.log('🔍 Verificando conexão...');
    await transporter.verify();
    console.log(`✅ Conexão com ${providerName} estabelecida com sucesso!`);
    
    // Enviar email de teste
    console.log('📧 Enviando email de teste...');
    const testEmail = {
      from: {
        name: 'MedAssist',
        address: process.env.SMTP_FROM_EMAIL || 'admin@medassist.com'
      },
      to: process.env.TEST_EMAIL || 'test@localhost',
      subject: `Teste SMTP - ${providerName} - ${new Date().toLocaleString()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">🏥 MedAssist - Teste de SMTP</h2>
          <p>Este é um email de teste para verificar a configuração SMTP com <strong>${providerName}</strong>.</p>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>📊 Informações do Teste:</h3>
            <ul>
              <li><strong>Provedor:</strong> ${providerName}</li>
              <li><strong>Host:</strong> ${config.host}</li>
              <li><strong>Porta:</strong> ${config.port}</li>
              <li><strong>Data/Hora:</strong> ${new Date().toLocaleString()}</li>
              <li><strong>Usuário:</strong> ${config.auth.user}</li>
            </ul>
          </div>
          <p>Se você recebeu este email, a configuração SMTP está funcionando corretamente! ✅</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">
          <p style="color: #64748b; font-size: 14px;">
            <strong>MedAssist</strong> - Plataforma de Gestão Médica<br>
            Este é um email automático de teste.
          </p>
        </div>
      `
    };
    
    const result = await transporter.sendMail(testEmail);
    console.log(`✅ Email enviado com sucesso!`);
    console.log(`📬 Message ID: ${result.messageId}`);
    
    if (result.response) {
      console.log(`📋 Resposta do servidor: ${result.response}`);
    }
    
    return true;
    
  } catch (error) {
    console.log(`❌ Erro ao testar ${providerName}:`);
    console.log(`🔍 Tipo do erro: ${error.name}`);
    console.log(`💬 Mensagem: ${error.message}`);
    
    if (error.code) {
      console.log(`🏷️ Código: ${error.code}`);
    }
    
    if (error.response) {
      console.log(`📋 Resposta: ${error.response}`);
    }
    
    // Sugestões baseadas no tipo de erro
    if (error.message.includes('authentication')) {
      console.log('\n💡 Sugestão: Verifique suas credenciais SMTP (usuário/senha)');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Sugestão: Verifique se o host e porta estão corretos');
    } else if (error.message.includes('timeout')) {
      console.log('\n💡 Sugestão: Verifique sua conexão de internet e firewall');
    }
    
    return false;
  }
}

async function testAllProviders() {
  console.log('🏥 MedAssist - Teste de Configuração SMTP');
  console.log('=' .repeat(50));
  
  const results = [];
  
  // Testar SendGrid
  if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY !== 'SG.SUBSTITUA_PELA_SUA_API_KEY') {
    const sendgridResult = await testSMTPConnection(SENDGRID_CONFIG, 'SendGrid');
    results.push({ provider: 'SendGrid', success: sendgridResult });
  } else {
    console.log('\n⚠️ SendGrid: API Key não configurada (defina SENDGRID_API_KEY)');
    results.push({ provider: 'SendGrid', success: false, reason: 'API Key não configurada' });
  }
  
  // Testar AWS SES
  if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
    const awsResult = await testSMTPConnection(AWS_SES_CONFIG, 'AWS SES');
    results.push({ provider: 'AWS SES', success: awsResult });
  } else {
    console.log('\n⚠️ AWS SES: Credenciais não configuradas (defina AWS_ACCESS_KEY_ID e AWS_SECRET_ACCESS_KEY)');
    results.push({ provider: 'AWS SES', success: false, reason: 'Credenciais não configuradas' });
  }
  
  // Resumo dos resultados
  console.log('\n' + '=' .repeat(50));
  console.log('📊 RESUMO DOS TESTES:');
  console.log('=' .repeat(50));
  
  results.forEach(result => {
    const status = result.success ? '✅ SUCESSO' : '❌ FALHOU';
    const reason = result.reason ? ` (${result.reason})` : '';
    console.log(`${result.provider}: ${status}${reason}`);
  });
  
  const successCount = results.filter(r => r.success).length;
  console.log(`\n📈 Total: ${successCount}/${results.length} provedores funcionando`);
  
  if (successCount === 0) {
    console.log('\n🔧 PRÓXIMOS PASSOS:');
    console.log('1. Configure pelo menos um provedor SMTP');
    console.log('2. Crie um arquivo .env com suas credenciais');
    console.log('3. Execute este teste novamente');
    console.log('\n📝 Exemplo de .env:');
    console.log('SENDGRID_API_KEY=SG.sua_api_key_aqui');
    console.log('SMTP_FROM_EMAIL=admin@medassist.com');
    console.log('TEST_EMAIL=seu_email@gmail.com');
  }
}

// Executar testes
testAllProviders().catch(console.error);