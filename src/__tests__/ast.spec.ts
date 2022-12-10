import { FN_ID, hasInjected, instrumentCypressInit, parseJS } from '../js';
import { normalizePath } from '../path';

// jest.mock('../path');

const nonPatchedFile = `
process.env.CYPRESS_INTERNAL_ENV =
  process.env.CYPRESS_INTERNAL_ENV || "production";
require("./packages/server");
`;

const patchedFile = `
(
  function ${FN_ID}() {
    try { 
        require('oldPath.js');
    } catch (e) {
        // noop;
    }
}
)();

process.env.CYPRESS_INTERNAL_ENV =
  process.env.CYPRESS_INTERNAL_ENV || "production";
require('./packages/server');
`;

const result = (path = 'foo') => `(function ${FN_ID}() {
    try {
        require('${path}')('source', 'backup');
    } catch (e) {
        console.error(e);
    }
}());
process.env.CYPRESS_INTERNAL_ENV = process.env.CYPRESS_INTERNAL_ENV || 'production';
require('./packages/server');`;

test('should return false for non-injected code', () => {
  expect(hasInjected(parseJS(nonPatchedFile))).toEqual(false);
});

test('should return true for injected code', () => {
  expect(hasInjected(parseJS(patchedFile))).toEqual(true);
});

test('should inject new code', async () => {
  expect(
    instrumentCypressInit(nonPatchedFile, 'foo', 'source', 'backup')
  ).toEqual(result());
});

test('should replace existing code', async () => {
  expect(instrumentCypressInit(patchedFile, 'foo', 'source', 'backup')).toEqual(
    result()
  );
});

test('should inject new code for windows path', async () => {
  expect(
    instrumentCypressInit(
      nonPatchedFile,
      'C:\\Users\\Administrator\\Desktop\\node_modules\\cy2\\dist/injected.js',
      'source',
      'backup'
    )
  ).toEqual(
    result(
      normalizePath(
        'C:\\Users\\Administrator\\Desktop\\node_modules\\cy2\\dist/injected.js'
      )
    )
  );
});
