// cypress.config.js
const { defineConfig } = require('cypress');
const { installPlugin } = require('@chromatic-com/cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8083',
    setupNodeEvents(on, config) {
      installPlugin(on, config);
      return config;
    },
  },
});
