#!/usr/bin/env node

const prev = require('../package.json');
const fs = require('fs');

prev.name = `@currents-dev/cy2`;
prev.repository.url = `https://github.com/currents-dev/cy2.git`;
prev.publishConfig = {
  registry: 'https://npm.pkg.github.com',
};

console.log('New package.json:');
console.log(JSON.stringify(prev, null, 2));

fs.writeFileSync(`${__dirname}/../package.json`, JSON.stringify(prev, null, 2));

console.log('✅ Done!');
