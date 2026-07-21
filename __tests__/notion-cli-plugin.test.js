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

function writeFakeNotionBinary(dir) {
  const bin = path.join(dir, "notion")
  fs.writeFileSync(bin, [
    "#!/usr/bin/env node",
    "const args = process.argv.slice(2);",
    "if (args[0] === '--version') { console.log('notion 0.1.0-test'); process.exit(0); }",
    "if (args[0] === 'search') { console.log(JSON.stringify({ results: [{ id: 'p1', title: 'Hello' }] })); process.exit(0); }",
    "if (args[0] === 'db' && args[1] === 'list') { console.log(JSON.stringify({ databases: [{ id: 'db1', title: 'Tasks' }] })); process.exit(0); }",
    "if (args[0] === 'page' && args[1] === 'list') { console.log(JSON.stringify({ pages: [{ id: 'pg1', title: 'Note' }] })); process.exit(0); }",
    "console.log(JSON.stringify({ ok: true, args }));"
  ].join("\n"), "utf-8")
  fs.chmodSync(bin, 0o755)
  return bin
}

describe("notion-cli plugin", () => {
  const fakeDir = fs.mkdtempSync(path.join(os.tmpdir(), "dcli-notion-"))
  const tempHome = fs.mkdtempSync(path.join(os.tmpdir(), "dcli-home-notion-"))
  writeFakeNotionBinary(fakeDir)
  const env = { ...process.env, PATH: `${fakeDir}:${process.env.PATH || ""}`, SUPERCLI_HOME: tempHome }

  beforeAll(() => {
    runNoServer("plugins install ./plugins/notion-cli --on-conflict replace --json", { env })
  })

  afterAll(() => {
    runNoServer("plugins remove notion-cli --json", { env })
    fs.rmSync(fakeDir, { recursive: true, force: true })
    fs.rmSync(tempHome, { recursive: true, force: true })
  })

  test("routes version command as raw text", () => {
    const r = runNoServer("notion self version --json", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.command).toBe("notion.self.version")
    expect(data.data.raw).toBe("notion 0.1.0-test")
  })

  test("routes search with positional query", () => {
    const r = runNoServer('notion search run "Hello" --json', { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.command).toBe("notion.search.run")
    expect(data.data.results[0].id).toBe("p1")
  })

  test("routes db list as parsed json", () => {
    const r = runNoServer("notion db list --json", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.command).toBe("notion.db.list")
    expect(data.data.databases[0].title).toBe("Tasks")
  })

  test("routes page list as parsed json", () => {
    const r = runNoServer("notion page list --json", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.command).toBe("notion.page.list")
    expect(data.data.pages[0].id).toBe("pg1")
  })

  test("doctor reports notion binary dependency as healthy", () => {
    const r = runNoServer("plugins doctor notion-cli --json", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.ok).toBe(true)
    expect(data.checks.some(c => c.type === "binary" && c.binary === "notion" && c.ok === true)).toBe(true)
  })
})
