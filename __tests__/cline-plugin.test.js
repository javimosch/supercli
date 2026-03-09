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

function writeFakeClineBinary(dir) {
  const bin = path.join(dir, "cline")
  fs.writeFileSync(bin, [
    "#!/usr/bin/env node",
    "const args = process.argv.slice(2);",
    "if (args[0] === '--version') { console.log('cline 3.71.0-test'); process.exit(0); }",
    "if (args.includes('--json') && (args.includes('-a') || args.includes('-p'))) {",
    "  const prompt = args[args.length - 1];",
    "  console.log(JSON.stringify({ type: 'task_started', taskId: 'task-123' }));",
    "  console.log(JSON.stringify({ type: 'say', say: 'task', text: prompt }));",
    "  console.log(JSON.stringify({ type: 'say', say: 'completion_result', text: 'done', partial: false }));",
    "  process.exit(0);",
    "}",
    "console.log(JSON.stringify({ ok: true, args }));"
  ].join("\n"), "utf-8")
  fs.chmodSync(bin, 0o755)
  return bin
}

describe("cline plugin", () => {
  const fakeDir = fs.mkdtempSync(path.join(os.tmpdir(), "dcli-cline-"))
  const tempHome = fs.mkdtempSync(path.join(os.tmpdir(), "dcli-home-cline-"))
  writeFakeClineBinary(fakeDir)
  const env = { ...process.env, PATH: `${fakeDir}:${process.env.PATH || ""}`, SUPERCLI_HOME: tempHome }

  beforeAll(() => {
    runNoServer("plugins install ./plugins/cline --on-conflict replace --json", { env })
  })

  afterAll(() => {
    runNoServer("plugins remove cline --json", { env })
    fs.rmSync(fakeDir, { recursive: true, force: true })
    fs.rmSync(tempHome, { recursive: true, force: true })
  })

  test("routes cli version wrapped command", () => {
    const r = runNoServer("cline cli version --json", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.command).toBe("cline.cli.version")
    expect(data.data.raw).toBe("cline 3.71.0-test")
  })

  test("streams act-mode task output with final summary", () => {
    const r = runNoServer("cline task run --prompt \"List files with most LOC\" --cwd . --timeout 30 --json", { env })
    expect(r.ok).toBe(true)
    const lines = r.output.split("\n").filter(Boolean).map(line => JSON.parse(line))
    expect(lines[0].stream).toBe(true)
    expect(lines[0].command).toBe("cline.task.run")
    expect(lines[0].data.type).toBe("task_started")
    expect(lines[1].data.say).toBe("task")
    expect(lines[2].data.say).toBe("completion_result")
    expect(lines[3].stream).toBeUndefined()
    expect(lines[3].data.streamed).toBe(true)
    expect(lines[3].data.event_count).toBe(3)
  })

  test("streams plan-mode task output with final summary", () => {
    const r = runNoServer("cline task plan --prompt \"Plan auth refactor\" --json", { env })
    expect(r.ok).toBe(true)
    const lines = r.output.split("\n").filter(Boolean).map(line => JSON.parse(line))
    expect(lines[0].command).toBe("cline.task.plan")
    expect(lines[3].data.last_event.say).toBe("completion_result")
  })

  test("supports namespace passthrough", () => {
    const r = runNoServer("cline --help --json", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.command).toBe("cline.passthrough")
    expect(data.data.args).toContain("--help")
    expect(data.data.args).toContain("--json")
  })

  test("doctor reports cline dependency as healthy", () => {
    const r = runNoServer("plugins doctor cline --json", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.ok).toBe(true)
    expect(data.checks.some(c => c.type === "binary" && c.binary === "cline" && c.ok === true)).toBe(true)
  })
})
