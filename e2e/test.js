const { run } = require('cy2');
console.log(require.resolve.paths('cy2'));
process.env.CYPRESS_API_URL = 'https://myURIhere.com';

/*
 https://docs.npmjs.com/cli/v8/configuring-npm/folders#node-modules

 Global installs on Unix systems go to {prefix}/lib/node_modules. Global installs on Windows go to {prefix}/node_modules (that is, no lib folder.)
 
*/

async function main() {
  console.log('Running cypress tests via "run" API');

  // cypress is using ts-path/register which discovera our tsconfig.json and breaks the imports. Overriding this env should prevent it from parsing our tsconfig.json
  process.env.TS_NODE_PROJECT = 'dummy.ts.json';
  console.log(await run(process.env.CYPRESS_API_URL));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
