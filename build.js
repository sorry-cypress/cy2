#!/usr/bin/env node

const { build } = require('esbuild');

build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  outdir: 'dist',
  minify: true,
  sourcemap: true,
  target: ['node14'],
  format: 'cjs',
  platform: 'node',
  packages: 'external',
  legalComments: 'linked',
}).catch(() => process.exit(1));
