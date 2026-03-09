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

function writeFakeCurlBinary(dir) {
  const bin = path.join(dir, "curl")
  fs.writeFileSync(bin, [
    "#!/usr/bin/env node",
    "const args = process.argv.slice(2);",
    "const url = args[args.length - 1] || '';",
    "if (args.includes('--version')) { console.log('curl 8.0.0-test'); process.exit(0); }",
    "if (url.includes('/git/trees/main?recursive=1')) {",
    "  console.log(JSON.stringify({ tree: [",
    "    { type: 'blob', path: 'README.md' },",
    "    { type: 'blob', path: 'AGENTS.md' },",
    "    { type: 'blob', path: 'CLAUDE.md' },",
    "    { type: 'blob', path: 'CONTRIBUTING.md' },",
    "    { type: 'blob', path: 'docs/en/README.md' },",
    "    { type: 'blob', path: 'docs/en/installation.md' },",
    "    { type: 'blob', path: 'docs/en/configuration.md' },",
    "    { type: 'blob', path: 'docs/en/commands.md' },",
    "    { type: 'blob', path: 'docs/en/usage.md' },",
    "    { type: 'blob', path: 'docs/en/architecture.md' },",
    "    { type: 'blob', path: 'docs/en/security.md' },",
    "    { type: 'blob', path: 'docs/en/gateway-api.md' },",
    "    { type: 'blob', path: 'docs/en/development.md' }",
    "  ] }));",
    "  process.exit(0);",
    "}",
    "if (url.includes('raw.githubusercontent.com/nullclaw/nullclaw/main/')) {",
    "  const docPath = url.split('/main/')[1] || 'README.md';",
    "  console.log(`# ${docPath}\\n\\nTest markdown for ${docPath}.`);",
    "  process.exit(0);",
    "}",
    "console.error(`unsupported url: ${url}`);",
    "process.exit(22);"
  ].join("\n"), "utf-8")
  fs.chmodSync(bin, 0o755)
  return bin
}

function writeFakeNullclawBinary(dir) {
  const bin = path.join(dir, "nullclaw")
  fs.writeFileSync(bin, [
    "#!/usr/bin/env node",
    "const args = process.argv.slice(2);",
    "if (args[0] === '--version' || args[0] === 'version') { console.log('nullclaw v2026.3.8-test'); process.exit(0); }",
    "if (args[0] === 'status') { console.log('NullClaw status: healthy'); process.exit(0); }",
    "console.log(JSON.stringify({ ok: true, args }));"
  ].join("\n"), "utf-8")
  fs.chmodSync(bin, 0o755)
  return bin
}

describe("nullclaw hybrid plugin", () => {
  const fakeDir = fs.mkdtempSync(path.join(os.tmpdir(), "dcli-nullclaw-"))
  const tempHome = fs.mkdtempSync(path.join(os.tmpdir(), "dcli-home-nullclaw-"))
  writeFakeCurlBinary(fakeDir)
  writeFakeNullclawBinary(fakeDir)
  const env = { ...process.env, PATH: `${fakeDir}:${process.env.PATH || ""}`, SUPERCLI_HOME: tempHome }
  let removed = false

  beforeAll(() => {
    const install = runNoServer("plugins install ./plugins/nullclaw --on-conflict replace --json", { env })
    expect(install.ok).toBe(true)
  })

  afterAll(() => {
    if (!removed) runNoServer("plugins remove nullclaw --json", { env })
    fs.rmSync(fakeDir, { recursive: true, force: true })
    fs.rmSync(tempHome, { recursive: true, force: true })
  })

  test("indexes nullclaw skills provider", () => {
    const provider = runNoServer("skills providers show --name nullclaw --json", { env })
    expect(provider.ok).toBe(true)
    const providerData = JSON.parse(provider.output)
    expect(providerData.provider.name).toBe("nullclaw")

    const list = runNoServer("skills list --catalog --provider nullclaw --json", { env })
    expect(list.ok).toBe(true)
    const listData = JSON.parse(list.output)
    expect(listData.skills.some(skill => skill.id === "nullclaw:root.agents")).toBe(true)
  })

  test("routes wrapped version command", () => {
    const r = runNoServer("nullclaw cli version --json", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.command).toBe("nullclaw.cli.version")
    expect(data.data.raw).toBe("nullclaw v2026.3.8-test")
  })

  test("routes wrapped system status command", () => {
    const r = runNoServer("nullclaw system status --json", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.command).toBe("nullclaw.system.status")
    expect(data.data.raw).toBe("NullClaw status: healthy")
  })

  test("supports nullclaw namespace passthrough", () => {
    const r = runNoServer("nullclaw models list --json", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.command).toBe("nullclaw.passthrough")
    expect(data.data.args[0]).toBe("models")
    expect(data.data.args[1]).toBe("list")
    expect(data.data.args).toContain("--json")
  })

  test("doctor reports curl and nullclaw dependencies as healthy", () => {
    const r = runNoServer("plugins doctor nullclaw --json", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.ok).toBe(true)
    expect(data.checks.some(c => c.type === "binary" && c.binary === "curl" && c.ok === true)).toBe(true)
    expect(data.checks.some(c => c.type === "binary" && c.binary === "nullclaw" && c.ok === true)).toBe(true)
  })

  test("removal cleans up the skills provider", () => {
    const remove = runNoServer("plugins remove nullclaw --json", { env })
    expect(remove.ok).toBe(true)
    removed = true

    const provider = runNoServer("skills providers show --name nullclaw --json", { env })
    expect(provider.ok).toBe(false)

    const list = runNoServer("skills list --catalog --provider nullclaw --json", { env })
    expect(list.ok).toBe(true)
    const listData = JSON.parse(list.output)
    expect(listData.skills).toEqual([])
  })
})
