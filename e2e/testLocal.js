#!/bin/env node
const { installCmd, runE2E } = require('./setup');

console.log('Running local installation tests...');

if (runE2E('_local', installCmd.local) !== 0) {
  console.log('Error: local cypress install failed');
  process.exit(1);
}
