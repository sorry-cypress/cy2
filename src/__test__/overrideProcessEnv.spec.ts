import { expect } from '@jest/globals';

import * as settings from '../settings';

let originalEnv = { ...process.env };

describe('overrideProcessEnv', () => {
  beforeEach(() => {
    // restore the original env
    process.env = { ...originalEnv };
  });
  it('removes "undefined" variables', async () => {
    process.env.HTTP_PROXY = 'http://undefined.proxy/';

    settings.overrideProcessEnv({
      HTTP_PROXY: undefined,
    });

    expect(process.env).not.toHaveProperty('HTTP_PROXY');
  });
});
