// Debug script para testar o estado do componente Patients
// Execute este script no console do navegador na página /patients

console.log('=== DEBUG: Estado do Componente Patients ===');

// Função para verificar se o React está disponível
function checkReact() {
  if (typeof React !== 'undefined') {
    console.log('✅ React está disponível:', React.version);
    return true;
  } else {
    console.log('❌ React não está disponível');
    return false;
  }
}

// Função para verificar o botão "Novo Paciente"
function checkNewPatientButton() {
  const buttons = document.querySelectorAll('button');
  let newPatientButton = null;

  buttons.forEach(button => {
    if (button.textContent.includes('Novo Paciente')) {
      newPatientButton = button;
    }
  });

  if (newPatientButton) {
    console.log('✅ Botão "Novo Paciente" encontrado:', newPatientButton);
    console.log('   - Classes:', newPatientButton.className);
    console.log('   - Disabled:', newPatientButton.disabled);
    console.log(
      '   - Event listeners:',
      getEventListeners ? getEventListeners(newPatientButton) : 'N/A'
    );
    return newPatientButton;
  } else {
    console.log('❌ Botão "Novo Paciente" não encontrado');
    return null;
  }
}

// Função para verificar se o formulário está presente
function checkPatientForm() {
  const forms = document.querySelectorAll('form');
  const suspenseElements = document.querySelectorAll(
    '[data-testid="patient-form"], .patient-form'
  );

  console.log('📋 Formulários encontrados:', forms.length);
  console.log(
    '📋 Elementos relacionados ao PatientForm:',
    suspenseElements.length
  );

  // Verificar se há elementos Suspense
  const suspenseLoaders = document.querySelectorAll('.animate-spin');
  console.log('⏳ Elementos de loading (Suspense):', suspenseLoaders.length);

  return {
    forms: forms.length,
    suspenseElements: suspenseElements.length,
    loaders: suspenseLoaders.length,
  };
}

// Função para simular clique no botão
function simulateButtonClick() {
  const button = checkNewPatientButton();
  if (button) {
    console.log('🖱️ Simulando clique no botão...');

    // Verificar estado antes do clique
    const beforeState = checkPatientForm();
    console.log('📊 Estado antes do clique:', beforeState);

    // Simular clique
    button.click();

    // Aguardar um pouco e verificar estado após clique
    setTimeout(() => {
      const afterState = checkPatientForm();
      console.log('📊 Estado após clique:', afterState);

      if (
        afterState.forms > beforeState.forms ||
        afterState.suspenseElements > beforeState.suspenseElements
      ) {
        console.log('✅ Formulário parece ter sido exibido!');
      } else if (afterState.loaders > beforeState.loaders) {
        console.log('⏳ Formulário está carregando (Suspense)...');
      } else {
        console.log('❌ Nenhuma mudança detectada após clique');
      }
    }, 500);

    return true;
  }
  return false;
}

// Função para verificar erros no console
function checkConsoleErrors() {
  console.log('🔍 Verificando erros recentes...');
  // Esta função precisa ser executada manualmente no console
  console.log(
    '   Execute: console.error = (function(originalError) { return function(...args) { console.log("ERROR DETECTED:", ...args); originalError.apply(console, args); }; })(console.error);'
  );
}

// Função principal de debug
function debugPatientComponent() {
  console.log('\n🚀 Iniciando debug do componente Patients...');

  checkReact();
  checkNewPatientButton();
  checkPatientForm();

  console.log('\n📝 Para testar o botão, execute: simulateButtonClick()');
  console.log(
    '📝 Para verificar erros, abra a aba Console e observe mensagens de erro'
  );

  return {
    simulateClick: simulateButtonClick,
    checkButton: checkNewPatientButton,
    checkForm: checkPatientForm,
  };
}

// Executar debug automaticamente
const debugTools = debugPatientComponent();

// Disponibilizar funções globalmente para uso manual
window.debugPatient = debugTools;

console.log('\n✨ Debug tools disponíveis em window.debugPatient');
console.log('   - debugPatient.simulateClick() - Simula clique no botão');
console.log('   - debugPatient.checkButton() - Verifica o botão');
console.log('   - debugPatient.checkForm() - Verifica o formulário');

// Auto-executar teste do botão após 2 segundos
setTimeout(() => {
  console.log('\n🔄 Auto-executando teste do botão...');
  simulateButtonClick();
}, 2000);
