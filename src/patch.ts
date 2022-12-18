import cp from 'child_process';
import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';
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
export async function run({ port }) {
  const [node, script, ...rest] = process.argv;
  const cliBinPath = await getCypressCLIBinPath();
  debug('Running cypress from %s', cliBinPath, ...rest);

  if (process.env.HTTP_PROXY || process.env.HTTPS_PROXY) {
    throw new Error(
      'HTTP_PROXY and HTTPS_PROXY are not supported. Please report this issue.'
    );
  }

  if (process.env.NODE_EXTRA_CA_CERTS) {
    throw new Error(
      'NODE_EXTRA_CA_CERTS is not supported. Please report this issue.'
    );
  }
  const caPath = path.resolve(__dirname, './cert/ca.crt');
  if (!fs.existsSync(caPath)) {
    throw new Error('Certificate not found. Please report this issue.');
  }

  return cp.spawn(cliBinPath, [...rest], {
    stdio: 'inherit',
    env: {
      ...process.env,
      HTTP_PROXY: `http://127.0.0.1:${port}`,
      NODE_EXTRA_CA_CERTS: path.resolve(__dirname, './cert/ca.crt'),
    },
  });
}
