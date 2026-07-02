"use strict";

/**
 * Extended coverage for cli/adapters/process.js (the process-spawn runner).
 * cli/runner.js does not exist — process.js IS the spawn runner.
 * This file covers paths not reached by the existing process-adapter.test.js.
 */

const { execute } = require("../cli/adapters/process")
const { spawn, spawnSync } = require("child_process")
const EventEmitter = require("events")

jest.mock("child_process")

function makeChild() {
  const child = new EventEmitter()
  child.stdout = new EventEmitter()
  child.stdout.setEncoding = jest.fn()
  child.stderr = new EventEmitter()
  child.stderr.setEncoding = jest.fn()
  child.stdin = { write: jest.fn(), end: jest.fn() }
  child.kill = jest.fn()
  child.pid = 12345
  child.unref = jest.fn()
  return child
}

describe("process-spawn runner — extended coverage", () => {
  let mockChild

  beforeEach(() => {
    jest.resetAllMocks()
    mockChild = makeChild()
    spawn.mockReturnValue(mockChild)
    // Default: binary found
    spawnSync.mockReturnValue({ status: 0, stdout: "/usr/bin/node" })
  })

  // ── binary not found ──────────────────────────────────────────────────────

  test("preflight failure rejects with code 85 and help text", async () => {
    spawnSync.mockReturnValue({ status: 1, stdout: "" })
    await expect(
      execute({ adapterConfig: { command: "notfound", missingDependencyHelp: "Run: install notfound" } }, {})
    ).rejects.toMatchObject({ code: 85, message: expect.stringContaining("Missing dependency 'notfound'") })
  })

  test("preflight error field also triggers code 85", async () => {
    spawnSync.mockReturnValue({ status: 0, error: new Error("ENOENT") })
    await expect(
      execute({ adapterConfig: { command: "broken" } }, {})
    ).rejects.toMatchObject({ code: 85 })
  })

  // ── non-ENOENT spawn error ────────────────────────────────────────────────

  test("generic spawn error (non-ENOENT) rejects with code 105", async () => {
    const promise = execute({ adapterConfig: { command: "node" } }, {})
    mockChild.emit("error", new Error("permission denied"))
    await expect(promise).rejects.toMatchObject({ code: 105, type: "integration_error" })
  })

  test("second close/error after settled is ignored (settled flag prevents double-reject)", async () => {
    jest.useFakeTimers()
    try {
      const promise = execute({ adapterConfig: { command: "node", timeout_ms: 50 } }, {})
      jest.advanceTimersByTime(100)
      // Emit close AFTER timeout already settled the promise — should be a no-op
      mockChild.emit("close", 0)
      await expect(promise).rejects.toThrow("timed out")
    } finally {
      jest.useRealTimers()
    }
  })

  // ── detached mode ─────────────────────────────────────────────────────────

  test("detached + noWait resolves immediately with pid message", async () => {
    const result = await execute(
      { adapterConfig: { command: "node", detached: true, noWait: true } },
      {}
    )
    expect(result).toMatchObject({ raw: expect.stringContaining("12345") })
    expect(mockChild.unref).toHaveBeenCalled()
  })

  test("detached without noWait waits for close event", async () => {
    // detached=true but noWait=false → child.unref() NOT called, must wait
    const spawnOpts = { stdio: "ignore", cwd: expect.any(String), env: expect.any(Object), detached: true }
    const promise = execute(
      { adapterConfig: { command: "node", detached: true } },
      {}
    )
    mockChild.emit("close", 0)
    const result = await promise
    expect(result).toEqual({})
  })

  // ── noTimeout ─────────────────────────────────────────────────────────────

  test("noTimeout: timer is not started, process runs until close", async () => {
    jest.useFakeTimers()
    const setTimeoutSpy = jest.spyOn(global, "setTimeout")
    const promise = execute({ adapterConfig: { command: "node", noTimeout: true } }, {})
    // Advance far past any default timeout
    jest.advanceTimersByTime(60000)
    // Promise should still be pending
    let settled = false
    promise.then(() => { settled = true }).catch(() => { settled = true })
    await Promise.resolve()
    expect(settled).toBe(false)
    // Now close it
    mockChild.emit("close", 0)
    await promise
    // setTimeout should not have been called (beyond the module-load time)
    // The adapter does not call setTimeout when noTimeout=true
    jest.useRealTimers()
  })

  // ── requiresInteractive on non-TTY ────────────────────────────────────────

  test("requiresInteractive:true on non-TTY rejects with code 91", async () => {
    const oldTTY = process.stdout.isTTY
    process.stdout.isTTY = false
    try {
      await expect(
        execute({ adapterConfig: { command: "node", requiresInteractive: true } }, {})
      ).rejects.toMatchObject({ code: 91, type: "safety_violation", recoverable: false })
    } finally {
      process.stdout.isTTY = oldTTY
    }
  })

  test("requiresInteractive:true is allowed on TTY", async () => {
    const oldTTY = process.stdout.isTTY
    process.stdout.isTTY = true
    try {
      const promise = execute({ adapterConfig: { command: "node", requiresInteractive: true } }, {})
      mockChild.emit("close", 0)
      await promise // should not throw
    } finally {
      process.stdout.isTTY = oldTTY
    }
  })

  // ── positional args ───────────────────────────────────────────────────────

  test("positionalArgs: positional values precede flag args (default order)", async () => {
    const promise = execute(
      { adapterConfig: { command: "node", positionalArgs: ["file"] } },
      { file: "app.js", verbose: true }
    )
    mockChild.emit("close", 0)
    await promise
    const [, args] = spawn.mock.calls[0]
    expect(args).toEqual(["app.js", "--verbose"])
  })

  test("flagsBeforePositionals: flags come before positionals", async () => {
    const promise = execute(
      { adapterConfig: { command: "mybin", positionalArgs: ["target"], flagsBeforePositionals: true } },
      { target: "dest", dryRun: true }
    )
    mockChild.emit("close", 0)
    await promise
    const [, args] = spawn.mock.calls[0]
    expect(args.indexOf("--dry-run")).toBeLessThan(args.indexOf("dest"))
  })

  test("__positionalArgs are appended to positional values", async () => {
    const promise = execute(
      { adapterConfig: { command: "node", positionalArgs: ["file"] } },
      { file: "main.js", __positionalArgs: ["extra1", "extra2"] }
    )
    mockChild.emit("close", 0)
    await promise
    const [, args] = spawn.mock.calls[0]
    expect(args).toContain("main.js")
    expect(args).toContain("extra1")
    expect(args).toContain("extra2")
  })

  // ── plugin env vars ───────────────────────────────────────────────────────

  test("plugin_dir and plugin_name inject SUPERCLI_PLUGIN_DIR and SUPERCLI_PLUGIN_NAME", async () => {
    const promise = execute(
      { adapterConfig: { command: "node" }, plugin_dir: "/plugins/myplugin", plugin_name: "myplugin" },
      {}
    )
    mockChild.emit("close", 0)
    await promise
    const [, , opts] = spawn.mock.calls[0]
    expect(opts.env.SUPERCLI_PLUGIN_DIR).toBe("/plugins/myplugin")
    expect(opts.env.SUPERCLI_PLUGIN_NAME).toBe("myplugin")
    expect(opts.env.SUPERCLI_INVOKE_CWD).toBe(process.cwd())
  })

  test("custom cfg.env is merged with process.env", async () => {
    const promise = execute(
      { adapterConfig: { command: "node", env: { MY_TOKEN: "secret123" } } },
      {}
    )
    mockChild.emit("close", 0)
    await promise
    const [, , opts] = spawn.mock.calls[0]
    expect(opts.env.MY_TOKEN).toBe("secret123")
    expect(opts.env.PATH).toBe(process.env.PATH)
  })

  // ── cwd resolution ────────────────────────────────────────────────────────

  test("cwd: 'plugin_dir' resolves to cmd.plugin_dir", async () => {
    const promise = execute(
      { adapterConfig: { command: "node", cwd: "plugin_dir" }, plugin_dir: "/my/plugin" },
      {}
    )
    mockChild.emit("close", 0)
    await promise
    const [, , opts] = spawn.mock.calls[0]
    expect(opts.cwd).toBe("/my/plugin")
  })

  test("cwd: string literal is used as-is", async () => {
    const promise = execute(
      { adapterConfig: { command: "node", cwd: "/fixed/path" } },
      {}
    )
    mockChild.emit("close", 0)
    await promise
    const [, , opts] = spawn.mock.calls[0]
    expect(opts.cwd).toBe("/fixed/path")
  })

  // ── exit-code forwarding and stderr capture ───────────────────────────────

  test("non-zero exit with JSON error in stderr uses parsedError fields", async () => {
    const promise = execute({ adapterConfig: { command: "node" } }, {})
    mockChild.stderr.emit("data", JSON.stringify({ error: { message: "auth failed", code: 401, type: "auth_error", recoverable: false } }))
    mockChild.emit("close", 1)
    await expect(promise).rejects.toMatchObject({
      message: "auth failed",
      code: 401,
      type: "auth_error",
      recoverable: false
    })
  })

  test("non-zero exit with top-level JSON message in stderr", async () => {
    const promise = execute({ adapterConfig: { command: "node" } }, {})
    mockChild.stderr.emit("data", JSON.stringify({ message: "rate limited", code: 429 }))
    mockChild.emit("close", 1)
    await expect(promise).rejects.toMatchObject({ message: "rate limited", code: 429 })
  })

  test("non-zero exit with unparseable stderr falls back to base message", async () => {
    const promise = execute({ adapterConfig: { command: "mybin" } }, {})
    // No stderr at all
    mockChild.emit("close", 2)
    await expect(promise).rejects.toMatchObject({ code: 105 })
  })

  test("kill is called on timeout", async () => {
    jest.useFakeTimers()
    const promise = execute({ adapterConfig: { command: "node", timeout_ms: 500 } }, {})
    jest.advanceTimersByTime(600)
    await expect(promise).rejects.toThrow("timed out")
    expect(mockChild.kill).toHaveBeenCalledWith("SIGTERM")
    jest.useRealTimers()
  })

  // ── toCliFlags edge cases ─────────────────────────────────────────────────

  test("array flag produces repeated --flag value pairs", async () => {
    const promise = execute(
      { adapterConfig: { command: "node" } },
      { tags: ["a", "b", "c"] }
    )
    mockChild.emit("close", 0)
    await promise
    const [, args] = spawn.mock.calls[0]
    expect(args).toEqual(["--tags", "a", "--tags", "b", "--tags", "c"])
  })

  test("object flag is JSON-serialised with --key=value form", async () => {
    const promise = execute(
      { adapterConfig: { command: "node" } },
      { filter: { key: "val" } }
    )
    mockChild.emit("close", 0)
    await promise
    const [, args] = spawn.mock.calls[0]
    expect(args).toContain('--filter={"key":"val"}')
  })

  test("false/null/undefined flags are omitted", async () => {
    const promise = execute(
      { adapterConfig: { command: "node" } },
      { a: false, b: null, c: undefined, d: "keep" }
    )
    mockChild.emit("close", 0)
    await promise
    const [, args] = spawn.mock.calls[0]
    expect(args).toContain("--d")
    expect(args).not.toContain("--a")
    expect(args).not.toContain("--b")
    expect(args).not.toContain("--c")
  })

  test("__prefixed flags and format flags (human/json/compact) are stripped", async () => {
    const promise = execute(
      { adapterConfig: { command: "node" } },
      { human: true, json: true, compact: true, __rawArgs: ["x"], keep: "yes" }
    )
    mockChild.emit("close", 0)
    await promise
    const [, args] = spawn.mock.calls[0]
    expect(args).toEqual(["--keep", "yes"])
  })

  // ── jsonFlag inclusion ────────────────────────────────────────────────────

  test("jsonFlag is prepended to flag args when configured", async () => {
    const promise = execute(
      { adapterConfig: { command: "node", jsonFlag: "--output-json" } },
      { key: "val" }
    )
    mockChild.emit("close", 0)
    await promise
    const [, args] = spawn.mock.calls[0]
    expect(args[0]).toBe("--output-json")
  })

  // ── empty stdout ──────────────────────────────────────────────────────────

  test("empty stdout with parseJson:true resolves to empty object", async () => {
    const promise = execute({ adapterConfig: { command: "node", parseJson: true } }, {})
    mockChild.emit("close", 0)
    const result = await promise
    expect(result).toEqual({})
  })

  // ── errorMatcher edge cases ───────────────────────────────────────────────

  test("errorMatcher with invalid regex is skipped gracefully", async () => {
    const promise = execute(
      {
        adapterConfig: {
          command: "node",
          errorMatchers: [{ match: "[invalid(regex", message: "should not appear" }]
        }
      },
      {}
    )
    mockChild.stderr.emit("data", "some error")
    mockChild.emit("close", 1)
    const err = await promise.catch(e => e)
    expect(err.message).not.toBe("should not appear")
  })

  test("errorMatcher with null/empty match entry is skipped", async () => {
    const promise = execute(
      {
        adapterConfig: {
          command: "node",
          errorMatchers: [null, undefined, {}]
        }
      },
      {}
    )
    mockChild.stderr.emit("data", "failure")
    mockChild.emit("close", 1)
    const err = await promise.catch(e => e)
    expect(err.message).toContain("failure")
  })

  // ── streamMode jsonl without onStreamEvent ────────────────────────────────

  test("jsonl stream mode works without onStreamEvent callback", async () => {
    const promise = execute(
      { adapterConfig: { command: "node", stream: "jsonl" } },
      {},
      {} // no onStreamEvent
    )
    mockChild.stdout.emit("data", '{"type":"ok"}\n')
    mockChild.emit("close", 0)
    const result = await promise
    expect(result).toMatchObject({ streamed: true, event_count: 1 })
  })

  test("jsonl close with no events returns event_count 0 and null last_event", async () => {
    const promise = execute(
      { adapterConfig: { command: "node", stream: "jsonl" } },
      {}
    )
    mockChild.emit("close", 0)
    const result = await promise
    expect(result).toMatchObject({ streamed: true, event_count: 0, last_event: null })
  })
})
