import { platform } from 'os';
import fs from 'fs';
import path from 'path';
import { debug } from './debug';
import { getConfigFiles } from './files';

export function getPkgRootFromElectronBinary(binaryPath: string): string {
  fs.statSync(binaryPath);

  // MacOS
  // ~/Downloads/Cypress.app/Contents/MacOS/Cypress
  if (platform() === 'darwin') {
    return path.resolve(
      path.resolve(binaryPath).split('Contents/MacOS/Cypress')[0] +
        '/Contents/Resources/app'
    );
  }

  // Windows
  // ~/Downloads/Cypress/Cypress.exe
  if (platform() === 'win32') {
    return path.resolve(
      path.resolve(binaryPath).split('/Cypress.exe')[0] + '/resources/app'
    );
  }

  // linux
  // > ~/Downloads/Cypress/Cypress
  return path.resolve(
    path.dirname(path.resolve(binaryPath)) + '/resources/app'
  );
}

export function getConfigFromElectronBinary(binaryPath: string) {
  fs.statSync(binaryPath);
  return getConfigFiles(getPkgRootFromElectronBinary(binaryPath));
}
