const fs = require('fs');

function pathExists(path) {
  try {
    fs.statSync(path);
    return true;
  } catch (error) {
    return false;
  }
}

exports.lookupPaths = (candidates = []) =>
  candidates.find((p) => pathExists(p));
