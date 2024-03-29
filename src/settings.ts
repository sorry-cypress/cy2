import { pipe } from 'fp-ts/function';
import * as o from 'fp-ts/Option';
import fs from 'fs';
import { chain, isUndefined, pick } from 'lodash';
import tmp from 'tmp';
import { URL } from 'url';
import { getCA } from './ca';
import { debug } from './debug';
import { warn } from './log';

const falsyEnv = (v: string) => {
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

export function getSettings({ port }: { port: number }) {
  const ca = getCA();
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
  return pipe(
    o.fromNullable(envVariables.HTTPS_PROXY),
    o.map((r) => ({
      source: 'HTTPS_PROXY',
      value: r,
    })),
    o.alt(() =>
      pipe(
        o.fromNullable(envVariables.HTTP_PROXY),
        o.map((r) => ({
          source: 'HTTP_PROXY',
          value: r,
        }))
      )
    ),
    o.map((i) => {
      warnProtocolMismatch(i.source, new URL(i.value));
      return new URL(i.value);
    }),
    o.fold(
      () => null,
      (r) => {
        debug('Using upstream proxy %o', r);
        return r;
      }
    )
  );
}

export function warnProtocolMismatch(source: string, url: URL) {
  if (url.protocol === 'http:' && source === 'HTTPS_PROXY') {
    warn(
      "Mismatch between protocol 'http' and env variable HTTPS_PROXY: %s. Use HTTP_PROXY instead.",
      url
    );
  }
  if (url.protocol === 'https:' && source === 'HTTP_PROXY') {
    warn(
      "Mismatch between protocol 'https' and env variable HTTP_PROXY: %s. USE HTTPS_PROXY instead.",
      url
    );
  }
  return;
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
  settings: ReturnType<typeof getSettings>,
  envVariables: Record<string, string | undefined>
): Partial<Record<string, string>> {
  return chain({
    ...envVariables,
    // They use outdated `@cyrpress/request` for uploading artifacts
    // it doesn't like HTTP_PROXY for some reason.
    // That affects sorry-cypress users with `http:` storage urls
    // see https://github.com/sorry-cypress/cy2/issues/47
    HTTP_PROXY: undefined,
    HTTPS_PROXY: settings.proxyURL,
    NODE_EXTRA_CA_CERTS: settings.caPath,
    CYPRESS_API_URL: undefined, // remove for preflight
  })
    .tap((o) => debug('Resolved proxy environment variables %o', o))
    .value();
}

export function overrideProcessEnv(newEnv: Partial<Record<string, string>>) {
  Object.entries(newEnv).forEach(([key, value]) => {
    if (isUndefined(value)) {
      debug('Deleting env %s', key);
      process.env[key] = value;
      delete process.env[key];
      return;
    }
    debug('Setting env %s=%s', key, value);
    process.env[key] = value;
  });
}
