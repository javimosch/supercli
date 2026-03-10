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

function writeFakeWacliBinary(dir) {
  const bin = path.join(dir, "wacli")
  fs.writeFileSync(bin, [
    "#!/usr/bin/env node",
    "const args = process.argv.slice(2);",
    "if (args[0] === '--version') { console.log('wacli 0.2.0-test'); process.exit(0); }",
    "const hasJson = args.includes('--json');",
    "const storeIndex = args.indexOf('--store');",
    "const store = storeIndex >= 0 ? args[storeIndex + 1] : null;",
    "const clean = args.filter((arg, i) => arg !== '--json' && arg !== '--store' && i !== storeIndex + 1);",
    "if (clean[0] === 'doctor') { console.log(JSON.stringify({ ok: true, store })); process.exit(0); }",
    "if (clean[0] === 'auth' && clean[1] === 'status') { console.log(JSON.stringify({ authenticated: true, store })); process.exit(0); }",
    "if (clean[0] === 'chats' && clean[1] === 'list') { console.log(JSON.stringify([{ JID: '123@s.whatsapp.net', Name: 'Alice', store }])); process.exit(0); }",
    "if (clean[0] === 'chats' && clean[1] === 'show') { console.log(JSON.stringify({ JID: clean[3], Name: 'Alice Chat', store })); process.exit(0); }",
    "if (clean[0] === 'messages' && clean[1] === 'list') { console.log(JSON.stringify([{ ChatJID: '123@s.whatsapp.net', ID: 'm1', Text: 'hello', store }])); process.exit(0); }",
    "if (clean[0] === 'messages' && clean[1] === 'search') { console.log(JSON.stringify([{ ID: 'm2', Text: clean[2], store }])); process.exit(0); }",
    "if (clean[0] === 'messages' && clean[1] === 'show') { console.log(JSON.stringify({ ChatJID: clean[3], ID: clean[5], Text: 'full message', store })); process.exit(0); }",
    "if (clean[0] === 'messages' && clean[1] === 'context') { console.log(JSON.stringify({ center: clean[5], messages: [{ ID: 'm0' }, { ID: clean[5] }, { ID: 'm3' }], store })); process.exit(0); }",
    "if (clean[0] === 'contacts' && clean[1] === 'search') { console.log(JSON.stringify([{ JID: '123@s.whatsapp.net', Name: clean[2], store }])); process.exit(0); }",
    "if (clean[0] === 'contacts' && clean[1] === 'show') { console.log(JSON.stringify({ JID: clean[3], Name: 'Alice', store })); process.exit(0); }",
    "if (clean[0] === 'groups' && clean[1] === 'list') { console.log(JSON.stringify([{ JID: '456@g.us', Name: 'Test Group', store }])); process.exit(0); }",
    "if (clean[0] === 'groups' && clean[1] === 'info') { console.log(JSON.stringify({ JID: clean[3], Name: 'Test Group', store })); process.exit(0); process.exit(0); }",
    "if (hasJson) { console.log(JSON.stringify({ ok: true, args, store })); process.exit(0); }",
    "console.log('human output');"
  ].join("\n"), "utf-8")
  fs.chmodSync(bin, 0o755)
  return bin
}

describe("wacli plugin", () => {
  const fakeDir = fs.mkdtempSync(path.join(os.tmpdir(), "dcli-wacli-"))
  const tempHome = fs.mkdtempSync(path.join(os.tmpdir(), "dcli-home-wacli-"))
  const fakeStore = path.join(tempHome, "store")
  fs.mkdirSync(fakeStore, { recursive: true })
  writeFakeWacliBinary(fakeDir)
  const env = { ...process.env, PATH: `${fakeDir}:${process.env.PATH || ""}`, SUPERCLI_HOME: tempHome }

  beforeAll(() => {
    runNoServer("plugins install ./plugins/wacli --on-conflict replace --json", { env })
  })

  afterAll(() => {
    runNoServer("plugins remove wacli --json", { env })
    fs.rmSync(fakeDir, { recursive: true, force: true })
    fs.rmSync(tempHome, { recursive: true, force: true })
  })

  test("routes version and doctor commands", () => {
    const version = runNoServer("wacli cli version --json", { env })
    expect(version.ok).toBe(true)
    expect(JSON.parse(version.output).data.raw).toBe("wacli 0.2.0-test")

    const doctor = runNoServer(`wacli doctor run --store ${fakeStore} --json`, { env })
    expect(doctor.ok).toBe(true)
    const doctorData = JSON.parse(doctor.output)
    expect(doctorData.command).toBe("wacli.doctor.run")
    expect(doctorData.data.ok).toBe(true)
    expect(doctorData.data.store).toBe(fakeStore)
  })

  test("routes auth chats and messages wrappers", () => {
    const auth = runNoServer(`wacli auth status --store ${fakeStore} --json`, { env })
    expect(auth.ok).toBe(true)
    expect(JSON.parse(auth.output).data.authenticated).toBe(true)

    const chats = runNoServer(`wacli chats list --store ${fakeStore} --limit 5 --json`, { env })
    expect(chats.ok).toBe(true)
    expect(JSON.parse(chats.output).data[0].JID).toBe("123@s.whatsapp.net")

    const show = runNoServer(`wacli chats show --jid 123@s.whatsapp.net --store ${fakeStore} --json`, { env })
    expect(show.ok).toBe(true)
    expect(JSON.parse(show.output).data.JID).toBe("123@s.whatsapp.net")

    const search = runNoServer(`wacli messages search --query meeting --store ${fakeStore} --limit 10 --json`, { env })
    expect(search.ok).toBe(true)
    expect(JSON.parse(search.output).data[0].Text).toBe("meeting")
  })

  test("routes message context contacts and groups wrappers", () => {
    const show = runNoServer(`wacli messages show --chat 123@s.whatsapp.net --id m1 --store ${fakeStore} --json`, { env })
    expect(show.ok).toBe(true)
    expect(JSON.parse(show.output).data.ID).toBe("m1")

    const context = runNoServer(`wacli messages context --chat 123@s.whatsapp.net --id m1 --before 1 --after 1 --store ${fakeStore} --json`, { env })
    expect(context.ok).toBe(true)
    expect(JSON.parse(context.output).data.messages).toHaveLength(3)

    const contact = runNoServer(`wacli contacts show --jid 123@s.whatsapp.net --store ${fakeStore} --json`, { env })
    expect(contact.ok).toBe(true)
    expect(JSON.parse(contact.output).data.Name).toBe("Alice")

    const group = runNoServer(`wacli groups info --jid 456@g.us --store ${fakeStore} --json`, { env })
    expect(group.ok).toBe(true)
    expect(JSON.parse(group.output).data.JID).toBe("456@g.us")
  })

  test("does not expose passthrough and reports dependency health", () => {
    const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "plugins", "wacli", "plugin.json"), "utf-8"))
    expect(manifest.commands.some(command => command.resource === "_" && command.action === "_")).toBe(false)

    const doctor = runNoServer("plugins doctor wacli --json", { env })
    expect(doctor.ok).toBe(true)
    expect(JSON.parse(doctor.output).checks.some(c => c.type === "binary" && c.binary === "wacli" && c.ok === true)).toBe(true)
  })
})
