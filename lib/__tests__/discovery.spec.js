const fs = require('fs');
const { getConfigFilesPaths } = require('../discovery');
const { getAutoDiscoveredConfigFilesPaths } = require('../auto-discovery');

jest.mock('../auto-discovery');

test('should use explicit path', async () => {
  fs.statSync = jest.fn().mockReturnValue(true);

  const result = await getConfigFilesPaths('explicitPath/app.yml');

  expect(result.configFilePath).toMatch('explicitPath/app.yml');
  expect(result.backupConfigFilePath).toMatch('explicitPath/_app.yml');
  expect(fs.statSync).toHaveBeenCalledWith(
    expect.stringMatching('explicitPath')
  );
});

test('should use auto-discovery', async () => {
  getAutoDiscoveredConfigFilesPaths.mockReturnValue({});

  await getConfigFilesPaths();

  expect(getAutoDiscoveredConfigFilesPaths).toHaveBeenCalled();
});
