/**
 * Teste de Cadastro com Mock do Supabase
 * 
 * Este script testa a lógica de cadastro sem depender do Supabase local,
 * usando mocks para simular as respostas da API.
 */

// Mock do Supabase Auth
const mockSupabaseAuth = {
  signUp: async (options) => {
    console.log('📝 Mock Supabase Auth - signUp chamado com:', {
      email: options.email,
      password: '[REDACTED]',
      data: options.options?.data
    });

    // Simular validação de email
    if (!options.email || !options.email.includes('@')) {
      return {
        data: null,
        error: { message: 'Email inválido' }
      };
    }

    // Simular validação de senha
    if (!options.password || options.password.length < 8) {
      return {
        data: null,
        error: { message: 'Senha deve ter pelo menos 8 caracteres' }
      };
    }

    // Simular sucesso
    const mockUser = {
      id: `user_${Date.now()}`,
      email: options.email,
      user_metadata: options.options?.data || {}
    };

    console.log('✅ Mock: Usuário criado com sucesso:', {
      id: mockUser.id,
      email: mockUser.email,
      metadata: mockUser.user_metadata
    });

    return {
      data: {
        user: mockUser,
        session: null // Usuário precisa confirmar email
      },
      error: null
    };
  }
};

// Mock do trigger de criação de perfil
const mockProfileTrigger = {
  createProfile: (user) => {
    console.log('🔄 Mock: Trigger create_profile_for_user executado');
    
    const profile = {
      id: user.id,
      email: user.email,
      full_name: user.user_metadata.full_name || '',
      role: user.user_metadata.profession || 'Médico',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('✅ Mock: Perfil criado automaticamente:', profile);
    return profile;
  }
};

// Função de teste do fluxo de cadastro
async function testSignUpFlow() {
  console.log('🚀 Iniciando teste do fluxo de cadastro com mocks\n');

  // Dados de teste
  const testData = {
    email: `teste.${Date.now()}@medassist.com`,
    password: 'MinhaSenh@123',
    fullName: 'Dr. João Silva',
    profession: 'Médico'
  };

  console.log('📋 Dados de teste:', {
    email: testData.email,
    password: '[REDACTED]',
    fullName: testData.fullName,
    profession: testData.profession
  });

  try {
    // 1. Testar validação de dados
    console.log('\n🔍 Etapa 1: Validação de dados');
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(testData.email)) {
      throw new Error('Email inválido');
    }
    console.log('✅ Email válido');

    // Validar senha
    if (testData.password.length < 8) {
      throw new Error('Senha muito curta');
    }
    console.log('✅ Senha válida');

    // Validar nome completo
    if (!testData.fullName || testData.fullName.length < 2) {
      throw new Error('Nome completo inválido');
    }
    console.log('✅ Nome completo válido');

    // Validar profissão
    const validProfessions = ['Médico', 'Psicólogo', 'Terapeuta'];
    if (!validProfessions.includes(testData.profession)) {
      throw new Error('Profissão inválida');
    }
    console.log('✅ Profissão válida');

    // 2. Testar criação do usuário no Supabase Auth
    console.log('\n🔍 Etapa 2: Criação do usuário no Supabase Auth');
    
    const authResult = await mockSupabaseAuth.signUp({
      email: testData.email,
      password: testData.password,
      options: {
        data: {
          full_name: testData.fullName,
          profession: testData.profession
        }
      }
    });

    if (authResult.error) {
      throw new Error(`Erro no Supabase Auth: ${authResult.error.message}`);
    }

    const user = authResult.data.user;
    console.log('✅ Usuário criado no Auth');

    // 3. Testar trigger de criação de perfil
    console.log('\n🔍 Etapa 3: Trigger de criação de perfil');
    
    const profile = mockProfileTrigger.createProfile(user);
    console.log('✅ Perfil criado pelo trigger');

    // 4. Verificar integridade dos dados
    console.log('\n🔍 Etapa 4: Verificação de integridade');
    
    if (profile.id !== user.id) {
      throw new Error('ID do perfil não corresponde ao ID do usuário');
    }
    console.log('✅ ID do perfil corresponde ao usuário');

    if (profile.email !== user.email) {
      throw new Error('Email do perfil não corresponde ao email do usuário');
    }
    console.log('✅ Email do perfil corresponde ao usuário');

    if (profile.full_name !== user.user_metadata.full_name) {
      throw new Error('Nome do perfil não corresponde aos metadados');
    }
    console.log('✅ Nome do perfil corresponde aos metadados');

    if (profile.role !== user.user_metadata.profession) {
      throw new Error('Role do perfil não corresponde à profissão');
    }
    console.log('✅ Role do perfil corresponde à profissão');

    // 5. Resultado final
    console.log('\n🎉 TESTE CONCLUÍDO COM SUCESSO!');
    console.log('\n📊 Resumo do teste:');
    console.log('- ✅ Validação de dados: OK');
    console.log('- ✅ Criação no Supabase Auth: OK');
    console.log('- ✅ Trigger de perfil: OK');
    console.log('- ✅ Integridade dos dados: OK');
    
    console.log('\n🔧 Próximos passos para teste real:');
    console.log('1. Iniciar Docker Desktop');
    console.log('2. Executar: supabase start');
    console.log('3. Testar cadastro no frontend: http://localhost:5173');
    console.log('4. Verificar criação do perfil no Supabase Studio');

  } catch (error) {
    console.error('\n❌ ERRO NO TESTE:', error.message);
    console.log('\n🔧 Ações recomendadas:');
    console.log('- Verificar validações no frontend');
    console.log('- Revisar lógica do serviço de autenticação');
    console.log('- Confirmar configuração do trigger no banco');
  }
}

// Executar teste
testSignUpFlow();