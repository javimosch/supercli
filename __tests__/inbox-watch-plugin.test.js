const fs = require("fs")
const path = require("path")
const { runNoServer, makePluginEnv, withInstalledPlugin } = require("./helpers/plugin-test-env")

// The real tool follows cli-output-spec: versioned JSON on stdout, typed errors
// on stderr, and a semantic exit code -- 10 meaning "new items", which is a
// SUCCESS signal a cron acts on, not a failure. The fake reproduces that shape.
function writeFakeInboxWatchBinary(dir) {
  const bin = path.join(dir, "inbox-watch")
  fs.writeFileSync(bin, [
    "#!/usr/bin/env node",
    "const args = process.argv.slice(2);",
    "if (args[0] === 'help-json') {",
    "  console.log(JSON.stringify({ version: '1.0.0', output: 'json', interactive: false,",
    "    commands: { 'help-json': { args: [] } },",
    "    exit_codes: { '0': 'success — nothing new', '10': 'success — new items found (the cron signal)' },",
    "    env: ['INBOX_TOKEN'] })); process.exit(0);",
    "}",
    "if (args[0] === 'guide') {",
    "  console.log(JSON.stringify({ version: '1.0.0', summary: 'tells you only when a human replied',",
    "    gotchas: ['The cursor is consumed on read: use --peek to diagnose.'] })); process.exit(0);",
    "}",
    "// --peek reports WITHOUT consuming; a bare run consumes and exits 10 when new.",
    "const peek = args.includes('--peek');",
    "const exitZero = args.includes('--exit-zero');",
    "const item = { channel: 'mailbox', kind: 'reply', from: 'someone@example.com', title: 'Re: hello', url: '' };",
    "console.log(JSON.stringify({ ok: true, version: '1.0.0', new: [item], count: 1,",
    "  disabled: [{ channel: 'resend', reason: 'set RESEND_API_KEY', recoverable: true }] }));",
    "process.exit(exitZero ? 0 : 10);"
  ].join("\n"), "utf-8")
  fs.chmodSync(bin, 0o755)
  return bin
}

describe("inbox-watch plugin", () => {
  const ctx = makePluginEnv("inbox-watch")
  writeFakeInboxWatchBinary(ctx.fakeDir)
  withInstalledPlugin(ctx)

  test("exposes the cli-output-spec command catalog", () => {
    const r = runNoServer("inbox-watch self help-json --json", { env: ctx.env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.command).toBe("inbox-watch.self.help-json")
    expect(data.data.version).toBe("1.0.0")
    // exit code 10 must be documented as a success signal, not an error
    expect(data.data.exit_codes["10"]).toMatch(/success/)
  })

  test("routes the embedded guide", () => {
    const r = runNoServer("inbox-watch self guide --json", { env: ctx.env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.command).toBe("inbox-watch.self.guide")
    expect(data.data.gotchas.join(" ")).toMatch(/--peek/)
  })

  test("returns the versioned envelope with classified items", () => {
    const r = runNoServer("inbox-watch inbox check --json", { env: ctx.env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.command).toBe("inbox-watch.inbox.check")
    expect(data.data.ok).toBe(true)
    expect(data.data.new[0].kind).toBe("reply")
    // a disabled channel is structured context, not prose
    expect(data.data.disabled[0]).toHaveProperty("recoverable")
  })

  test("exit 10 (new items) is a SUCCESS, not a failure", () => {
    // supercli's process adapter treats any non-zero exit as failure, and
    // inbox-watch exits 10 when mail arrived -- so routed naively, the single
    // most important case would surface as an error. The plugin normalises it.
    const r = runNoServer("inbox-watch inbox check --json", { env: ctx.env })
    expect(r.ok).toBe(true)
    expect(JSON.parse(r.output).data.count).toBe(1)
  })

  test("peek is a distinct command from check", () => {
    // They are separate on purpose: the destructive one must never be the one
    // reached for while debugging, since a normal run consumes the cursor and
    // eats the alert the cron would have sent.
    const r = runNoServer("inbox-watch inbox peek --json", { env: ctx.env })
    expect(r.ok).toBe(true)
    expect(JSON.parse(r.output).command).toBe("inbox-watch.inbox.peek")
  })
})
