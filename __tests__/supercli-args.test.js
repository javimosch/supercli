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

  test("bare -- acts as end-of-options marker (POSIX convention)", () => {
    const out = execSync(`node ${CLI} plan testns testres testact -- --foo bar --json`, {
      env,
      encoding: "utf-8"
    })
    const plan = JSON.parse(out)
    // bare -- marks end of options; everything after it is positional, not flags
    expect(plan.args.foo).toBeUndefined()
    expect(plan.args.json).toBeUndefined()
    expect(Object.keys(plan.args)).not.toContain("")
  })

  test("--flag at end of args defaults to true", () => {
    const out = execSync(`node ${CLI} plan testns testres testact --flag --json`, {
      env,
      encoding: "utf-8"
    })
    const plan = JSON.parse(out)
    expect(plan.args.flag).toBe(true)
  })

  test("--flag --other does not consume --other as value", () => {
    const out = execSync(`node ${CLI} plan testns testres testact --flag --other value --json`, {
      env,
      encoding: "utf-8"
    })
    const plan = JSON.parse(out)
    expect(plan.args.flag).toBe(true)
    expect(plan.args.other).toBe("value")
  })

  test("--flag= with empty string value", () => {
    const out = execSync(`node ${CLI} plan testns testres testact --empty= --json`, {
      env,
      encoding: "utf-8"
    })
    const plan = JSON.parse(out)
    expect(plan.args.empty).toBe("")
  })

  test("--=value does not create empty flag key", () => {
    const out = execSync(`node ${CLI} plan testns testres testact --=value --foo bar --json`, {
      env,
      encoding: "utf-8"
    })
    const plan = JSON.parse(out)
    expect(Object.keys(plan.args)).not.toContain("")
    expect(plan.args.foo).toBe("bar")
  })

  test("--=\"\" does not create empty flag key", () => {
    const out = execSync(`node ${CLI} plan testns testres testact --="" --foo bar --json`, {
      env,
      encoding: "utf-8"
    })
    const plan = JSON.parse(out)
    expect(Object.keys(plan.args)).not.toContain("")
    expect(plan.args.foo).toBe("bar")
  })

  test("error for unknown namespace goes to stderr", () => {
    const cmd = `node ${CLI} nonexistent --json`
    expect(() => execSync(cmd, { env, encoding: "utf-8" })).toThrow()
  })

  test("inspect with missing args errors on stderr not stdout", () => {
    try {
      execSync(`node ${CLI} inspect --json`, { env, stdio: ["pipe", "pipe", "pipe"] })
    } catch (e) {
      expect(e.stderr.toString()).toContain("Usage: supercli inspect")
      expect(e.stdout.toString()).toBe("")
    }
  })

  test("unknown namespace exits with non-zero code", () => {
    try {
      execSync(`node ${CLI} nonexistent --json`, { env, stdio: ["pipe", "pipe", "pipe"] })
    } catch (e) {
      expect(e.status).toBeGreaterThan(0)
      expect(e.stderr.toString()).toContain("not found")
    }
  })
})
