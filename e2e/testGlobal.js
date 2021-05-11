#!/bin/env node
const { installCmd, runE2E } = require('./setup');

console.log('Running global installation tests...');

if (runE2E('_global', installCmd.global) !== 0) {
  console.log('Error: global cypress install failed');
  process.exit(1);
}
