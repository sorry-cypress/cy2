#!/bin/env node
const { installCmd, runE2E } = require('./setup');

console.log('Running global installation tests...');

const command = !!process.env.CIRCLE_BRANCH
  ? installCmd.globalLinux
  : installCmd.globalWindows;

if (runE2E('_global', command) !== 0) {
  console.log('Error: global cypress install failed');
  process.exit(1);
}
