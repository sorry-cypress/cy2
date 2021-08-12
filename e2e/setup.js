#!/bin/env node
const shell = require('shelljs');

exports.installCmd = {
  local: 'npm install --save-dev cypress',
  global: 'npm install -g cypress',
};
exports.runE2E = (dirname, installCmd) => {
  shell.rm('-rf', dirname);
  shell.mkdir('-p', dirname);
  shell.mkdir('-p', '~/.local/lib');
  shell.cp('./test.js', dirname);
  shell.cd(dirname);
  shell.exec('npm init -y');
  shell.exec(installCmd);
  return shell.exec('node ./test.js').code;
};
