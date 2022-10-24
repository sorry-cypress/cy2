import fs from 'fs';
import which from 'npm-which';
import { platform } from 'os';
import path, { dirname } from 'path';
import { promisify } from 'util';

import { getContext } from './context';
import { debug } from './debug';

export async function getCypressCLIBinPath(): Promise<string> {
  let cliBinPath: null | string | void = null;

  const ctx = getContext();
  if (ctx?.has('cypressPackagePath')) {
    cliBinPath = path.join(
      dirname(ctx.get('cypressPackagePath') as string),
      'bin',
      'cypress'
    );
  } else {
    cliBinPath = await whichCypress();
  }

  if (!cliBinPath) {
    throw new Error('Cannot detect cypress package executable script');
  }
  const packagePath = path.normalize(fs.realpathSync(cliBinPath));
  debug('Cypress normalized binary path: %s', packagePath);
  return packagePath;
}

async function whichCypress() {
  const location = platform() === 'win32' ? process.cwd() : __dirname;
  const pWhich = promisify<string | null>(which(location));
  return pWhich('cypress');
}
