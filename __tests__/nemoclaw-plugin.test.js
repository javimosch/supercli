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
    "if (url.includes('/NVIDIA/NemoClaw/git/trees/main?recursive=1')) {",
    "  console.log(JSON.stringify({ tree: [",
    "    { type: 'blob', path: 'README.md' },",
    "    { type: 'blob', path: 'docs/index.md' },",
    "    { type: 'blob', path: 'docs/get-started/quickstart.md' },",
    "    { type: 'blob', path: 'docs/about/overview.md' },",
    "    { type: 'blob', path: 'docs/about/how-it-works.md' },",
    "    { type: 'blob', path: 'docs/reference/commands.md' },",
    "    { type: 'blob', path: 'docs/reference/architecture.md' },",
    "    { type: 'blob', path: 'docs/reference/inference-profiles.md' },",
    "    { type: 'blob', path: 'docs/reference/network-policies.md' },",
    "    { type: 'blob', path: 'docs/monitoring/monitor-sandbox-activity.md' },",
    "    { type: 'blob', path: 'docs/network-policy/customize-network-policy.md' },",
    "    { type: 'blob', path: 'docs/deployment/deploy-to-remote-gpu.md' }",
    "  ] }));",
    "  process.exit(0);",
    "}",
    "if (url.includes('raw.githubusercontent.com/NVIDIA/NemoClaw/main/')) {",
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

function writeFakeNemoClawBinary(dir) {
  const bin = path.join(dir, "nemoclaw")
  fs.writeFileSync(bin, [
    "#!/usr/bin/env node",
    "const args = process.argv.slice(2);",
    "if (args[0] === '--version') { console.log('nemoclaw 0.1.0-test'); process.exit(0); }",
    "if (args[0] === 'help') { console.log('nemoclaw help test'); process.exit(0); }",
    "if (args[0] === 'status') { console.log('services:ok'); process.exit(0); }",
    "if (args[0] === 'list') { console.log('sandboxes: my-assistant'); process.exit(0); }",
    "if (args[0] === 'onboard') {",
    "  console.log(JSON.stringify({",
    "    mode: process.env.NEMOCLAW_NON_INTERACTIVE || '0',",
    "    provider: process.env.NEMOCLAW_PROVIDER || '',",
    "    sandbox: process.env.NEMOCLAW_SANDBOX_NAME || '',",
    "    policyMode: process.env.NEMOCLAW_POLICY_MODE || '',",
    "    policyPresets: process.env.NEMOCLAW_POLICY_PRESETS || '',",
    "    recreate: process.env.NEMOCLAW_RECREATE_SANDBOX || '0',",
    "    apiKey: process.env.NVIDIA_API_KEY ? 'set' : 'unset'",
    "  }));",
    "  process.exit(0);",
    "}",
    "if (args[0] === 'start') { console.log('services started'); process.exit(0); }",
    "if (args[0] === 'stop') { console.log('services stopped'); process.exit(0); }",
    "if (args[0] === 'deploy' && args[1]) { console.log(`deployed:${args[1]}`); process.exit(0); }",
    "if (args.length >= 2 && args[1] === 'status') { console.log(`sandbox-status:${args[0]}`); process.exit(0); }",
    "if (args.length >= 2 && args[1] === 'logs') {",
    "  const follow = args.includes('--follow') ? ':follow' : '';",
    "  console.log(`sandbox-logs:${args[0]}${follow}`);",
    "  process.exit(0);",
    "}",
    "if (args.length >= 2 && args[1] === 'connect') { console.log(`sandbox-connect:${args[0]}`); process.exit(0); }",
    "console.log(JSON.stringify({ ok: true, args }));"
  ].join("\n"), "utf-8")
  fs.chmodSync(bin, 0o755)
  return bin
}

function writeFakeOpenShellBinary(dir) {
  const bin = path.join(dir, "openshell")
  fs.writeFileSync(bin, [
    "#!/usr/bin/env node",
    "const args = process.argv.slice(2);",
    "if (args[0] === '--version') { console.log('openshell 0.2.0-test'); process.exit(0); }",
    "console.log(JSON.stringify({ ok: true, args }));"
  ].join("\n"), "utf-8")
  fs.chmodSync(bin, 0o755)
  return bin
}

describe("nemoclaw hybrid plugin", () => {
  const fakeDir = fs.mkdtempSync(path.join(os.tmpdir(), "dcli-nemoclaw-"))
  const tempHome = fs.mkdtempSync(path.join(os.tmpdir(), "dcli-home-nemoclaw-"))
  writeFakeCurlBinary(fakeDir)
  writeFakeNemoClawBinary(fakeDir)
  writeFakeOpenShellBinary(fakeDir)
  const env = { ...process.env, PATH: `${fakeDir}:${process.env.PATH || ""}`, SUPERCLI_HOME: tempHome }
  let removed = false

  beforeAll(() => {
    const install = runNoServer("plugins install ./plugins/nemoclaw --on-conflict replace --json", { env })
    expect(install.ok).toBe(true)
  })

  afterAll(() => {
    if (!removed) runNoServer("plugins remove nemoclaw --json", { env })
    fs.rmSync(fakeDir, { recursive: true, force: true })
    fs.rmSync(tempHome, { recursive: true, force: true })
  })

  test("indexes nemoclaw skills provider", () => {
    const provider = runNoServer("skills providers show --name nemoclaw --json", { env })
    expect(provider.ok).toBe(true)
    const providerData = JSON.parse(provider.output)
    expect(providerData.provider.name).toBe("nemoclaw")

    const list = runNoServer("skills list --catalog --provider nemoclaw --json", { env })
    expect(list.ok).toBe(true)
    const listData = JSON.parse(list.output)
    expect(listData.skills.some(skill => skill.id === "nemoclaw:docs.reference.commands")).toBe(true)
  })

  test("routes wrapped version command", () => {
    const r = runNoServer("nemoclaw self version --json", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.command).toBe("nemoclaw.self.version")
    expect(data.data.raw).toBe("nemoclaw 0.1.0-test")
  })

  test("routes sandbox action wrapper", () => {
    const r = runNoServer("nemoclaw sandbox status --name my-assistant --json", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.command).toBe("nemoclaw.sandbox.status")
    expect(data.data.raw).toBe("sandbox-status:my-assistant")
  })

  test("supports logs follow flag in sandbox wrapper", () => {
    const r = runNoServer("nemoclaw sandbox logs --name my-assistant --follow --json", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.command).toBe("nemoclaw.sandbox.logs")
    expect(data.data.raw).toBe("sandbox-logs:my-assistant:follow")
  })

  test("supports passthrough", () => {
    const r = runNoServer("nemoclaw help --json", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.command).toBe("nemoclaw.passthrough")
    expect(data.data.raw).toBe("nemoclaw help test")
  })

  test("supports non-interactive onboarding wrapper", () => {
    const r = runNoServer("nemoclaw host onboard-auto --non-interactive --provider cloud --sandbox-name ci-sandbox --policy-mode skip --policy-presets pypi,npm --recreate --api-key test-key --json", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.command).toBe("nemoclaw.host.onboard-auto")
    const payload = JSON.parse(data.data.raw)
    expect(payload.mode).toBe("1")
    expect(payload.provider).toBe("cloud")
    expect(payload.sandbox).toBe("ci-sandbox")
    expect(payload.policyMode).toBe("skip")
    expect(payload.policyPresets).toBe("pypi,npm")
    expect(payload.recreate).toBe("1")
    expect(payload.apiKey).toBe("set")
  })

  test("doctor reports dependencies as healthy", () => {
    const r = runNoServer("plugins doctor nemoclaw --json", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.ok).toBe(true)
    expect(data.checks.some(c => c.type === "binary" && c.binary === "curl" && c.ok === true)).toBe(true)
    expect(data.checks.some(c => c.type === "binary" && c.binary === "nemoclaw" && c.ok === true)).toBe(true)
    expect(data.checks.some(c => c.type === "binary" && c.binary === "openshell" && c.ok === true)).toBe(true)
  })

  test("removal cleans up the skills provider", () => {
    const remove = runNoServer("plugins remove nemoclaw --json", { env })
    expect(remove.ok).toBe(true)
    removed = true

    const provider = runNoServer("skills providers show --name nemoclaw --json", { env })
    expect(provider.ok).toBe(false)

    const list = runNoServer("skills list --catalog --provider nemoclaw --json", { env })
    expect(list.ok).toBe(true)
    const listData = JSON.parse(list.output)
    expect(listData.skills).toEqual([])
  })
})
