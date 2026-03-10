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

function writeFakeHimalayaBinary(dir) {
  const bin = path.join(dir, "himalaya")
  fs.writeFileSync(bin, [
    "#!/usr/bin/env node",
    "const args = process.argv.slice(2);",
    "const outJson = args[0] === '--output' && args[1] === 'json';",
    "const payloadArgs = outJson ? args.slice(2) : args;",
    "if (args[0] === '--version') { console.log('himalaya 1.2.0-test'); process.exit(0); }",
    "if (outJson && payloadArgs[0] === 'account' && payloadArgs[1] === 'list') { console.log(JSON.stringify({ accounts: [{ name: 'personal', default: true }] })); process.exit(0); }",
    "if (payloadArgs[0] === 'account' && payloadArgs[1] === 'doctor') { console.log('Account personal looks healthy'); process.exit(0); }",
    "if (outJson && payloadArgs[0] === 'folder' && payloadArgs[1] === 'list') { console.log(JSON.stringify({ folders: [{ name: 'INBOX' }, { name: 'Archive' }] })); process.exit(0); }",
    "if (outJson && payloadArgs[0] === 'envelope' && payloadArgs[1] === 'list') { console.log(JSON.stringify({ envelopes: [{ id: 42, subject: 'Hello' }] })); process.exit(0); }",
    "if (outJson && payloadArgs[0] === 'envelope' && payloadArgs[1] === 'thread') { console.log(JSON.stringify({ thread: [{ id: 42 }, { id: 43 }] })); process.exit(0); }",
    "if (outJson && payloadArgs[0] === 'message' && payloadArgs[1] === 'read' && payloadArgs.includes('--preview')) { console.log(JSON.stringify({ id: 42, preview: true, subject: 'Hello' })); process.exit(0); }",
    "console.log(JSON.stringify({ ok: true, args }));"
  ].join("\n"), "utf-8")
  fs.chmodSync(bin, 0o755)
  return bin
}

describe("himalaya plugin", () => {
  const fakeDir = fs.mkdtempSync(path.join(os.tmpdir(), "dcli-himalaya-"))
  const tempHome = fs.mkdtempSync(path.join(os.tmpdir(), "dcli-home-himalaya-"))
  writeFakeHimalayaBinary(fakeDir)
  const env = { ...process.env, PATH: `${fakeDir}:${process.env.PATH || ""}`, SUPERCLI_HOME: tempHome }

  beforeAll(() => {
    runNoServer("plugins install ./plugins/himalaya --on-conflict replace --json", { env })
  })

  afterAll(() => {
    runNoServer("plugins remove himalaya --json", { env })
    fs.rmSync(fakeDir, { recursive: true, force: true })
    fs.rmSync(tempHome, { recursive: true, force: true })
  })

  test("routes cli version wrapped command", () => {
    const r = runNoServer("himalaya cli version --json", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.command).toBe("himalaya.cli.version")
    expect(data.data.raw).toBe("himalaya 1.2.0-test")
  })

  test("routes json account and folder wrappers", () => {
    const accounts = runNoServer("himalaya account list --json", { env })
    expect(accounts.ok).toBe(true)
    expect(JSON.parse(accounts.output).data.accounts[0].name).toBe("personal")

    const folders = runNoServer("himalaya folder list --account personal --json", { env })
    expect(folders.ok).toBe(true)
    expect(JSON.parse(folders.output).data.folders[0].name).toBe("INBOX")
  })

  test("routes envelope and message wrappers", () => {
    const envelopes = runNoServer("himalaya envelope list --account personal --folder INBOX --page 1 --page-size 10 --json", { env })
    expect(envelopes.ok).toBe(true)
    expect(JSON.parse(envelopes.output).data.envelopes[0].id).toBe(42)

    const thread = runNoServer("himalaya envelope thread --account personal --folder INBOX --id 42 --json", { env })
    expect(thread.ok).toBe(true)
    expect(JSON.parse(thread.output).data.thread).toHaveLength(2)

    const message = runNoServer("himalaya message read-preview --account personal --folder INBOX --id 42 --json", { env })
    expect(message.ok).toBe(true)
    const messageData = JSON.parse(message.output)
    expect(messageData.command).toBe("himalaya.message.read-preview")
    expect(messageData.data.preview).toBe(true)
  })

  test("routes account doctor wrapper as raw text", () => {
    const r = runNoServer("himalaya account doctor --account personal --json", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.command).toBe("himalaya.account.doctor")
    expect(data.data.raw).toBe("Account personal looks healthy")
  })

  test("supports namespace passthrough", () => {
    const r = runNoServer("himalaya --output json account list", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.command).toBe("himalaya.passthrough")
    expect(data.data.raw).toContain('"accounts"')
  })

  test("doctor reports himalaya dependency as healthy", () => {
    const r = runNoServer("plugins doctor himalaya --json", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.ok).toBe(true)
    expect(data.checks.some(c => c.type === "binary" && c.binary === "himalaya" && c.ok === true)).toBe(true)
  })
})
