const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://localhost:3000',
    specPattern: 'cypress/integration/*.spec.js',
    supportFile: 'cypress/support/e2e.js',
  },
  projectId: 'Ij0RfK',
  video: true,
  videoUploadOnPasses: false,
});
