import { customAlphabet } from 'nanoid';
import net from 'net';
import { getDebugNet } from './debug';

const debugDirect = getDebugNet('direct');
const debugInterceptor = getDebugNet('interceptor');

/*
 * cypress > proxy > destination
 */

export function pipeSocketToRemoteDestination({
  socket,
  port,
  hostname,
}: {
  socket: net.Socket;
  port: number;
  hostname: string;
}) {
  // proxy to the target with no interception
  const destinationSocket = getSocketWithId(net.connect(port, hostname));
  const cypressSocket = getSocketWithId(socket);

  destinationSocket.on('ready', function tunnel() {
    debugDirect(
      'destination socket: %s is ready, destination: %s:%d',
      destinationSocket._cy2_id,
      hostname,
      port
    );

    cypressSocket.pipe(destinationSocket);
    destinationSocket.pipe(cypressSocket);
    cypressSocket.write('HTTP/1.1 200 OK\r\n\r\n');
  });

  destinationSocket.addListener('close', function (withError) {
    debugDirect(
      'destination socket %s - event close',
      destinationSocket._cy2_id
    );
    if (withError) {
      debugDirect(
        'destination socket %s - event close with error. %o',
        destinationSocket._cy2_id,
        destinationSocket
      );
    }
  });

  // One important caveat is that if the Readable stream emits an error during processing, the Writable destination is not closed automatically. If an error occurs, it will be necessary to manually close each stream in order to prevent memory leaks.
  destinationSocket.on('error', function (error) {
    debugDirect(
      'destination socket %s - error %o',
      destinationSocket._cy2_id,
      error
    );
    // for some reason, socket keeps writing to conn after conn is ended, triggering an error AFTER_WRITE_FINISHED error
    destinationSocket.end();
    destinationSocket.destroy();
    cypressSocket.end();
    cypressSocket.destroy();
  });

  cypressSocket.on('error', function (error) {
    debugDirect('cypress socket %s - error %o', cypressSocket._cy2_id, error);
    cypressSocket.end();
    cypressSocket.destroy();
    destinationSocket.end();
    destinationSocket.destroy();
  });
}

/*
 * cypress > proxy > interceptor > destination
 */

export function pipeSocketToLocalPort({
  socket,
  port,
}: {
  socket: net.Socket;
  port: number;
}) {
  const cypressSocket = getSocketWithId(socket);
  const socketToInterceptor = getSocketWithId(net.connect(port));

  debugInterceptor(
    'Connected to interceptor socket: %s, port: %d',
    socketToInterceptor._cy2_id,
    port
  );

  socketToInterceptor.addListener('close', function (withError) {
    debugInterceptor(
      'socketToInterceptor  %s - event close',
      socketToInterceptor._cy2_id
    );
    if (withError) {
      debugInterceptor(
        'socketToInterceptor %s - event close with error. %o',
        socketToInterceptor._cy2_id,
        socketToInterceptor
      );
    }
  });

  socketToInterceptor.on('ready', () => {
    debugInterceptor(
      'Interceptor socket %s - "ready" event',
      socketToInterceptor._cy2_id
    );
    socketToInterceptor.pipe(cypressSocket);
    cypressSocket.pipe(socketToInterceptor);
    cypressSocket.write('HTTP/1.1 200 OK\r\n\r\n');
  });

  socketToInterceptor.on('error', (error) => {
    debugInterceptor(
      'Interceptor socket %s - "error" event: %o',
      socketToInterceptor._cy2_id,
      error
    );
    cypressSocket.end();
    cypressSocket.destroy();
  });

  socketToInterceptor.on('end', () => {
    debugInterceptor(
      'Interceptor socket %s - "end" event',
      socketToInterceptor._cy2_id
    );
    cypressSocket.end();
    cypressSocket.destroy();
  });

  cypressSocket.on('error', (error) => {
    debugInterceptor(
      'Cypress socket %s - "error" event: %o',
      cypressSocket._cy2_id,
      error
    );
    socketToInterceptor.end();
    socketToInterceptor.destroy();
  });

  cypressSocket.on('end', () => {
    debugInterceptor('Cypress socket %s - "end" event', cypressSocket._cy2_id);
    socketToInterceptor.end();
    socketToInterceptor.destroy();
  });

  cypressSocket.addListener('close', function (withError) {
    debugInterceptor('cypressSocket  %s - event close', cypressSocket._cy2_id);
    if (withError) {
      debugInterceptor(
        'cypressSocket %s - event close with error. %o',
        cypressSocket._cy2_id,
        cypressSocket
      );
    }
  });
}

const uuid = () =>
  customAlphabet(
    '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    16
  )();
type SocketWithId = net.Socket & { _cy2_id: string };

export function getSocketWithId(socket: net.Socket) {
  const socketWithId = socket as SocketWithId;
  socketWithId._cy2_id = uuid();
  return socketWithId;
}
