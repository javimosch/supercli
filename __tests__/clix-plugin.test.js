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
    "if (url.endsWith('/SKILL.md')) { console.log('---\\nname: clix\\ndescription: Test skill\\n---\\n# clix Skill'); process.exit(0); }",
    "if (url.endsWith('/README.md')) { console.log('# clix\\n\\nTest readme.'); process.exit(0); }",
    "console.error(`unsupported url: ${url}`);",
    "process.exit(22);"
  ].join("\n"), "utf-8")
  fs.chmodSync(bin, 0o755)
  return bin
}

function writeFakeClixBinary(dir) {
  const bin = path.join(dir, "clix")
  fs.writeFileSync(bin, [
    "#!/usr/bin/env node",
    "const args = process.argv.slice(2);",
    "if (args[0] === 'auth' && args[1] === 'status') { console.log(JSON.stringify({ authenticated: true, account: 'default' })); process.exit(0); }",
    "if (args[0] === 'feed') { console.log(JSON.stringify({ tweets: [{ id: '1', text: 'timeline item' }] })); process.exit(0); }",
    "if (args[0] === 'search') { console.log(JSON.stringify({ tweets: [{ id: '2', text: args[2] || args[1] }] })); process.exit(0); }",
    "if (args[0] === 'tweet') { console.log(JSON.stringify({ tweet: { id: args[2] || args[1], text: 'tweet body' } })); process.exit(0); }",
    "if (args[0] === 'user') { console.log(JSON.stringify({ user: { handle: args[2] || args[1], name: 'OpenAI' } })); process.exit(0); }",
    "if (args[0] === 'bookmarks') { console.log(JSON.stringify({ tweets: [{ id: '3', text: 'bookmark item' }] })); process.exit(0); }",
    "console.log(JSON.stringify({ ok: true, args }));"
  ].join("\n"), "utf-8")
  fs.chmodSync(bin, 0o755)
  return bin
}

describe("clix hybrid plugin", () => {
  const fakeDir = fs.mkdtempSync(path.join(os.tmpdir(), "dcli-clix-"))
  const tempHome = fs.mkdtempSync(path.join(os.tmpdir(), "dcli-home-clix-"))
  writeFakeCurlBinary(fakeDir)
  writeFakeClixBinary(fakeDir)
  const env = { ...process.env, PATH: `${fakeDir}:${process.env.PATH || ""}`, SUPERCLI_HOME: tempHome }
  let removed = false

  beforeAll(() => {
    const install = runNoServer("plugins install ./plugins/clix --on-conflict replace --json", { env })
    expect(install.ok).toBe(true)
  })

  afterAll(() => {
    if (!removed) runNoServer("plugins remove clix --json", { env })
    fs.rmSync(fakeDir, { recursive: true, force: true })
    fs.rmSync(tempHome, { recursive: true, force: true })
  })

  test("indexes clix skills provider", () => {
    const provider = runNoServer("skills providers show --name clix --json", { env })
    expect(provider.ok).toBe(true)
    expect(JSON.parse(provider.output).provider.name).toBe("clix")

    const list = runNoServer("skills list --catalog --provider clix --json", { env })
    expect(list.ok).toBe(true)
    const listData = JSON.parse(list.output)
    expect(listData.skills.some(skill => skill.id === "clix:root.skill")).toBe(true)
    expect(listData.skills.some(skill => skill.id === "clix:root.readme")).toBe(true)
  })

  test("fetches indexed remote skill markdown", () => {
    const skill = runNoServer("skills get clix:root.skill", { env })
    expect(skill.ok).toBe(true)
    expect(skill.output).toContain("clix Skill")
  })

  test("routes wrapped read-only commands", () => {
    const status = runNoServer("clix auth status --json", { env })
    expect(status.ok).toBe(true)
    expect(JSON.parse(status.output).data.authenticated).toBe(true)

    const timeline = runNoServer("clix timeline list --type following --count 20 --json", { env })
    expect(timeline.ok).toBe(true)
    expect(JSON.parse(timeline.output).data.tweets[0].text).toBe("timeline item")

    const search = runNoServer("clix posts search --query \"from:openai\" --type latest --count 20 --json", { env })
    expect(search.ok).toBe(true)
    expect(JSON.parse(search.output).data.tweets[0].text).toBe("from:openai")

    const tweet = runNoServer("clix posts show --id 1234567890 --json", { env })
    expect(tweet.ok).toBe(true)
    expect(JSON.parse(tweet.output).data.tweet.id).toBe("1234567890")

    const user = runNoServer("clix users show --handle openai --json", { env })
    expect(user.ok).toBe(true)
    expect(JSON.parse(user.output).data.user.handle).toBe("openai")

    const bookmarks = runNoServer("clix bookmarks list --json", { env })
    expect(bookmarks.ok).toBe(true)
    expect(JSON.parse(bookmarks.output).data.tweets[0].text).toBe("bookmark item")
  })

  test("does not expose passthrough and reports dependencies as healthy", () => {
    const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "plugins", "clix", "plugin.json"), "utf-8"))
    expect(manifest.commands.some(command => command.resource === "_" && command.action === "_")).toBe(false)

    const doctor = runNoServer("plugins doctor clix --json", { env })
    expect(doctor.ok).toBe(true)
    const doctorData = JSON.parse(doctor.output)
    expect(doctorData.checks.some(c => c.type === "binary" && c.binary === "curl" && c.ok === true)).toBe(true)
    expect(doctorData.checks.some(c => c.type === "binary" && c.binary === "clix" && c.ok === true)).toBe(true)
  })

  test("removal cleans up the skills provider", () => {
    const remove = runNoServer("plugins remove clix --json", { env })
    expect(remove.ok).toBe(true)
    removed = true

    const provider = runNoServer("skills providers show --name clix --json", { env })
    expect(provider.ok).toBe(false)
  })
})
