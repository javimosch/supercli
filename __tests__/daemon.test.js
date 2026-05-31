const fs = require("fs")
const os = require("os")
const path = require("path")
const { execSync, spawn } = require("child_process")

const DAEMON = path.join(__dirname, "..", "cli", "daemon.js")

describe("daemon CLI error output", () => {
  let tempDir

  beforeAll(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "supercli-daemon-test-"))
  })

  afterAll(() => {
    try { fs.rmSync(tempDir, { recursive: true, force: true }) } catch {}
  })

  test("daemon startup message goes to stderr, not stdout", () => {
    const child = spawn("node", [DAEMON, "--daemon"], {
      env: { ...process.env, HOME: tempDir },
      stdio: ["ignore", "pipe", "pipe"],
    })

    const stderrChunks = []
    const stdoutChunks = []

    child.stderr.on("data", (chunk) => stderrChunks.push(chunk))
    child.stdout.on("data", (chunk) => stdoutChunks.push(chunk))

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        child.kill()
        const stderr = Buffer.concat(stderrChunks).toString()
        const stdout = Buffer.concat(stdoutChunks).toString()
        try {
          expect(stderr).toContain("Daemon started")
          expect(stdout).toBe("")
          resolve()
        } catch (e) {
          reject(e)
        }
      }, 3000)

      child.on("error", (err) => {
        clearTimeout(timer)
        reject(err)
      })
    })
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
