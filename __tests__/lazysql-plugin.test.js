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

function writeFakeLazysqlBinary(dir) {
  const bin = path.join(dir, "lazysql")
  fs.writeFileSync(bin, [
    "#!/usr/bin/env node",
    "const args = process.argv.slice(2);",
    "if (args[0] === '--version') { console.log('lazysql v0.3.0-test'); process.exit(0); }",
    "console.log(JSON.stringify({ ok: true, args }));"
  ].join("\n"), "utf-8")
  fs.chmodSync(bin, 0o755)
  return bin
}

describe("lazysql plugin", () => {
  const fakeDir = fs.mkdtempSync(path.join(os.tmpdir(), "dcli-lazysql-"))
  const tempHome = fs.mkdtempSync(path.join(os.tmpdir(), "dcli-home-lazysql-"))
  writeFakeLazysqlBinary(fakeDir)
  const env = { ...process.env, PATH: `${fakeDir}:${process.env.PATH || ""}`, SUPERCLI_HOME: tempHome }

  beforeAll(() => {
    runNoServer("plugins install ./plugins/lazysql --on-conflict replace --json", { env })
  })

  afterAll(() => {
    runNoServer("plugins remove lazysql --json", { env })
    fs.rmSync(fakeDir, { recursive: true, force: true })
    fs.rmSync(tempHome, { recursive: true, force: true })
  })

  test("routes the self version command", () => {
    const r = runNoServer("lazysql self version --json", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.command).toBe("lazysql.self.version")
    expect(data.data.raw).toBe("lazysql v0.3.0-test")
  })

  test("routes connection open with a positional url", () => {
    const r = runNoServer("lazysql connection open postgres://x --json", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.command).toBe("lazysql.connection.open")
    const inner = JSON.parse(data.data.raw)
    expect(inner.args).toContain("postgres://x")
  })

  test("supports namespace passthrough for unknown subcommands", () => {
    const r = runNoServer("lazysql somecmd --json", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.command).toBe("lazysql.passthrough")
    const inner = JSON.parse(data.data.raw)
    expect(inner.args).toContain("somecmd")
  })

  test("doctor reports lazysql dependency as healthy", () => {
    const r = runNoServer("plugins doctor lazysql --json", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.ok).toBe(true)
    expect(data.checks.some(c => c.type === "binary" && c.binary === "lazysql" && c.ok === true)).toBe(true)
  })
})
