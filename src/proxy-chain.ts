import https from 'http';
import net from 'net';
import { uid } from 'uid';
import { debug } from './debug';

export function runProxyChain(
  req: https.IncomingMessage,
  socket: net.Socket,
  upstreamProxy: URL
) {
  // socket._id = uid();
  debug('Connecting to upstream proxy for', req.url);

  https
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
    proxySocket._id = uid();
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
