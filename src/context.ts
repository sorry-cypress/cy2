import { AsyncLocalStorage } from 'async_hooks';

type ContextType = Map<'cypressPackagePath', string>;
const asyncLocalStorage = new AsyncLocalStorage<ContextType>();

export const getContext = () => {
  return asyncLocalStorage.getStore();
};

export const runInContext = <T>(fn: () => T, context: ContextType) => {
  return asyncLocalStorage.run(context, fn);
};
