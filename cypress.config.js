// cypress.config.js
const { defineConfig } = require("cypress");
const { installPlugin } = require('@chromatic-com/cypress');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Plugin configuration will be added later
      installPlugin(on);
    },
  },
});