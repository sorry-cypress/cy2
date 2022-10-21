import * as lib from './patch';

export const patch = async () => {
  await lib.patchServerInit(`${__dirname}/injected.js`);
};

export const run = async () => {
  await lib.patchServerInit(`${__dirname}/injected.js`);
  await lib.run();
};

export const inject = lib.patchServerInit;
