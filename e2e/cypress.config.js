const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://wikipedia.org',
    specPattern: 'cypress/integration/*.spec.js',
    supportFile: 'cypress/support/e2e.js',
  },
  projectId: 'Ij0RfK',
  video: true,
  videoUploadOnPasses: false,
});
