const path = require('path');
const { getCypressCLIBinPath } = require('./bin-path');
const { lookupPaths } = require('./fs');
const debug = require('debug')('cy2');

module.exports = {
  getAutoDiscoveredConfigFilesPaths,
};

async function getAutoDiscoveredConfigFilesPaths() {
  const stateModulePath = await getStateModulePath();
  const state = require(stateModulePath);

  const pkgPath = state.getBinaryPkgPath(state.getBinaryDir());
  debug('Cypress pkgPath: %s', pkgPath);

  const pkgRoot = path.dirname(pkgPath);
  debug('Cypress pkgRoot: %s', pkgRoot);

  const configFilePath = path.resolve(
    pkgRoot,
    'packages/server/config/app.yml'
  );
  const backupConfigFilePath = path.resolve(
    pkgRoot,
    'packages/server/config/_app.yml'
  );

  debug('Cypress configFilePath: %s', configFilePath);
  return {
    configFilePath,
    backupConfigFilePath,
  };
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
