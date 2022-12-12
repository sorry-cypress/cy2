import { getCypressCLIBinPath } from './bin-path';
import { runInContext } from './context';
import * as lib from './patch';

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
  await lib.verify();
  await lib.patchServerInit(`${__dirname}/injected.js`);
  const childProcess = await lib.run();
  childProcess.on('exit', (code) => process.exit(code ?? 1));
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
