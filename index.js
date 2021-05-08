const lib = require('./lib/patch');

exports.patch = async (cypressAPIUrl) => {
  await lib.patch(cypressAPIUrl, await lib.getCypressCLIBinPath());
};

exports.run = async (cypressAPIUrl, label = 'cy2') => {
  const cliBinPath = await lib.getCypressCLIBinPath();
  lib.patch(cypressAPIUrl, cliBinPath);
  console.log(`[${label}] Launching cypress from ${cliBinPath}`);
  console.log(`[${label}] Cypress API URL: ${cypressAPIUrl}`);
  lib.run(cliBinPath);
};
