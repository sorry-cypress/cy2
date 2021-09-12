import fs from 'fs';
import path from 'path';
import { debug } from './debug';

import { getConfigFilesPaths_cli } from './discovery-cli';
import { getConfigFilesPaths_stateModule } from './discovery-state-module';

interface ConfigFilePaths {
  configFilePath: string;
  backupConfigFilePath: string;
}

export async function getConfigFilesPaths(
  cypressConfigFilePath: string | null = null
): Promise<ConfigFilePaths> {
  if (typeof cypressConfigFilePath === 'string') {
    const explicitPath = path.resolve(
      path.normalize(cypressConfigFilePath.trim())
    );
    debug(
      'Explicit package path provided via CYPRESS_PACKAGE_CONFIG_PATH: %s',
      explicitPath
    );

    // verify the path
    fs.statSync(explicitPath);
    return {
      configFilePath: explicitPath,
      backupConfigFilePath: explicitPath.replace('app.yml', '_app.yml'),
    };
  }
  return tryAll(getConfigFilesPaths_stateModule, getConfigFilesPaths_cli);
}

async function tryAll(...fns) {
  const errors: Error[] = [];
  for (const fn of fns) {
    try {
      // @ts-ignore
      return await fn();
    } catch (e) {
      debug('Discovery error received: %s', e);
      errors.push(e);
    }
  }
  console.error(errors);
  throw new Error('Cannot detect cypress location');
}
