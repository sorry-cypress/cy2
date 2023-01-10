import { expect } from '@jest/globals';
import { URL } from 'url';
import { getUpstreamProxy } from '../proxy-settings';

let originalEnv = process.env;

const HTTPS_PROXY = 'https://localhost:1234';
const HTTP_PROXY = 'http://localhost:1234';

describe('Upstream proxy settings', () => {
  beforeEach(() => {
    // restore the original env
    process.env = { ...originalEnv };
  });

  it('prefers HTTPS_PROXY', async () => {
    expect(
      getUpstreamProxy({
        HTTPS_PROXY,
        HTTP_PROXY,
      })
    ).toEqual(new URL(HTTPS_PROXY));
  });

  it('prefers HTTP_PROXY', async () => {
    expect(
      getUpstreamProxy({
        HTTP_PROXY,
      })
    ).toEqual(new URL(HTTP_PROXY));
  });

  it('returns null if none set', async () => {
    expect(getUpstreamProxy({})).toBe(null);
  });

  it('warn if protocol mismatch HTTPS_PROXY <> http://', async () => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    getUpstreamProxy({
      HTTPS_PROXY: 'http://localhost:1234',
    });
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringMatching('WARNING'),
      expect.stringMatching('Mismatch between protocol'),
      expect.anything()
    );
  });
  it('warn if protocol mismatch HTTP_PROXY <> https://', async () => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    getUpstreamProxy({
      HTTP_PROXY: 'httpS://localhost:1234',
    });
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringMatching('WARNING'),
      expect.stringMatching('Mismatch between protocol'),
      expect.anything()
    );
  });
});
