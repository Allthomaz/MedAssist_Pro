/*
 * Configuração básica do test-runner do Storybook
 * Executa testes de smoke para todas as stories
 */
module.exports = {
  // Configuração para ignorar erros de console durante os testes
  async preRender(page) {
    // Ignora erros de console que não são críticos
    page.on('console', msg => {
      if (
        msg.type() === 'error' &&
        msg.text().includes('React will try to recreate')
      ) {
        return; // Ignora erros de React ErrorBoundary
      }
    });

    await page.waitForLoadState('networkidle');
  },

  async postRender(page) {
    // Aguarda um pouco para garantir que a renderização está completa
    await page.waitForTimeout(1000);

    // Verifica se o elemento principal está presente
    const storyRoot = await page.locator('#storybook-root');
    await storyRoot.waitFor({ state: 'visible', timeout: 5000 });
  },
};
