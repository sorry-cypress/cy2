import path from 'path';

import { debug } from './debug';
import { getCypressCLIBinPath } from './bin-path';
import { lookupPaths } from './fs';
import { getConfigFiles } from './files';

export async function getConfigFilesPaths_stateModule() {
  debug('Trying discovery via state module');

  const stateModulePath = await getStateModulePath();
  const state = require(stateModulePath);

  const pkgPath = state.getBinaryPkgPath(state.getBinaryDir());
  debug('Cypress pkgPath: %s', pkgPath);

  const pkgRoot = path.dirname(pkgPath);
  debug('Cypress pkgRoot: %s', pkgRoot);

  return getConfigFiles(pkgRoot);
}

async function getStateModulePath() {
  try {
    const cliBinPath = await getCypressCLIBinPath();
    const candidates = [
      path.join(
        path.dirname(cliBinPath),
        'node_modules',
        'cypress/lib/tasks/state.js'
      ),
      path.join(path.dirname(cliBinPath), '..', 'lib/tasks/state.js'),
      path.join(
        path.dirname(cliBinPath),
        '..',
        'cypress',
        'lib/tasks/state.js'
      ),
    ];

    debug('Cypress state module candidates: %o', candidates);

    const result = lookupPaths(candidates);

    if (!result) {
      throw new Error('Cannot detect cypress');
    }

    debug('Cypress state module detected: %s', result);
    return result;
  } catch (error) {
    throw new Error('Cannot detect cypress. Is cypress installed?');
  }
}
