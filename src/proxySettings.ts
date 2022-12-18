import fs from 'fs';
import { isUndefined, pick } from 'lodash';
import tmp from 'tmp';
import { ca } from './cert';
import { debug } from './debug';

const falsyEnv = (v) => {
  return v === 'false' || v === '0' || !v;
};

const copyLowercaseEnvToUppercase = (name: string) => {
  const lowerEnv = process.env[name.toLowerCase()];

  if (lowerEnv) {
    debug('overriding uppercase env var with lowercase %o', { name });
    process.env[name.toUpperCase()] = lowerEnv;
  }
};

const mergeNpmProxyVars = () => {
  [
    ['npm_config_proxy', 'HTTP_PROXY'],
    ['npm_config_https_proxy', 'HTTPS_PROXY'],
  ].forEach(([from, to]) => {
    if (!falsyEnv(process.env[from]) && isUndefined(process.env[to])) {
      debug("using npm's %s as %s", from, to);
      process.env[to] = process.env[from];
    }
  });
};

export function getProxySettings({ port }: { port: number }) {
  debug(
    'found proxy environment variables %o',
    pick(process.env, [
      'NO_PROXY',
      'HTTP_PROXY',
      'HTTPS_PROXY',
      'no_proxy',
      'http_proxy',
      'https_proxy',
      'npm_config_proxy',
      'npm_config_https_proxy',
      'npm_config_noproxy',
    ])
  );
  ['NO_PROXY', 'HTTP_PROXY', 'HTTPS_PROXY'].forEach(
    copyLowercaseEnvToUppercase
  );

  mergeNpmProxyVars();

  if (process.env.HTTP_PROXY || process.env.HTTPS_PROXY) {
    throw new Error(
      'HTTP_PROXY and HTTPS_PROXY are not supported. Please report this issue.'
    );
  }

  if (process.env.NODE_EXTRA_CA_CERTS) {
    throw new Error(
      'NODE_EXTRA_CA_CERTS is not supported. Please report this issue.'
    );
  }
  const tmpobj = tmp.fileSync();
  fs.writeFileSync(tmpobj.name, ca);

  return {
    caPath: tmpobj.name,
    proxyURL: `http://127.0.0.1:${port}`,
  };
}
