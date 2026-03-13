const { removeProvider, syncCatalog } = require("../cli/skills-catalog")
const { run } = require("../plugins/cocoindex-code/scripts/post-uninstall")

jest.mock("../cli/skills-catalog")

describe("plugin-cocoindex-code post-uninstall", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    removeProvider.mockReturnValue(true)
    syncCatalog.mockReturnValue({ skills: [1] })
  })

  test("removes provider and keeps MCP cleanup manual", async () => {
    const result = await run()
    expect(removeProvider).toHaveBeenCalledWith("cocoindex-code")
    expect(result.removed_provider).toBe(true)
    expect(result.note).toContain("supercli mcp remove cocoindex-code")
  })
})
