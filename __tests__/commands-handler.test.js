"use strict"

const {
  handleCommandsQuery,
  handleInspect,
  handleSchema,
  handleNamespaceBrowse,
} = require("../cli/commands-handler")

// ── helpers ──────────────────────────────────────────────────────────────────

function makeIo(overrides = {}) {
  return {
    humanMode: false,
    output: jest.fn(),
    outputError: jest.fn(),
    outputHumanTable: jest.fn(),
    ...overrides,
  }
}

function makeConfig(commands = []) {
  return { commands }
}

function makeCmd(overrides = {}) {
  return {
    namespace: "ns",
    resource: "res",
    action: "act",
    description: "desc",
    adapter: "http",
    args: [],
    ...overrides,
  }
}

// ── handleCommandsQuery ───────────────────────────────────────────────────────

describe("handleCommandsQuery", () => {
  describe("guard: invalid config", () => {
    test("emits error code 110 when config is null", () => {
      const io = makeIo()
      handleCommandsQuery(null, {}, io)
      expect(io.outputError).toHaveBeenCalledWith(
        expect.objectContaining({ code: 110, type: "internal_error" })
      )
      expect(io.output).not.toHaveBeenCalled()
    })

    test("emits error code 110 when config.commands is missing", () => {
      const io = makeIo()
      handleCommandsQuery({}, {}, io)
      expect(io.outputError).toHaveBeenCalledWith(
        expect.objectContaining({ code: 110 })
      )
    })
  })

  describe("guard: invalid --limit", () => {
    test("rejects zero limit", () => {
      const io = makeIo()
      handleCommandsQuery(makeConfig(), { limit: 0 }, io)
      expect(io.outputError).toHaveBeenCalledWith(
        expect.objectContaining({ code: 85, type: "invalid_argument" })
      )
    })

    test("rejects negative limit", () => {
      const io = makeIo()
      handleCommandsQuery(makeConfig(), { limit: -5 }, io)
      expect(io.outputError).toHaveBeenCalledWith(
        expect.objectContaining({ code: 85 })
      )
    })

    test("rejects non-integer limit (float)", () => {
      const io = makeIo()
      handleCommandsQuery(makeConfig(), { limit: 2.5 }, io)
      expect(io.outputError).toHaveBeenCalledWith(
        expect.objectContaining({ code: 85 })
      )
    })

    test("rejects non-numeric limit string", () => {
      const io = makeIo()
      handleCommandsQuery(makeConfig(), { limit: "abc" }, io)
      expect(io.outputError).toHaveBeenCalledWith(
        expect.objectContaining({ code: 85 })
      )
    })

    test("accepts valid positive integer limit", () => {
      const io = makeIo()
      handleCommandsQuery(makeConfig([makeCmd()]), { limit: 5 }, io)
      expect(io.outputError).not.toHaveBeenCalled()
      expect(io.output).toHaveBeenCalled()
    })
  })

  describe("guard: invalid --offset", () => {
    test("rejects negative offset", () => {
      const io = makeIo()
      handleCommandsQuery(makeConfig(), { offset: -1 }, io)
      expect(io.outputError).toHaveBeenCalledWith(
        expect.objectContaining({ code: 85, type: "invalid_argument" })
      )
    })

    test("rejects float offset", () => {
      const io = makeIo()
      handleCommandsQuery(makeConfig(), { offset: 1.5 }, io)
      expect(io.outputError).toHaveBeenCalledWith(
        expect.objectContaining({ code: 85 })
      )
    })

    test("accepts zero offset", () => {
      const io = makeIo()
      handleCommandsQuery(makeConfig([makeCmd()]), { offset: 0 }, io)
      expect(io.outputError).not.toHaveBeenCalled()
    })

    test("accepts positive integer offset", () => {
      const io = makeIo()
      handleCommandsQuery(makeConfig([makeCmd()]), { offset: 1 }, io)
      expect(io.outputError).not.toHaveBeenCalled()
    })
  })

  describe("filtering", () => {
    const cmds = [
      makeCmd({ namespace: "git", resource: "repo", action: "clone", adapter: "shell", description: "clone a repo" }),
      makeCmd({ namespace: "git", resource: "repo", action: "push",  adapter: "shell", description: "push changes" }),
      makeCmd({ namespace: "k8s", resource: "pod",  action: "list",  adapter: "http",  description: "list pods" }),
    ]
    const config = makeConfig(cmds)

    test("no filters returns all commands", () => {
      const io = makeIo()
      handleCommandsQuery(config, { limit: 100 }, io)
      const result = io.output.mock.calls[0][0]
      expect(result.total).toBe(3)
    })

    test("--namespace filters by exact namespace (case-insensitive)", () => {
      const io = makeIo()
      handleCommandsQuery(config, { namespace: "GIT", limit: 100 }, io)
      const result = io.output.mock.calls[0][0]
      expect(result.total).toBe(2)
      result.commands.forEach((c) => expect(c.namespace).toBe("git"))
    })

    test("--resource filters by exact resource", () => {
      const io = makeIo()
      handleCommandsQuery(config, { resource: "pod", limit: 100 }, io)
      const result = io.output.mock.calls[0][0]
      expect(result.total).toBe(1)
      expect(result.commands[0].action).toBe("list")
    })

    test("--action filters by exact action", () => {
      const io = makeIo()
      handleCommandsQuery(config, { action: "clone", limit: 100 }, io)
      const result = io.output.mock.calls[0][0]
      expect(result.total).toBe(1)
    })

    test("--query filters by substring in command string", () => {
      const io = makeIo()
      handleCommandsQuery(config, { query: "push", limit: 100 }, io)
      const result = io.output.mock.calls[0][0]
      expect(result.total).toBe(1)
      expect(result.commands[0].action).toBe("push")
    })

    test("--query matches against description", () => {
      const io = makeIo()
      handleCommandsQuery(config, { query: "pods", limit: 100 }, io)
      const result = io.output.mock.calls[0][0]
      expect(result.total).toBe(1)
      expect(result.commands[0].namespace).toBe("k8s")
    })

    test("combined namespace + action filter narrows to one result", () => {
      const io = makeIo()
      handleCommandsQuery(config, { namespace: "git", action: "push", limit: 100 }, io)
      const result = io.output.mock.calls[0][0]
      expect(result.total).toBe(1)
    })

    test("filter with no match returns empty commands array", () => {
      const io = makeIo()
      handleCommandsQuery(config, { namespace: "does-not-exist", limit: 100 }, io)
      const result = io.output.mock.calls[0][0]
      expect(result.total).toBe(0)
      expect(result.commands).toEqual([])
    })
  })

  describe("pagination", () => {
    const manyCommands = Array.from({ length: 10 }, (_, i) =>
      makeCmd({ namespace: "ns", resource: "res", action: `act${i}` })
    )
    const config = makeConfig(manyCommands)

    test("applies explicit limit", () => {
      const io = makeIo()
      handleCommandsQuery(config, { limit: 3 }, io)
      const result = io.output.mock.calls[0][0]
      expect(result.returned).toBe(3)
      expect(result.commands).toHaveLength(3)
    })

    test("applies explicit offset", () => {
      const io = makeIo()
      handleCommandsQuery(config, { limit: 3, offset: 7 }, io)
      const result = io.output.mock.calls[0][0]
      expect(result.returned).toBe(3)
      expect(result.offset).toBe(7)
    })

    test("offset beyond total returns empty", () => {
      const io = makeIo()
      handleCommandsQuery(config, { limit: 5, offset: 20 }, io)
      const result = io.output.mock.calls[0][0]
      expect(result.returned).toBe(0)
    })

    test("auto-limit of 50 applied in non-human mode when limit not set", () => {
      const bigConfig = makeConfig(
        Array.from({ length: 60 }, (_, i) => makeCmd({ action: `act${i}` }))
      )
      const io = makeIo()
      handleCommandsQuery(bigConfig, {}, io)
      const result = io.output.mock.calls[0][0]
      expect(result.returned).toBe(50)
      expect(result._warning).toMatch(/--limit 50/)
    })

    test("no _warning when all results fit within auto-limit", () => {
      const io = makeIo()
      handleCommandsQuery(config, {}, io) // 10 cmds < 50
      const result = io.output.mock.calls[0][0]
      expect(result._warning).toBeUndefined()
    })

    test("filters object reflects applied filter values", () => {
      const io = makeIo()
      handleCommandsQuery(makeConfig([makeCmd()]), { namespace: "ns", limit: 10 }, io)
      const result = io.output.mock.calls[0][0]
      expect(result.filters.namespace).toBe("ns")
      expect(result.filters.limit).toBe(10)
    })
  })

  describe("human mode", () => {
    test("calls outputHumanTable instead of output", () => {
      const io = makeIo({ humanMode: true })
      handleCommandsQuery(makeConfig([makeCmd()]), {}, io)
      expect(io.outputHumanTable).toHaveBeenCalled()
      expect(io.output).not.toHaveBeenCalled()
    })

    test("no auto-limit in human mode", () => {
      const bigConfig = makeConfig(
        Array.from({ length: 60 }, (_, i) => makeCmd({ action: `act${i}` }))
      )
      const io = makeIo({ humanMode: true })
      const logSpy = jest.spyOn(console, "log").mockImplementation(() => {})
      handleCommandsQuery(bigConfig, {}, io)
      expect(io.outputHumanTable.mock.calls[0][0]).toHaveLength(60)
      logSpy.mockRestore()
    })
  })

  describe("args formatting", () => {
    test("required args are marked with * in output", () => {
      const cmd = makeCmd({
        args: [
          { name: "url", required: true },
          { name: "token", required: false },
        ],
      })
      const io = makeIo()
      handleCommandsQuery(makeConfig([cmd]), { limit: 10 }, io)
      const row = io.output.mock.calls[0][0].commands[0]
      expect(row.args).toContain("--url*")
      expect(row.args).toContain("--token")
      expect(row.args).not.toMatch(/--token\*/)
    })
  })

  describe("exception handling", () => {
    test("catches thrown errors and emits outputError code 110", () => {
      const io = makeIo()
      const badConfig = {
        get commands() { throw new Error("boom") },
      }
      handleCommandsQuery(badConfig, {}, io)
      expect(io.outputError).toHaveBeenCalledWith(
        expect.objectContaining({ code: 110, type: "internal_error" })
      )
    })
  })
})

// ── handleInspect ─────────────────────────────────────────────────────────────

describe("handleInspect", () => {
  const cmd = makeCmd({
    namespace: "git",
    resource: "repo",
    action: "clone",
    description: "clone a repo",
    adapter: "shell",
    adapterConfig: { cmd: "git clone" },
    mutation: true,
    risk_level: "medium",
    args: [
      { name: "url", type: "string", required: true },
      { name: "dir", type: "string", required: false },
    ],
  })
  const config = makeConfig([cmd])

  test("emits error code 85 when positional has fewer than 4 elements", () => {
    const io = makeIo()
    handleInspect(config, ["inspect", "git", "repo"], io)
    expect(io.outputError).toHaveBeenCalledWith(
      expect.objectContaining({ code: 85, type: "invalid_argument" })
    )
  })

  test("emits error code 92 when command not found", () => {
    const io = makeIo()
    handleInspect(config, ["inspect", "git", "repo", "push"], io)
    expect(io.outputError).toHaveBeenCalledWith(
      expect.objectContaining({ code: 92, type: "resource_not_found" })
    )
  })

  test("returns full spec in JSON mode", () => {
    const io = makeIo()
    handleInspect(config, ["inspect", "git", "repo", "clone"], io)
    expect(io.output).toHaveBeenCalled()
    const spec = io.output.mock.calls[0][0]
    expect(spec.version).toBe("1.0")
    expect(spec.command).toBe("git.repo.clone")
    expect(spec.namespace).toBe("git")
    expect(spec.resource).toBe("repo")
    expect(spec.action).toBe("clone")
    expect(spec.adapter).toBe("shell")
    expect(spec.side_effects).toBe(true)
    expect(spec.risk_level).toBe("medium")
  })

  test("input_schema required array contains required arg names", () => {
    const io = makeIo()
    handleInspect(config, ["inspect", "git", "repo", "clone"], io)
    const spec = io.output.mock.calls[0][0]
    expect(spec.input_schema.required).toEqual(["url"])
    expect(spec.input_schema.properties).toHaveProperty("url")
    expect(spec.input_schema.properties).toHaveProperty("dir")
  })

  test("side_effects is false when mutation is falsy", () => {
    const noMutCmd = makeCmd({ namespace: "git", resource: "repo", action: "clone" })
    const io = makeIo()
    handleInspect(makeConfig([noMutCmd]), ["inspect", "git", "repo", "clone"], io)
    expect(io.output.mock.calls[0][0].side_effects).toBe(false)
  })

  test("risk_level defaults to 'safe' when not set", () => {
    const safeCmd = makeCmd({ namespace: "git", resource: "repo", action: "clone" })
    const io = makeIo()
    handleInspect(makeConfig([safeCmd]), ["inspect", "git", "repo", "clone"], io)
    expect(io.output.mock.calls[0][0].risk_level).toBe("safe")
  })

  test("human mode calls console.log and does NOT call output", () => {
    const io = makeIo({ humanMode: true })
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {})
    handleInspect(config, ["inspect", "git", "repo", "clone"], io)
    expect(logSpy).toHaveBeenCalled()
    expect(io.output).not.toHaveBeenCalled()
    logSpy.mockRestore()
  })
})

// ── handleSchema ──────────────────────────────────────────────────────────────

describe("handleSchema", () => {
  test("returns version 1.0 schema object", () => {
    const io = makeIo()
    const cmd = makeCmd({
      args: [{ name: "url", type: "string", required: true }],
      output: { type: "array" },
    })
    handleSchema(cmd, ["git", "repo", "clone"], io)
    const schema = io.output.mock.calls[0][0]
    expect(schema.version).toBe("1.0")
    expect(schema.command).toBe("git.repo.clone")
  })

  test("input_schema.properties maps arg names to types", () => {
    const io = makeIo()
    const cmd = makeCmd({
      args: [
        { name: "url", type: "string", required: true },
        { name: "depth", type: "number", required: false },
      ],
    })
    handleSchema(cmd, ["ns", "res", "act"], io)
    const { input_schema } = io.output.mock.calls[0][0]
    expect(input_schema.properties.url).toEqual({ type: "string" })
    expect(input_schema.properties.depth).toEqual({ type: "number" })
  })

  test("input_schema.required lists only required args", () => {
    const io = makeIo()
    const cmd = makeCmd({
      args: [
        { name: "url", type: "string", required: true },
        { name: "depth", type: "number", required: false },
      ],
    })
    handleSchema(cmd, ["ns", "res", "act"], io)
    expect(io.output.mock.calls[0][0].input_schema.required).toEqual(["url"])
  })

  test("args default to type 'string' when not specified", () => {
    const io = makeIo()
    const cmd = makeCmd({ args: [{ name: "x" }] })
    handleSchema(cmd, ["ns", "res", "act"], io)
    expect(io.output.mock.calls[0][0].input_schema.properties.x).toEqual({ type: "string" })
  })

  test("output_schema defaults to { type: 'object' } when cmd.output is missing", () => {
    const io = makeIo()
    const cmd = makeCmd()
    handleSchema(cmd, ["ns", "res", "act"], io)
    expect(io.output.mock.calls[0][0].output_schema).toEqual({ type: "object" })
  })

  test("uses cmd.output when provided", () => {
    const io = makeIo()
    const cmd = makeCmd({ output: { type: "array", items: { type: "string" } } })
    handleSchema(cmd, ["ns", "res", "act"], io)
    expect(io.output.mock.calls[0][0].output_schema).toEqual({ type: "array", items: { type: "string" } })
  })

  test("handles cmd with no args (empty input_schema)", () => {
    const io = makeIo()
    const cmd = makeCmd({ args: [] })
    handleSchema(cmd, ["ns", "res", "act"], io)
    const { input_schema } = io.output.mock.calls[0][0]
    expect(input_schema.properties).toEqual({})
    expect(input_schema.required).toEqual([])
  })
})

// ── handleNamespaceBrowse ─────────────────────────────────────────────────────

describe("handleNamespaceBrowse", () => {
  const cmds = [
    makeCmd({ namespace: "git", resource: "repo", action: "clone" }),
    makeCmd({ namespace: "git", resource: "repo", action: "push" }),
    makeCmd({ namespace: "git", resource: "tag",  action: "list" }),
    makeCmd({ namespace: "k8s", resource: "pod",  action: "get" }),
  ]
  const config = makeConfig(cmds)

  describe("positional length === 1 (namespace browse)", () => {
    test("returns unique resources for a known namespace", () => {
      const io = makeIo()
      handleNamespaceBrowse(config, ["git"], io)
      const result = io.output.mock.calls[0][0]
      expect(result.namespace).toBe("git")
      expect(result.resources).toEqual(expect.arrayContaining(["repo", "tag"]))
      expect(result.resources).toHaveLength(2)
    })

    test("emits error code 92 for unknown namespace", () => {
      const io = makeIo()
      handleNamespaceBrowse(config, ["unknown"], io)
      expect(io.outputError).toHaveBeenCalledWith(
        expect.objectContaining({ code: 92, type: "resource_not_found" })
      )
    })

    test("human mode logs to console and does NOT call output", () => {
      const io = makeIo({ humanMode: true })
      const logSpy = jest.spyOn(console, "log").mockImplementation(() => {})
      handleNamespaceBrowse(config, ["git"], io)
      expect(logSpy).toHaveBeenCalled()
      expect(io.output).not.toHaveBeenCalled()
      logSpy.mockRestore()
    })
  })

  describe("positional length === 2 (resource browse)", () => {
    test("returns actions for a known namespace.resource", () => {
      const io = makeIo()
      handleNamespaceBrowse(config, ["git", "repo"], io)
      const result = io.output.mock.calls[0][0]
      expect(result.namespace).toBe("git")
      expect(result.resource).toBe("repo")
      expect(result.actions).toEqual(expect.arrayContaining(["clone", "push"]))
    })

    test("emits error code 92 for unknown resource", () => {
      const io = makeIo()
      handleNamespaceBrowse(config, ["git", "notaresource"], io)
      expect(io.outputError).toHaveBeenCalledWith(
        expect.objectContaining({ code: 92, type: "resource_not_found" })
      )
    })

    test("human mode logs to console and does NOT call output", () => {
      const io = makeIo({ humanMode: true })
      const logSpy = jest.spyOn(console, "log").mockImplementation(() => {})
      handleNamespaceBrowse(config, ["git", "repo"], io)
      expect(logSpy).toHaveBeenCalled()
      expect(io.output).not.toHaveBeenCalled()
      logSpy.mockRestore()
    })

    test("error suggestion references namespace when resource not found", () => {
      const io = makeIo()
      handleNamespaceBrowse(config, ["git", "notaresource"], io)
      const err = io.outputError.mock.calls[0][0]
      expect(err.suggestions[0]).toContain("git")
    })
  })
})
