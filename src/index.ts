import * as lib from './patch';

// TODO: implement permanent patch solution
// export const patch = lib.patch;

export const run = async (moduleAbsolutePath: string) => {
  await lib.patchServerInit(moduleAbsolutePath);
  await lib.run();
};
