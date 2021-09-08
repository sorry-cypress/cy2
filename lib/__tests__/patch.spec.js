const fs = require('fs');
const path = require('path');

const yaml = require('js-yaml');
const { nanoid } = require('nanoid');

const { patch } = require('../patch');
const { getConfigFilesPaths } = require('../discovery');

jest.mock('../discovery');

const original = path.resolve(__dirname, './fixtures/app.yml');

test('should patch', async () => {
  const seed = nanoid();
  const filename = `./fixtures/__temp_fixture_${seed}`;

  const configFilePath = path.resolve(__dirname, `${filename}.yml`);
  const backupConfigFilePath = path.resolve(
    __dirname,
    `${filename}_backup.yml`
  );
  fs.copyFileSync(original, configFilePath);

  getConfigFilesPaths.mockResolvedValueOnce({
    configFilePath,
    backupConfigFilePath,
  });

  await patch(seed);

  const doc = yaml.load(fs.readFileSync(configFilePath, 'utf8'));
  expect(doc.production.api_url).toEqual(seed);
});
