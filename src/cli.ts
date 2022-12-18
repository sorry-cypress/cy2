import { spawn } from './index';

export const runCY2 = async () => {
  if (!process.env.CYPRESS_API_URL) {
    throw new Error(
      'Missing CYPRESS_API_URL environment variable pointing to sorry-cypress director service'
    );
  }
  console.log(
    '[cy] Running Cypress with API URL: ',
    process.env.CYPRESS_API_URL
  );
  await spawn(process.env.CYPRESS_API_URL);
};
