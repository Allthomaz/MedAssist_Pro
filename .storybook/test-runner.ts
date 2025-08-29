import type { TestRunnerConfig } from '@storybook/test-runner';
import { injectAxe, checkA11y, configureAxe } from 'axe-playwright';

const config: TestRunnerConfig = {
  setup() {
    // Setup global para todos os testes
    console.log('🧪 Iniciando Storybook Test Runner...');
  },

  async preVisit(page) {
    // Injeta axe-core em cada página antes dos testes
    await injectAxe(page);

    // Configura axe-core com regras customizadas
    await configureAxe(page, {
      rules: [
        // Desabilita regras que podem ser problemáticas no Storybook
        { id: 'page-has-heading-one', enabled: false },
        { id: 'landmark-one-main', enabled: false },
        { id: 'region', enabled: false },
      ],
    });
  },

  async postVisit(page, context) {
    // Executa testes de acessibilidade após renderizar cada story
    const storyContext = context.storyContext;

    // Pula testes de acessibilidade para stories específicas se necessário
    const skipA11yStories = [
      // Adicione IDs de stories que devem pular testes de acessibilidade
      // 'example-button--primary'
    ];

    if (!skipA11yStories.includes(storyContext.id)) {
      try {
        await checkA11y(page, '#storybook-root', {
          detailedReport: true,
          detailedReportOptions: {
            html: true,
          },
        });
        console.log(
          `✅ Acessibilidade OK: ${storyContext.title} - ${storyContext.name}`
        );
      } catch (error) {
        console.error(
          `❌ Violação de acessibilidade: ${storyContext.title} - ${storyContext.name}`
        );
        throw error;
      }
    }
  },

  // Configurações de timeout
  testTimeout: 60000,

  // Tags para filtrar stories nos testes
  tags: {
    include: ['test'],
    exclude: ['skip-test'],
    skip: ['broken'],
  },

  // Configurações do Jest para snapshots
  jest: {
    // Configuração específica do Jest para o test-runner
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/test/jest.setup.ts'],
    moduleNameMapping: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
  },
};

export default config;
