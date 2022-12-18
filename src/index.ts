import { getCypressCLIBinPath } from './bin-path';
import { runInContext } from './context';
import * as lib from './patch';
import { startProxy, stopProxy } from './proxy';

/**
 * Patch cypress for subsequent programmatic invocation.
 * The actual dashboard url is set via process.env.CYPRESS_API_URL.
 * For SorryCypress it should point to the director service.
 *
 * @param cypressPackagePath - path to cypress npm package enyty point
 */
export const patch = async (
  cypressPackagePath: string = require.resolve('cypress')
) => {
  await runInContext(
    () => lib.patchServerInit(`${__dirname}/injected.js`),
    new Map().set('cypressPackagePath', cypressPackagePath)
  );
};

export const run = async (label: string = 'cy2') => {
  console.log(
    `[${label}] Running cypress with API URL: ${process.env.CYPRESS_API_URL}`
  );
  const port = await startProxy();
  const childProcess = await lib.run({ port });
  childProcess.on('exit', (code) => {
    stopProxy();
    process.exit(code ?? 1);
  });
};

export const inject = async (
  injectedAbsolutePath: string,
  cypressPackagePath: string = require.resolve('cypress')
) => {
  await runInContext(
    () => lib.patchServerInit(injectedAbsolutePath),
    new Map().set('cypressPackagePath', cypressPackagePath)
  );
};

export const getBinPath = async (
  cypressPackagePath: string = require.resolve('cypress')
) => {
  return await runInContext(
    getCypressCLIBinPath,
    new Map().set('cypressPackagePath', cypressPackagePath)
  );
};
