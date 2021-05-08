const path = require('path');
const fs = require('fs');
const cp = require('child_process');
const which = require('npm-which')(process.cwd());
const yaml = require('js-yaml');

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

async function getCypressRoot() {
  let cypressRoot;
  try {
    const cliBinPath = await getCypressCLIBinPath();
    const cliBinPathElements = cliBinPath.split(path.sep);

    if (isWindowsBin(cliBinPath)) {
      cypressRoot = path.resolve(
        path.dirname(cliBinPath),
        'node_modules',
        'cypress'
      );
    } else {
      cypressRoot = cliBinPathElements
        .slice(0, cliBinPathElements.length - 2)
        .join('/');
    }
    return cypressRoot;
  } catch (error) {
    throw new Error('Cannot detect cypress. Is cypress installed?');
  }
}
async function getConfigFilesPaths() {
  const cypressRoot = await getCypressRoot();
  const stateModulePath = path.resolve(cypressRoot, 'lib/tasks/state');
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

function isWindowsBin(path) {
  return path.includes('.CMD');
}
