const fs = require("fs")
const path = require("path")
const {
  readRegistry,
  listRegistryPlugins,
  getRegistryPlugin,
  REGISTRY_FILE
} = require("../cli/plugins-registry")

jest.mock("fs")

describe("plugins-registry", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("readRegistry", () => {
    test("returns empty registry if file missing", () => {
      fs.existsSync.mockReturnValue(false)
      const registry = readRegistry()
      expect(registry).toEqual({ version: 1, plugins: [] })
    })

    test("throws if registry is invalid JSON", () => {
      fs.existsSync.mockReturnValue(true)
      fs.readFileSync.mockReturnValue("invalid")
      expect(() => readRegistry()).toThrow(/Invalid plugin registry/)
    })

    test("throws if registry missing plugins array", () => {
      fs.existsSync.mockReturnValue(true)
      fs.readFileSync.mockReturnValue(JSON.stringify({ version: 1 }))
      expect(() => readRegistry()).toThrow(/expected object with plugins array/)
    })

    test("returns parsed registry", () => {
      fs.existsSync.mockReturnValue(true)
      const mock = { version: 1, plugins: [{ name: "p1" }] }
      fs.readFileSync.mockReturnValue(JSON.stringify(mock))
      expect(readRegistry()).toEqual(mock)
    })
  })

  describe("listRegistryPlugins", () => {
    const mockRegistry = {
      plugins: [
        { name: "p1", description: "desc1", tags: ["t1", "t2"], source: { type: "git" }, has_learn: true },
        { name: "p2", description: "other", tags: ["t2"] }
      ]
    }

    beforeEach(() => {
      fs.existsSync.mockReturnValue(true)
      fs.readFileSync.mockReturnValue(JSON.stringify(mockRegistry))
      fs.readdirSync.mockReturnValue([])
    })

    test("returns all plugins normalized", () => {
      const list = listRegistryPlugins()
      expect(list).toHaveLength(2)
      expect(list[0]).toMatchObject({ name: "p1", tags: ["t1", "t2"] })
      expect(list[0].has_learn).toBe(true)
      expect(list[1].has_learn).toBe(false)
      expect(list[1].source).toEqual({}) // normalized
    })

    test("filters by name", () => {
      const list = listRegistryPlugins({ name: "p1" })
      expect(list).toHaveLength(1)
      expect(list[0].name).toBe("p1")
    })

    test("filters by tags", () => {
      const list = listRegistryPlugins({ tags: ["t1"] })
      expect(list).toHaveLength(1)
      expect(list[0].name).toBe("p1")
    })

    test("filters by multiple tags (OR logic)", () => {
      const list = listRegistryPlugins({ tags: ["t1", "t2"] })
      expect(list).toHaveLength(2)
    })

    test("filters by name query in description", () => {
      const list = listRegistryPlugins({ name: "other" })
      expect(list).toHaveLength(1)
      expect(list[0].name).toBe("p2")
    })

    test("returns empty if no match", () => {
      const list = listRegistryPlugins({ name: "nomatch" })
      expect(list).toHaveLength(0)
    })

    test("includes auto-discovered bundled plugin not in registry file", () => {
      fs.readdirSync.mockReturnValue([
        { name: "autop", isDirectory: () => true }
      ])
      fs.existsSync.mockImplementation((p) => (
        String(p).includes("plugins/autop/plugin.json") ||
        String(p).endsWith("plugins.json") ||
        /[\\/]plugins$/.test(String(p))
      ))
      fs.readFileSync.mockImplementation((p) => {
        if (String(p).endsWith("plugins.json")) return JSON.stringify({ version: 1, plugins: [] })
        return JSON.stringify({ name: "autop", description: "auto", commands: [], learn: { file: "skills/quickstart/SKILL.md" } })
      })

      const list = listRegistryPlugins({ name: "autop" })
      expect(list).toHaveLength(1)
      expect(list[0].name).toBe("autop")
      expect(list[0].has_learn).toBe(true)
      expect(list[0].source).toEqual({ type: "bundled", manifest_path: "plugins/autop/plugin.json" })
    })

    test("registry entry overrides discovered metadata by name", () => {
      fs.readdirSync.mockReturnValue([{ name: "p1", isDirectory: () => true }])
      fs.existsSync.mockImplementation((p) => (
        String(p).includes("plugins/p1/plugin.json") ||
        String(p).endsWith("plugins.json") ||
        /[\\/]plugins$/.test(String(p))
      ))
      fs.readFileSync.mockImplementation((p) => {
        if (String(p).endsWith("plugins.json")) {
          return JSON.stringify({
            version: 1,
            plugins: [{ name: "p1", description: "registry-desc", tags: ["registry"] }],
          })
        }
        return JSON.stringify({ name: "p1", description: "discovered-desc", commands: [] })
      })

      const plugin = getRegistryPlugin("p1")
      expect(plugin.description).toBe("registry-desc")
      expect(plugin.tags).toEqual(["registry"])
    })
  })

  describe("getRegistryPlugin", () => {
    beforeEach(() => {
      fs.existsSync.mockReturnValue(true)
      fs.readFileSync.mockReturnValue(JSON.stringify({
        plugins: [{ name: "P1" }]
      }))
    })

    test("returns normalized plugin by name case-insensitive", () => {
      const p = getRegistryPlugin("p1")
      expect(p.name).toBe("P1")
    })

    test("returns null if name empty", () => {
      expect(getRegistryPlugin("")).toBeNull()
    })

    test("returns null if not found", () => {
      expect(getRegistryPlugin("missing")).toBeNull()
    })
  })
})
