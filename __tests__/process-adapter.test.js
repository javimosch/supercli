const { execute } = require("../cli/adapters/process")
const { spawn, spawnSync } = require("child_process")
const EventEmitter = require("events")
const os = require("os")

jest.mock("child_process")

describe("process adapter", () => {
  let mockChild

  beforeEach(() => {
    jest.clearAllMocks()
    mockChild = new EventEmitter()
    mockChild.stdout = new EventEmitter()
    mockChild.stdout.setEncoding = jest.fn()
    mockChild.stderr = new EventEmitter()
    mockChild.stderr.setEncoding = jest.fn()
    mockChild.stdin = { write: jest.fn(), end: jest.fn() }
    mockChild.kill = jest.fn()
    spawn.mockReturnValue(mockChild)
    spawnSync.mockReturnValue({ status: 0, stdout: "/bin/node" })
  })

  test("detectInteractiveFlags coverage (short flags, long flag with equals)", async () => {
    const oldTTY = process.stdout.isTTY
    process.stdout.isTTY = false
    try {
      await expect(execute({
        adapterConfig: { 
          command: "node", 
          passthrough: true,
          interactiveFlags: ["--tty", "-i", "-t"] 
        },
      }, { __rawArgs: ["--tty=true", "-it"] })).rejects.toMatchObject({ code: 91 })
    } finally {
      process.stdout.isTTY = oldTTY
    }
  })

  test("throws if command missing", async () => {
    await expect(execute({ adapterConfig: {} }, {})).rejects.toThrow(/requires adapterConfig.command/)
  })

  test("successfully executes command and parses JSON", async () => {
    const promise = execute({
      adapterConfig: { command: "node", baseArgs: ["-e", "ok"], parseJson: true }
    }, { foo: "bar" })

    mockChild.stdout.emit("data", '{"result": true}')
    mockChild.emit("close", 0)

    const result = await promise
    expect(result).toEqual({ result: true })
  })

  test("handles spawn error ENOENT", async () => {
    const promise = execute({ adapterConfig: { command: "node" } }, {})
    mockChild.emit("error", { code: "ENOENT" })
    await expect(promise).rejects.toMatchObject({ code: 85 })
  })

  test("handles timeout", async () => {
    jest.useFakeTimers()
    const promise = execute({ adapterConfig: { command: "node", timeout_ms: 100 } }, {})
    jest.advanceTimersByTime(200)
    await expect(promise).rejects.toThrow("timed out")
    jest.useRealTimers()
  })

  test("handles non-zero exit", async () => {
    const promise = execute({ adapterConfig: { command: "node" } }, {})
    mockChild.stderr.emit("data", "error")
    mockChild.emit("close", 1)
    await expect(promise).rejects.toThrow("error")
  })

  test("rewrites matched integration errors with friendlier guidance", async () => {
    const promise = execute({
      adapterConfig: {
        command: "node",
        errorMatchers: [
          {
            match: "No provider configured",
            message: "Goose is installed but not configured with a provider. Escalate to a human to run `goose configure`.",
            suggestions: [
              "Ask a human to run `goose configure` and set a provider.",
              "Retry after Goose provider setup is complete."
            ],
            recoverable: true
          }
        ]
      }
    }, {})
    mockChild.stderr.emit("data", JSON.stringify({ error: { message: "No provider configured. Run 'goose configure' first" } }))
    mockChild.emit("close", 1)
    await expect(promise).rejects.toMatchObject({
      message: "Goose is installed but not configured with a provider. Escalate to a human to run `goose configure`.",
      suggestions: [
        "Ask a human to run `goose configure` and set a provider.",
        "Retry after Goose provider setup is complete."
      ],
      recoverable: true
    })
  })
  
  test("handles passthroughInteractive", async () => {
    const promise = execute({
      adapterConfig: { command: "node", passthrough: true }
    }, { __passthroughInteractive: true })
    mockChild.emit("close", 0)
    const result = await promise
    expect(result.passthrough).toBe(true)
  })

  test("includes nonTtyBaseArgs", async () => {
    const oldTTY = process.stdout.isTTY
    process.stdout.isTTY = false
    try {
      const promise = execute({
        adapterConfig: { command: "node", nonTtyBaseArgs: ["--no-tty"] }
      }, {})
      mockChild.emit("close", 0)
      await promise
      expect(spawn).toHaveBeenCalledWith("node", ["--no-tty"], expect.anything())
    } finally {
      process.stdout.isTTY = oldTTY
    }
  })

  test("handles JSON parse error", async () => {
    const promise = execute({ adapterConfig: { command: "node", parseJson: true } }, {})
    mockChild.stdout.emit("data", "invalid")
    mockChild.emit("close", 0)
    const result = await promise
    expect(result.raw).toBe("invalid")
  })

  test("handles parseJson false", async () => {
    const promise = execute({ adapterConfig: { command: "node", parseJson: false } }, {})
    mockChild.stdout.emit("data", "text")
    mockChild.emit("close", 0)
    const result = await promise
    expect(result.raw).toBe("text")
  })

  test("uses invoke cwd when configured", async () => {
    const promise = execute({
      adapterConfig: { command: "node", cwd: "invoke_cwd" },
      plugin_dir: "/tmp/plugin-dir"
    }, {})
    mockChild.emit("close", 0)
    await promise
    expect(spawn).toHaveBeenCalledWith("node", [], expect.objectContaining({ cwd: process.cwd() }))
  })

  test("defaults cwd to plugin dir when not configured", async () => {
    const promise = execute({
      adapterConfig: { command: "node" },
      plugin_dir: "/tmp/plugin-dir"
    }, {})
    mockChild.emit("close", 0)
    await promise
    expect(spawn).toHaveBeenCalledWith("node", [], expect.objectContaining({ cwd: "/tmp/plugin-dir" }))
  })

  test("streams jsonl events incrementally", async () => {
    const onStreamEvent = jest.fn()
    const promise = execute({ adapterConfig: { command: "node", stream: "jsonl" } }, {}, { onStreamEvent })
    mockChild.stdout.emit("data", '{"type":"say","text":"one"}\n{"type":"say"')
    mockChild.stdout.emit("data", ',"text":"two"}\n')
    mockChild.emit("close", 0)
    const result = await promise
    expect(onStreamEvent).toHaveBeenCalledTimes(2)
    expect(onStreamEvent.mock.calls[0][0]).toEqual({ type: "say", text: "one" })
    expect(result).toEqual({
      streamed: true,
      stream: "jsonl",
      event_count: 2,
      last_event: { type: "say", text: "two" }
    })
  })

  test("flushes trailing jsonl line without newline", async () => {
    const onStreamEvent = jest.fn()
    const promise = execute({ adapterConfig: { command: "node", stream: "jsonl" } }, {}, { onStreamEvent })
    mockChild.stdout.emit("data", '{"type":"task_started","taskId":"123"}')
    mockChild.emit("close", 0)
    const result = await promise
    expect(onStreamEvent).toHaveBeenCalledWith({ type: "task_started", taskId: "123" })
    expect(result.event_count).toBe(1)
  })
})
