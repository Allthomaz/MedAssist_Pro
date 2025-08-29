describe('Save Buttons Functionality', () => {
  beforeEach(() => {
    // Interceptar chamadas da API
    cy.intercept('POST', '**/auth/v1/token*', {
      fixture: 'auth-success.json',
    }).as('login');
    cy.intercept('GET', '**/rest/v1/profiles*', { fixture: 'profile.json' }).as(
      'getProfile'
    );
    cy.intercept('PATCH', '**/rest/v1/profiles*', {
      statusCode: 200,
      body: {},
    }).as('updateProfile');
    cy.intercept('POST', '**/rest/v1/patients*', {
      statusCode: 201,
      body: { id: '123' },
    }).as('createPatient');
    cy.intercept('PATCH', '**/rest/v1/consultations*', {
      statusCode: 200,
      body: {},
    }).as('updateConsultation');

    // Visitar a página inicial
    cy.visit('/');
  });

  it('should test profile save button functionality', () => {
    // Navegar para configurações de perfil
    cy.get('[data-testid="profile-config-button"]', { timeout: 10000 })
      .should('be.visible')
      .click();

    // Verificar se o modal de configuração abriu
    cy.get('[data-testid="profile-config-modal"]').should('be.visible');

    // Preencher campos obrigatórios
    cy.get('input[name="fullName"]').clear().type('Dr. João Silva');

    cy.get('select[name="specialty"]').select('Medicina Geral');

    // Clicar no botão salvar
    cy.get('button')
      .contains('Salvar Configurações')
      .should('not.be.disabled')
      .click();

    // Verificar se a requisição foi feita
    cy.wait('@updateProfile');

    // Verificar feedback de sucesso
    cy.get('.toast').should('contain', 'sucesso');
  });

  it('should test patient save button functionality', () => {
    // Navegar para novo paciente
    cy.get('[data-testid="new-patient-button"]', { timeout: 10000 })
      .should('be.visible')
      .click();

    // Preencher dados do paciente
    cy.get('input[name="fullName"]').type('Maria Santos');

    cy.get('input[name="email"]').type('maria@email.com');

    cy.get('input[name="phone"]').type('(11) 99999-9999');

    cy.get('input[name="birthDate"]').type('1990-01-01');

    cy.get('select[name="gender"]').select('Feminino');

    // Clicar no botão salvar
    cy.get('button')
      .contains('Salvar Paciente')
      .should('not.be.disabled')
      .click();

    // Verificar se a requisição foi feita
    cy.wait('@createPatient');

    // Verificar redirecionamento ou feedback
    cy.url().should('include', '/patients');
  });

  it('should test consultation save button functionality', () => {
    // Interceptar dados de consulta
    cy.intercept('GET', '**/rest/v1/consultations*', {
      fixture: 'consultation.json',
    }).as('getConsultation');

    // Navegar para uma consulta específica
    cy.visit('/consultations/123');

    // Aguardar carregamento
    cy.wait('@getConsultation');

    // Ativar modo de edição
    cy.get('[data-testid="edit-consultation-button"]').click();

    // Editar campos
    cy.get('textarea[name="clinical_notes"]')
      .clear()
      .type('Paciente apresenta melhora significativa.');

    cy.get('textarea[name="diagnosis"]').clear().type('Diagnóstico atualizado');

    // Clicar no botão salvar
    cy.get('button').contains('Salvar').should('not.be.disabled').click();

    // Verificar se a requisição foi feita
    cy.wait('@updateConsultation');

    // Verificar se saiu do modo de edição
    cy.get('[data-testid="edit-consultation-button"]').should('be.visible');
  });

  it('should test notification settings save button', () => {
    // Interceptar preferências de notificação
    cy.intercept('GET', '**/rest/v1/notification_preferences*', {
      body: [],
    }).as('getNotificationPrefs');
    cy.intercept('DELETE', '**/rest/v1/notification_preferences*', {
      statusCode: 200,
    }).as('deleteNotificationPrefs');
    cy.intercept('POST', '**/rest/v1/notification_preferences*', {
      statusCode: 201,
    }).as('saveNotificationPrefs');

    // Navegar para configurações de notificação
    cy.get('[data-testid="notification-settings-button"]').click();

    // Aguardar carregamento
    cy.wait('@getNotificationPrefs');

    // Alterar algumas configurações
    cy.get('input[type="checkbox"]').first().check();

    // Clicar no botão salvar
    cy.get('button')
      .contains('Salvar Preferências')
      .should('not.be.disabled')
      .click();

    // Verificar se as requisições foram feitas
    cy.wait('@deleteNotificationPrefs');
    cy.wait('@saveNotificationPrefs');

    // Verificar feedback de sucesso
    cy.get('.toast').should('contain', 'sucesso');
  });

  it('should test n8n integration save button', () => {
    // Interceptar configurações do n8n
    cy.intercept('GET', '**/api/n8n/config*', { body: {} }).as('getN8nConfig');
    cy.intercept('POST', '**/api/n8n/config*', { statusCode: 200 }).as(
      'saveN8nConfig'
    );

    // Navegar para configurações de integração
    cy.visit('/settings/integrations');

    // Aguardar carregamento
    cy.wait('@getN8nConfig');

    // Preencher configurações
    cy.get('input[name="webhookUrl"]').type('https://webhook.n8n.io/test');

    cy.get('input[name="workflowId"]').type('workflow-123');

    // Clicar no botão salvar
    cy.get('button')
      .contains('Salvar Configurações')
      .should('not.be.disabled')
      .click();

    // Verificar se a requisição foi feita
    cy.wait('@saveN8nConfig');

    // Verificar feedback de sucesso
    cy.get('.toast').should('contain', 'sucesso');
  });

  it('should validate required fields before saving', () => {
    // Testar validação no formulário de paciente
    cy.get('[data-testid="new-patient-button"]').click();

    // Tentar salvar sem preencher campos obrigatórios
    cy.get('button').contains('Salvar Paciente').click();

    // Verificar se mostra erros de validação
    cy.get('.error-message, .text-red-500, [role="alert"]').should(
      'be.visible'
    );

    // Verificar se a requisição NÃO foi feita
    cy.get('@createPatient.all').should('have.length', 0);
  });

  it('should handle save errors gracefully', () => {
    // Interceptar erro na API
    cy.intercept('PATCH', '**/rest/v1/profiles*', {
      statusCode: 500,
      body: { error: 'Internal Server Error' },
    }).as('updateProfileError');

    // Navegar para configurações de perfil
    cy.get('[data-testid="profile-config-button"]').click();

    // Preencher e tentar salvar
    cy.get('input[name="fullName"]').clear().type('Dr. João Silva');

    cy.get('button').contains('Salvar Configurações').click();

    // Verificar se a requisição foi feita
    cy.wait('@updateProfileError');

    // Verificar se mostra erro
    cy.get('.toast').should('contain', 'erro');
  });
});
