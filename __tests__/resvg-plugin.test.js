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

function writeFakeResvgBinary(dir) {
  const bin = path.join(dir, "resvg")
  fs.writeFileSync(bin, [
    "#!/usr/bin/env node",
    "const args = process.argv.slice(2);",
    "if (args[0] === 'version') { console.log('resvg 0.44.0-test'); process.exit(0); }",
    "console.log(JSON.stringify({ ok: true, args }));"
  ].join("\n"), "utf-8")
  fs.chmodSync(bin, 0o755)
  return bin
}

describe("resvg plugin", () => {
  const fakeDir = fs.mkdtempSync(path.join(os.tmpdir(), "dcli-resvg-"))
  const tempHome = fs.mkdtempSync(path.join(os.tmpdir(), "dcli-home-resvg-"))
  writeFakeResvgBinary(fakeDir)
  const env = { ...process.env, PATH: `${fakeDir}:${process.env.PATH || ""}`, SUPERCLI_HOME: tempHome }

  beforeAll(() => {
    runNoServer("plugins install ./plugins/resvg --on-conflict replace --json", { env })
  })

  afterAll(() => {
    runNoServer("plugins remove resvg --json", { env })
    fs.rmSync(fakeDir, { recursive: true, force: true })
    fs.rmSync(tempHome, { recursive: true, force: true })
  })

  test("routes namespace passthrough to the resvg binary", () => {
    const r = runNoServer("resvg version --json", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.command).toBe("resvg.passthrough")
    expect(data.data.raw).toBe("resvg 0.44.0-test")
  })

  test("forwards conversion arguments through passthrough", () => {
    const r = runNoServer("resvg input.svg output.png --width 512", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.command).toBe("resvg.passthrough")
    expect(data.data.args).toContain("input.svg")
    expect(data.data.args).toContain("output.png")
    expect(data.data.args).toContain("--width")
  })

  test("doctor reports resvg dependency as healthy", () => {
    const r = runNoServer("plugins doctor resvg --json", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.ok).toBe(true)
    expect(data.checks.some(c => c.type === "binary" && c.binary === "resvg" && c.ok === true)).toBe(true)
  })
})
