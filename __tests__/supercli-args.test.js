const fs = require("fs")
const os = require("os")
const path = require("path")
const { execSync } = require("child_process")

const CLI = path.join(__dirname, "..", "cli", "supercli.js")

describe("supercli args parser", () => {
  let tempDir
  let env

  beforeAll(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "supercli-test-args-"))
    const supercliDir = path.join(tempDir, ".supercli")
    fs.mkdirSync(supercliDir)

    // Write a dummy config.json with a test command
    const dummyConfig = {
      version: "1",
      commands: [
        {
          namespace: "testns",
          resource: "testres",
          action: "testact",
          adapter: "http",
          adapterConfig: { url: "http://example.com" }
        }
      ]
    }
    fs.writeFileSync(path.join(supercliDir, "config.json"), JSON.stringify(dummyConfig))

    env = {
      ...process.env,
      HOME: tempDir
    }
    delete env.SUPERCLI_SERVER
  })

  afterAll(() => {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true })
    } catch {}
  })

  test("parses standard flags", () => {
    const out = execSync(`node ${CLI} plan testns testres testact --foo bar --baz --json`, {
      env,
      encoding: "utf-8"
    })
    const plan = JSON.parse(out)
    expect(plan.args.foo).toBe("bar")
    expect(plan.args.baz).toBe(true)
  })

  test("parses --flag=value flags", () => {
    const out = execSync(`node ${CLI} plan testns testres testact --foo=bar --baz= --json`, {
      env,
      encoding: "utf-8"
    })
    const plan = JSON.parse(out)
    expect(plan.args.foo).toBe("bar")
    expect(plan.args.baz).toBe("")
  })
})
