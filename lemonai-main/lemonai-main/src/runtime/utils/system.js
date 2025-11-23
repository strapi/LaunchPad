const net = require('net');

async function find_available_tcp_port(min_port = 30000, max_port = 39999, max_attempts = 10) {

  /**
  Find an available TCP port in a specified range.

  Args:
      min_port (int): The lower bound of the port range (default: 30000)
      max_port (int): The upper bound of the port range (default: 39999)
      max_attempts (int): Maximum number of attempts to find an available port (default: 10)

  Returns:
      int: An available port number, or -1 if none found after max_attempts
  
   */
  let port = Math.floor(Math.random() * (max_port - min_port + 1)) + min_port;
  let attempts = 0;
  while (attempts < max_attempts) {
    return new Promise((resolve, reject) => {
      const server = net.createServer();
      server.listen(port, () => {
        server.close(() => resolve(port));
      });
      server.on('error', () => {
        attempts++;
        if (attempts === max_attempts) {
          resolve(-1);
        } else {
          port = Math.floor(Math.random() * (max_port - min_port + 1)) + min_port;
        }
      });
    });
  }
}

module.exports = {
  find_available_tcp_port
};