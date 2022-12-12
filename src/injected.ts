import { copyFileSync } from 'fs';

const Mod = require('module');
const req = Mod.prototype.require;

// @ts-ignore
global.integrityCheck = function () {};

// @ts-ignore
if (global.snapshotResult?.customRequire?.exports) {
  // @ts-ignore
  global.snapshotResult.customRequire.exports[
    './packages/server/config/app.json'
  ].exports = {
    development: { api_url: 'http://localhost:1234/' },
    test: { api_url: 'http://localhost:1234/' },
    staging: { api_url: 'https://api-staging.cypress.io/' },
    production: {
      api_url: process.env.CYPRESS_API_URL || 'https://api.cypress.io',
    },
  };
}

Mod.prototype.require = function (...args) {
  if (args[0].match(/app\.json/)) {
    return {
      development: { api_url: 'http://localhost:1234/' },
      test: { api_url: 'http://localhost:1234/' },
      staging: { api_url: 'https://api-staging.cypress.io/' },
      production: {
        api_url: process.env.CYPRESS_API_URL || 'https://api.cypress.io',
      },
    };
  }
  if (args[0] === 'konfig') {
    return () => ({
      app: {
        api_url: process.env.CYPRESS_API_URL || 'https://api.cypress.io',
        cdn_url: 'https://cdn.cypress.io',
        chromium_manifest_url: 'https://download.cypress.io/chromium.json',
        chromium_url: 'https://download.cypress.io/chromium',
        desktop_manifest_url: 'https://download.cypress.io/desktop.json',
        desktop_url: 'https://download.cypress.io/desktop',
        on_url: 'https://on.cypress.io/',
      },
    });
  }
  return req.call(this, ...args);
};

module.exports = function (entryPointPath: string, backupPath: string) {
  copyFileSync(backupPath, entryPointPath);
};
