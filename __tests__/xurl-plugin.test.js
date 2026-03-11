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
    "if (url.endsWith('/SKILL.md')) { console.log('---\\nname: xurl\\ndescription: Test skill\\n---\\n# xurl Skill'); process.exit(0); }",
    "if (url.endsWith('/README.md')) { console.log('# xurl\\n\\nTest readme.'); process.exit(0); }",
    "console.error(`unsupported url: ${url}`);",
    "process.exit(22);"
  ].join("\n"), "utf-8")
  fs.chmodSync(bin, 0o755)
  return bin
}

function writeFakeXurlBinary(dir) {
  const bin = path.join(dir, "xurl")
  fs.writeFileSync(bin, [
    "#!/usr/bin/env node",
    "const args = process.argv.slice(2);",
    "const emitJson = value => {",
    "  const payload = JSON.stringify(value);",
    "  if (process.env.NO_COLOR === '1') console.log(payload);",
    "  else console.log(`\\u001b[32m${payload}\\u001b[0m`);",
    "  process.exit(0);",
    "};",
    "if (args[0] === 'version') { console.log('xurl 1.0.3-test'); process.exit(0); }",
    "if (args[0] === 'auth' && args[1] === 'status') { console.log('▸ my-app  [client_id: abc123…]'); process.exit(0); }",
    "if (args[0] === 'auth' && args[1] === 'apps' && args[2] === 'list') { console.log('▸ my-app (client_id: abc123…)'); process.exit(0); }",
    "if (args[0] === 'whoami') emitJson({ data: { id: '42', username: 'tester' } });",
    "if (args[0] === 'user') emitJson({ data: { id: '84', username: args[1].replace(/^@/, '') } });",
    "if (args[0] === 'read') emitJson({ data: { id: '123', text: 'hello world', ref: args[1] } });",
    "if (args[0] === 'search') emitJson({ data: [{ id: '1', text: args[1] }] });",
    "if (args[0] === 'timeline') emitJson({ data: [{ id: '2', text: 'timeline item' }] });",
    "if (args[0] === 'mentions') emitJson({ data: [{ id: '3', text: 'mention item' }] });",
    "if (args[0] === 'followers') emitJson({ data: [{ username: args.includes('--of') ? args[args.indexOf('--of') + 1] : 'alice' }] });",
    "if (args[0] === 'following') emitJson({ data: [{ username: args.includes('--of') ? args[args.indexOf('--of') + 1] : 'bob' }] });",
    "emitJson({ ok: true, args });"
  ].join("\n"), "utf-8")
  fs.chmodSync(bin, 0o755)
  return bin
}

describe("xurl hybrid plugin", () => {
  const fakeDir = fs.mkdtempSync(path.join(os.tmpdir(), "dcli-xurl-"))
  const tempHome = fs.mkdtempSync(path.join(os.tmpdir(), "dcli-home-xurl-"))
  writeFakeCurlBinary(fakeDir)
  writeFakeXurlBinary(fakeDir)
  const env = { ...process.env, PATH: `${fakeDir}:${process.env.PATH || ""}`, SUPERCLI_HOME: tempHome }
  let removed = false

  beforeAll(() => {
    const install = runNoServer("plugins install ./plugins/xurl --on-conflict replace --json", { env })
    expect(install.ok).toBe(true)
  })

  afterAll(() => {
    if (!removed) runNoServer("plugins remove xurl --json", { env })
    fs.rmSync(fakeDir, { recursive: true, force: true })
    fs.rmSync(tempHome, { recursive: true, force: true })
  })

  test("indexes xurl skills provider", () => {
    const provider = runNoServer("skills providers show --name xurl --json", { env })
    expect(provider.ok).toBe(true)
    expect(JSON.parse(provider.output).provider.name).toBe("xurl")

    const list = runNoServer("skills list --catalog --provider xurl --json", { env })
    expect(list.ok).toBe(true)
    const listData = JSON.parse(list.output)
    expect(listData.skills.some(skill => skill.id === "xurl:root.skill")).toBe(true)
    expect(listData.skills.some(skill => skill.id === "xurl:root.readme")).toBe(true)
  })

  test("fetches indexed remote skill markdown", () => {
    const skill = runNoServer("skills get xurl:root.skill", { env })
    expect(skill.ok).toBe(true)
    expect(skill.output).toContain("xurl Skill")
  })

  test("routes wrapped raw and parsed commands", () => {
    const version = runNoServer("xurl cli version --json", { env })
    expect(version.ok).toBe(true)
    expect(JSON.parse(version.output).data.raw).toBe("xurl 1.0.3-test")

    const status = runNoServer("xurl auth status --json", { env })
    expect(status.ok).toBe(true)
    expect(JSON.parse(status.output).data.raw).toContain("my-app")

    const apps = runNoServer("xurl apps list --json", { env })
    expect(apps.ok).toBe(true)
    expect(JSON.parse(apps.output).data.raw).toContain("my-app")

    const whoami = runNoServer("xurl account whoami --json", { env })
    expect(whoami.ok).toBe(true)
    expect(JSON.parse(whoami.output).data.data.username).toBe("tester")

    const user = runNoServer("xurl users show --target @XDevelopers --json", { env })
    expect(user.ok).toBe(true)
    expect(JSON.parse(user.output).data.data.username).toBe("XDevelopers")

    const read = runNoServer("xurl posts show --target 1234567890 --json", { env })
    expect(read.ok).toBe(true)
    expect(JSON.parse(read.output).data.data.ref).toBe("1234567890")

    const search = runNoServer("xurl posts search --query \"from:XDevelopers\" --max-results 10 --json", { env })
    expect(search.ok).toBe(true)
    expect(JSON.parse(search.output).data.data[0].text).toBe("from:XDevelopers")
  })

  test("routes timeline mentions and social wrappers", () => {
    const timeline = runNoServer("xurl timeline list --max-results 10 --json", { env })
    expect(timeline.ok).toBe(true)
    expect(JSON.parse(timeline.output).data.data[0].text).toBe("timeline item")

    const mentions = runNoServer("xurl mentions list --max-results 10 --json", { env })
    expect(mentions.ok).toBe(true)
    expect(JSON.parse(mentions.output).data.data[0].text).toBe("mention item")

    const followers = runNoServer("xurl social followers --of XDevelopers --max-results 20 --json", { env })
    expect(followers.ok).toBe(true)
    expect(JSON.parse(followers.output).data.data[0].username).toBe("XDevelopers")

    const following = runNoServer("xurl social following --of XDevelopers --max-results 20 --json", { env })
    expect(following.ok).toBe(true)
    expect(JSON.parse(following.output).data.data[0].username).toBe("XDevelopers")
  })

  test("does not expose passthrough and reports dependencies as healthy", () => {
    const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "plugins", "xurl", "plugin.json"), "utf-8"))
    expect(manifest.commands.some(command => command.resource === "_" && command.action === "_")).toBe(false)

    const doctor = runNoServer("plugins doctor xurl --json", { env })
    expect(doctor.ok).toBe(true)
    const doctorData = JSON.parse(doctor.output)
    expect(doctorData.checks.some(c => c.type === "binary" && c.binary === "curl" && c.ok === true)).toBe(true)
    expect(doctorData.checks.some(c => c.type === "binary" && c.binary === "xurl" && c.ok === true)).toBe(true)
  })

  test("removal cleans up the skills provider", () => {
    const remove = runNoServer("plugins remove xurl --json", { env })
    expect(remove.ok).toBe(true)
    removed = true

    const provider = runNoServer("skills providers show --name xurl --json", { env })
    expect(provider.ok).toBe(false)
  })
})
