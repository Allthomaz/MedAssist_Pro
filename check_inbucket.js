import fetch from 'node-fetch';

async function checkInbucket() {
  try {
    console.log('🔍 Verificando Inbucket...');
    
    // Primeiro, vamos listar todos os mailboxes
    console.log('\n📋 Listando todos os mailboxes...');
    try {
      const response = await fetch('http://127.0.0.1:54324/api/v1/mailbox');
      if (response.ok) {
        const mailboxes = await response.json();
        console.log(`📊 Total de mailboxes: ${mailboxes.length}`);
        
        if (mailboxes.length > 0) {
          console.log('📬 Mailboxes encontrados:');
          mailboxes.forEach(mailbox => {
            console.log(`   - ${mailbox}`);
          });
          
          // Verificar emails em cada mailbox
          for (const mailbox of mailboxes) {
            await checkMailbox(mailbox);
          }
        } else {
          console.log('📭 Nenhum mailbox encontrado');
        }
      } else {
        console.log(`❌ Erro ao listar mailboxes: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.log(`❌ Erro ao acessar API: ${error.message}`);
    }
    
    // Tentar verificar mailboxes específicos mesmo assim
    console.log('\n🔍 Verificando mailboxes específicos...');
    const specificMailboxes = ['test', 'admin', 'localhost'];
    
    for (const mailbox of specificMailboxes) {
      await checkMailbox(mailbox);
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

async function checkMailbox(mailbox) {
  try {
    console.log(`\n📬 Verificando mailbox: ${mailbox}`);
    const response = await fetch(`http://127.0.0.1:54324/api/v1/mailbox/${mailbox}`);
    
    if (response.ok) {
      const emails = await response.json();
      console.log(`📊 Emails encontrados: ${emails.length}`);
      
      if (emails.length > 0) {
        console.log('✅ Emails encontrados!');
        emails.forEach((email, index) => {
          console.log(`\n📧 Email ${index + 1}:`);
          console.log(`   - De: ${email.from}`);
          console.log(`   - Para: ${email.to}`);
          console.log(`   - Assunto: ${email.subject}`);
          console.log(`   - Data: ${email.date}`);
          console.log(`   - ID: ${email.id}`);
        });
      } else {
        console.log('📭 Nenhum email encontrado');
      }
    } else {
      console.log(`❌ Erro HTTP: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.log(`❌ Erro ao verificar ${mailbox}: ${error.message}`);
  }
}

checkInbucket();