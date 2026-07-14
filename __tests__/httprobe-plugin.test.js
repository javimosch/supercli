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

function writeFakeHttprobeBinary(dir) {
  const bin = path.join(dir, "httprobe")
  fs.writeFileSync(bin, [
    "#!/usr/bin/env node",
    "console.log('https://example.com');"
  ].join("\n"), "utf-8")
  fs.chmodSync(bin, 0o755)
  return bin
}

describe("httprobe plugin", () => {
  const fakeDir = fs.mkdtempSync(path.join(os.tmpdir(), "dcli-httprobe-"))
  const tempHome = fs.mkdtempSync(path.join(os.tmpdir(), "dcli-home-httprobe-"))
  writeFakeHttprobeBinary(fakeDir)
  const env = { ...process.env, PATH: `${fakeDir}:${process.env.PATH || ""}`, SUPERCLI_HOME: tempHome }

  beforeAll(() => {
    runNoServer("plugins install ./plugins/httprobe --on-conflict replace --json", { env })
  })

  afterAll(() => {
    runNoServer("plugins remove httprobe --json", { env })
    fs.rmSync(fakeDir, { recursive: true, force: true })
    fs.rmSync(tempHome, { recursive: true, force: true })
  })

  test("routes the domain probe command", () => {
    const r = runNoServer("httprobe domain probe --json", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.command).toBe("httprobe.domain.probe")
    expect(data.data.raw).toBe("https://example.com")
  })

  test("doctor reports httprobe dependency as healthy", () => {
    const r = runNoServer("plugins doctor httprobe --json", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.ok).toBe(true)
    expect(data.checks.some(c => c.type === "binary" && c.binary === "httprobe" && c.ok === true)).toBe(true)
  })
})
