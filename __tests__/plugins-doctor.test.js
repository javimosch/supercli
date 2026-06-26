"use strict"

jest.mock("child_process")
jest.mock("../cli/plugins-store")
jest.mock("../cli/plugins-registry", () => ({ getRegistryPlugin: jest.fn(() => null) }))
jest.mock("../cli/plugin-install-guidance")
jest.mock("../cli/adapter-schema", () => ({
  SUPPORTED_ADAPTERS: ["http", "openapi", "mcp", "process", "shell"],
}))
jest.mock("../cli/plugins-manifest", () => ({
  commandKey: jest.fn(
    (cmd) => `${cmd.namespace || "_"}.${cmd.resource || "_"}.${cmd.action || "_"}`
  ),
}))

const { spawnSync } = require("child_process")
const { getPlugin, listInstalledPlugins } = require("../cli/plugins-store")
const { getPluginInstallGuidance } = require("../cli/plugin-install-guidance")
const { checkBinary, doctorPlugin, doctorAllPlugins } = require("../cli/plugins-doctor")

describe("plugins-doctor", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    getPluginInstallGuidance.mockReturnValue(null)
  })

  // ─── checkBinary ────────────────────────────────────────────────────────────

  describe("checkBinary", () => {
    test("returns ok:true with trimmed stdout when binary exits 0", () => {
      spawnSync.mockReturnValue({ status: 0, stdout: "v1.2.3\n", stderr: "", error: undefined })
      expect(checkBinary("git")).toEqual({ binary: "git", ok: true, message: "v1.2.3" })
    })

    test("returns ok:true with 'ok' when stdout is empty", () => {
      spawnSync.mockReturnValue({ status: 0, stdout: "", stderr: "", error: undefined })
      expect(checkBinary("git")).toEqual({ binary: "git", ok: true, message: "ok" })
    })

    test("returns ok:false with 'not installed' on ENOENT", () => {
      spawnSync.mockReturnValue({ error: { code: "ENOENT" }, status: null, stdout: "", stderr: "" })
      expect(checkBinary("missing")).toEqual({ binary: "missing", ok: false, message: "not installed" })
    })

    test("returns ok:false with error.message on non-ENOENT spawn error", () => {
      spawnSync.mockReturnValue({
        error: { code: "EACCES", message: "permission denied" },
        status: null,
        stdout: "",
        stderr: "",
      })
      expect(checkBinary("mytool")).toEqual({ binary: "mytool", ok: false, message: "permission denied" })
    })

    test("returns ok:false with trimmed stderr on non-zero exit", () => {
      spawnSync.mockReturnValue({ status: 1, stdout: "", stderr: "bad command\n", error: undefined })
      expect(checkBinary("mytool")).toEqual({ binary: "mytool", ok: false, message: "bad command" })
    })

    test("returns ok:false with 'exit N' when stderr is empty and exit is non-zero", () => {
      spawnSync.mockReturnValue({ status: 2, stdout: "", stderr: "", error: undefined })
      expect(checkBinary("mytool")).toEqual({ binary: "mytool", ok: false, message: "exit 2" })
    })

    test("passes custom args to spawnSync", () => {
      spawnSync.mockReturnValue({ status: 0, stdout: "ok", stderr: "", error: undefined })
      checkBinary("mytool", ["--help"])
      expect(spawnSync).toHaveBeenCalledWith("mytool", ["--help"], expect.any(Object))
    })

    test("uses --version as default args when none provided", () => {
      spawnSync.mockReturnValue({ status: 0, stdout: "ok", stderr: "", error: undefined })
      checkBinary("mytool")
      expect(spawnSync).toHaveBeenCalledWith("mytool", ["--version"], expect.any(Object))
    })
  })

  // ─── doctorPlugin ───────────────────────────────────────────────────────────

  describe("doctorPlugin", () => {
    test("throws code 92 when plugin is not installed", () => {
      getPlugin.mockReturnValue(null)
      expect(() => doctorPlugin("unknown")).toThrow("Plugin 'unknown' is not installed")
    })

    test("thrown error carries code 92 and type resource_not_found", () => {
      getPlugin.mockReturnValue(null)
      let err
      try {
        doctorPlugin("unknown")
      } catch (e) {
        err = e
      }
      expect(err.code).toBe(92)
      expect(err.type).toBe("resource_not_found")
    })

    test("returns ok:true for plugin with empty checks and no commands", () => {
      getPlugin.mockReturnValue({ name: "p", checks: [], commands: [] })
      const result = doctorPlugin("p")
      expect(result.ok).toBe(true)
      expect(result.checks).toEqual([])
      expect(result.commands).toBe(0)
    })

    test("returns ok:true for plugin missing checks and commands properties", () => {
      getPlugin.mockReturnValue({ name: "p" })
      const result = doctorPlugin("p")
      expect(result.ok).toBe(true)
      expect(result.checks).toHaveLength(0)
      expect(result.commands).toBe(0)
    })

    test("skips null and undefined entries in plugin.checks", () => {
      spawnSync.mockReturnValue({ status: 0, stdout: "ok", stderr: "", error: undefined })
      getPlugin.mockReturnValue({ name: "p", checks: [null, undefined, { type: "binary", name: "git" }] })
      const result = doctorPlugin("p")
      expect(spawnSync).toHaveBeenCalledTimes(1)
      expect(result.checks).toHaveLength(1)
    })

    test("skips check entry missing type field", () => {
      getPlugin.mockReturnValue({ name: "p", checks: [{ name: "git" }] })
      const result = doctorPlugin("p")
      expect(result.checks).toHaveLength(0)
    })

    test("skips binary check entry missing name field", () => {
      getPlugin.mockReturnValue({ name: "p", checks: [{ type: "binary" }] })
      const result = doctorPlugin("p")
      expect(result.checks).toHaveLength(0)
    })

    test("skips check entry with non-binary type", () => {
      getPlugin.mockReturnValue({ name: "p", checks: [{ type: "other", name: "tool" }] })
      const result = doctorPlugin("p")
      expect(result.checks).toHaveLength(0)
    })

    test("processes binary check and surfaces ok:true when binary found", () => {
      spawnSync.mockReturnValue({ status: 0, stdout: "v1.0.0", stderr: "", error: undefined })
      getPlugin.mockReturnValue({ name: "p", checks: [{ type: "binary", name: "git" }] })
      const result = doctorPlugin("p")
      expect(result.checks).toHaveLength(1)
      expect(result.checks[0].ok).toBe(true)
      expect(result.ok).toBe(true)
    })

    test("ok:false when a binary check fails (ENOENT)", () => {
      spawnSync.mockReturnValue({ error: { code: "ENOENT" }, status: null, stdout: "", stderr: "" })
      getPlugin.mockReturnValue({ name: "p", checks: [{ type: "binary", name: "notfound" }] })
      const result = doctorPlugin("p")
      expect(result.ok).toBe(false)
    })

    // checks.every undefined guard — verify that every check object carries an explicit ok field
    test("each check in result has an explicit ok property (no undefined gaps)", () => {
      spawnSync.mockReturnValue({ status: 0, stdout: "ok", stderr: "", error: undefined })
      getPlugin.mockReturnValue({
        name: "p",
        checks: [{ type: "binary", name: "git" }],
        commands: [
          { namespace: "a", resource: "b", action: "c", adapter: "unknown-adapter" },
          { namespace: "a", resource: "b", action: "d", adapter: "shell", adapterConfig: {} },
        ],
      })
      const result = doctorPlugin("p")
      for (const c of result.checks) {
        expect(c).toHaveProperty("ok")
        expect(typeof c.ok).toBe("boolean")
      }
    })

    // checks.every undefined guard — empty checks array → ok:true
    test("checks.every on empty array returns true (ok:true)", () => {
      getPlugin.mockReturnValue({ name: "p", checks: [], commands: [] })
      expect(doctorPlugin("p").ok).toBe(true)
    })

    test("adds policy check for unknown adapter", () => {
      getPlugin.mockReturnValue({
        name: "p",
        checks: [],
        commands: [{ namespace: "n", resource: "r", action: "a", adapter: "unknown-adapter" }],
      })
      const result = doctorPlugin("p")
      expect(result.ok).toBe(false)
      expect(result.checks).toHaveLength(1)
      expect(result.checks[0].type).toBe("policy")
      expect(result.checks[0].ok).toBe(false)
      expect(result.checks[0].message).toMatch(/unknown adapter/)
    })

    test("adds policy check for shell command missing unsafe:true", () => {
      getPlugin.mockReturnValue({
        name: "p",
        checks: [],
        commands: [
          { namespace: "n", resource: "r", action: "a", adapter: "shell", adapterConfig: {} },
        ],
      })
      const result = doctorPlugin("p")
      expect(result.ok).toBe(false)
      const check = result.checks.find((c) => c.message && c.message.includes("unsafe=true"))
      expect(check).toBeTruthy()
    })

    test("no unsafe policy error when shell command has unsafe:true", () => {
      getPlugin.mockReturnValue({
        name: "p",
        checks: [],
        commands: [
          { namespace: "n", resource: "r", action: "a", adapter: "shell", adapterConfig: { unsafe: true } },
        ],
      })
      const result = doctorPlugin("p")
      expect(result.unsafe_commands).toBe(1)
      const unsafeCheck = result.checks.find((c) => c.message && c.message.includes("unsafe=true"))
      expect(unsafeCheck).toBeUndefined()
    })

    test("adds policy check for shell command with non_interactive:false", () => {
      getPlugin.mockReturnValue({
        name: "p",
        checks: [],
        commands: [
          {
            namespace: "n",
            resource: "r",
            action: "a",
            adapter: "shell",
            adapterConfig: { unsafe: true, non_interactive: false },
          },
        ],
      })
      const result = doctorPlugin("p")
      const niCheck = result.checks.find((c) => c.message && c.message.includes("non_interactive"))
      expect(niCheck).toBeTruthy()
      expect(niCheck.ok).toBe(false)
    })

    test("counts adapter types in adapter_counts", () => {
      getPlugin.mockReturnValue({
        name: "p",
        checks: [],
        commands: [
          { namespace: "a", resource: "b", action: "c1", adapter: "http" },
          { namespace: "a", resource: "b", action: "c2", adapter: "http" },
          { namespace: "a", resource: "b", action: "c3", adapter: "mcp" },
        ],
      })
      const result = doctorPlugin("p")
      expect(result.adapter_counts).toEqual({ http: 2, mcp: 1 })
    })

    test("uses '(missing)' as adapter label when cmd.adapter is undefined", () => {
      getPlugin.mockReturnValue({
        name: "p",
        checks: [],
        commands: [{ namespace: "a", resource: "b", action: "c" }],
      })
      const result = doctorPlugin("p")
      expect(result.adapter_counts["(missing)"]).toBe(1)
    })

    test("includes install_guidance in result", () => {
      getPlugin.mockReturnValue({ name: "p" })
      getPluginInstallGuidance.mockReturnValue({ binary: "mytool", note: "install me" })
      const result = doctorPlugin("p")
      expect(result.install_guidance).toEqual({ binary: "mytool", note: "install me" })
    })

    test("result includes plugin name, commands count, and checks array", () => {
      getPlugin.mockReturnValue({
        name: "myplugin",
        checks: [],
        commands: [{ namespace: "a", resource: "b", action: "c", adapter: "http" }],
      })
      const result = doctorPlugin("myplugin")
      expect(result.plugin).toBe("myplugin")
      expect(result.commands).toBe(1)
      expect(Array.isArray(result.checks)).toBe(true)
    })
  })

  // ─── doctorAllPlugins ───────────────────────────────────────────────────────

  describe("doctorAllPlugins", () => {
    test("returns empty summary when no plugins installed", () => {
      listInstalledPlugins.mockReturnValue([])
      expect(doctorAllPlugins()).toEqual({
        plugins: [],
        ok: true,
        total_plugins: 0,
        failing_plugins: [],
      })
    })

    test("ok:true when all installed plugins pass", () => {
      listInstalledPlugins.mockReturnValue([{ name: "a" }, { name: "b" }])
      getPlugin.mockImplementation((name) => ({ name, checks: [], commands: [] }))
      const result = doctorAllPlugins()
      expect(result.ok).toBe(true)
      expect(result.total_plugins).toBe(2)
      expect(result.failing_plugins).toEqual([])
    })

    test("ok:false and failing_plugins lists the failing plugin", () => {
      listInstalledPlugins.mockReturnValue([{ name: "good" }, { name: "bad" }])
      spawnSync.mockReturnValue({ error: { code: "ENOENT" }, status: null, stdout: "", stderr: "" })
      getPlugin.mockImplementation((name) => {
        if (name === "bad") {
          return { name: "bad", checks: [{ type: "binary", name: "missing-bin" }], commands: [] }
        }
        return { name, checks: [], commands: [] }
      })
      const result = doctorAllPlugins()
      expect(result.ok).toBe(false)
      expect(result.failing_plugins).toEqual(["bad"])
    })

    test("total_plugins matches the installed plugin count", () => {
      const plugins = [{ name: "a" }, { name: "b" }, { name: "c" }]
      listInstalledPlugins.mockReturnValue(plugins)
      getPlugin.mockImplementation((name) => ({ name, checks: [], commands: [] }))
      expect(doctorAllPlugins().total_plugins).toBe(3)
    })

    test("missing-field: plugin entry with no name propagates to doctorPlugin(undefined) which throws", () => {
      listInstalledPlugins.mockReturnValue([{}]) // entry has no name field
      getPlugin.mockReturnValue(null)
      expect(() => doctorAllPlugins()).toThrow()
    })

    test("reports.every ok:false propagates to top-level ok:false", () => {
      listInstalledPlugins.mockReturnValue([{ name: "p1" }])
      getPlugin.mockReturnValue({
        name: "p1",
        checks: [],
        commands: [{ namespace: "n", resource: "r", action: "a", adapter: "bad-adapter" }],
      })
      const result = doctorAllPlugins()
      expect(result.ok).toBe(false)
    })

    test("plugins array contains one report per installed plugin", () => {
      listInstalledPlugins.mockReturnValue([{ name: "x" }, { name: "y" }])
      getPlugin.mockImplementation((name) => ({ name, checks: [], commands: [] }))
      const result = doctorAllPlugins()
      expect(result.plugins).toHaveLength(2)
      expect(result.plugins.map((r) => r.plugin)).toEqual(["x", "y"])
    })
  })
})
