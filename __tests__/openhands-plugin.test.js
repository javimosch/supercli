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

function writeFakeOpenHandsBinary(dir) {
  const bin = path.join(dir, "openhands")
  fs.writeFileSync(bin, [
    "#!/usr/bin/env node",
    "const args = process.argv.slice(2);",
    "if (args[0] === '--version') { console.log('openhands 0.42.0-test'); process.exit(0); }",
    "if (args.includes('--headless') && args.includes('--json')) {",
    "  console.log(JSON.stringify({ type: 'action', action: 'write' }));",
    "  console.log(JSON.stringify({ type: 'observation', content: 'ok' }));",
    "  process.exit(0);",
    "}",
    "if (args.includes('--headless') && args.includes('-t')) {",
    "  const i = args.indexOf('-t');",
    "  console.log(`ran:${args[i + 1] || ''}`);",
    "  process.exit(0);",
    "}",
    "if (args.includes('--headless') && args.includes('-f')) {",
    "  const i = args.indexOf('-f');",
    "  console.log(`file:${args[i + 1] || ''}`);",
    "  process.exit(0);",
    "}",
    "console.log(JSON.stringify({ ok: true, args }));"
  ].join("\n"), "utf-8")
  fs.chmodSync(bin, 0o755)
  return bin
}

describe("openhands plugin", () => {
  const fakeDir = fs.mkdtempSync(path.join(os.tmpdir(), "dcli-openhands-"))
  const tempHome = fs.mkdtempSync(path.join(os.tmpdir(), "dcli-home-openhands-"))
  writeFakeOpenHandsBinary(fakeDir)
  const env = { ...process.env, PATH: `${fakeDir}:${process.env.PATH || ""}`, SUPERCLI_HOME: tempHome }

  beforeAll(() => {
    runNoServer("plugins install ./plugins/openhands --on-conflict replace --json", { env })
  })

  afterAll(() => {
    runNoServer("plugins remove openhands --json", { env })
    fs.rmSync(fakeDir, { recursive: true, force: true })
    fs.rmSync(tempHome, { recursive: true, force: true })
  })

  test("routes version command", () => {
    const r = runNoServer("openhands self version --json", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.command).toBe("openhands.self.version")
    expect(data.data.raw).toBe("openhands 0.42.0-test")
  })

  test("streams jsonl events for task json", () => {
    const r = runNoServer("openhands task json --task \"Add tests\" --json", { env })
    expect(r.ok).toBe(true)
    const lines = r.output.split("\n").filter(Boolean).map(line => JSON.parse(line))
    expect(lines[0].command).toBe("openhands.task.json")
    expect(lines[0].data.type).toBe("action")
    expect(lines[1].data.type).toBe("observation")
    expect(lines[2].data.streamed).toBe(true)
    expect(lines[2].data.event_count).toBe(2)
  })

  test("supports passthrough", () => {
    const r = runNoServer("openhands --help --json", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.command).toBe("openhands.passthrough")
    const payload = JSON.parse(data.data.raw)
    expect(payload.args).toContain("--help")
  })

  test("doctor reports openhands dependency as healthy", () => {
    const r = runNoServer("plugins doctor openhands --json", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.ok).toBe(true)
    expect(data.checks.some(c => c.type === "binary" && c.binary === "openhands" && c.ok === true)).toBe(true)
  })
})
