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

function writeFakeMysqlBinary(dir) {
  const bin = path.join(dir, "mysql")
  fs.writeFileSync(bin, [
    "#!/usr/bin/env node",
    "const args = process.argv.slice(2);",
    "if (args[0] === '--version') { console.log('mysql  Ver 8.4.0-test for Linux on x86_64'); process.exit(0); }",
    "const executeIndex = args.indexOf('--execute');",
    "if (executeIndex >= 0) {",
    "  const sql = args[executeIndex + 1];",
    "  console.log('RESULT\\t' + sql);",
    "  process.exit(0);",
    "}",
    "console.log(JSON.stringify({ ok: true, args }));"
  ].join("\n"), "utf-8")
  fs.chmodSync(bin, 0o755)
  return bin
}

describe("mysql plugin", () => {
  const fakeDir = fs.mkdtempSync(path.join(os.tmpdir(), "dcli-mysql-"))
  const tempHome = fs.mkdtempSync(path.join(os.tmpdir(), "dcli-home-mysql-"))
  writeFakeMysqlBinary(fakeDir)
  const env = { ...process.env, PATH: `${fakeDir}:${process.env.PATH || ""}`, SUPERCLI_HOME: tempHome }

  beforeAll(() => {
    runNoServer("plugins install ./plugins/mysql --on-conflict replace --json", { env })
  })

  afterAll(() => {
    runNoServer("plugins remove mysql --json", { env })
    fs.rmSync(fakeDir, { recursive: true, force: true })
    fs.rmSync(tempHome, { recursive: true, force: true })
  })

  test("routes cli version wrapped command", () => {
    const r = runNoServer("mysql cli version --json", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.command).toBe("mysql.cli.version")
    expect(data.data.raw).toContain("mysql  Ver 8.4.0-test")
  })

  test("routes query execute wrapped command", () => {
    const r = runNoServer("mysql query execute --execute \"select 1\" --host 127.0.0.1 --user root --database mysql --json", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.command).toBe("mysql.query.execute")
    expect(data.data.raw).toBe("RESULT\tselect 1")
  })

  test("supports namespace passthrough", () => {
    const r = runNoServer("mysql --help --json", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.command).toBe("mysql.passthrough")
    expect(data.data.args).toContain("--help")
    expect(data.data.args).toContain("--json")
  })

  test("doctor reports mysql dependency as healthy", () => {
    const r = runNoServer("plugins doctor mysql --json", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.ok).toBe(true)
    expect(data.checks.some(c => c.type === "binary" && c.binary === "mysql" && c.ok === true)).toBe(true)
  })
})
