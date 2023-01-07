import http from 'http';
import net from 'net';

// a simple upstream tunnel proxy for testing
http
  .createServer()
  .on('connect', (req, socket) => {
    console.log('CONNECT', req.url);
    const [host, port = '443'] = req.url!.split(':');
    const socketToTarget = net.connect(parseInt(port, 10), host);

    socketToTarget.on('ready', () => {
      socketToTarget.pipe(socket);
      socket.pipe(socketToTarget);
      socket.write('HTTP/1.1 200 OK\r\n\r\n');
    });

    socket.on('end', () => {
      socketToTarget.end();
    });

    socketToTarget.on('end', () => {
      socket.end();
    });

    socketToTarget.on('error', (err) => {
      socketToTarget.end();
      socket.end();
    });

    socket.on('error', (err) => {
      socketToTarget.end();
      socket.end();
    });
  })
  .listen(9999, () => {
    console.log('upstream proxy listening on 9999');
  });
