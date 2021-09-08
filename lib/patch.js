const path = require('path');
const fs = require('fs');
const cp = require('child_process');
const which = require('npm-which');
const { platform } = require('os');
const yaml = require('js-yaml');
const { lookupPaths } = require('./fs');
const debug = require('debug')('cy2');

exports.patch = async function (apiURL) {
  if (!apiURL) {
    throw new Error('Missing apiURL');
  }
  const { configFilePath, backupConfigFilePath } = await getConfigFilesPaths();
  try {
    fs.statSync(backupConfigFilePath);
  } catch (e) {
    fs.copyFileSync(configFilePath, backupConfigFilePath);
  }
  debug('Patching cypress config file: %s', configFilePath);

  const doc = yaml.load(fs.readFileSync(configFilePath, 'utf8'));
  doc.production.api_url = apiURL;
  fs.writeFileSync(configFilePath, yaml.dump(doc));
};

exports.run = async function () {
  const [node, script, ...rest] = process.argv;
  const cliBinPath = await getCypressCLIBinPath();
  debug('Running cypress from %s', cliBinPath);
  const child = cp.spawn(cliBinPath, [...rest], { stdio: 'inherit' });
  child.on('exit', (code) => process.exit(code));
};

async function getConfigFilesPaths() {
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

function getCypressCLIBinPath() {
  return new Promise((resolve, reject) => {
    const location = platform() === 'win32' ? process.cwd() : __dirname;

    which(location)('cypress', function (err, binaryCypress) {
      if (err) {
        return reject(err.message);
      }
      debug('Cypress binary: %s', binaryCypress);

      const packagePath = path.normalize(fs.realpathSync(binaryCypress));
      debug('Cypress normalized package path: %s', packagePath);

      return resolve(packagePath);
    });
  });
}
