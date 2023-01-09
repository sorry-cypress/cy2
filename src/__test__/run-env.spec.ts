import { run } from '../cypress-wrapper';
import { startProxy } from '../proxy';

jest.mock('../proxy');
jest.mock('cypress', () => ({
  run: async () => ({
    some: 'thing',
  }),
}));

let originalEnv = process.env;

// generate function to return a  random port
const randomPort = () => Math.floor(Math.random() * 10000) + 10000;
const target = 'http://cy.currents.dev';
describe('Run env', () => {
  beforeEach(() => {
    // restore the original env
    process.env = { ...originalEnv };
  });

  it('populates NODE_EXTRA_CA_CERTS', async () => {
    const port = randomPort();
    (startProxy as jest.Mock).mockResolvedValue({ port, stop: () => {} });

    await run(target, {});

    expect(process.env).toHaveProperty(
      'NODE_EXTRA_CA_CERTS',
      expect.any(String)
    );
  });

  it('populates HTTP_PROXY when no pre-existing env variables', async () => {
    const port = randomPort();
    (startProxy as jest.Mock).mockResolvedValue({ port, stop: () => {} });
    await run(target, {});

    expect(process.env).toMatchObject({
      HTTP_PROXY: `http://127.0.0.1:${port}`,
    });
  });

  it('removes "undefined" variables', async () => {
    const port = randomPort();
    (startProxy as jest.Mock).mockResolvedValue({ port, stop: () => {} });

    await run(target, {});
    expect(process.env).not.toHaveProperty('HTTPS_PROXY');
  });

  it('use HTTPS_PROXY as upstream proxy', async () => {
    const port = randomPort();
    (startProxy as jest.Mock).mockResolvedValue({ port, stop: () => {} });

    // prepopulate HTTPS_PROXY from userland
    const upstreamProxy = 'https://upstream.proxy/';
    process.env.HTTPS_PROXY = upstreamProxy;

    await run(target, {});

    expect(startProxy).toHaveBeenCalledWith(
      expect.objectContaining({
        upstreamProxy: new URL(upstreamProxy),
      })
    );

    expect(process.env).toHaveProperty(
      'HTTPS_PROXY',
      `http://127.0.0.1:${port}`
    );
  });
});
