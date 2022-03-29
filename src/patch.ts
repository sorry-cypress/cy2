import fs from 'fs';
import cp from 'child_process';

import yaml from 'js-yaml';
import { debug } from './debug';
import { getConfigFilesPaths } from './discovery';
import { getCypressCLIBinPath } from './bin-path';

/**
 * Patch Cypress with a custom API URL.
 *
 * Try to discover the location of `app.yml`
 * and patch it with a custom URL.
 *
 * @param {string} apiURL - new API URL to use
 * @param {string} [cypressConfigFilePath] - explicitly provide the path to Cypress app.yml and disable auto-discovery
 */
export async function patch(apiURL: string, cypressConfigFilePath?: string) {
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

  const doc = yaml.load(
    fs.readFileSync(configFilePath, 'utf8')
  ) as CypressConfigDoc;
  doc.production.api_url = apiURL;
  fs.writeFileSync(configFilePath, yaml.dump(doc));
}

interface CypressConfigDoc {
  production: {
    api_url: string;
  };
}

/**
 * Run Cypress programmatically as a child process
 */
export async function run() {
  const [node, script, ...rest] = process.argv;
  const cliBinPath = await getCypressCLIBinPath();
  debug('Running cypress from %s', cliBinPath, ...rest);

  const child = cp.spawn(cliBinPath, [...rest], { stdio: 'inherit' });
  child.on('exit', (code) => process.exit(code ?? 1));
}
