const fs = require('fs');
const cp = require('child_process');
const yaml = require('js-yaml');
const debug = require('debug')('cy2');
const { getConfigFilesPaths } = require('./discovery');
const { getCypressCLIBinPath } = require('./bin-path');
/**
 * Patch Cypress with a custom API URL.
 *
 * Try to discover the location of `app.yml`
 * and patch it with a custom URL.
 *
 * @param {string} apiURL - new API URL to use
 * @param {string} [cypressConfigFilePath] - explicitly provide the path to Cypress app.yml and disable auto-discovery
 */
exports.patch = async function (apiURL, cypressConfigFilePath) {
  if (!apiURL) {
    throw new Error('Missing apiURL');
  }
  const { configFilePath, backupConfigFilePath } = await getConfigFilesPaths(
    cypressConfigFilePath
  );

  debug('Patching cypress config file: %s', configFilePath);
  try {
    fs.statSync(backupConfigFilePath);
  } catch (e) {
    fs.copyFileSync(configFilePath, backupConfigFilePath);
  }

  const doc = yaml.load(fs.readFileSync(configFilePath, 'utf8'));
  doc.production.api_url = apiURL;
  fs.writeFileSync(configFilePath, yaml.dump(doc));
};

/**
 * Run Cypress programmatically as a child process
 */
exports.run = async function () {
  const [node, script, ...rest] = process.argv;
  const cliBinPath = await getCypressCLIBinPath();
  debug('Running cypress from %s', cliBinPath);
  const child = cp.spawn(cliBinPath, [...rest], { stdio: 'inherit' });
  child.on('exit', (code) => process.exit(code));
};
