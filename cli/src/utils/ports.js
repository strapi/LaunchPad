import net from 'node:net';

/**
 * Check if a port is available.
 * Returns true if available, false if in use.
 */
export function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.unref(); // Prevent server from keeping the process alive
    server.once('error', () => resolve(false));
    server.once('listening', () => {
      server.close(() => resolve(true));
    });
    server.listen(port);
  });
}
