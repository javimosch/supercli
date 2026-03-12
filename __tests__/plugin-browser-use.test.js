const { addProvider, syncCatalog } = require("../cli/skills-catalog")
const { setMcpServer, listMcpServers, upsertCommand } = require("../cli/config")
const { discoverMcpTools } = require("../cli/mcp-discovery")
const {
  run,
  actionFromToolName,
  buildToolCommand,
  KNOWN_TOOLS,
} = require("../plugins/browser-use/scripts/post-install")

jest.mock("../cli/skills-catalog")
jest.mock("../cli/config")
jest.mock("../cli/mcp-discovery")

describe("plugin-browser-use", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    listMcpServers.mockResolvedValue([])
    setMcpServer.mockResolvedValue({})
    upsertCommand.mockResolvedValue({})
    syncCatalog.mockReturnValue({ skills: [1, 2, 3] })
  })

  test("actionFromToolName normalizes name", () => {
    expect(actionFromToolName("list_skills")).toBe("list-skills")
    expect(actionFromToolName("Browser Task")).toBe("browser-task")
  })

  test("buildToolCommand builds MCP command", () => {
    const cmd = buildToolCommand("list_skills")
    expect(cmd.namespace).toBe("browseruse")
    expect(cmd.resource).toBe("tool")
    expect(cmd.action).toBe("list-skills")
    expect(cmd.adapter).toBe("mcp")
    expect(cmd.adapterConfig.tool).toBe("list_skills")
  })

  test("run registers server, binds discovered tools, and adds local skill provider", async () => {
    discoverMcpTools.mockResolvedValue([
      { name: "list_skills" },
      { name: "browser_task" },
    ])

    const result = await run()

    expect(setMcpServer).toHaveBeenCalledWith("browser-use", expect.objectContaining({ command: "npx" }))
    expect(upsertCommand).toHaveBeenCalledTimes(2)
    expect(addProvider).toHaveBeenCalledWith(expect.objectContaining({
      name: "browser-use",
      type: "local_fs",
      roots: expect.any(Array),
    }))
    expect(result.discovered_tools).toBe(2)
    expect(result.bound_commands).toBe(2)
  })

  test("run uses fallback tools when discovery fails", async () => {
    discoverMcpTools.mockRejectedValue(new Error("network"))

    const result = await run()

    expect(result.discovered_tools).toBe(KNOWN_TOOLS.length)
    expect(result.bound_commands).toBe(KNOWN_TOOLS.length)
    expect(result.warnings.length).toBeGreaterThan(0)
    expect(upsertCommand).toHaveBeenCalledTimes(KNOWN_TOOLS.length)
  })

  test("run does not overwrite existing MCP server", async () => {
    listMcpServers.mockResolvedValue([{ name: "browser-use", command: "npx", args: ["x"] }])
    discoverMcpTools.mockResolvedValue([{ name: "list_skills" }])

    const result = await run()

    expect(setMcpServer).not.toHaveBeenCalled()
    expect(result.server_created).toBe(false)
  })
})
