const { removeProvider, syncCatalog } = require("../cli/skills-catalog")
const { removeCommandsByNamespace } = require("../cli/config")
const { run } = require("../plugins/browser-use/scripts/post-uninstall")

jest.mock("../cli/skills-catalog")
jest.mock("../cli/config")

describe("plugin-browser-use post-uninstall", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    removeProvider.mockReturnValue(true)
    removeCommandsByNamespace.mockResolvedValue(6)
    syncCatalog.mockReturnValue({ skills: [1, 2] })
  })

  test("removes provider and browseruse commands", async () => {
    const result = await run()
    expect(removeCommandsByNamespace).toHaveBeenCalledWith("browseruse")
    expect(removeProvider).toHaveBeenCalledWith("browser-use")
    expect(result.removed_commands).toBe(6)
    expect(result.removed_provider).toBe(true)
  })
})
