import cp from 'child_process';
import fs from 'fs';
import yaml from 'js-yaml';
import { getCypressCLIBinPath } from './bin-path';
import { debug } from './debug';
import { getConfigFilesPaths, getServerInitPath } from './discovery';
import { pathExists } from './fs';
import { instrumentCypressInit } from './js';

/**
 * Patch Cypress init script
 *
 * @param {string} injectedAbsolutePath - JS module to be injected into Cypress
 */
export async function patchServerInit(injectedAbsolutePath: string) {
  const serverInitPath = await getServerInitPath();
  debug('Patching cypress entry point file: %s', serverInitPath);

  const serverInitBackup = serverInitPath + '.bak';

  if (!pathExists(serverInitBackup)) {
    fs.copyFileSync(serverInitPath, serverInitBackup);
  }
  const doc = fs.readFileSync(serverInitPath, 'utf8');
  const result = instrumentCypressInit(
    doc,
    injectedAbsolutePath,
    serverInitPath,
    serverInitBackup
  );

  fs.writeFileSync(serverInitPath, result);
}

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
  return cp.spawn(cliBinPath, [...rest], { stdio: 'inherit' });
}

export async function verify() {
  const cliBinPath = await getCypressCLIBinPath();
  debug('Verifying cypress from %s', cliBinPath);
  cp.execFileSync(cliBinPath, ['verify'], { stdio: 'pipe' });
}
