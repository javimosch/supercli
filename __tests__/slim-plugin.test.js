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

function writeFakeSlimBinary(dir) {
  const bin = path.join(dir, "slim")
  fs.writeFileSync(bin, [
    "#!/usr/bin/env node",
    "const args = process.argv.slice(2);",
    "if (args[0] === 'version') { console.log('slim version 1.40.0-test'); process.exit(0); }",
    "if (args[0] === 'xray') { console.log(JSON.stringify({ target: args[1], layers: [{ index: 0, size: 1024 }] })); process.exit(0); }",
    "if (args[0] === 'lint') { console.log(JSON.stringify({ target: args[1], findings: [{ rule: 'ID.SHELL', level: 'info' }] })); process.exit(0); }",
    "console.log(JSON.stringify({ ok: true, args }));"
  ].join("\n"), "utf-8")
  fs.chmodSync(bin, 0o755)
  return bin
}

describe("slim plugin", () => {
  const fakeDir = fs.mkdtempSync(path.join(os.tmpdir(), "dcli-slim-"))
  const tempHome = fs.mkdtempSync(path.join(os.tmpdir(), "dcli-home-slim-"))
  writeFakeSlimBinary(fakeDir)
  const env = { ...process.env, PATH: `${fakeDir}:${process.env.PATH || ""}`, SUPERCLI_HOME: tempHome }

  beforeAll(() => {
    runNoServer("plugins install ./plugins/slim --on-conflict replace --json", { env })
  })

  afterAll(() => {
    runNoServer("plugins remove slim --json", { env })
    fs.rmSync(fakeDir, { recursive: true, force: true })
    fs.rmSync(tempHome, { recursive: true, force: true })
  })

  test("routes version command as raw text", () => {
    const r = runNoServer("slim self version --json", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.command).toBe("slim.self.version")
    expect(data.data.raw).toBe("slim version 1.40.0-test")
  })

  test("routes xray with positional target", () => {
    const r = runNoServer("slim image xray nginx:latest --json", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.command).toBe("slim.image.xray")
    // xray declares parseJson:false, so the tool output is returned verbatim as raw
    expect(data.data.raw).toContain("nginx:latest")
    expect(JSON.parse(data.data.raw).layers[0].size).toBe(1024)
  })

  test("routes dockerfile lint with positional target", () => {
    const r = runNoServer("slim dockerfile lint ./Dockerfile --json", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.command).toBe("slim.dockerfile.lint")
    expect(data.data.raw).toContain("ID.SHELL")
  })

  test("doctor reports slim binary dependency as healthy", () => {
    const r = runNoServer("plugins doctor slim --json", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.ok).toBe(true)
    expect(data.checks.some(c => c.type === "binary" && c.binary === "slim" && c.ok === true)).toBe(true)
  })
})
