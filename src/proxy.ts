import http from 'http';
import httpProxy from 'http-proxy';
import { HttpsProxyAgent } from 'https-proxy-agent';
import net from 'net';
import { cert, key } from './cert';
import { debugNet } from './debug';
import { warn } from './log';
import { runProxyChain } from './proxy-chain';

export interface Proxy {
  stop: () => Promise<void>;
  port: number;
}
export function startProxy(
  target: string = 'https://cy.currents.dev',
  upstreamProxy: URL | null = null
): Promise<Proxy> {
  debugNet(
    'Routing path: %s',
    upstreamProxy ? `${upstreamProxy.toString()} -> ${target}` : target
  );

  const agent = upstreamProxy
    ? new HttpsProxyAgent({
        host: upstreamProxy.hostname,
        port: upstreamProxy.port,
        path: upstreamProxy.pathname,
      })
    : false;

  return new Promise((resolve, reject) => {
    const interceptor = httpProxy
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
        debugNet('Interceptor error: %s', err);
        warn('Error connecting to %s: %s', target, err.message);
      })
      .listen(0);

    function stopInterceptor(): Promise<void> {
      return new Promise((_resolve) => {
        debugNet('Stopping interceptor');
        interceptor.close(() => {
          _resolve();
        });
      });
    }

    function stopProxy(): Promise<void> {
      return new Promise((_resolve) => {
        debugNet('Stopping proxy');
        proxy.close((err) => {
          if (err) {
            console.error(err);
          }
          _resolve();
        });
      });
    }

    const proxy = http.createServer();
    proxy
      // @ts-ignore
      .on('connect', getOnConnect(interceptor._server.address().port))
      .listen(0, () => {
        const address = proxy.address();
        if (!isAddress(address)) {
          reject(new Error('Unable to detect proxy address'));
          return;
        }

        resolve({
          stop: async () => {
            debugNet('Stopping interceptor');
            await stopInterceptor();
            debugNet('Stopping proxy');
            await stopProxy();
          },
          port: address.port,
        });
        return;
      });
  });
}

function isAddress(value: unknown): value is net.AddressInfo {
  return typeof value === 'object' && value !== null;
}

const getOnConnect = (interceptorPort: number, upstreamProxy: URL | null) =>
  function onConnect(req: http.IncomingMessage, socket: net.Socket) {
    debugNet('Connection request: %s', req.url);

    if (!interceptorPort) {
      throw new Error('Unable to detect interceptor port');
    }
    if (!req.url) {
      throw new Error('Missing req.url in connect handler');
    }

    const [hostname, port] = req.url.split(':', 2);

    if (hostname === 'api.cypress.io') {
      const socketToInterceptor = net.connect(interceptorPort);

      socketToInterceptor.on('ready', () => {
        socketToInterceptor.pipe(socket);
        socket.pipe(socketToInterceptor);
        socket.write('HTTP/1.1 200 OK\r\n\r\n');
      });

      socketToInterceptor.on('error', () => {
        socket.end();
        socket.destroy();
      });

      socketToInterceptor.on('end', () => {
        socket.end();
        socket.destroy();
      });

      socket.on('error', () => {
        socketToInterceptor.end();
        socketToInterceptor.destroy();
      });

      socket.on('end', () => {
        socketToInterceptor.end();
        socketToInterceptor.destroy();
      });

      return;
    }

    if (upstreamProxy) {
      runProxyChain(req, socket, upstreamProxy);
      return;
    }

    // proxy to the target with no interception
    const conn = net.connect(parseInt(port, 10), hostname);

    conn.on('ready', function tunnel() {
      socket.pipe(conn);
      conn.pipe(socket);
      socket.write('HTTP/1.1 200 OK\r\n\r\n');
    });

    // One important caveat is that if the Readable stream emits an error during processing, the Writable destination is not closed automatically. If an error occurs, it will be necessary to manually close each stream in order to prevent memory leaks.
    conn.on('error', function () {
      // for some reason, socket keeps writing to conn after conn is ended, triggering an error AFTER_WRITE_FINISHED error
      conn.end();
      conn.destroy();
      socket.end();
      socket.destroy();
    });

    socket.on('error', function () {
      socket.end();
      socket.destroy();
      conn.end();
      conn.destroy();
    });

    return;
  };

type NetworkError = Error & {
  code: string;
};
