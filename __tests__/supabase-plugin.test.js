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

function writeFakeSupabaseBinary(dir) {
  const bin = path.join(dir, "supabase")
  fs.writeFileSync(bin, [
    "#!/usr/bin/env node",
    "const args = process.argv.slice(2);",
    "if (args.includes('--version')) { console.log('supabase 2.0.0-test'); process.exit(0); }",
    "if (args[0] === 'projects' && args[1] === 'list' && args.includes('--output') && args.includes('json')) {",
    "  console.log(JSON.stringify([{ id: 'proj_1', name: 'mock-project' }]));",
    "  process.exit(0);",
    "}",
    "console.log(JSON.stringify({ ok: true, args }));"
  ].join("\n"), "utf-8")
  fs.chmodSync(bin, 0o755)
  return bin
}

describe("supabase plugin", () => {
  const fakeDir = fs.mkdtempSync(path.join(os.tmpdir(), "dcli-supabase-"))
  writeFakeSupabaseBinary(fakeDir)
  const env = { ...process.env, PATH: `${fakeDir}:${process.env.PATH || ""}` }

  beforeAll(() => {
    runNoServer("plugins install ./plugins/supabase --on-conflict replace --json", { env })
  })

  afterAll(() => {
    runNoServer("plugins remove supabase --json", { env })
    fs.rmSync(fakeDir, { recursive: true, force: true })
  })

  test("routes projects list wrapped command", () => {
    const r = runNoServer("supabase projects list --json", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.command).toBe("supabase.projects.list")
    expect(Array.isArray(data.data)).toBe(true)
    expect(data.data[0].name).toBe("mock-project")
  })

  test("supports namespace passthrough", () => {
    const r = runNoServer("supabase status --output json", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.command).toBe("supabase.passthrough")
    expect(data.data.args[0]).toBe("status")
    expect(data.data.args).toContain("--output")
    expect(data.data.args).toContain("json")
  })

  test("doctor reports supabase dependency as healthy", () => {
    const r = runNoServer("plugins doctor supabase --json", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.ok).toBe(true)
    expect(data.checks.some(c => c.type === "binary" && c.binary === "supabase" && c.ok === true)).toBe(true)
  })
})
