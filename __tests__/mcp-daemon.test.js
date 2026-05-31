const net = require("net");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { 
  SOCKET_PATH, 
  checkDaemonRunning, 
  startSocketServer, 
  gracefulShutdown, 
  log 
} = require("../cli/mcp-daemon");

describe("mcp-daemon", () => {
  const testSocketPath = path.join(os.homedir(), ".supercli", `mcp-daemon-test-${process.pid}.sock`);

  beforeEach(() => {
    if (fs.existsSync(testSocketPath)) {
      try { fs.unlinkSync(testSocketPath); } catch {}
    }
  });

  afterEach(() => {
    if (fs.existsSync(testSocketPath)) {
      try { fs.unlinkSync(testSocketPath); } catch {}
    }
  });

  test("checkDaemonRunning returns false when no server is running", async () => {
    const isRunning = await checkDaemonRunning(testSocketPath);
    expect(isRunning).toBe(false);
  });

  test("checkDaemonRunning returns true when socket is listening", async () => {
    const server = net.createServer();
    await new Promise((resolve) => server.listen(testSocketPath, resolve));

    try {
      const isRunning = await checkDaemonRunning(testSocketPath);
      expect(isRunning).toBe(true);
    } finally {
      await new Promise((resolve) => server.close(resolve));
    }
  });

  test("socket server handles malformed JSON requests gracefully and replies with an error", async () => {
    // Override SOCKET_PATH temporarily for startSocketServer
    const originalSocketPath = require("../cli/mcp-daemon").SOCKET_PATH;
    
    // We modify the internal socket path using a require hack or setting it
    const daemonModule = require("../cli/mcp-daemon");
    const backupSocket = daemonModule.SOCKET_PATH;
    
    // Actually, we can just start a standard net.createServer on testSocketPath using the same logic:
    // Or we can stub the SOCKET_PATH in the daemon module if possible.
    // In node, we can assign it since module.exports properties are mutable:
    daemonModule.SOCKET_PATH = testSocketPath;

    let server;
    try {
      server = startSocketServer();
      
      const response = await new Promise((resolve, reject) => {
        const client = net.connect(testSocketPath, () => {
          // Send a malformed request (invalid JSON object)
          client.write("invalid-json\n");
          // Send null request
          client.write("null\n");
        });

        let data = "";
        client.on("data", (chunk) => {
          data += chunk.toString("utf-8");
          if (data.includes("\n")) {
            client.end();
            resolve(data.trim());
          }
        });

        client.on("error", reject);
      });

      // The server should reply with a JSON-RPC error response instead of crashing
      const parsed = JSON.parse(response);
      expect(parsed).toEqual(expect.objectContaining({
        id: null,
        error: expect.objectContaining({
          message: expect.stringContaining("expected a JSON object")
        })
      }));

    } finally {
      daemonModule.SOCKET_PATH = backupSocket;
      if (server) {
        await new Promise((resolve) => server.close(resolve));
      }
    }
  });

  describe("log() output stream", () => {
    let stdoutWriteSpy;
    let stderrWriteSpy;

    beforeEach(() => {
      stdoutWriteSpy = jest.spyOn(process.stdout, "write").mockImplementation(() => true);
      stderrWriteSpy = jest.spyOn(process.stderr, "write").mockImplementation(() => true);
    });

    afterEach(() => {
      stdoutWriteSpy.mockRestore();
      stderrWriteSpy.mockRestore();
    });

    test("writes log messages to stderr, not stdout", () => {
      log("test message");
      expect(stderrWriteSpy).toHaveBeenCalled();
      expect(stdoutWriteSpy).not.toHaveBeenCalled();
      const lastCall = stderrWriteSpy.mock.calls[stderrWriteSpy.mock.calls.length - 1][0];
      expect(lastCall.toString()).toContain("test message");
    });
  });
});
