import fs from 'fs';
import { chain, isUndefined, pick } from 'lodash';
import tmp from 'tmp';
import { URL } from 'url';
import { ca } from './cert';
import { debug } from './debug';

const falsyEnv = (v) => {
  return v === 'false' || v === '0' || !v;
};

export function getSanitizedEnvironment() {
  const result = pick(process.env, [
    'NO_PROXY',
    'HTTP_PROXY',
    'HTTPS_PROXY',
    'no_proxy',
    'http_proxy',
    'https_proxy',
    'npm_config_proxy',
    'npm_config_https_proxy',
    'npm_config_noproxy',
  ]);

  debug('Original environment variables %o', result);

  // override uppercase with lowercase non falsy value regardless of existing uppercase value
  [
    ['http_proxy', 'HTTP_PROXY'],
    ['https_proxy', 'HTTPS_PROXY'],
    ['no_proxy', 'NO_PROXY'],
  ].forEach(([from, to]) => {
    if (!falsyEnv(result[from])) {
      debug('Copying lowercase %s to %s', from, to);
      result[to] = result[from];
    }
  });

  // override only if target is undefined and source is not falsy
  [
    ['npm_config_proxy', 'HTTP_PROXY'],
    ['npm_config_https_proxy', 'HTTPS_PROXY'],
  ].forEach(([from, to]) => {
    if (!falsyEnv(result[from]) && isUndefined(result[to])) {
      debug("Using npm's %s as %s", from, to);
      result[to] = result[from];
    }
  });

  // only return uppercase env vars, remove the others
  const r = {
    https_proxy: undefined,
    http_proxy: undefined,
    npm_config_proxy: undefined,
    npm_config_https_proxy: undefined,
    NO_PROXY: result.NO_PROXY,
    HTTP_PROXY: result.HTTP_PROXY,
    HTTPS_PROXY: result.HTTPS_PROXY,
  };
  debug('Sanitized environment variables %o', r);
  return r;
}

export function getProxySettings({ port }: { port: number }) {
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

export function getUpstreamProxy(
  envVariables: Record<string, string | undefined>
) {
  if (envVariables.HTTPS_PROXY) {
    const r = new URL(envVariables.HTTPS_PROXY);
    r.protocol = 'https:';
    debug('Using upstream proxy %s', r);
    return r;
  }

  if (envVariables.HTTP_PROXY) {
    const r = new URL(envVariables.HTTP_PROXY);
    r.protocol = 'http:';
    debug('Using upstream proxy %s', r);
    return r;
  }

  return null;
}

/**
Override HTTP_PROXY and maybe HTTPS_PROXY env variables with our own proxy URL

Relevant documentation: {@link https://docs.cypress.io/guides/references/proxy-configuration#Proxy-environment-variables}


The cloud API implementation: they copy HTTP_PROXY to HTTPS_PROXY at https://github.com/cypress-io/cypress/blob/develop/packages/server/lib/util/proxy.ts#L23.

Later they use HTTPS_PROXY for cloud connections and 'proxy-from-env' npm package
- https://github.com/cypress-io/cypress/blob/develop/packages/network/lib/agent.ts#L347
- https://github.com/cypress-io/cypress/blob/develop/packages/server/lib/cloud/api.ts#L45
*/
export function getEnvOverrides(
  currentsProxyURL: string,
  envVariables: Record<string, string | undefined>
): Partial<Record<string, string>> {
  return chain({
    ...envVariables,
    HTTP_PROXY: currentsProxyURL,
    HTTPS_PROXY: envVariables.HTTPS_PROXY ? currentsProxyURL : undefined,
  })
    .tap((o) => debug('Resolved proxy environment variables %o', o))
    .value();
}
