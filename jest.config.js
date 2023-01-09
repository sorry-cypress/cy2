// jest.config.js
// const fs = require('node:fs');

// const swcrc = JSON.parse(fs.readFileSync('.swcrc', 'utf8'));

// // If you have other plugins, change this line.
// ((swcrc.jsc ??= {}).experimental ??= {}).plugins = [['jest_workaround', {}]];

module.exports = {
  clearMocks: true,
  testMatch: ['**/*.spec.ts'],
  preset: 'ts-jest',
};
