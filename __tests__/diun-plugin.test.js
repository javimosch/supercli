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

function writeFakeDiunBinary(dir) {
  const bin = path.join(dir, "diun")
  fs.writeFileSync(bin, [
    "#!/usr/bin/env node",
    "const args = process.argv.slice(2);",
    "if (args[0] === 'version') { console.log('diun version 4.28.0-test'); process.exit(0); }",
    "if (args[0] === 'check-config') { console.log('configuration is valid'); process.exit(0); }",
    "console.log(JSON.stringify({ ok: true, args }));"
  ].join("\n"), "utf-8")
  fs.chmodSync(bin, 0o755)
  return bin
}

describe("diun plugin", () => {
  const fakeDir = fs.mkdtempSync(path.join(os.tmpdir(), "dcli-diun-"))
  const tempHome = fs.mkdtempSync(path.join(os.tmpdir(), "dcli-home-diun-"))
  writeFakeDiunBinary(fakeDir)
  const env = { ...process.env, PATH: `${fakeDir}:${process.env.PATH || ""}`, SUPERCLI_HOME: tempHome }

  beforeAll(() => {
    runNoServer("plugins install ./plugins/diun --on-conflict replace --json", { env })
  })

  afterAll(() => {
    runNoServer("plugins remove diun --json", { env })
    fs.rmSync(fakeDir, { recursive: true, force: true })
    fs.rmSync(tempHome, { recursive: true, force: true })
  })

  test("routes version command as raw text", () => {
    const r = runNoServer("diun self version --json", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.command).toBe("diun.self.version")
    expect(data.data.raw).toBe("diun version 4.28.0-test")
  })

  test("routes check-config command as raw text", () => {
    const r = runNoServer("diun self check-config --json", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.command).toBe("diun.self.check-config")
    expect(data.data.raw).toBe("configuration is valid")
  })

  test("doctor reports diun binary dependency as healthy", () => {
    const r = runNoServer("plugins doctor diun --json", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.ok).toBe(true)
    expect(data.checks.some(c => c.type === "binary" && c.binary === "diun" && c.ok === true)).toBe(true)
  })
})
