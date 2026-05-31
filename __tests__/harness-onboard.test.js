const fs = require("fs")
const os = require("os")
const path = require("path")
const { spawnSync } = require("child_process")

const CLI = path.join(__dirname, "..", "cli", "supercli.js")

describe("supercli onboard error output", () => {
  let tempDir
  let env

  beforeAll(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "supercli-test-onboard-"))
    const supercliDir = path.join(tempDir, ".supercli")
    fs.mkdirSync(supercliDir)
    fs.writeFileSync(path.join(supercliDir, "config.json"), JSON.stringify({ version: "1", commands: [] }))
    env = {
      ...process.env,
      HOME: tempDir,
    }
    delete env.SUPERCLI_SERVER
  })

  afterAll(() => {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true })
    } catch {}
  })

  test("onboard errors go to stderr not stdout", () => {
    // Use a file path as target dir to trigger mkdir failure
    const targetPath = path.join(tempDir, "target-is-a-file")
    fs.writeFileSync(targetPath, "", "utf-8")

    const result = spawnSync("node", [CLI, "onboard", "--harness", "claude", "--target", targetPath, "--human"], {
      env,
      encoding: "utf-8",
    })

    expect(result.stderr).toContain("Error")
    expect(result.stdout).not.toContain("Error")

    fs.unlinkSync(targetPath)
  })
})
