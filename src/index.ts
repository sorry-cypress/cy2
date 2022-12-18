import { getCypressCLIBinPath } from './bin-path';
import { runInContext } from './context';
export { run, spawn } from './cypress-wrapper';

// TODO: extract this to a separate package
export async function getBinPath(
  cypressPackagePath: string = require.resolve('cypress')
) {
  return await runInContext(
    getCypressCLIBinPath,
    new Map().set('cypressPackagePath', cypressPackagePath)
  );
}
