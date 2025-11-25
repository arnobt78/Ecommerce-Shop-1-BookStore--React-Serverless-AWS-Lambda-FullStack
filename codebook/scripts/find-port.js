/**
 * Utility script to find an available port
 * Starts checking from port 3000 and finds the next available port
 */

const net = require("net");

/**
 * Check if a port is available
 * @param {number} port - Port number to check
 * @returns {Promise<boolean>} - True if port is available, false otherwise
 */
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();

    server.listen(port, () => {
      server.once("close", () => resolve(true));
      server.close();
    });

    server.on("error", () => resolve(false));
  });
}

/**
 * Find the next available port starting from a given port
 * @param {number} startPort - Starting port number (default: 3000)
 * @returns {Promise<number>} - Available port number
 */
async function findAvailablePort(startPort = 3000) {
  let port = startPort;
  const maxPort = startPort + 100; // Check up to 100 ports ahead

  while (port <= maxPort) {
    const available = await isPortAvailable(port);
    if (available) {
      return port;
    }
    port++;
  }

  throw new Error(
    `No available port found between ${startPort} and ${maxPort}`
  );
}

// If run directly, find and output the port
if (require.main === module) {
  findAvailablePort(3000)
    .then((port) => {
      console.log(port);
      process.exit(0);
    })
    .catch((error) => {
      console.error(error.message);
      process.exit(1);
    });
}

module.exports = { findAvailablePort, isPortAvailable };
