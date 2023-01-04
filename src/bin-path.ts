import { dirname, resolve } from 'path';
import { debug } from './debug';

export async function getCypressCLIBinPath(): Promise<string> {
  if (process.env.CYPRESS_PACKAGE_SHELL_SCRIPT) {
    return process.env.CYPRESS_PACKAGE_SHELL_SCRIPT;
  }
  const cypressPath = require.resolve('cypress');
  const cypress = require('cypress/package.json');

  const result = resolve(dirname(cypressPath), cypress.bin.cypress);

  debug('Cypress binary path: %s', result);

  if (!result) {
    throw new Error('Cannot detect cypress package executable');
  }
  return result;
}
