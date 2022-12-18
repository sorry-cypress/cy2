import http from 'http';
import httpProxy from 'http-proxy';
import net from 'net';
import { cert, key } from './cert';
import { debug } from './debug';

export interface Proxy {
  stop: () => Promise<void>;
  port: number;
}
export function startProxy(
  target: string = 'https://cy.currents.dev'
): Promise<Proxy> {
  debug('Proxying to %s', target);

  return new Promise((resolve, reject) => {
    const interceptor = httpProxy
      .createProxyServer({
        secure: false,
        target,
        changeOrigin: true,
        followRedirects: true,
        ssl: {
          key,
          cert,
        },
      })
      .listen(0);

    const proxy = http.createServer(interceptor.web);

    function stopInterceptor(): Promise<void> {
      return new Promise((_resolve) => {
        debug('Stopping interceptor');
        interceptor.close(() => {
          _resolve();
        });
      });
    }

    function stopProxy(): Promise<void> {
      return new Promise((_resolve) => {
        debug('Stopping proxy');
        proxy.close(() => {
          _resolve();
        });
      });
    }

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
            await stopProxy();
            await stopInterceptor();
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

const getOnConnect = (interceptorPort: number) =>
  function onConnect(req: http.IncomingMessage, socket: net.Socket) {
    if (!interceptorPort) {
      throw new Error('Unable to detect interceptor port');
    }
    if (!req.url) {
      throw new Error('Missing req.url in connect handler');
    }

    const [hostname, port] = req.url.split(':', 2);

    if (hostname === 'api.cypress.io') {
      const socketToProxy = net.connect(interceptorPort);

      socketToProxy.on('ready', () => {
        socketToProxy.pipe(socket);
        socket.pipe(socketToProxy);
        socket.write('HTTP/1.1 200 OK\r\n\r\n');
      });

      socketToProxy.on('error', (...args) => {
        console.error(...args);
        socket.end();
        socket.destroy();
      });

      socketToProxy.on('end', () => {
        socket.end();
        socket.destroy();
      });

      socket.on('error', (...args) => {
        console.error(...args);
        socketToProxy.end();
        socketToProxy.destroy();
      });

      socket.on('end', () => {
        socketToProxy.end();
        socketToProxy.destroy();
      });

      return;
    }

    // proxy to the target with no interception
    const conn = net.connect(parseInt(port, 10), hostname, function () {
      socket.write('HTTP/1.1 200 OK\r\n\r\n');
      socket.pipe(conn);
      conn.pipe(socket);
    });
    conn.on('error', function () {
      socket.write('HTTP/1.1 500 SERVER ERROR\r\n\r\n');
      socket.end();
      socket.destroy();
    });
    return;
  };
