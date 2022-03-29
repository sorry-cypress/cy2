import fs from 'fs';
import path from 'path';
import which from 'npm-which';
import { platform } from 'os';

import { debug } from './debug';

export function getCypressCLIBinPath(): Promise<string> {
  return new Promise((resolve, reject) => {
    const location = platform() === 'win32' ? process.cwd() : __dirname;

    which(location)('cypress', function (err, binaryCypress) {
      if (err) {
        return reject(err);
      }
      debug('Cypress binary: %s', binaryCypress);

      const packagePath = path.normalize(fs.realpathSync(binaryCypress));
      debug('Cypress normalized binary path: %s', packagePath);

      return resolve(packagePath);
    });
  });
}
