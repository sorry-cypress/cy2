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

  const child = await lib.run();

  child.on('close', async (code) => {
    await patch(DEFAULT_OVERRIDE_URL);
    process.exit(code ?? 1);
  });
  process.on('SIGINT', async () => {
    await patch(DEFAULT_OVERRIDE_URL);
    child.kill('SIGINT');
    process.exit(1);
  });
};
