const fs = require("fs")
const os = require("os")
const path = require("path")
const { execSync } = require("child_process")

const CLI = path.join(__dirname, "..", "cli", "supercli.js")
const nodeDir = path.dirname(process.execPath)

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

function writeFakeCurlBinary(dir) {
  const bin = path.join(dir, "curl")
  fs.writeFileSync(bin, [
    "#!/usr/bin/env node",
    "const args = process.argv.slice(2);",
    "const url = args[args.length - 1] || '';",
    "if (args.includes('--version')) { console.log('curl 8.0.0-test'); process.exit(0); }",
    "if (url.endsWith('/README.md')) { console.log('# Resend CLI\\n\\nTest readme.'); process.exit(0); }",
    "process.exit(22);"
  ].join("\n"), "utf-8")
  fs.chmodSync(bin, 0o755)
  return bin
}

describe("resend hybrid plugin", () => {
  const fakeBinDir = fs.mkdtempSync(path.join(os.tmpdir(), "dcli-resend-bin-"))
  const tempHome = fs.mkdtempSync(path.join(os.tmpdir(), "dcli-home-resend-"))
  const fakeUserHome = fs.mkdtempSync(path.join(os.tmpdir(), "dcli-user-home-resend-"))
  writeFakeCurlBinary(fakeBinDir)
  
  const env = {
    ...process.env,
    PATH: `${fakeBinDir}:${process.env.PATH || ""}`,
    SUPERCLI_HOME: tempHome,
    HOME: fakeUserHome
  }
  let removed = false

  beforeAll(() => {
    // Install the plugin
    const install = runNoServer("plugins install ./plugins/resend --on-conflict replace --json", { env })
    if (!install.ok) {
        console.error("Install failed:", install.output, install.stderr)
    }
    expect(install.ok).toBe(true)
  })

  afterAll(() => {
    if (!removed) runNoServer("plugins remove resend --json", { env })
    fs.rmSync(fakeBinDir, { recursive: true, force: true })
    fs.rmSync(tempHome, { recursive: true, force: true })
    fs.rmSync(fakeUserHome, { recursive: true, force: true })
  })

  test("indexes resend skills provider", () => {
    const list = runNoServer("skills list --catalog --provider resend --json", { env })
    expect(list.ok).toBe(true)
    const listData = JSON.parse(list.output)
    expect(listData.skills.some(skill => skill.id === "resend:root.readme")).toBe(true)
  })

  test("fetches indexed remote skill markdown", () => {
    const skill = runNoServer("skills get resend:root.readme", { env })
    expect(skill.ok).toBe(true)
    expect(skill.output).toContain("Resend CLI")
  })

  test("fails with helpful message when resend binary is missing", () => {
    // Ensure 'resend' is not found, but keep 'node' available
    const r = runNoServer("resend cli doctor --json", { 
        env: { ...env, PATH: `${fakeBinDir}:${nodeDir}` } 
    })
    expect(r.ok).toBe(false)
    const data = JSON.parse(r.output || r.stderr)
    expect(data.error.message).toContain("Missing dependency 'resend'")
    expect(data.error.message).toContain("Please run 'dcli resend cli setup'")
  })

  test("exposes expanded structured commands", () => {
    const help = runNoServer("help resend --json", { env })
    expect(help.ok).toBe(true)
    const data = JSON.parse(help.output)
    
    const resendNamespace = data.namespaces.find(n => n.name === "resend")
    expect(resendNamespace).toBeDefined()

    const resources = new Set(resendNamespace.resources.map(r => r.name))
    
    expect(resources.has("domains")).toBe(true)
    expect(resources.has("api-keys")).toBe(true)
    expect(resources.has("webhooks")).toBe(true)
    expect(resources.has("contacts")).toBe(true)
    expect(resources.has("auth")).toBe(true)
  })

  test("doctor reports node and npm dependencies as healthy", () => {
    const r = runNoServer("plugins doctor resend --json", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.ok).toBe(true)
    expect(data.checks.some(c => c.binary === "node" && c.ok === true)).toBe(true)
    expect(data.checks.some(c => c.binary === "npm" && c.ok === true)).toBe(true)
  })
})
