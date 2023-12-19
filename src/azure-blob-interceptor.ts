import type httpProxyType from 'http-proxy';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { cert, key } from './cert';
import { debugNet } from './debug';
import * as httpProxy from './http-proxy';
import { warn } from './log';

const interceptors = new Map<'upstream' | 'direct', httpProxyType>();

export async function stopAzureBlobInterceptors() {
  debugNet('Stopping Azure blob interceptors');
  await Promise.all(
    Array.from(interceptors.values()).map(
      (interceptor, i, all): Promise<void> =>
        new Promise((resolve) =>
          interceptor.close(() => {
            debugNet('Stopped Azure blob interceptor %d/%d', i + 1, all.length);
            resolve();
          })
        )
    )
  );
  interceptors.clear();
}

export async function getUpstreamAzureBlobInterceptor({
  target,
  upstreamProxy,
}: {
  target: string;
  upstreamProxy: URL;
}) {
  if (interceptors.has('upstream')) {
    debugNet(
      'Using Azure blob interceptor with upstream routing',
      upstreamProxy.toString(),
      target
    );
    return interceptors.get('upstream');
  }
  debugNet(
    'Creating Azure blob interceptor with upstream routing path: %s -> %s',
    upstreamProxy.toString(),
    target
  );
  const agent = new HttpsProxyAgent({
    protocol: upstreamProxy.protocol, // connect to upstreamProxy over https
    host: upstreamProxy.hostname,
    port: upstreamProxy.port,
    path: upstreamProxy.pathname,
  });

  interceptors.set(
    'upstream',
    await createInterceptor({
      target,
      agent,
    })
  );
  return interceptors.get('upstream');
}

export async function getDirectAzureBlobInterceptor({
  target,
}: {
  target: string;
}): Promise<httpProxyType> {
  if (interceptors.has('direct')) {
    debugNet('Using Azure blob interceptor with direct routing');
    return interceptors.get('direct') as httpProxyType;
  }
  debugNet('Creating Azure blob interceptor with direct routing path: %s', target);
  interceptors.set(
    'direct',
    await createInterceptor({
      target,
    })
  );
  return interceptors.get('direct') as httpProxyType;
}

function createInterceptor({
  target,
  agent,
}: {
  target: string;
  agent?: HttpsProxyAgent;
}): Promise<httpProxyType> {
  return new Promise((resolve) => {
    debugNet('Creating Azure blob interceptor for %s', target);
    const i = httpProxy
      // @ts-ignore
      .createProxyServer({
        target,
        agent,
        ssl: {
          key,
          cert,
        },
      })
      .on("proxyReq", (proxyReq) => {
        proxyReq.setHeader("x-ms-blob-type", "BlockBlob");
        debugNet('Added x-ms-blob-type header to Azure blob request')
      })
      .on('error', (err) => {
        const type = Boolean(agent) ? 'upstream proxy' : 'direct';
        debugNet('Azure blob interceptor of type %s error: %s', type, err);
        warn('Error connecting to %s: %s', target, err.message);
      });

    i.listen(0, undefined, () => resolve(i));
  });
}
