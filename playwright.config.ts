import { defineConfig, devices } from '@playwright/test';

/**
 * Configuração do Playwright para Storybook Test Runner
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './src/stories',

  /* Executa testes em paralelo */
  fullyParallel: true,

  /* Falha no build se você deixou test.only no código fonte */
  forbidOnly: !!process.env.CI,

  /* Retry nos testes apenas no CI */
  retries: process.env.CI ? 2 : 0,

  /* Opt out de parallel tests no CI */
  workers: process.env.CI ? 1 : undefined,

  /* Reporter para usar */
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }],
  ],

  /* Configuração global para todos os projetos */
  use: {
    /* URL base para usar em ações como `await page.goto('/')` */
    baseURL: 'http://localhost:6006',

    /* Coleta trace em retry de testes falhados */
    trace: 'on-first-retry',

    /* Screenshot apenas em falhas */
    screenshot: 'only-on-failure',

    /* Video apenas em falhas */
    video: 'retain-on-failure',
  },

  /* Configuração para diferentes browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Testes em mobile viewports */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  /* Executa servidor local antes de iniciar os testes */
  webServer: {
    command: 'npm run storybook',
    url: 'http://localhost:6006',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },

  /* Diretório para artefatos de teste */
  outputDir: 'test-results/',

  /* Timeout global para testes */
  timeout: 30 * 1000,

  /* Timeout para expect */
  expect: {
    timeout: 5000,
  },
});
