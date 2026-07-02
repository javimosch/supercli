const fs = require("fs")
const os = require("os")

jest.mock("fs")
jest.mock("os", () => ({
  homedir: jest.fn(() => "/home/user")
}))

const {
  SUPERCLI_PLUGINS_DIR,
  SUPERCLI_LOCAL_LOCK_FILE,
  SUPERCLI_SERVER_LOCK_FILE,
  LEGACY_PLUGINS_FILE,
  readPluginsLock,
  writePluginsLock,
  readServerPluginsLock,
  writeServerPluginsLock,
  listInstalledPlugins,
  listServerInstalledPlugins,
  getPlugin,
  getInstalledPluginCommands,
  getServerPluginCommands,
  getEffectivePluginCommands,
} = require("../cli/plugins-store")
const path = require("path")

describe("plugins-store", () => {
  const mockHomedir = "/home/user"
  const pluginsDir = path.join(mockHomedir, ".supercli", "plugins")
  const pluginsFile = path.join(pluginsDir, "plugins.lock.json")

  beforeEach(() => {
    jest.clearAllMocks()
    os.homedir.mockReturnValue(mockHomedir)
  })

  describe("readPluginsLock", () => {
    test("returns empty lock if file does not exist", () => {
      fs.existsSync.mockReturnValue(false)
      const lock = readPluginsLock()
      expect(lock).toEqual({ version: 1, installed: {} })
    })

    test("returns parsed lock if file exists", () => {
      fs.existsSync.mockImplementation((target) => target === pluginsFile)
      const mockLock = { version: 1, installed: { p1: { name: "p1" } } }
      fs.readFileSync.mockReturnValue(JSON.stringify(mockLock))
      const lock = readPluginsLock()
      expect(lock).toEqual(mockLock)
    })

    test("migrates legacy lock when new lock missing", () => {
      fs.existsSync.mockImplementation((target) => target === LEGACY_PLUGINS_FILE)
      const mockLock = { version: 1, installed: { p1: { name: "p1" } } }
      fs.readFileSync.mockReturnValue(JSON.stringify(mockLock))

      const lock = readPluginsLock()

      expect(lock).toEqual(mockLock)
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        SUPERCLI_LOCAL_LOCK_FILE,
        expect.stringContaining('"version": 1'),
      )
    })

    test("returns empty lock if file is invalid JSON", () => {
      fs.existsSync.mockReturnValue(true)
      fs.readFileSync.mockReturnValue("invalid-json")
      const lock = readPluginsLock()
      expect(lock).toEqual({ version: 1, installed: {} })
    })

    test("returns empty lock if parsed content is not an object", () => {
      fs.existsSync.mockReturnValue(true)
      fs.readFileSync.mockReturnValue("null")
      const lock = readPluginsLock()
      expect(lock).toEqual({ version: 1, installed: {} })
    })

    test("ensures installed field is an object", () => {
      fs.existsSync.mockReturnValue(true)
      fs.readFileSync.mockReturnValue(JSON.stringify({ version: 1 }))
      const lock = readPluginsLock()
      expect(lock.installed).toEqual({})
    })
  })

  describe("writePluginsLock", () => {
    test("creates directory if missing and writes file", () => {
      fs.existsSync.mockReturnValue(false)
      const lock = { version: 1, installed: {} }
      writePluginsLock(lock)
      expect(fs.mkdirSync).toHaveBeenCalledWith(SUPERCLI_PLUGINS_DIR, { recursive: true })
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        pluginsFile,
        expect.stringContaining('"version": 1')
      )
    })
  })

  describe("listInstalledPlugins", () => {
    test("returns array of plugins", () => {
      fs.existsSync.mockReturnValue(true)
      const p1 = { name: "p1" }
      fs.readFileSync.mockReturnValue(JSON.stringify({
        installed: { p1 }
      }))
      const list = listInstalledPlugins()
      expect(list).toEqual([p1])
    })
  })

  describe("getInstalledPluginCommands", () => {
    test("returns flattened array of commands", () => {
      fs.existsSync.mockReturnValue(true)
      const c1 = { id: "c1" }
      const c2 = { id: "c2" }
      fs.readFileSync.mockReturnValue(JSON.stringify({
        installed: {
          p1: { commands: [c1] },
          p2: { commands: [c2] }
        }
      }))
      const commands = getInstalledPluginCommands()
      expect(commands).toEqual([c1, c2])
    })

    test("handles plugins with missing commands field", () => {
      fs.existsSync.mockReturnValue(true)
      fs.readFileSync.mockReturnValue(JSON.stringify({
        installed: {
          p1: { name: "p1" }
        }
      }))
      const commands = getInstalledPluginCommands()
      expect(commands).toEqual([])
    })
  })

  describe("getEffectivePluginCommands", () => {
    test("local plugins shadow server plugins by name", () => {
      fs.existsSync.mockImplementation((target) =>
        target === SUPERCLI_LOCAL_LOCK_FILE || target.endsWith("server.lock.json"),
      )
      fs.readFileSync.mockImplementation((target) => {
        if (target.endsWith("plugins.lock.json")) {
          return JSON.stringify({ installed: { alpha: { name: "alpha", commands: [{ id: "local" }] } } })
        }
        return JSON.stringify({ installed: { alpha: { name: "alpha", commands: [{ id: "server-shadowed" }] }, beta: { name: "beta", commands: [{ id: "server" }] } } })
      })

      const commands = getEffectivePluginCommands()
      expect(commands).toEqual([{ id: "local" }, { id: "server" }])
    })
  })

  describe("readServerPluginsLock (readLockFile edge cases)", () => {
    test("returns empty lock if server lock file does not exist", () => {
      fs.existsSync.mockReturnValue(false)
      const lock = readServerPluginsLock()
      expect(lock).toEqual({ version: 1, installed: {} })
    })

    test("returns parsed server lock if file exists", () => {
      fs.existsSync.mockReturnValue(true)
      const mockLock = { version: 1, installed: { s1: { name: "s1" } } }
      fs.readFileSync.mockReturnValue(JSON.stringify(mockLock))
      const lock = readServerPluginsLock()
      expect(lock).toEqual(mockLock)
    })

    test("returns empty lock if server lock file contains invalid JSON", () => {
      fs.existsSync.mockReturnValue(true)
      fs.readFileSync.mockReturnValue("{broken")
      const lock = readServerPluginsLock()
      expect(lock).toEqual({ version: 1, installed: {} })
    })

    test("resets installed to {} when installed is null", () => {
      fs.existsSync.mockReturnValue(true)
      fs.readFileSync.mockReturnValue(JSON.stringify({ version: 2, installed: null }))
      const lock = readServerPluginsLock()
      expect(lock.installed).toEqual({})
    })

    test("resets installed to {} when installed is a string", () => {
      fs.existsSync.mockReturnValue(true)
      fs.readFileSync.mockReturnValue(JSON.stringify({ version: 2, installed: "bad" }))
      const lock = readServerPluginsLock()
      expect(lock.installed).toEqual({})
    })
  })

  describe("writeServerPluginsLock", () => {
    test("writes server lock file and ensures plugins dir exists", () => {
      fs.existsSync.mockReturnValue(false)
      const lock = { version: 1, installed: { s1: { name: "s1" } } }
      const result = writeServerPluginsLock(lock)
      expect(fs.mkdirSync).toHaveBeenCalledWith(SUPERCLI_PLUGINS_DIR, { recursive: true })
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        SUPERCLI_SERVER_LOCK_FILE,
        expect.stringContaining('"name": "s1"')
      )
      expect(result).toEqual(lock)
    })
  })

  describe("listServerInstalledPlugins", () => {
    test("returns array of server-installed plugins", () => {
      fs.existsSync.mockReturnValue(true)
      const s1 = { name: "s1" }
      fs.readFileSync.mockReturnValue(JSON.stringify({ installed: { s1 } }))
      expect(listServerInstalledPlugins()).toEqual([s1])
    })

    test("returns empty array when server lock has no plugins", () => {
      fs.existsSync.mockReturnValue(false)
      expect(listServerInstalledPlugins()).toEqual([])
    })
  })

  describe("getPlugin", () => {
    test("returns plugin by name when it exists", () => {
      fs.existsSync.mockReturnValue(true)
      const p1 = { name: "p1", version: "1.0.0" }
      fs.readFileSync.mockReturnValue(JSON.stringify({ installed: { p1 } }))
      expect(getPlugin("p1")).toEqual(p1)
    })

    test("returns null when plugin does not exist", () => {
      fs.existsSync.mockReturnValue(true)
      fs.readFileSync.mockReturnValue(JSON.stringify({ installed: {} }))
      expect(getPlugin("missing")).toBeNull()
    })

    test("returns null when lock file is absent", () => {
      fs.existsSync.mockReturnValue(false)
      expect(getPlugin("any")).toBeNull()
    })
  })

  describe("getServerPluginCommands", () => {
    test("returns flattened commands from server plugins", () => {
      fs.existsSync.mockReturnValue(true)
      const c1 = { id: "sc1" }
      fs.readFileSync.mockReturnValue(JSON.stringify({
        installed: { s1: { name: "s1", commands: [c1] } }
      }))
      expect(getServerPluginCommands()).toEqual([c1])
    })

    test("returns empty array when server lock is empty", () => {
      fs.existsSync.mockReturnValue(false)
      expect(getServerPluginCommands()).toEqual([])
    })
  })
})
