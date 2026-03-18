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

function writeFakeJsaAstBinary(dir) {
  const bin = path.join(dir, "jsa-ast")
  fs.writeFileSync(bin, [
    "#!/usr/bin/env node",
    "const args = process.argv.slice(2);",
    "const firstPath = args.find(a => !a.startsWith('-')) || '';",
    "if (args[0] === '--help') { console.log('JSA AST CLI help'); process.exit(0); }",
    "if (args[0] === '--version') { console.log('jsa-ast 1.0.0-test'); process.exit(0); }",
    "if (args.includes('--tree')) { console.log('program\\n  element: div'); process.exit(0); }",
    "if (args.includes('--json')) {",
    "  console.log(JSON.stringify({ ok: true, mode: 'json', path: firstPath, args }));",
    "  process.exit(0);",
    "}",
    "if (firstPath) { console.log(`validated:${firstPath}`); process.exit(0); }",
    "console.log(JSON.stringify({ ok: true, args }));"
  ].join("\n"), "utf-8")
  fs.chmodSync(bin, 0o755)
  return bin
}

describe("jsalt plugin", () => {
  const fakeDir = fs.mkdtempSync(path.join(os.tmpdir(), "dcli-jsalt-"))
  const tempHome = fs.mkdtempSync(path.join(os.tmpdir(), "dcli-home-jsalt-"))
  writeFakeJsaAstBinary(fakeDir)
  const env = { ...process.env, PATH: `${fakeDir}:${process.env.PATH || ""}`, SUPERCLI_HOME: tempHome }

  beforeAll(() => {
    runNoServer("plugins install ./plugins/jsalt --on-conflict replace --json", { env })
  })

  afterAll(() => {
    runNoServer("plugins remove jsalt --json", { env })
    fs.rmSync(fakeDir, { recursive: true, force: true })
    fs.rmSync(tempHome, { recursive: true, force: true })
  })

  test("routes ast validate wrapped command", () => {
    const r = runNoServer("jsalt ast validate --path examples/counter.jsa --json", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.command).toBe("jsalt.ast.validate")
    expect(data.data.raw).toBe("validated:examples/counter.jsa")
  })

  test("routes ast json wrapped command", () => {
    const r = runNoServer("jsalt ast json --path examples/counter.jsa --json", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.command).toBe("jsalt.ast.json")
    expect(data.data.mode).toBe("json")
    expect(data.data.path).toBe("examples/counter.jsa")
  })

  test("supports namespace passthrough", () => {
    const r = runNoServer("jsalt examples/counter.jsa --foo bar --json", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.command).toBe("jsalt.passthrough")
    expect(data.data.args[0]).toBe("examples/counter.jsa")
    expect(data.data.args).toContain("--foo")
    expect(data.data.args).toContain("bar")
    expect(data.data.args).toContain("--json")
  })

  test("doctor reports jsa-ast dependency as healthy", () => {
    const r = runNoServer("plugins doctor jsalt --json", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.ok).toBe(true)
    expect(data.checks.some(c => c.type === "binary" && c.binary === "jsa-ast" && c.ok === true)).toBe(true)
  })

  test("learn returns quickstart content", () => {
    const r = runNoServer("plugins learn jsalt --json", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.plugin).toBe("jsalt")
    expect(data.learn_markdown).toContain("jsalt Quickstart")
    expect(data.learn_markdown).toContain("Core JSALT syntax checklist")
  })
})
