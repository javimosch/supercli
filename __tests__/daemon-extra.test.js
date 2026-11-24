"use strict";

const fs = require("fs");
const path = require("path");
const os = require("os");

const daemon = require("../cli/daemon");

// The daemon module uses os.homedir() at load time, so paths are fixed
const SUPERCLI_DIR = path.join(os.homedir(), ".supercli");

// Tests probe an unreachable port so a live daemon is never touched.
const DEAD = { host: "127.0.0.1", port: 1 };

describe("sc daemon — core functions", () => {
  test("loadConfig returns config object with expected fields", () => {
    const config = daemon.loadConfig();
    expect(config).toBeTruthy();
    expect(typeof config.enabled).toBe("boolean");
    expect(typeof config.sync_interval_seconds).toBe("number");
  });

  test("loadConfig honors SUPERCLI_SERVER env over daemon.json", () => {
    process.env.SUPERCLI_SERVER = "http://hub.test:3000";
    const config = daemon.loadConfig();
    expect(config.server_url).toBe("http://hub.test:3000");
    delete process.env.SUPERCLI_SERVER;
  });

  test("loadDaemonConfig is the canonical name", () => {
    expect(daemon.loadDaemonConfig).toBe(daemon.loadConfig);
  });

  test("writeLog writes a JSONL entry to logs dir", () => {
    const testEntry = { command: "test.command.run", status: "success", timestamp: new Date().toISOString() };
    daemon.writeLog(testEntry);
    const logsDir = path.join(SUPERCLI_DIR, "logs");
    expect(fs.existsSync(logsDir)).toBe(true);
    // writeLog writes to today's file (jobs-YYYY-MM-DD.jsonl)
    const today = new Date().toISOString().split("T")[0];
    const todayFile = path.join(logsDir, `jobs-${today}.jsonl`);
    expect(fs.existsSync(todayFile)).toBe(true);
    const content = fs.readFileSync(todayFile, "utf8");
    const lines = content.trim().split("\n");
    // Find our test entry — writeLog adds synced:false
    const found = lines.some(line => {
      try {
        const parsed = JSON.parse(line);
        return parsed.command === "test.command.run" && parsed.synced === false;
      } catch { return false; }
    });
    expect(found).toBe(true);
  });

  test("getDaemonStatus returns stopped on unreachable port (exit 3)", async () => {
    const status = await daemon.getDaemonStatus(DEAD);
    expect(status.ok).toBe(true);
    expect(status.daemon).toBe("stopped");
    expect(status.code).toBe(3);
  });

  test("stopDaemon is a noop on unreachable port", async () => {
    const result = await daemon.stopDaemon(DEAD);
    expect(result.ok).toBe(true);
    expect(result.daemon).toBe("already_stopped");
  });
});
