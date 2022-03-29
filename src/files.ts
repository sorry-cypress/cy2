import path from 'path';

import { debug } from './debug';

export type ConfigFiles = {
  configFilePath: string;
  backupConfigFilePath: string;
};
export const getConfigFiles = (pkgRoot: string): ConfigFiles => {
  const configFilePath = path.resolve(
    pkgRoot,
    'packages/server/config/app.yml'
  );
  const backupConfigFilePath = path.resolve(
    pkgRoot,
    'packages/server/config/_app.yml'
  );

  debug('Cypress configFilePath: %s', configFilePath);
  return {
    configFilePath,
    backupConfigFilePath,
  };
};
