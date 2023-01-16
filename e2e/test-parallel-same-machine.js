const { run } = require('../');

console.log(require.resolve.paths('cy2'));
process.env.CYPRESS_API_URL = 'https://myURIhere.com';

/* 

The test is supposed to be run with NODE_PATH being set:

- to the pwd of the project for locally installed cypress
- to "`npm prefix -g`/lib/node_modules` for globally installed cypress

See the .circle/config.yml file for an example of how to set this up. Note the use of npm_config_prefix to set the location for global npm installs.
*/

/*
 https://docs.npmjs.com/cli/v8/configuring-npm/folders#node-modules

 Global installs on Unix systems go to {prefix}/lib/node_modules. Global installs on Windows go to {prefix}/node_modules (that is, no lib folder.)

 
*/
async function main() {
  console.log('Running cypress tests via "run" API');

  // cypress is using ts-path/register which discovera our tsconfig.json and breaks the imports. Overriding this env should prevent it from parsing our tsconfig.json
  process.env.TS_NODE_PROJECT = 'dummy.ts.json';
  const resultA = await run(process.env.CYPRESS_API_URL);
  const resultB = await run(process.env.CYPRESS_API_URL);

  console.log({ resultA: !!resultA, resultB: resultB });
  process.exit(resultA.totalFailed + resultB.totalFailed);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
