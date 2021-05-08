const path = require('path');
const fs = require('fs');
const cp = require('child_process');
const which = require('npm-which')(process.cwd());
const yaml = require('js-yaml');

const DEFAULT_OVERRIDE_URL = 'https://api.cypress.io/';

exports.getCypressCLIBinPath = function getCypressCLIBinPath() {
  return new Promise((resolve, reject) => {
    which('cypress', function (err, binaryCypress) {
      if (err) {
        return reject(err.message);
      }
      return resolve(fs.realpathSync(binaryCypress));
    });
  });
};

exports.getConfigFilesPaths = getConfigFilesPaths;

exports.patch = async function (apiURL, cliBinPath) {
  const { configFilePath, backupConfigFilePath } = getConfigFilesPaths(
    cliBinPath
  );
  try {
    fs.statSync(backupConfigFilePath);
  } catch (e) {
    fs.copyFileSync(configFilePath, backupConfigFilePath);
  }

  const doc = yaml.load(fs.readFileSync(configFilePath, 'utf8'));
  doc.production.api_url = apiURL || DEFAULT_OVERRIDE_URL;

  fs.writeFileSync(configFilePath, yaml.dump(doc));
};

exports.run = async function (cliBinPath) {
  const [node, script, ...rest] = process.argv;
  const child = cp.spawn(cliBinPath, [...rest], { stdio: 'inherit' });
  child.on('exit', (code) => process.exit(code));
};

function getConfigFilesPaths(cliBinPath) {
  const cliBinPathElements = cliBinPath.split('/');
  const cliPkgPath = cliBinPathElements
    .slice(0, cliBinPathElements.length - 2)
    .join('/');

  const stateModulePath = path.resolve(cliPkgPath, 'lib/tasks/state');
  const state = require(stateModulePath);
  const pkgFilePath = state.getBinaryPkgPath(state.getBinaryDir());
  const configFilePath = path.resolve(
    path.dirname(pkgFilePath),
    'packages/server/config/app.yml'
  );
  const backupConfigFilePath = path.resolve(
    path.dirname(pkgFilePath),
    'packages/server/config/_app.yml'
  );

  return {
    configFilePath,
    backupConfigFilePath,
  };
}
