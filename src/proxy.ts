import * as a from 'fp-ts/Array';
import { pipe } from 'fp-ts/function';
import * as o from 'fp-ts/Option';
import http from 'http';
import { createHttpTerminator } from 'http-terminator';
import { isMatch } from 'micromatch';
import net from 'net';
import { debugNet } from './debug';
import { enc } from './enc';
import {
  getDirectInterceptor,
  getUpstreamInterceptor,
  stopInterceptors,
} from './interceptor';
import {
  pipeSocketToLocalPort,
  pipeSocketToRemoteDestination,
} from './network';
import { runProxyChain } from './proxy-chain';
import { getSanitizedEnvironment } from './proxy-settings';

export interface Proxy {
  stop: () => Promise<void>;
  port: number;
}
export async function startProxy({
  target = 'https://cy.currents.dev',
  upstreamProxy = null,
  envVariables = {},
}: {
  target: string;
  upstreamProxy: URL | null;
  envVariables: Partial<ReturnType<typeof getSanitizedEnvironment>>;
}): Promise<Proxy> {
  return new Promise((resolve, reject) => {
    const onConnect = getOnConnect(
      upstreamProxy,
      target,
      envVariables.NO_PROXY?.split(',')
    );

    const proxy = http.createServer();
    const httpTerminator = createHttpTerminator({
      server: proxy,
    });

    async function stopProxy(): Promise<void> {
      debugNet('Stopping proxy');
      await httpTerminator.terminate();
    }

    proxy.on('connect', onConnect).listen(0, () => {
      const address = proxy.address();
      if (!isAddress(address)) {
        reject(new Error('Unable to detect proxy address'));
        return;
      }

      debugNet('Proxy is listening on port %d', address.port);
      resolve({
        stop: async () => {
          await stopInterceptors();
          await stopProxy();
          debugNet('Stopped proxy + interceptors');
        },
        port: address.port,
      });
      return;
    });
  });
}

const getOnConnect = (
  upstreamProxy: URL | null,
  target: string,
  noProxy: string[] = []
) =>
  function onConnect(req: http.IncomingMessage, socket: net.Socket) {
    debugNet('Connection request: %s', req.url);

    if (!req.url) {
      throw new Error('Missing req.url in connect handler');
    }

    const [hostname, port] = req.url.split(':', 2);

    if (shouldIntercept(hostname)) {
      interceptRequest({ target, hostname, socket, upstreamProxy, noProxy });
      return;
    }

    if (upstreamProxy && shouldUseUpstreamProxy(hostname, noProxy)) {
      runProxyChain(req, socket, upstreamProxy);
      return;
    }

    pipeSocketToRemoteDestination({
      socket,
      port: parseInt(port, 10),
      hostname,
    });
    return;
  };

async function interceptRequest({
  target,
  hostname,
  socket,
  upstreamProxy = null,
  noProxy = [],
}: {
  target: string;
  hostname: string;
  socket: net.Socket;
  upstreamProxy: URL | null;
  noProxy: string[];
}) {
  const interceptor = await pipe(
    upstreamProxy,
    o.fromNullable,
    o.filter(() => shouldUseUpstreamProxy(new URL(target).hostname, noProxy)),
    o.map((upstreamProxy) => getUpstreamInterceptor({ upstreamProxy, target })),
    o.getOrElse(() => getDirectInterceptor({ target }))
  );

  // @ts-ignore
  const port = interceptor._server.address().port;
  debugNet('Intercepting request to "%s" via port: %d', hostname, port);
  pipeSocketToLocalPort({ socket, port });
}

function shouldUseUpstreamProxy(hostname: string, noProxy: string[] = []) {
  const result = a.isEmpty(noProxy) ? true : !isMatch(hostname, noProxy);
  debugNet(
    'Should "%s" use upstream proxy with NO_PROXY %s: %s',
    hostname,
    noProxy,
    result
  );
  return result;
}

function shouldIntercept(hostname: string) {
  return hostname === enc('YXBpLmN5cHJlc3MuaW8=');
}

function isAddress(value: unknown): value is net.AddressInfo {
  return typeof value === 'object' && value !== null;
}
