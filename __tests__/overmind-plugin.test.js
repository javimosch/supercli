const fs = require("fs")
const os = require("os")
const path = require("path")
const { execSync } = require("child_process")

const CLI = path.join(__dirname, "..", "cli", "supercli.js")

function runNoServer(args, options = {}) {
  try {
    const env = { ...process.env }
    delete env.SUPERCLI_SERVER
    const out = execSync(`node ${CLI} ${args}`, {
      encoding: "utf-8",
      timeout: 15000,
      env: { ...env, ...(options.env || {}) }
    })
    return { ok: true, output: out.trim(), code: 0 }
  } catch (err) {
    return {
      ok: false,
      output: (err.stdout || "").trim(),
      stderr: (err.stderr || "").trim(),
      code: err.status
    }
  }
}

function writeFakeOvermindBinary(dir) {
  const bin = path.join(dir, "overmind")
  fs.writeFileSync(bin, [
    "#!/usr/bin/env node",
    "const args = process.argv.slice(2);",
    "if (args[0] === 'version') { console.log('overmind 2.5.1-test'); process.exit(0); }",
    "console.log(JSON.stringify({ ok: true, args }));"
  ].join("\n"), "utf-8")
  fs.chmodSync(bin, 0o755)
  return bin
}

describe("overmind plugin", () => {
  const fakeDir = fs.mkdtempSync(path.join(os.tmpdir(), "dcli-overmind-"))
  const tempHome = fs.mkdtempSync(path.join(os.tmpdir(), "dcli-home-overmind-"))
  writeFakeOvermindBinary(fakeDir)
  const env = { ...process.env, PATH: `${fakeDir}:${process.env.PATH || ""}`, SUPERCLI_HOME: tempHome }

  beforeAll(() => {
    runNoServer("plugins install ./plugins/overmind --on-conflict replace --json", { env })
  })

  afterAll(() => {
    runNoServer("plugins remove overmind --json", { env })
    fs.rmSync(fakeDir, { recursive: true, force: true })
    fs.rmSync(tempHome, { recursive: true, force: true })
  })

  test("routes namespace passthrough to the overmind binary", () => {
    const r = runNoServer("overmind version --json", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.command).toBe("overmind.passthrough")
    expect(data.data.raw).toBe("overmind 2.5.1-test")
  })

  test("forwards subcommands and flags through passthrough", () => {
    const r = runNoServer("overmind start -f ./Procfile.dev", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.command).toBe("overmind.passthrough")
    expect(data.data.args).toContain("start")
    expect(data.data.args).toContain("-f")
    expect(data.data.args).toContain("./Procfile.dev")
  })

  test("doctor reports overmind dependency as healthy", () => {
    const r = runNoServer("plugins doctor overmind --json", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.ok).toBe(true)
    expect(data.checks.some(c => c.type === "binary" && c.binary === "overmind" && c.ok === true)).toBe(true)
  })
})
