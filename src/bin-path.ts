import { dirname, resolve } from 'path';
import { debug } from './debug';
import { error } from './log';

export async function getCypressCLIBinPath(): Promise<string> {
  if (process.env.CYPRESS_PACKAGE_SHELL_SCRIPT) {
    debug(
      'Cypress binary path from CYPRESS_PACKAGE_SHELL_SCRIPT: %s',
      process.env.CYPRESS_PACKAGE_SHELL_SCRIPT
    );
    return process.env.CYPRESS_PACKAGE_SHELL_SCRIPT;
  }

  try {
    const cypressPath = require.resolve('cypress');
    const cypress = require('cypress/package.json');

    if (!cypress.bin || !cypress.bin?.cypress) {
      throw new Error('Cannot detect cypress package executable');
    }
    const result = resolve(dirname(cypressPath), cypress.bin.cypress);
    debug('Cypress binary path: %s', result);

    if (!result) {
      throw new Error('Cannot detect cypress package executable');
    }
    return result;
  } catch (err) {
    error(
      'Cannot detect cypress package executable. Consider using CYPRESS_PACKAGE_SHELL_SCRIPT environment variable. Tried locations: %O',
      require.resolve.paths('cypress')
    );
    throw err;
  }
}
