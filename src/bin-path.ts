import fs from 'fs';
import path, { dirname } from 'path';

import { debug } from './debug';

export async function getCypressCLIBinPath(): Promise<string> {
  const cypressModulePath = require.resolve('cypress');
  if (!cypressModulePath) {
    throw new Error('Cannot detect cypress package');
  }

  const result = path.normalize(
    fs.realpathSync(path.join(dirname(cypressModulePath), 'bin', 'cypress'))
  );
  debug('Cypress normalized binary path: %s', result);
  return result;
}
