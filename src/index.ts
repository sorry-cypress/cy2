import * as lib from './patch';

export const patch = async () => {
  await lib.patchServerInit(`${__dirname}/injected.js`);
};

export const run = async (label: string = 'cy2') => {
  console.log(
    `[${label}] Running cypress with API URL: ${process.env.CYPRESS_API_URL}`
  );
  await lib.patchServerInit(`${__dirname}/injected.js`);
  await lib.run();
};

export const inject = lib.patchServerInit;
