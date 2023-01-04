/// <reference types="node" />
/// <reference types="cypress" />

import cp from 'child_process';
import { run as runCypress } from 'cypress';
import { getCypressCLIBinPath } from './bin-path';
import { debug } from './debug';
import { startProxy } from './proxy';
import { getProxySettings, getUpstreamProxy } from './proxy-settings';

/**
 * Spawn Cypress as a child process, inherit all the flags and environment variables
 *
 * @param apiUrl orchestration service URL
 */
export async function spawn(apiUrl: string) {
  debug('Cypress API URL: %s', apiUrl);

  const [, , ...rest] = process.argv;
  const cliBinPath = await getCypressCLIBinPath();
  debug('Running cypress from %s', cliBinPath, ...rest);

  const upstreamProxy = getUpstreamProxy();
  const { port } = await startProxy(apiUrl, upstreamProxy);
  const settings = getProxySettings({ port });

  cp.spawn('node', [cliBinPath, ...rest], {
    stdio: 'inherit',
    env: {
      ...process.env,
      HTTP_PROXY: settings.proxyURL,
      NODE_EXTRA_CA_CERTS: settings.caPath,
    },
  }).on('exit', (code) => {
    process.exit(code ?? 1);
  });
}

/**
 * Run Cypress via {Module API} https://docs.cypress.io/guides/guides/module-api
 *
 * @param apiUrl orchestration service URL
 * @param config Cypress run options
 * @returns Cypress run results
 */
export async function run(
  apiUrl: string,
  config: CypressCommandLine.CypressRunOptions
) {
  debug('Cypress API URL: %s', apiUrl);
  const upstreamProxy = getUpstreamProxy();
  const { port, stop } = await startProxy(apiUrl, upstreamProxy);
  try {
    const settings = getProxySettings({ port });
    process.env.HTTP_PROXY = settings.proxyURL;
    process.env.NODE_EXTRA_CA_CERTS = settings.caPath;
    return await runCypress(config);
  } finally {
    await stop();
  }
}
