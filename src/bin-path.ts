import fs from 'fs';
import path, { dirname } from 'path';

import { debug } from './debug';

export async function getCypressCLIBinPath(): Promise<string> {
  if (process.env.CYPRESS_PACKAGE_BIN_ENTRY) {
    return process.env.CYPRESS_PACKAGE_BIN_ENTRY;
  }
  const result = await whichCypress();
  
  debug('Cypress normalized binary path: %s', result);
  if (!result) {
   throw new Error('Cannot detect cypress package executable') 
  }
  return result;
}


import which from 'npm-which';
import { platform } from 'os';
import { promisify } from 'util';



async function whichCypress() {
  const location = platform() === 'win32' ? process.cwd() : __dirname;
  const pWhich = promisify<string | null>(which(location));
  return pWhich('cypress');
}