const path = require('path');
const fs = require('fs');
const cp = require('child_process');
const which = require('npm-which')(process.cwd());
const yaml = require('js-yaml');
const { lookupPaths } = require('./fs');

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

  const doc = yaml.load(fs.readFileSync(configFilePath, 'utf8'));
  doc.production.api_url = apiURL;

  fs.writeFileSync(configFilePath, yaml.dump(doc));
};

exports.run = async function () {
  const [node, script, ...rest] = process.argv;
  const cliBinPath = await getCypressCLIBinPath();
  const child = cp.spawn(cliBinPath, [...rest], { stdio: 'inherit' });
  child.on('exit', (code) => process.exit(code));
};

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
    const result = lookupPaths(candidates);
    if (!result) {
      throw new Error('Cannot detect cypress');
    }
    return result;
  } catch (error) {
    throw new Error('Cannot detect cypress. Is cypress installed?');
  }
}
async function getConfigFilesPaths() {
  const stateModulePath = await getStateModulePath();
  const state = require(stateModulePath);

  const pkgPath = state.getBinaryPkgPath(state.getBinaryDir());
  const pkgRoot = path.dirname(pkgPath);
  const configFilePath = path.resolve(
    pkgRoot,
    'packages/server/config/app.yml'
  );
  const backupConfigFilePath = path.resolve(
    pkgRoot,
    'packages/server/config/_app.yml'
  );

  return {
    configFilePath,
    backupConfigFilePath,
  };
}

function getCypressCLIBinPath() {
  return new Promise((resolve, reject) => {
    which('cypress', function (err, binaryCypress) {
      if (err) {
        return reject(err.message);
      }
      return resolve(path.normalize(fs.realpathSync(binaryCypress)));
    });
  });
}
