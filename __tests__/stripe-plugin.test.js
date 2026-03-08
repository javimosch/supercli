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

function writeFakeStripeBinary(dir) {
  const bin = path.join(dir, "stripe")
  fs.writeFileSync(bin, [
    "#!/usr/bin/env node",
    "const args = process.argv.slice(2);",
    "if (args.includes('--version')) { console.log('stripe version 1.21.0'); process.exit(0); }",
    "console.log(JSON.stringify({ ok: true, args }));"
  ].join("\n"), "utf-8")
  fs.chmodSync(bin, 0o755)
  return bin
}

describe("stripe plugin", () => {
  const fakeDir = fs.mkdtempSync(path.join(os.tmpdir(), "dcli-stripe-"))
  writeFakeStripeBinary(fakeDir)
  const env = { ...process.env, PATH: `${fakeDir}:${process.env.PATH || ""}` }

  beforeAll(() => {
    runNoServer("plugins install ./plugins/stripe --on-conflict replace --json", { env })
  })

  afterAll(() => {
    runNoServer("plugins remove stripe --json", { env })
    fs.rmSync(fakeDir, { recursive: true, force: true })
  })

  test("routes customers list command", () => {
    const r = runNoServer("stripe customers list --limit 3 --json", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.command).toBe("stripe.customers.list")
    expect(data.data.args).toEqual(["customers", "list", "--limit", "3"])
  })

  test("supports namespace passthrough", () => {
    const r = runNoServer("stripe trigger payment_intent.succeeded --json", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.command).toBe("stripe.passthrough")
    expect(data.data.args[0]).toBe("trigger")
    expect(data.data.args[1]).toBe("payment_intent.succeeded")
    expect(data.data.args).toContain("--json")
  })

  test("doctor reports stripe dependency as healthy", () => {
    const r = runNoServer("plugins doctor stripe --json", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.ok).toBe(true)
    expect(data.checks.some(c => c.type === "binary" && c.binary === "stripe" && c.ok === true)).toBe(true)
  })
})
