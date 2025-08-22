import fetch from 'node-fetch';

async function debugInbucket() {
  try {
    console.log('🔍 Debug do Inbucket...');

    // Verificar o conteúdo da página principal
    console.log('\n🌐 Conteúdo da página principal:');
    const webResponse = await fetch('http://127.0.0.1:54324/');
    const webContent = await webResponse.text();
    console.log('--- INÍCIO DO CONTEÚDO ---');
    console.log(webContent);
    console.log('--- FIM DO CONTEÚDO ---');

    // Tentar diferentes endpoints da API
    const endpoints = [
      '/api/v1/mailbox',
      '/api/v1/monitor/messages',
      '/api/v1/monitor',
      '/api/mailbox',
      '/mailbox',
      '/api',
    ];

    console.log('\n🔍 Testando diferentes endpoints:');
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`http://127.0.0.1:54324${endpoint}`);
        console.log(`${endpoint}: ${response.status} - ${response.statusText}`);
        if (response.ok) {
          const content = await response.text();
          console.log(
            `   Conteúdo (${content.length} chars): ${content.substring(0, 200)}...`
          );
        }
      } catch (error) {
        console.log(`${endpoint}: ERRO - ${error.message}`);
      }
    }
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

debugInbucket();
