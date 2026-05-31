const fs = require("fs")
const os = require("os")
const path = require("path")
const { execSync } = require("child_process")

const DAEMON = path.join(__dirname, "..", "cli", "daemon.js")

describe("daemon CLI error output", () => {
  let tempDir

  beforeAll(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "supercli-daemon-test-"))
  })

  afterAll(() => {
    try { fs.rmSync(tempDir, { recursive: true, force: true }) } catch {}
  })

  test("invalid subcommand writes usage to stderr, not stdout", () => {
    try {
      execSync(`node ${DAEMON} invalidcommand`, {
        env: { ...process.env, HOME: tempDir },
        encoding: "utf-8",
        stdio: ["pipe", "pipe", "pipe"],
      })
    } catch (e) {
      expect(e.stderr.toString()).toContain("Usage: node daemon.js")
      expect(e.stdout.toString()).toBe("")
      expect(e.status).toBe(85)
    }
  })
})
