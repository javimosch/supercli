const { tokenizeIntent, discoverPluginsByIntent } = require("../cli/discover")
const { listRegistryPlugins } = require("../cli/plugins-registry")
const { listInstalledPlugins, getPluginInstallGuidance } = require("../cli/plugins-manager")

jest.mock("../cli/plugins-registry")
jest.mock("../cli/plugins-manager")

describe("discover", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("tokenizeIntent strips stopwords and expands synonyms", () => {
    const tokens = tokenizeIntent("Please send mail with gmail")
    expect(tokens).toEqual(expect.arrayContaining(["email", "gmail", "mail"]))
    expect(tokens).not.toContain("please")
    expect(tokens).not.toContain("with")
  })

  test("discoverPluginsByIntent ranks plugins deterministically", () => {
    listRegistryPlugins.mockReturnValue([
      {
        name: "resend",
        description: "Resend email API",
        tags: ["email", "api"],
        has_learn: true,
        source: { type: "bundled" },
      },
      {
        name: "browser-use",
        description: "Browser automation over MCP",
        tags: ["browser", "mcp"],
        has_learn: true,
        source: { type: "bundled" },
      },
    ])
    listInstalledPlugins.mockReturnValue([{ name: "resend" }])
    getPluginInstallGuidance.mockReturnValue({
      install_steps: ["supercli plugins install resend", "supercli resend cli setup"],
    })

    const out = discoverPluginsByIntent("send email", { limit: 5 })
    expect(out.no_llm).toBe(true)
    expect(out.plugins[0].name).toBe("resend")
    expect(out.plugins[0].installed).toBe(true)
    expect(out.plugins[0].matched_tokens).toContain("email")
    expect(out.plugins[0].next_steps).toEqual(expect.arrayContaining(["supercli plugins learn resend --json"]))
  })

  test("discoverPluginsByIntent validates empty intent", () => {
    expect(() => discoverPluginsByIntent("   ")).toThrow(/Missing --intent text/)
  })

  test("discoverPluginsByIntent validates limit", () => {
    listRegistryPlugins.mockReturnValue([])
    listInstalledPlugins.mockReturnValue([])
    expect(() => discoverPluginsByIntent("email", { limit: 0 })).toThrow(/Invalid --limit/)
  })
})
