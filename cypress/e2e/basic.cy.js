// cypress/e2e/basic.cy.js
describe('Basic Test', () => {
  it('should visit the homepage', () => {
    cy.visit('/');
    cy.get('body').should('be.visible');
    cy.takeSnapshot('homepage');
  });
});
