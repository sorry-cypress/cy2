import cp from 'child_process';
import path from 'path';
import { platform } from 'os';
import { debug } from './debug';

import { getCypressCLIBinPath } from './bin-path';

export async function getConfigFilesPaths_cli() {
  debug('Trying discovery via cypress CLI');
  const cliBinPath = await getCypressCLIBinPath();

  const basePath = await getBasePath(cliBinPath);
  debug('Cypress base path is: %s', basePath);

  const version = await getCypressVersion(cliBinPath);
  debug('Cypress version is: %s', version);

  const configFilePath = path.resolve(
    basePath,
    version,
    getPackagedPath(),
    'app.yml'
  );

  const backupConfigFilePath = path.resolve(
    basePath,
    version,
    getPackagedPath(),
    '_app.yml'
  );

  return {
    configFilePath,
    backupConfigFilePath,
  };
}

async function getBasePath(binPath: string) {
  debug('Getting base path: %s', `${binPath} cache path`);
  return (await execute(`${binPath} cache path`)).trim();
}

async function getCypressVersion(binPath: string) {
  debug('Getting cypress version: %s', `${binPath} --version`);
  const version = await execute(`${binPath} --version`);
  const packageVersion = version
    .split('\n')
    .find((i) => i.match(/^Cypress package version/));
  const els = packageVersion?.split(':').map((i) => i.trim());
  if (!els || !els[1]) {
    throw new Error('Cannot detect cypress version');
  }
  return els[1];
}

function getPackagedPath() {
  if (platform() === 'win32') {
    return 'Cypress/resources/app/packages/server/config';
  }
  return 'Cypress.app/Contents/Resources/app/packages/server/config';
}

function execute(command): Promise<string> {
  return new Promise((resolve, reject) => {
    cp.exec(command, function (error, stdout, stderr) {
      if (error || stderr) {
        reject(error || stderr);
      }
      resolve(stdout);
    });
  });
}
