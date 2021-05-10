#!/bin/env node
const { installCmd, runE2E } = require('./setup');

if (runE2E('_local', installCmd.local) !== 0) {
  console.log('Error: local cypress install failed');
  process.exit(1);
}
