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

function writeFakeAzdBinary(dir) {
  const bin = path.join(dir, "azd")
  fs.writeFileSync(bin, [
    "#!/usr/bin/env node",
    "const args = process.argv.slice(2);",
    "if (args[0] === 'version') { console.log('azd version 1.17.0-test'); process.exit(0); }",
    "if (args[0] === 'auth' && args[1] === 'login' && args.includes('--check-status')) {",
    "  console.log('Logged in as test-user');",
    "  process.exit(0);",
    "}",
    "if (args[0] === 'deploy' && args[1] === '--all') {",
    "  const envArg = args.find(a => a.startsWith('--environment='));",
    "  const environment = envArg ? envArg.split('=')[1] : null;",
    "  console.log(JSON.stringify({ mode: 'deploy-all', environment, args }));",
    "  process.exit(0);",
    "}",
    "if (args[0] === 'env' && args[1] === 'list') {",
    "  console.log(JSON.stringify({ environments: ['dev', 'prod'] }));",
    "  process.exit(0);",
    "}",
    "console.log(JSON.stringify({ ok: true, args }));"
  ].join("\n"), "utf-8")
  fs.chmodSync(bin, 0o755)
  return bin
}

describe("azd plugin", () => {
  const fakeDir = fs.mkdtempSync(path.join(os.tmpdir(), "dcli-azd-"))
  const tempHome = fs.mkdtempSync(path.join(os.tmpdir(), "dcli-home-azd-"))
  writeFakeAzdBinary(fakeDir)
  const env = { ...process.env, PATH: `${fakeDir}:${process.env.PATH || ""}`, SUPERCLI_HOME: tempHome }

  beforeAll(() => {
    const install = runNoServer("plugins install ./plugins/azd --on-conflict replace --json", { env })
    expect(install.ok).toBe(true)
  })

  afterAll(() => {
    runNoServer("plugins remove azd --json", { env })
    fs.rmSync(fakeDir, { recursive: true, force: true })
    fs.rmSync(tempHome, { recursive: true, force: true })
  })

  test("exposes learn content and healthy dependency checks", () => {
    const learn = runNoServer("plugins learn azd --json", { env })
    expect(learn.ok).toBe(true)
    const learnPayload = JSON.parse(learn.output)
    expect(learnPayload.plugin).toBe("azd")
    expect(learnPayload.learn_markdown).toContain("azd Quickstart")

    const explore = runNoServer("plugins explore --name azd --json", { env })
    expect(explore.ok).toBe(true)
    const plugin = JSON.parse(explore.output).plugins.find(p => p.name === "azd")
    expect(plugin).toBeDefined()
    expect(plugin.has_learn).toBe(true)

    const doctor = runNoServer("plugins doctor azd --json", { env })
    expect(doctor.ok).toBe(true)
    expect(JSON.parse(doctor.output).checks.some(c => c.type === "binary" && c.binary === "azd" && c.ok === true)).toBe(true)
  })
})
