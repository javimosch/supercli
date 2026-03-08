const fs = require("fs")
const { spawnSync } = require("child_process")
const path = require("path")
const os = require("os")

// Mock dependencies
jest.mock("fs")
jest.mock("child_process")
jest.mock("../cli/plugins-store")
jest.mock("../cli/plugins-registry")
jest.mock("../cli/plugin-agency-agents")

const {
  installPlugin,
  removePlugin,
  getPlugin,
  listInstalledPlugins,
  doctorPlugin,
  doctorAllPlugins,
  getPluginInstallGuidance
} = require("../cli/plugins-manager")

const {
  readPluginsLock,
  writePluginsLock,
  listInstalledPlugins: mockListInstalledPlugins
} = require("../cli/plugins-store")

const { getRegistryPlugin } = require("../cli/plugins-registry")
const { installAgencyAgentsSkillProvider } = require("../cli/plugin-agency-agents")

describe("plugins-manager", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    readPluginsLock.mockReturnValue({ installed: {} })
    jest.spyOn(os, "tmpdir").mockReturnValue("/tmp")
  })

  describe("Manifest Parsing", () => {
    test("throws if manifest invalid JSON", () => {
      fs.existsSync.mockReturnValue(true)
      fs.statSync.mockReturnValue({ isDirectory: () => false })
      fs.readFileSync.mockReturnValue("invalid")
      expect(() => installPlugin("p1")).toThrow(/Invalid plugin manifest/)
    })

    test("throws if manifest missing name or commands", () => {
      fs.existsSync.mockReturnValue(true)
      fs.statSync.mockReturnValue({ isDirectory: () => false })
      fs.readFileSync.mockReturnValue(JSON.stringify({ version: "1" }))
      expect(() => installPlugin("p1")).toThrow(/missing name or commands/)
    })

    test("resolves manifest from directory", () => {
      fs.existsSync.mockReturnValue(true)
      fs.statSync.mockReturnValue({ isDirectory: () => true })
      fs.readFileSync.mockReturnValue(JSON.stringify({ name: "d-p", commands: [] }))
      const result = installPlugin("some-dir")
      expect(result.plugin).toBe("d-p")
    })
  })

  describe("Git Installation", () => {
    test("throws if repo missing", () => {
      expect(() => installPlugin("any", { git: 123 })).toThrow(/Missing git repo/)
    })

    test("successfully clones with ref", () => {
      fs.mkdtempSync.mockReturnValue("/tmp/dcli-plugin-123")
      spawnSync.mockReturnValue({ status: 0 })
      fs.existsSync.mockReturnValue(true)
      fs.readFileSync.mockReturnValue(JSON.stringify({ name: "git-p", commands: [] }))
      
      const result = installPlugin("(git)", { git: "https://repo", ref: "v1" })
      expect(result.plugin).toBe("git-p")
    })

    test("handles git clone binary missing", () => {
      fs.mkdtempSync.mockReturnValue("/tmp/dcli-plugin-123")
      spawnSync.mockReturnValue({ error: { code: "ENOENT", message: "not found" } })
      try {
        installPlugin("(git)", { git: "repo" })
      } catch (err) {
        expect(err.message).toContain("Failed to clone")
        expect(err.suggestions).toContain("Install git and retry")
      }
    })

    test("handles git clone non-ENOENT error", () => {
      fs.mkdtempSync.mockReturnValue("/tmp/dcli-plugin-123")
      spawnSync.mockReturnValue({ error: { code: "OTHER", message: "fail" } })
      expect(() => installPlugin("(git)", { git: "repo" })).toThrow(/fail/)
    })

    test("handles git clone status failure", () => {
      fs.mkdtempSync.mockReturnValue("/tmp/dcli-plugin-123")
      spawnSync.mockReturnValue({ status: 1, stderr: "fatal" })
      expect(() => installPlugin("(git)", { git: "repo" })).toThrow(/fatal/)
    })

    test("handles missing manifest in repo", () => {
      fs.mkdtempSync.mockReturnValue("/tmp/dcli-plugin-123")
      spawnSync.mockReturnValue({ status: 0 })
      fs.existsSync.mockReturnValue(false)
      expect(() => installPlugin("(git)", { git: "repo" })).toThrow(/not found in repo/)
    })

    test("prevents path traversal", () => {
      fs.mkdtempSync.mockReturnValue("/tmp/dcli-plugin-123")
      spawnSync.mockReturnValue({ status: 0 })
      expect(() => installPlugin("(git)", { git: "repo", manifestPath: "../evil.json" })).toThrow(/Invalid manifest path/)
    })
  })

  describe("Registry Integration", () => {
    test("resolves git source from registry", () => {
      fs.existsSync.mockReturnValue(false)
      getRegistryPlugin.mockReturnValue({
        name: "reg-git",
        source: { type: "git", repo: "reg-repo", ref: "main", manifest_path: "p.json" }
      })
      fs.mkdtempSync.mockReturnValue("/tmp/temp")
      spawnSync.mockReturnValue({ status: 0 })
      fs.existsSync.mockImplementation((p) => p.includes("p.json"))
      fs.readFileSync.mockReturnValue(JSON.stringify({ name: "reg-git", commands: [] }))

      const result = installPlugin("reg-git")
      expect(result.plugin).toBe("reg-git")
    })

    test("resolves path source from registry", () => {
      fs.existsSync.mockReturnValue(false)
      getRegistryPlugin.mockReturnValue({
        name: "reg-p",
        source: { type: "path", manifest_path: "p.json" }
      })
      fs.existsSync.mockImplementation((p) => p.includes("p.json"))
      fs.readFileSync.mockReturnValue(JSON.stringify({ name: "reg-p", commands: [] }))

      const result = installPlugin("reg-p")
      expect(result.plugin).toBe("reg-p")
    })

    test("throws if registry source manifest missing", () => {
      fs.existsSync.mockReturnValue(false)
      getRegistryPlugin.mockReturnValue({
        name: "broken",
        source: { type: "path" }
      })
      fs.existsSync.mockReturnValue(false)
      expect(() => installPlugin("broken")).toThrow(/Plugin manifest not found for 'broken'/)
    })

    test("throws if not found anywhere", () => {
      fs.existsSync.mockReturnValue(false)
      getRegistryPlugin.mockReturnValue(null)
      expect(() => installPlugin("unknown")).toThrow(/Plugin 'unknown' not found/)
    })
  })

  describe("Doctor & checkBinary", () => {
    test("throws if not installed", () => {
      readPluginsLock.mockReturnValue({ installed: {} })
      expect(() => doctorPlugin("p")).toThrow(/is not installed/)
    })

    test("handles checkBinary ENOENT", () => {
      const plugin = { name: "p", checks: [{ type: "binary", name: "m" }] }
      readPluginsLock.mockReturnValue({ installed: { p: plugin } })
      spawnSync.mockReturnValue({ error: { code: "ENOENT" } })
      const report = doctorPlugin("p")
      expect(report.checks[0].message).toBe("not installed")
    })

    test("handles checkBinary status != 0", () => {
      const plugin = { name: "p", checks: [{ type: "binary", name: "b" }] }
      readPluginsLock.mockReturnValue({ installed: { p: plugin } })
      spawnSync.mockReturnValue({ status: 127, stderr: "" })
      const report = doctorPlugin("p")
      expect(report.checks[0].message).toBe("exit 127")
    })

    test("handles checkBinary other error", () => {
      const plugin = { name: "p", checks: [{ type: "binary", name: "b" }] }
      readPluginsLock.mockReturnValue({ installed: { p: plugin } })
      spawnSync.mockReturnValue({ error: { code: "X", message: "fail" } })
      const report = doctorPlugin("p")
      expect(report.checks[0].message).toBe("fail")
    })

    test("handles successful binary check", () => {
      const plugin = { name: "p", checks: [{ type: "binary", name: "b" }] }
      readPluginsLock.mockReturnValue({ installed: { p: plugin } })
      spawnSync.mockReturnValue({ status: 0, stdout: "ok" })
      const report = doctorPlugin("p")
      expect(report.checks[0].ok).toBe(true)
      expect(report.checks[0].message).toBe("ok")
    })

    test("policy validation and safe shell command counting", () => {
      const plugin = {
        name: "p",
        commands: [
          { namespace: "n", resource: "r", action: "a", adapter: "unknown" },
          { namespace: "n", resource: "r", action: "s", adapter: "shell", adapterConfig: { unsafe: true, non_interactive: true } },
          { namespace: "n", resource: "r", action: "s2", adapter: "shell", adapterConfig: { unsafe: false, non_interactive: false } }
        ]
      }
      readPluginsLock.mockReturnValue({ installed: { p: plugin } })
      const report = doctorPlugin("p")
      expect(report.ok).toBe(false)
      expect(report.unsafe_commands).toBe(1)
    })

    test("doctorAll aggregates", () => {
      mockListInstalledPlugins.mockReturnValue([{ name: "p1" }])
      readPluginsLock.mockReturnValue({ installed: { p1: { name: "p1", commands: [] } } })
      const report = doctorAllPlugins()
      expect(report.total_plugins).toBe(1)
    })
  })

  describe("Installation Main Flow", () => {
    const manifest = {
      name: "p1",
      commands: [{ namespace: "n", resource: "r", action: "a" }]
    }

    beforeEach(() => {
      fs.existsSync.mockReturnValue(true)
      fs.statSync.mockReturnValue({ isDirectory: () => false })
      fs.readFileSync.mockReturnValue(JSON.stringify(manifest))
      installAgencyAgentsSkillProvider.mockReturnValue({ provider: "agency-agents", entries: 1, synced_skills: 1 })
    })

    test("runs agency-agents post install mapping", () => {
      fs.readFileSync.mockReturnValue(JSON.stringify({ name: "agency-agents", commands: [] }))
      const result = installPlugin("agency-agents")
      expect(installAgencyAgentsSkillProvider).toHaveBeenCalled()
      expect(result.post_install).toEqual({ provider: "agency-agents", entries: 1, synced_skills: 1 })
    })

    test("throws on invalid onConflict", () => {
      expect(() => installPlugin("p1", { onConflict: "invalid" })).toThrow(/Invalid --on-conflict/)
    })

    test("handles same plugin command (skip logic)", () => {
      readPluginsLock.mockReturnValue({
        installed: { p1: { name: "p1", commands: [{ namespace: "n", resource: "r", action: "a" }] } }
      })
      const result = installPlugin("p1")
      expect(result.installed_commands).toBe(1)
    })

    test("handles onConflict skip", () => {
      readPluginsLock.mockReturnValue({
        installed: { p2: { commands: [{ namespace: "n", resource: "r", action: "a" }] } }
      })
      const result = installPlugin("p1", { onConflict: "skip" })
      expect(result.installed_commands).toBe(0)
    })

    test("handles onConflict replace (other plugin)", () => {
      const lock = { installed: { p2: { commands: [{ namespace: "n", resource: "r", action: "a" }] } } }
      readPluginsLock.mockReturnValue(lock)
      const result = installPlugin("p1", { onConflict: "replace" })
      expect(result.conflicts[0].action).toBe("replaced")
      expect(lock.installed.p2.commands).toHaveLength(0)
    })

    test("handles onConflict replace (base owner)", () => {
      const result = installPlugin("p1", { 
        onConflict: "replace",
        currentCommands: [{ namespace: "n", resource: "r", action: "a" }]
      })
      expect(result.conflicts[0].owner).toBe("base")
    })

    test("throws on conflict fail", () => {
      readPluginsLock.mockReturnValue({
        installed: { p2: { commands: [{ namespace: "n", resource: "r", action: "a" }] } }
      })
      expect(() => installPlugin("p1")).toThrow(/Plugin install conflict/)
    })
  })

  describe("Miscellaneous", () => {
    test("getPluginInstallGuidance", () => {
      expect(getPluginInstallGuidance("beads")).not.toBeNull()
    })
    test("removePlugin success", () => {
      readPluginsLock.mockReturnValue({ installed: { p1: { name: "p1" } } })
      expect(removePlugin("p1")).toBe(true)
    })
    test("removePlugin fail", () => {
      readPluginsLock.mockReturnValue({ installed: {} })
      expect(removePlugin("p1")).toBe(false)
    })
    test("getPlugin not found", () => {
      readPluginsLock.mockReturnValue({ installed: {} })
      expect(getPlugin("p1")).toBeNull()
    })
  })
})
