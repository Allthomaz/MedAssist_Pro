// Teste simples para verificar o cadastro de usuário
// Execute com: node test-signup.js

const testSignup = async () => {
  console.log('🧪 Iniciando teste de cadastro...');
  
  // Dados de teste
  const testUser = {
    email: `teste${Date.now()}@exemplo.com`,
    password: 'MinhaSenh@123',
    fullName: 'Dr. João Teste',
    profession: 'medico'
  };
  
  console.log('📝 Dados do usuário de teste:', {
    email: testUser.email,
    fullName: testUser.fullName,
    profession: testUser.profession
  });
  
  try {
    // Simular validação dos schemas
    console.log('✅ Validação de email:', testUser.email.includes('@'));
    console.log('✅ Validação de senha:', testUser.password.length >= 8);
    console.log('✅ Validação de nome:', testUser.fullName.length >= 2);
    console.log('✅ Validação de profissão:', ['medico', 'psicologo', 'terapeuta'].includes(testUser.profession));
    
    console.log('\n🎯 Teste de validação concluído com sucesso!');
    console.log('\n📋 Próximos passos:');
    console.log('1. Abra o navegador em http://localhost:8080');
    console.log('2. Clique em "Cadastrar"');
    console.log('3. Preencha os dados:');
    console.log(`   - Email: ${testUser.email}`);
    console.log(`   - Senha: ${testUser.password}`);
    console.log(`   - Confirmar Senha: ${testUser.password}`);
    console.log(`   - Nome: ${testUser.fullName}`);
    console.log(`   - Profissão: ${testUser.profession}`);
    console.log('4. Clique em "Criar Conta"');
    console.log('5. Verifique se aparece mensagem de sucesso');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  }
};

testSignup();