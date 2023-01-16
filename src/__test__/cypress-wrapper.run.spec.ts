import { expect } from '@jest/globals';
import { run } from '../cypress-wrapper';
import * as proxy from '../proxy';

jest.mock('../proxy');
jest.mock('cypress', () => ({
  run: async () => ({
    some: 'thing',
  }),
}));

describe('run', () => {
  it('restores environment variables on success', async () => {
    jest.spyOn(proxy, 'startProxy').mockResolvedValue({
      port: 3333,
      stop: async () => {},
    });
    const originalEnv = { ...process.env };
    await run('https://localhost:1234');
    expect(originalEnv).toEqual(process.env);
  });

  it('restores environment variables on error', async () => {
    jest.spyOn(proxy, 'startProxy').mockRejectedValueOnce(new Error('test'));
    const originalEnv = { ...process.env };
    try {
      await run('https://localhost:1234');
    } catch (e) {
      // ignore
    }
    expect(originalEnv).toEqual(process.env);
  });
});
