import { expect } from '@jest/globals';
import path from 'path';
import { getCA } from '../ca';

let originalEnv = process.env;

describe('CA', () => {
  beforeEach(() => {
    // restore the original env
    process.env = { ...originalEnv };
  });

  it('augments CA', async () => {
    process.env.NODE_EXTRA_CA_CERTS = path.resolve(__dirname, './fixtures/ca');
    expect(getCA()).toMatch('some ca');
  });
  it('augments CA', async () => expect(getCA()).not.toMatch('some ca'));
});
