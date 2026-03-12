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
    "if (url.endsWith('/CLAUDE.md')) { console.log('---\\nskill_name: monty-sandbox\\n---\\n# Monty Sandbox'); process.exit(0); }",
    "if (url.endsWith('/README.md')) { console.log('# Monty\\n\\nTest readme.'); process.exit(0); }",
    "if (url.endsWith('/docs/usage-guide.md')) { console.log('# Monty Usage\\n\\nTest usage guide.'); process.exit(0); }",
    "process.exit(22);"
  ].join("\n"), "utf-8")
  fs.chmodSync(bin, 0o755)
  return bin
}

describe("monty hybrid plugin", () => {
  const fakeBinDir = fs.mkdtempSync(path.join(os.tmpdir(), "dcli-monty-bin-"))
  const tempHome = fs.mkdtempSync(path.join(os.tmpdir(), "dcli-home-monty-"))
  const fakeUserHome = fs.mkdtempSync(path.join(os.tmpdir(), "dcli-user-home-monty-"))
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
    const install = runNoServer("plugins install ./plugins/monty --on-conflict replace --json", { env })
    if (!install.ok) {
        console.error("Install failed:", install.output, install.stderr)
    }
    expect(install.ok).toBe(true)
  })

  afterAll(() => {
    if (!removed) runNoServer("plugins remove monty --json", { env })
    fs.rmSync(fakeBinDir, { recursive: true, force: true })
    fs.rmSync(tempHome, { recursive: true, force: true })
    fs.rmSync(fakeUserHome, { recursive: true, force: true })
  })

  test("indexes monty skills provider", () => {
    const list = runNoServer("skills list --catalog --provider monty --json", { env })
    expect(list.ok).toBe(true)
    const listData = JSON.parse(list.output)
    expect(listData.skills.some(skill => skill.id === "monty:root.skill")).toBe(true)
    expect(listData.skills.some(skill => skill.id === "monty:root.readme")).toBe(true)
    expect(listData.skills.some(skill => skill.id === "monty:root.usage")).toBe(true)
  })

  test("fetches indexed remote skill markdown", () => {
    const skill = runNoServer("skills get monty:root.skill", { env })
    expect(skill.ok).toBe(true)
    expect(skill.output).toContain("Monty Sandbox")
  })

  test("throws controlled error when @pydantic/monty is missing", () => {
    // Force dependency missing error via env var
    const r = runNoServer("monty python run --code \"1 + 1\" --json", { 
        env: { ...env, MOCK_MISSING_MONTY: "1" } 
    })
    
    expect(r.ok).toBe(false)
    const data = JSON.parse(r.output || r.stderr)

    expect(data.error.message).toContain("@pydantic/monty not found")
    expect(data.error.suggestions).toContain("Run: supercli monty cli setup")
  })

  test("doctor reports node and npm dependencies as healthy", () => {
    const r = runNoServer("plugins doctor monty --json", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.ok).toBe(true)
    expect(data.checks.some(c => c.binary === "node" && c.ok === true)).toBe(true)
    expect(data.checks.some(c => c.binary === "npm" && c.ok === true)).toBe(true)
  })

  test("removal cleans up the skills provider", () => {
    const remove = runNoServer("plugins remove monty --json", { env })
    expect(remove.ok).toBe(true)
    removed = true

    const list = runNoServer("skills list --catalog --provider monty --json", { env })
    expect(list.ok).toBe(true)
    const listData = JSON.parse(list.output)
    expect(listData.skills).toEqual([])
  })
})
