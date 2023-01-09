import type httpProxyType from 'http-proxy';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { cert, key } from './cert';
import { debugNet } from './debug';
import * as httpProxy from './http-proxy';
import { warn } from './log';

const inteceptors = new Map<'upstream' | 'direct', httpProxyType>();

export async function stopInterceptors() {
  debugNet('Stopping interceptors');
  await Promise.all(
    Array.from(inteceptors.values()).map(
      (interceptor, i, all): Promise<void> =>
        new Promise((resolve) =>
          interceptor.close(() => {
            debugNet('Stopped interceptor %d/%d', i + 1, all.length);
            resolve();
          })
        )
    )
  );
  inteceptors.clear();
}

export async function getUpstreamInterceptor({
  target,
  upstreamProxy,
}: {
  target: string;
  upstreamProxy: URL;
}) {
  if (inteceptors.has('upstream')) {
    debugNet(
      'Using interceptor with upstream routing',
      upstreamProxy.toString(),
      target
    );
    return inteceptors.get('upstream');
  }
  debugNet(
    'Creating interceptor with upstream routing path: %s -> %s',
    upstreamProxy.toString(),
    target
  );
  const agent = new HttpsProxyAgent({
    protocol: upstreamProxy.protocol, // connect to upstreamProxy over https
    host: upstreamProxy.hostname,
    port: upstreamProxy.port,
    path: upstreamProxy.pathname,
  });

  inteceptors.set(
    'upstream',
    await createInterceptor({
      target,
      agent,
    })
  );
  return inteceptors.get('upstream');
}

export async function getDirectInterceptor({
  target,
}: {
  target: string;
}): Promise<httpProxyType> {
  if (inteceptors.has('direct')) {
    debugNet('Using interceptor with direct routing');
    return inteceptors.get('direct') as httpProxyType;
  }
  debugNet('Creating interceptor with direct routing path: %s', target);
  inteceptors.set(
    'direct',
    await createInterceptor({
      target,
    })
  );
  return inteceptors.get('direct') as httpProxyType;
}

function createInterceptor({
  target,
  agent,
}: {
  target: string;
  agent?: HttpsProxyAgent;
}): Promise<httpProxyType> {
  return new Promise((resolve) => {
    debugNet('Creating interceptor for %s', target);
    const i = httpProxy
      // @ts-ignore
      .createProxyServer({
        target,
        changeOrigin: true,
        followRedirects: true,
        agent,
        ssl: {
          key,
          cert,
        },
      })
      .on('error', (err) => {
        const type = Boolean(agent) ? 'upstream proxy' : 'direct';
        debugNet('Interceptor of type %s error: %s', type, err);
        warn('Error connecting to %s: %s', target, err.message);
      });

    i.listen(0, undefined, () => resolve(i));
  });
}
