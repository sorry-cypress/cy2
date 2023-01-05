/// <reference types="node" />
/// <reference types="cypress" />

import cp from 'child_process';
import { platform } from 'os';
import { getCypressCLIBinPath } from './bin-path';
import { debug } from './debug';
import { startProxy } from './proxy';
import {
  getEnvProxyOverrides,
  getProxySettings,
  getUpstreamProxy,
} from './proxy-settings';

/**
 * Spawn Cypress as a child process, inherit all the flags and environment variables
 *
 * @param apiUrl orchestration service URL
 */
export async function spawn(apiUrl: string) {
  debug('Cypress API URL: %s', apiUrl);

  const [, , ...rest] = process.argv;
  const cliBinPath = await getCypressCLIBinPath();

  const isWindows = platform() === 'win32';
  const cmd = isWindows ? 'node' : cliBinPath;
  const args = isWindows ? [cliBinPath, ...rest] : rest;

  debug('Running cypress: %o', [cmd, ...args]);

  const upstreamProxy = getUpstreamProxy();
  const { port } = await startProxy(apiUrl, upstreamProxy);
  const settings = getProxySettings({ port });

  cp.spawn(cmd, args, {
    stdio: 'inherit',
    env: {
      ...process.env,
      ...getEnvProxyOverrides(settings.proxyURL),
      NODE_EXTRA_CA_CERTS: settings.caPath,
    },
  }).on('exit', (code) => {
    process.exit(code ?? 1);
  });
}

/**
 * Run Cypress via [Module API]{@link https://docs.cypress.io/guides/guides/module-api}
 *
 * @param apiUrl orchestration service URL
 * @param config Cypress.run options
 * @returns Cypress run results
 */
export async function run(
  apiUrl: string,
  config: CypressCommandLine.CypressRunOptions
) {
  debug('Cypress API URL: %s', apiUrl);

  // use inline import, otherwise it can throw when importing for "spawn"
  const cypress = require('cypress');

  const upstreamProxy = getUpstreamProxy();
  const { port, stop } = await startProxy(apiUrl, upstreamProxy);
  try {
    const settings = getProxySettings({ port });

    // override proxy env variables
    Object.entries(getEnvProxyOverrides(settings.proxyURL)).forEach(
      ([key, value]) => (process.env[key] = value)
    );

    process.env.NODE_EXTRA_CA_CERTS = settings.caPath;
    return await cypress.run(config);
  } finally {
    await stop();
  }
}
