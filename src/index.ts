import * as lib from './patch';

const DEFAULT_OVERRIDE_URL = 'https://api.cypress.io/';

export const patch = lib.patch;

export const run = async (
  cypressAPIUrl = DEFAULT_OVERRIDE_URL,
  label = 'cy2',
  cypressConfigFilePath = process.env.CYPRESS_PACKAGE_CONFIG_PATH
) => {
  await lib.patch(cypressAPIUrl, cypressConfigFilePath);
  console.log(`[${label}] Running cypress with API URL: ${cypressAPIUrl}`);
  await lib.run();
};
