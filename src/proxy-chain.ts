import http from 'http';
import https from 'https';
import net from 'net';
import { debugNet } from './debug';

export function runProxyChain(
  req: http.IncomingMessage,
  socket: net.Socket,
  upstreamProxy: URL
) {
  debugNet('Proxy chain to upstream for', req.url);

  upstreamProxy.protocol === 'https:'
    ? https
    : http
        .request({
          method: 'CONNECT',
          path: req.url,
          headers: req.headers,
          agent: false,
          hostname: upstreamProxy.hostname,
          port: upstreamProxy.port,
          protocol: upstreamProxy.protocol,
        })
        .once('upgrade', onUpgrade)
        .once('connect', onConnect)
        .once('error', onError)
        .once('response', onResponse)
        .end();

  function onResponse(res) {
    res.upgrade = true;
  }

  function onUpgrade(res, proxySocket) {
    process.nextTick(function () {
      onConnect(res, proxySocket);
    });
  }

  function onConnect(res, proxySocket) {
    proxySocket.setNoDelay(true);
    proxySocket.removeAllListeners();

    if (res.statusCode === 200) {
      socket.pipe(proxySocket);
      proxySocket.pipe(socket);
      socket.write('HTTP/1.1 200 OK\r\n\r\n');
    } else {
      socket.write('HTTP/1.1 500 SERVER ERROR\r\n\r\n');
      socket.end();
      socket.destroy();
    }

    proxySocket.on('error', () => {
      proxySocket.end();
      proxySocket.destroy();
      socket.end();
      socket.destroy();
    });

    socket.on('error', () => {
      proxySocket.end();
      proxySocket.destroy();
      socket.end();
      socket.destroy();
    });
  }

  function onError(err) {
    console.error('Upstream proxy connection error', err);
    socket.end();
    socket.destroy();
  }
}
