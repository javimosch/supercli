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

// tlrc ships the official tldr client, so the binary on PATH is named `tldr`.
function writeFakeTldrBinary(dir) {
  const bin = path.join(dir, "tldr")
  fs.writeFileSync(bin, [
    "#!/usr/bin/env node",
    "const args = process.argv.slice(2);",
    "if (args[0] === '--version') { console.log('tlrc 1.11.0-test'); process.exit(0); }",
    "if (args[0] === '--list') { console.log('tar\\nzip\\ngit'); process.exit(0); }",
    "console.log('Page for ' + args.join(' '));"
  ].join("\n"), "utf-8")
  fs.chmodSync(bin, 0o755)
  return bin
}

describe("tlrc plugin", () => {
  const fakeDir = fs.mkdtempSync(path.join(os.tmpdir(), "dcli-tlrc-"))
  const tempHome = fs.mkdtempSync(path.join(os.tmpdir(), "dcli-home-tlrc-"))
  writeFakeTldrBinary(fakeDir)
  const env = { ...process.env, PATH: `${fakeDir}:${process.env.PATH || ""}`, SUPERCLI_HOME: tempHome }

  beforeAll(() => {
    runNoServer("plugins install ./plugins/tlrc --on-conflict replace --json", { env })
  })

  afterAll(() => {
    runNoServer("plugins remove tlrc --json", { env })
    fs.rmSync(fakeDir, { recursive: true, force: true })
    fs.rmSync(tempHome, { recursive: true, force: true })
  })

  test("routes self version wrapped command", () => {
    const r = runNoServer("tldr self version --json", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.command).toBe("tldr.self.version")
    expect(data.data.raw).toBe("tlrc 1.11.0-test")
  })

  test("routes cache list wrapped command", () => {
    const r = runNoServer("tldr cache list --json", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.command).toBe("tldr.cache.list")
    expect(data.data.raw).toContain("git")
  })

  test("doctor reports tldr dependency as healthy", () => {
    const r = runNoServer("plugins doctor tlrc --json", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.ok).toBe(true)
    expect(data.checks.some(c => c.type === "binary" && c.binary === "tldr" && c.ok === true)).toBe(true)
  })
})
