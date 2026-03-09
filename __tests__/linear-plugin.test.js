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

function writeFakeLinearBinary(dir) {
  const bin = path.join(dir, "linear")
  fs.writeFileSync(bin, [
    "#!/usr/bin/env node",
    "const args = process.argv.slice(2);",
    "if (args.includes('--version')) { console.log('linear 0.1.0-test'); process.exit(0); }",
    "if (args[0] === 'auth' && args[1] === 'whoami') { console.log('mock-linear-user'); process.exit(0); }",
    "console.log(JSON.stringify({ ok: true, args }));"
  ].join("\n"), "utf-8")
  fs.chmodSync(bin, 0o755)
  return bin
}

describe("linear plugin", () => {
  const fakeDir = fs.mkdtempSync(path.join(os.tmpdir(), "dcli-linear-"))
  writeFakeLinearBinary(fakeDir)
  const env = { ...process.env, PATH: `${fakeDir}:${process.env.PATH || ""}` }

  beforeAll(() => {
    runNoServer("plugins install ./plugins/linear --on-conflict replace --json", { env })
  })

  afterAll(() => {
    runNoServer("plugins remove linear --json", { env })
    fs.rmSync(fakeDir, { recursive: true, force: true })
  })

  test("routes account whoami wrapped command", () => {
    const r = runNoServer("linear account whoami", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.command).toBe("linear.account.whoami")
    expect(data.data.raw).toBe("mock-linear-user")
  })

  test("supports namespace passthrough", () => {
    const r = runNoServer("linear issue list", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.command).toBe("linear.passthrough")
    expect(data.data.args[0]).toBe("issue")
    expect(data.data.args[1]).toBe("list")
  })

  test("doctor reports linear dependency as healthy", () => {
    const r = runNoServer("plugins doctor linear --json", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.ok).toBe(true)
    expect(data.checks.some(c => c.type === "binary" && c.binary === "linear" && c.ok === true)).toBe(true)
  })
})
