import net from 'net';

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
  const conn = net.connect(port, hostname);

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
}

export function pipeSocketToLocalPort({
  socket,
  port,
}: {
  socket: net.Socket;
  port: number;
}) {
  const socketToInterceptor = net.connect(port);

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
}
