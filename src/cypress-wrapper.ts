/// <reference types="node" />
/// <reference types="cypress" />

import cp from 'child_process';
import { platform } from 'os';
import packageJson from '../package.json';
import { getCypressCLIBinPath } from './bin-path';
import { debug } from './debug';
import { startProxy } from './proxy';

import {
  getEnvOverrides,
  getSanitizedEnvironment,
  getSettings,
  getUpstreamProxy,
  overrideProcessEnv,
} from './settings';

/**
 * Spawn Cypress as a child process, inherit all the flags and environment variables.
 *
 * @param apiUrl orchestration service URL
 */
export async function spawn(apiUrl: string) {
  debug('Cypress API URL: %s', apiUrl);
  debug('Package version: %s', packageJson.version);

  const [, , ...rest] = process.argv;
  const cliBinPath = await getCypressCLIBinPath();

  const isWindows = platform() === 'win32';
  const cmd = isWindows ? 'node' : cliBinPath;
  const args = isWindows ? [cliBinPath, ...rest] : rest;

  debug('Running cypress: %o', [cmd, ...args]);
  const envVariables = getSanitizedEnvironment();
  const upstreamProxy = getUpstreamProxy(envVariables);
  const { port } = await startProxy({
    target: apiUrl,
    upstreamProxy,
    envVariables,
  });

  cp.spawn(cmd, args, {
    stdio: 'inherit',
    env: {
      ...process.env,
      ...getEnvOverrides(getSettings({ port }), envVariables),
    },
  }).on('exit', (code) => {
    process.exit(code ?? 1);
  });
}

/**
 * Run Cypress via {@link https://docs.cypress.io/guides/guides/module-api| Module API}
 *
 * @param apiUrl orchestration service URL
 * @param config Cypress.run {@link https://docs.cypress.io/guides/guides/module-api#Options| options}
 * @returns Cypress {@link https://docs.cypress.io/guides/guides/module-api#Results| run results}
 */
export async function run(
  apiUrl: string,
  config?: Partial<CypressCommandLine.CypressRunOptions>
): Promise<
  | CypressCommandLine.CypressRunResult
  | CypressCommandLine.CypressFailedRunResult
> {
  debug('Cypress API URL: %s', apiUrl);
  debug('Package version: %s', packageJson.version);

  if (!apiUrl) {
    throw new Error('Missing API URL');
  }
  // use inline import, otherwise it can throw when importing for "spawn"
  const cypress = require('cypress');

  const originalEnv = { ...process.env };
  const envVariables = getSanitizedEnvironment();
  const upstreamProxy = getUpstreamProxy(envVariables);
  const { port, stop } = await startProxy({
    target: apiUrl,
    upstreamProxy,
    envVariables,
  });
  try {
    overrideProcessEnv(getEnvOverrides(getSettings({ port }), envVariables));
    return await cypress.run(config);
  } finally {
    process.env = originalEnv;
    await stop();
  }
}
