const path = require('path');
const fs = require('fs');
const debug = require('debug')('cy2');
const which = require('npm-which');
const { platform } = require('os');

module.exports = {
  getCypressCLIBinPath,
};

function getCypressCLIBinPath() {
  return new Promise((resolve, reject) => {
    const location = platform() === 'win32' ? process.cwd() : __dirname;

    which(location)('cypress', function (err, binaryCypress) {
      if (err) {
        return reject(err.message);
      }
      debug('Cypress binary: %s', binaryCypress);

      const packagePath = path.normalize(fs.realpathSync(binaryCypress));
      debug('Cypress normalized binary path: %s', packagePath);

      return resolve(packagePath);
    });
  });
}
