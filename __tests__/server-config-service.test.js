const {
  getCLIConfig,
  bumpVersion,
  getNamespaces,
  getResources,
  getActions,
  getCommand
} = require("../server/services/configService")
const { getStorage } = require("../server/storage/adapter")

jest.mock("../server/storage/adapter")

describe("configService", () => {
  let mockStorage

  beforeEach(() => {
    jest.clearAllMocks()
    mockStorage = {
      listKeys: jest.fn(),
      get: jest.fn(),
      set: jest.fn()
    }
    getStorage.mockReturnValue(mockStorage)
  })

  test("getCLIConfig returns full structured config", async () => {
    mockStorage.listKeys.mockImplementation((prefix) => {
      if (prefix === "command:") return ["command:n.r.a"]
      if (prefix === "mcp:") return ["mcp:s1"]
      if (prefix === "spec:") return ["spec:sp1"]
      return []
    })
    mockStorage.get.mockImplementation((key) => {
      if (key === "command:n.r.a") return { namespace: "n", resource: "r", action: "a", adapter: "builtin" }
      if (key === "mcp:s1") return { name: "s1", command: "npx", args: ["mcp-remote", "u1"], headers: { H: "v" }, env: { E: "1" } }
      if (key === "spec:sp1") return { name: "sp1", url: "u2", auth: "none" }
      if (key === "settings:config_version") return "10"
      return null
    })

    const config = await getCLIConfig()
    expect(config.version).toBe("10")
    expect(config.commands).toHaveLength(1)
    expect(config.mcp_servers).toHaveLength(1)
    expect(config.mcp_servers[0]).toEqual(expect.objectContaining({
      name: "s1",
      command: "npx",
      args: ["mcp-remote", "u1"],
      headers: { H: "v" },
      env: { E: "1" }
    }))
    expect(config.specs).toHaveLength(1)
  })

  test("bumpVersion increments and saves", async () => {
    mockStorage.get.mockResolvedValue("5")
    const next = await bumpVersion()
    expect(next).toBe("6")
    expect(mockStorage.set).toHaveBeenCalledWith("settings:config_version", "6")
  })

  test("getNamespaces extracts unique prefixes", async () => {
    mockStorage.listKeys.mockResolvedValue(["command:n1.r.a", "command:n1.r.b", "command:n2.r.a"])
    const ns = await getNamespaces()
    expect(ns.sort()).toEqual(["n1", "n2"])
  })

  test("getResources extracts second part", async () => {
    mockStorage.listKeys.mockResolvedValue(["command:n.r1.a", "command:n.r2.a"])
    const res = await getResources("n")
    expect(res.sort()).toEqual(["r1", "r2"])
  })

  test("getActions extracts third part", async () => {
    mockStorage.listKeys.mockResolvedValue(["command:n.r.a1", "command:n.r.a2"])
    const act = await getActions("n", "r")
    expect(act.sort()).toEqual(["a1", "a2"])
  })

  test("getCommand fetches by key", async () => {
    mockStorage.get.mockResolvedValue({ id: "cmd" })
    const cmd = await getCommand("n", "r", "a")
    expect(cmd).toEqual({ id: "cmd" })
    expect(mockStorage.get).toHaveBeenCalledWith("command:n.r.a")
  })
})
