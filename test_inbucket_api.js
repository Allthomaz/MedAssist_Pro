import fetch from 'node-fetch';

async function testInbucketAPI() {
  try {
    console.log('🔍 Testando API do Inbucket...');
    
    // Testar endpoint de status
    console.log('\n📊 Verificando status do Inbucket...');
    try {
      const statusResponse = await fetch('http://127.0.0.1:54324/api/v1/monitor/messages');
      console.log(`Status response: ${statusResponse.status}`);
      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        console.log('Status data:', statusData);
      } else {
        console.log('Status response text:', await statusResponse.text());
      }
    } catch (error) {
      console.log('Erro no status:', error.message);
    }
    
    // Testar endpoint de mailboxes
    console.log('\n📬 Verificando mailboxes...');
    try {
      const mailboxResponse = await fetch('http://127.0.0.1:54324/api/v1/mailbox');
      console.log(`Mailbox response: ${mailboxResponse.status}`);
      if (mailboxResponse.ok) {
        const mailboxData = await mailboxResponse.json();
        console.log('Mailboxes encontrados:', mailboxData);
        
        // Se houver mailboxes, verificar emails em cada um
        if (Array.isArray(mailboxData) && mailboxData.length > 0) {
          for (const mailbox of mailboxData) {
            console.log(`\n📧 Verificando emails no mailbox: ${mailbox}`);
            try {
              const emailResponse = await fetch(`http://127.0.0.1:54324/api/v1/mailbox/${encodeURIComponent(mailbox)}`);
              if (emailResponse.ok) {
                const emails = await emailResponse.json();
                console.log(`   - Emails encontrados: ${emails.length}`);
                emails.forEach((email, index) => {
                  console.log(`   - Email ${index + 1}: ${email.subject} (de: ${email.from})`);
                });
              } else {
                console.log(`   - Erro: ${emailResponse.status}`);
              }
            } catch (error) {
              console.log(`   - Erro: ${error.message}`);
            }
          }
        }
      } else {
        console.log('Mailbox response text:', await mailboxResponse.text());
      }
    } catch (error) {
      console.log('Erro nos mailboxes:', error.message);
    }
    
    // Testar acesso direto à interface web
    console.log('\n🌐 Testando interface web...');
    try {
      const webResponse = await fetch('http://127.0.0.1:54324/');
      console.log(`Web interface response: ${webResponse.status}`);
      if (webResponse.ok) {
        const webContent = await webResponse.text();
        console.log(`Web content length: ${webContent.length} characters`);
        // Verificar se contém elementos típicos do Inbucket
        if (webContent.includes('Inbucket') || webContent.includes('mailbox')) {
          console.log('✅ Interface web do Inbucket está funcionando');
        } else {
          console.log('⚠️ Interface web não parece ser do Inbucket');
        }
      }
    } catch (error) {
      console.log('Erro na interface web:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

testInbucketAPI();