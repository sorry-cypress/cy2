import http, { IncomingMessage } from 'http';
import https from 'https';
import net from 'net';
import { getDebugNet } from './debug';
import { getSocketWithId } from './network';

const debug = getDebugNet('proxy-chain');

/*
 * cypress > proxy > upstream proxy > destination
 */

export function runProxyChain(
  req: http.IncomingMessage,
  socket: net.Socket,
  upstreamProxy: URL
) {
  const cypressSocket = getSocketWithId(socket);
  debug('Proxy chain to upstream proxy for', req.url);

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

  function onResponse(res: IncomingMessage) {
    // @ts-ignore
    res.upgrade = true;
  }

  function onUpgrade(res: IncomingMessage, proxySocket: net.Socket) {
    process.nextTick(function () {
      onConnect(res, proxySocket);
    });
  }

  function onConnect(res: IncomingMessage, _proxySocket: net.Socket) {
    const proxySocket = getSocketWithId(_proxySocket);

    proxySocket.setNoDelay(true);
    proxySocket.removeAllListeners();

    if (res.statusCode === 200) {
      debug(
        'Proxy chain: connected to upstream proxy for "%s", socket: %s',
        req.url,
        proxySocket._cy2_id
      );

      cypressSocket.pipe(proxySocket);
      proxySocket.pipe(cypressSocket);
      cypressSocket.write('HTTP/1.1 200 OK\r\n\r\n');
    } else {
      debug(
        'Error connecting to upstream proxy for "%s", proxy socket: %s',
        req.url,
        proxySocket._cy2_id
      );

      cypressSocket.write('HTTP/1.1 500 SERVER ERROR\r\n\r\n');
      cypressSocket.end();
      cypressSocket.destroy();
    }

    proxySocket.on('error', (error) => {
      debug('proxySocket %s - error : %o', proxySocket._cy2_id, error);
      proxySocket.end();
      proxySocket.destroy();
      cypressSocket.end();
      cypressSocket.destroy();
    });

    cypressSocket.on('error', (error) => {
      debug('cypress socket %s - error: %o', cypressSocket._cy2_id, error);
      proxySocket.end();
      proxySocket.destroy();
      cypressSocket.end();
      cypressSocket.destroy();
    });
  }

  function onError(err) {
    debug('CONNECT request error', err);
    console.error('Upstream proxy connection error', err);
    cypressSocket.end();
    cypressSocket.destroy();
  }
}
