const { addProvider, syncCatalog } = require("../cli/skills-catalog")
const { setMcpServer, listMcpServers } = require("../cli/config")
const { run, DEFAULT_SERVER } = require("../plugins/cocoindex-code/scripts/post-install")

jest.mock("../cli/skills-catalog")
jest.mock("../cli/config")

describe("plugin-cocoindex-code", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    listMcpServers.mockResolvedValue([])
    setMcpServer.mockResolvedValue({})
    syncCatalog.mockReturnValue({ skills: [1, 2, 3] })
  })

  test("run registers MCP server and adds local skill provider", async () => {
    const result = await run()

    expect(setMcpServer).toHaveBeenCalledWith("cocoindex-code", DEFAULT_SERVER)
    expect(addProvider).toHaveBeenCalledWith(expect.objectContaining({
      name: "cocoindex-code",
      type: "local_fs",
      roots: expect.any(Array),
    }))
    expect(result.server_created).toBe(true)
    expect(result.bound_capabilities).toEqual(["cocoindex.code.search", "cocoindex.index.build"])
  })

  test("run does not overwrite existing MCP server", async () => {
    listMcpServers.mockResolvedValue([{ name: "cocoindex-code", command: "cocoindex-code" }])

    const result = await run()

    expect(setMcpServer).not.toHaveBeenCalled()
    expect(result.server_created).toBe(false)
  })
})
