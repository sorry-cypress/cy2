import http from 'http';
import httpProxy from 'http-proxy';
import net from 'net';
import { cert, key } from './cert';

const interceptor = httpProxy
  .createProxyServer({
    secure: false,
    target: process.env.CYPRESS_API_URL ?? 'https://cy.currents.dev',
    changeOrigin: true,
    followRedirects: true,
    ssl: {
      key,
      cert,
    },
  })
  .listen(0);

const proxy = http
  .createServer(interceptor.web)
  .on('connect', function (req, socket) {
    const parts = req.url.split(':', 2);

    const interceptorPort = interceptor._server.address().port;
    if (!interceptorPort) {
      throw new Error('Unable to detect interceptor port');
    }

    if (parts[0] === 'api.cypress.io') {
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

      socketToProxy.on('end', (...args) => {
        socket.end();
        socket.destroy();
      });

      socket.on('error', (...args) => {
        console.error(...args);
        socketToProxy.end();
        socketToProxy.destroy();
      });

      socket.on('end', (...args) => {
        console.log('socket end Cypress <> Proxy', ...args);
        socketToProxy.end();
        socketToProxy.destroy();
      });

      return;
    }

    // proxy to the target with no interception
    const conn = net.connect(parts[1], parts[0], function () {
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
  });

export function startProxy(): Promise<number> {
  return new Promise((resolve) => {
    proxy.listen(0, () => {
      const address = proxy.address();
      if (!isAddress(address)) {
        throw new Error('Unable to detect proxy address');
      }

      resolve(address.port);
    });
  });
}

export function stopProxy(): Promise<void> {
  return new Promise((resolve) => {
    proxy.close(() => {
      resolve();
    });
  });
}

function isAddress(value: unknown): value is net.AddressInfo {
  return typeof value === 'object' && value !== null;
}
