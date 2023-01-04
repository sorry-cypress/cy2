const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    specPattern: 'cypress/integration/*.spec.js',
    supportFile: 'cypress/support/e2e.js',
  },
  projectId: 'xxx',
  video: true,
  videoUploadOnPasses: false,
});
