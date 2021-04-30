const patch = require('./lib/patch');

exports.patch = async (cypressAPIUrl) => {
  await patch.patch(cypressAPIUrl, await patch.getCypressCLIBinPath());
};
