import { expect, jest } from '@jest/globals';
import { run } from '../cypress-wrapper';
import * as proxy from '../proxy';
import * as settings from '../settings';

jest.mock('../proxy');
jest.mock('cypress', () => ({
  run: async () => ({
    some: 'thing',
  }),
}));

let originalEnv = { ...process.env };

// generate function to return a  random port
const randomPort = () => Math.floor(Math.random() * 10000) + 10000;
const target = 'http://cy.currents.dev';
const port = randomPort();
jest.spyOn(proxy, 'startProxy').mockResolvedValue({
  port,
  stop: async () => {},
});
jest.spyOn(settings, 'overrideProcessEnv');

describe('Run env', () => {
  beforeEach(() => {
    // restore the original env
    process.env = { ...originalEnv };
  });

  it('populates NODE_EXTRA_CA_CERTS', async () => {
    const expected = {
      NODE_EXTRA_CA_CERTS: expect.any(String),
    };
    await run(target);

    expect(settings.overrideProcessEnv).toHaveBeenCalledWith(
      expect.objectContaining(expected)
    );
  });

  it('populates HTTPS_PROXY when no pre-existing env variables', async () => {
    const expected = {
      HTTPS_PROXY: `http://127.0.0.1:${port}`,
    };
    await run(target);

    expect(settings.overrideProcessEnv).toHaveBeenCalledWith(
      expect.objectContaining(expected)
    );
  });

  it('use HTTPS_PROXY as upstream proxy', async () => {
    // prepopulate HTTPS_PROXY from userland
    process.env.HTTPS_PROXY = 'https://upstream.proxy/';

    await run(target);

    expect(proxy.startProxy).toHaveBeenCalledWith(
      expect.objectContaining({
        upstreamProxy: new URL(process.env.HTTPS_PROXY),
      })
    );

    expect(settings.overrideProcessEnv).toHaveBeenCalledWith(
      expect.objectContaining({
        HTTPS_PROXY: `http://127.0.0.1:${port}`,
      })
    );
  });
});
