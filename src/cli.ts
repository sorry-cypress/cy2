import { run } from './index';

export const runCY2 = async () => {
  if (!process.env.CYPRESS_API_URL) {
    throw new Error(
      'Missing CYPRESS_API_URL environment variable pointing to sorry-cypress director service'
    );
  }
  await run();
};
