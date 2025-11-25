/**
 * Development server script with dynamic port detection
 * Finds an available port and runs vercel dev on it
 */

const { spawn } = require("child_process");
const { findAvailablePort } = require("./find-port");

async function startDevServer() {
  try {
    // Find an available port starting from 3000
    const port = await findAvailablePort(3000);

    console.log(`🚀 Starting development server on port ${port}...`);
    console.log(`📱 Open http://localhost:${port} in your browser\n`);

    // Spawn vercel dev process with the found port
    const vercelProcess = spawn(
      "vercel",
      ["dev", "--listen", port.toString()],
      {
        stdio: "inherit",
        shell: true,
      }
    );

    // Handle process termination
    vercelProcess.on("error", (error) => {
      console.error("❌ Error starting Vercel dev server:", error.message);
      process.exit(1);
    });

    vercelProcess.on("exit", (code) => {
      if (code !== 0 && code !== null) {
        console.error(`❌ Vercel dev server exited with code ${code}`);
        process.exit(code);
      }
    });

    // Handle Ctrl+C gracefully
    process.on("SIGINT", () => {
      console.log("\n🛑 Shutting down development server...");
      vercelProcess.kill("SIGINT");
      process.exit(0);
    });
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

// Start the dev server
startDevServer();
