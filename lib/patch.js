const path = require('path');
const fs = require('fs');
const cp = require('child_process');
const which = require('npm-which')(process.cwd());
const yaml = require('js-yaml');

const DEFAULT_OVERRIDE_URL = 'https://api.cypress.io/';

exports.patch = function () {
  which('cypress', function (err, binaryCypress) {
    if (err) return console.error(err.message);
    const cliBinPath = fs.realpathSync(binaryCypress);
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

    try {
      fs.statSync(backupConfigFilePath);
    } catch (e) {
      fs.copyFileSync(configFilePath, backupConfigFilePath);
    }

    const doc = yaml.load(fs.readFileSync(configFilePath, 'utf8'));
    doc.production.api_url =
      process.env.CYPRESS_API_URL || DEFAULT_OVERRIDE_URL;

    fs.writeFileSync(configFilePath, yaml.dump(doc));

    const [node, script, ...rest] = process.argv;
    cp.spawn(cliBinPath, [...rest], { stdio: 'inherit' });
  });
};
