const fs = require("fs")
const os = require("os")

jest.mock("fs")
jest.mock("os", () => ({
  homedir: jest.fn(() => "/home/user")
}))
jest.mock("../cli/plugins-store")

const {
  loadConfig,
  syncConfig,
  showConfig,
  setMcpServer,
  removeMcpServer,
  listMcpServers
} = require("../cli/config")
const { getInstalledPluginCommands, listInstalledPlugins } = require("../cli/plugins-store")

global.fetch = jest.fn()

describe("config", () => {
  const mockHomedir = "/home/user"
  const cacheDir = mockHomedir + "/.supercli"
  const cacheFile = cacheDir + "/config.json"

  beforeEach(() => {
    jest.clearAllMocks()
    os.homedir.mockReturnValue(mockHomedir)
    getInstalledPluginCommands.mockReturnValue([])
    listInstalledPlugins.mockReturnValue([])
    jest.spyOn(Date, "now").mockReturnValue(1000000)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe("loadConfig", () => {
    test("returns empty config if no cache exists", async () => {
      fs.existsSync.mockReturnValue(false)
      const config = await loadConfig()
      expect(config.version).toBe("1")
      expect(config.commands).toEqual([])
    })

    test("returns cached config merged with plugin commands", async () => {
      fs.existsSync.mockReturnValue(true)
      fs.readFileSync.mockReturnValue(JSON.stringify({
        version: "2",
        commands: [{ id: "base" }]
      }))
      getInstalledPluginCommands.mockReturnValue([{ id: "plugin" }])

      const config = await loadConfig()
      expect(config.version).toBe("2")
      expect(config.commands).toEqual([{ id: "base" }, { id: "plugin" }])
    })

    test("handles corrupted cache by returning empty config", async () => {
      fs.existsSync.mockReturnValue(true)
      fs.readFileSync.mockReturnValue("invalid-json")
      const config = await loadConfig()
      expect(config.commands).toEqual([])
    })

    test("handles cache with missing commands field", async () => {
      fs.existsSync.mockReturnValue(true)
      fs.readFileSync.mockReturnValue(JSON.stringify({ version: "2" }))
      const config = await loadConfig()
      expect(config.commands).toEqual([])
    })

    test("normalizes claude-style mcpServers object", async () => {
      fs.existsSync.mockReturnValue(true)
      fs.readFileSync.mockReturnValue(
        JSON.stringify({
          version: "2",
          mcpServers: {
            "browser-use": {
              command: "npx",
              args: ["mcp-remote", "https://api.browser-use.com/mcp"]
            }
          }
        })
      )

      const config = await loadConfig()
      expect(config.mcp_servers).toEqual([
        {
          name: "browser-use",
          command: "npx",
          args: ["mcp-remote", "https://api.browser-use.com/mcp"]
        }
      ])
    })
  })

  describe("syncConfig", () => {
    test("fetches and writes cache", async () => {
      fs.existsSync.mockReturnValue(false) // Trigger mkdirSync
      const mockConfig = { version: "2", mcp_servers: [], specs: [], commands: [] }
      global.fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockConfig)
      })

      const result = await syncConfig("http://server")

      expect(fs.mkdirSync).toHaveBeenCalledWith(cacheDir, { recursive: true })
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        cacheFile,
        expect.stringContaining('"version": "2"')
      )
      expect(result.version).toBe("2")
      expect(result.fetchedAt).toBe(1000000)
    })

    test("throws if server not provided", async () => {
      await expect(syncConfig()).rejects.toThrow("SUPERCLI_SERVER is not configured")
    })

    test("throws if fetch fails", async () => {
      global.fetch.mockResolvedValue({ ok: false, status: 500, statusText: "Internal Error" })
      await expect(syncConfig("http://server")).rejects.toThrow("Failed to fetch config: 500 Internal Error")
    })

    test("handles missing mcp_servers or specs in main response", async () => {
      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ version: "2" })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([{ name: "mcp1" }])
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([{ name: "spec1" }])
        })

      const config = await syncConfig("http://server")
      expect(config.mcp_servers).toEqual([{ name: "mcp1" }])
      expect(config.specs).toEqual([{ name: "spec1" }])
    })

    test("handles non-ok response from secondary fetches", async () => {
      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ version: "2" })
        })
        .mockResolvedValueOnce({ ok: false })
        .mockResolvedValueOnce({ ok: false })

      const config = await syncConfig("http://server")
      expect(config.mcp_servers).toEqual([])
      expect(config.specs).toEqual([])
    })

    test("handles network errors in secondary mcp/specs fetches", async () => {
      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ version: "2" })
        })
        .mockRejectedValueOnce(new Error("network error"))
        .mockRejectedValueOnce(new Error("network error"))

      const config = await syncConfig("http://server")
      expect(config.mcp_servers).toEqual([])
      expect(config.specs).toEqual([])
    })

    test("ensures commands is an array if missing", async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ version: "2", mcp_servers: [], specs: [] })
      })
      const config = await syncConfig("http://server")
      expect(config.commands).toEqual([])
    })
  })

  describe("MCP Server management", () => {
    test("setMcpServer adds new server to empty config", async () => {
      fs.existsSync.mockReturnValue(false)
      await setMcpServer("new", "http://new")
      
      const lastWrite = JSON.parse(fs.writeFileSync.mock.calls[0][1])
      expect(lastWrite.mcp_servers).toContainEqual({ name: "new", url: "http://new" })
    })

    test("setMcpServer updates existing server and sorts correctly", async () => {
      fs.existsSync.mockReturnValue(true)
      fs.readFileSync.mockReturnValue(JSON.stringify({
        mcp_servers: [
          { name: "z", url: "http://z" },
          { name: "m", url: "http://m" },
          { name: "a", url: "http://a" }
        ]
      }))
      
      await setMcpServer("m", "http://updated")
      
      const lastWrite = JSON.parse(fs.writeFileSync.mock.calls[0][1])
      expect(lastWrite.mcp_servers.map(s => s.name)).toEqual(["a", "m", "z"])
    })

    test("setMcpServer handles config without mcp_servers array", async () => {
      fs.existsSync.mockReturnValue(true)
      fs.readFileSync.mockReturnValue(JSON.stringify({ version: "1" }))
      await setMcpServer("s1", "u1")
      const lastWrite = JSON.parse(fs.writeFileSync.mock.calls[0][1])
      expect(lastWrite.mcp_servers).toEqual([{ name: "s1", url: "u1" }])
    })

    test("setMcpServer supports command, args, headers, env", async () => {
      fs.existsSync.mockReturnValue(false)
      await setMcpServer("browser-use", {
        command: "npx",
        args: ["mcp-remote", "https://api.browser-use.com/mcp"],
        headers: { "X-Browser-Use-API-Key": "key" },
        env: { BROWSER_USE_API_KEY: "key" },
      })

      const lastWrite = JSON.parse(fs.writeFileSync.mock.calls[0][1])
      expect(lastWrite.mcp_servers).toContainEqual(
        expect.objectContaining({
          name: "browser-use",
          command: "npx",
          args: ["mcp-remote", "https://api.browser-use.com/mcp"],
          headers: { "X-Browser-Use-API-Key": "key" },
          env: { BROWSER_USE_API_KEY: "key" }
        })
      )
    })

    test("removeMcpServer removes existing server", async () => {
      fs.existsSync.mockReturnValue(true)
      fs.readFileSync.mockReturnValue(JSON.stringify({
        mcp_servers: [{ name: "target", url: "http://target" }, { name: "other" }]
      }))

      const removed = await removeMcpServer("target")
      expect(removed).toBe(true)
      
      const lastWrite = JSON.parse(fs.writeFileSync.mock.calls[0][1])
      expect(lastWrite.mcp_servers).toHaveLength(1)
      expect(lastWrite.mcp_servers[0].name).toBe("other")
    })

    test("removeMcpServer returns false if not found", async () => {
      fs.existsSync.mockReturnValue(true)
      fs.readFileSync.mockReturnValue(JSON.stringify({
        mcp_servers: [{ name: "other" }]
      }))
      const removed = await removeMcpServer("missing")
      expect(removed).toBe(false)
    })

    test("removeMcpServer handles empty config", async () => {
      fs.existsSync.mockReturnValue(false)
      const removed = await removeMcpServer("any")
      expect(removed).toBe(false)
    })

    test("listMcpServers returns servers from config", async () => {
      fs.existsSync.mockReturnValue(true)
      fs.readFileSync.mockReturnValue(JSON.stringify({
        mcp_servers: [{ name: "s1" }]
      }))
      const servers = await listMcpServers()
      expect(servers).toEqual([{ name: "s1" }])
    })

    test("listMcpServers returns empty array if field missing", async () => {
      fs.existsSync.mockReturnValue(true)
      fs.readFileSync.mockReturnValue(JSON.stringify({ version: "1" }))
      const servers = await listMcpServers()
      expect(servers).toEqual([])
    })

    test("handles null or invalid items in mcp_servers array", async () => {
      fs.existsSync.mockReturnValue(true)
      fs.readFileSync.mockReturnValue(JSON.stringify({
        mcp_servers: [null, { name: 123 }, { name: "z" }]
      }))
      
      await setMcpServer("a", "http://a")
      const lastWrite = JSON.parse(fs.writeFileSync.mock.calls[0][1])
      expect(lastWrite.mcp_servers.some(s => s && s.name === "a")).toBe(true)
      expect(lastWrite.mcp_servers.find(s => s && s.name === 123)).toBeUndefined()
      
      const removed = await removeMcpServer("z")
      expect(removed).toBe(true)
    })
  })

  describe("showConfig", () => {
    test("returns message if no cache", async () => {
      fs.existsSync.mockReturnValue(false)
      const result = await showConfig()
      expect(result.cached).toBe(false)
      expect(result.message).toContain("No config cached")
    })

    test("returns summary of cached config", async () => {
      fs.existsSync.mockReturnValue(true)
      fs.readFileSync.mockReturnValue(JSON.stringify({
        version: "1.0",
        ttl: 3600,
        fetchedAt: 1000000,
        commands: [1, 2],
        mcp_servers: [{ name: "s1", url: "http://s1" }],
        specs: [1, 2, 3]
      }))
      listInstalledPlugins.mockReturnValue([1, 2, 3, 4])

      const result = await showConfig()
      expect(result.version).toBe("1.0")
      expect(result.commands).toBe(2)
      expect(result.plugins).toBe(4)
      expect(result.mcp_servers).toBe(1)
      expect(result.specs).toBe(3)
      expect(result.cacheFile).toBe(cacheFile)
    })

    test("handles cached config with missing fields in showConfig", async () => {
      fs.existsSync.mockReturnValue(true)
      fs.readFileSync.mockReturnValue(JSON.stringify({
        version: "1.0",
        fetchedAt: 1000000
      }))
      const result = await showConfig()
      expect(result.commands).toBe(0)
      expect(result.mcp_servers).toBe(0)
      expect(result.specs).toBe(0)
    })
  })
})
