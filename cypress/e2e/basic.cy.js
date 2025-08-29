// cypress/e2e/basic.cy.js
describe('Basic Test', () => {
  it('should visit the homepage', () => {
    cy.visit('http://localhost:5173');
    cy.contains('MedAssist');
  });
});