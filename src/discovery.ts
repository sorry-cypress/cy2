import fs from 'fs';
import path from 'path';

const { getAutoDiscoveredConfigFilesPaths } = require('./auto-discovery');
const debug = require('debug')('cy2');

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
  return getAutoDiscoveredConfigFilesPaths();
}
