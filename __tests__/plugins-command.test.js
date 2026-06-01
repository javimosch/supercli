const { handlePluginsCommand } = require("../cli/plugins-command")
const {
  installPlugin,
  removePlugin,
  getPlugin,
  listInstalledPlugins,
  getPluginInstallGuidance,
  doctorPlugin,
  doctorAllPlugins
} = require("../cli/plugins-manager")
const { listRegistryPlugins } = require("../cli/plugins-registry")
const { loadConfig } = require("../cli/config")
const { getPluginLearn } = require("../cli/plugins-learn")

jest.mock("../cli/plugins-manager")
jest.mock("../cli/plugins-registry")
jest.mock("../cli/config")
jest.mock("../cli/plugins-learn")

describe("plugins-command", () => {
  let mockOutput
  let mockOutputHumanTable
  let mockOutputError
  let consoleSpy

  beforeEach(() => {
    jest.clearAllMocks()
    mockOutput = jest.fn()
    mockOutputHumanTable = jest.fn()
    mockOutputError = jest.fn()
    consoleSpy = jest.spyOn(console, "log").mockImplementation()
  })

  afterEach(() => {
    consoleSpy.mockRestore()
  })

  test("list subcommand", async () => {
    const mockPlugins = [{ name: "p1", version: "1.0", commands: [{}] }]
    listInstalledPlugins.mockReturnValue(mockPlugins)

    await handlePluginsCommand({
      positional: ["plugins", "list"],
      humanMode: false,
      output: mockOutput
    })

    expect(mockOutput).toHaveBeenCalledWith({
      plugins: [{ name: "p1", version: "1.0", commands: 1, description: "" }]
    })
  })

  test("list subcommand in human mode", async () => {
    listInstalledPlugins.mockReturnValue([])
    await handlePluginsCommand({
      positional: ["plugins", "list"],
      humanMode: true,
      outputHumanTable: mockOutputHumanTable
    })
    expect(mockOutputHumanTable).toHaveBeenCalled()
  })

  test("install subcommand validation error", async () => {
    await handlePluginsCommand({
      positional: ["plugins", "install"],
      flags: {},
      outputError: mockOutputError
    })
    expect(mockOutputError).toHaveBeenCalledWith(expect.objectContaining({
      code: 85,
      type: "invalid_argument"
    }))
  })

  test("install subcommand success", async () => {
    loadConfig.mockResolvedValue({ commands: [] })
    installPlugin.mockReturnValue({ plugin: "p1", version: "1.0" })
    getPluginInstallGuidance.mockReturnValue({ steps: [] })

    await handlePluginsCommand({
      positional: ["plugins", "install", "p1"],
      flags: { "on-conflict": "skip" },
      output: mockOutput
    })

    expect(installPlugin).toHaveBeenCalledWith("p1", expect.objectContaining({
      onConflict: "skip"
    }))
    expect(mockOutput).toHaveBeenCalledWith(expect.objectContaining({
      ok: true,
      plugin: "p1"
    }))
  })

  test("install via git", async () => {
    loadConfig.mockResolvedValue({ commands: [] })
    installPlugin.mockReturnValue({ plugin: "git-p" })

    await handlePluginsCommand({
      positional: ["plugins", "install"],
      flags: { git: "repo", "manifest-path": "p", ref: "v1" },
      output: mockOutput
    })

    expect(installPlugin).toHaveBeenCalledWith("(git)", expect.objectContaining({
      git: "repo",
      manifestPath: "p",
      ref: "v1"
    }))
  })

  test("explore subcommand", async () => {
    const mockReg = [{ name: "p1", tags: ["t1"], has_learn: true }]
    listRegistryPlugins.mockReturnValue(mockReg)
    listInstalledPlugins.mockReturnValue([{ name: "p1" }])

    await handlePluginsCommand({
      positional: ["plugins", "explore"],
      flags: { tags: "t1, t2", name: "query" },
      humanMode: false,
      output: mockOutput
    })

    expect(listRegistryPlugins).toHaveBeenCalledWith({
      name: "query",
      nameOnly: false,
      tags: ["t1", "t2"]
    })
    expect(mockOutput).toHaveBeenCalledWith(expect.objectContaining({
      plugins: expect.any(Array)
    }))
    expect(mockOutput.mock.calls[0][0].plugins[0].has_learn).toBe(true)
    expect(mockOutput.mock.calls[0][0].plugins[0].installed).toBe(true)
  })

  test("explore supports has-learn/source/installed/limit filters", async () => {
    listInstalledPlugins.mockReturnValue([{ name: "p2" }])
    listRegistryPlugins.mockReturnValue([
      { name: "p1", tags: ["x"], has_learn: true, source: { type: "bundled" } },
      { name: "p2", tags: ["x"], has_learn: true, source: { type: "bundled" } },
      { name: "p3", tags: ["x"], has_learn: false, source: { type: "git" } },
    ])

    await handlePluginsCommand({
      positional: ["plugins", "explore"],
      flags: { "has-learn": "true", source: "bundled", installed: "false", limit: "1" },
      humanMode: false,
      output: mockOutput,
      outputError: mockOutputError,
    })

    const out = mockOutput.mock.calls[0][0]
    expect(out.total).toBe(1)
    expect(out.returned).toBe(1)
    expect(out.plugins[0].name).toBe("p1")
    expect(out.filters).toEqual(expect.objectContaining({
      has_learn: true,
      source: "bundled",
      installed: false,
      limit: 1,
    }))
    expect(mockOutputError).not.toHaveBeenCalled()
  })

  test("explore rejects invalid has-learn", async () => {
    await handlePluginsCommand({
      positional: ["plugins", "explore"],
      flags: { "has-learn": "maybe" },
      outputError: mockOutputError,
    })
    expect(mockOutputError).toHaveBeenCalledWith(expect.objectContaining({ code: 85 }))
  })

  test("explore rejects invalid source", async () => {
    await handlePluginsCommand({
      positional: ["plugins", "explore"],
      flags: { source: "svn" },
      outputError: mockOutputError,
    })
    expect(mockOutputError).toHaveBeenCalledWith(expect.objectContaining({ code: 85 }))
  })

  test("explore rejects invalid limit", async () => {
    await handlePluginsCommand({
      positional: ["plugins", "explore"],
      flags: { limit: "0" },
      outputError: mockOutputError,
    })
    expect(mockOutputError).toHaveBeenCalledWith(expect.objectContaining({ code: 85 }))
  })

  test("explore subcommand in human mode", async () => {
    listRegistryPlugins.mockReturnValue([])
    await handlePluginsCommand({
      positional: ["plugins", "explore"],
      flags: {},
      humanMode: true,
      outputHumanTable: mockOutputHumanTable
    })
    expect(mockOutputHumanTable).toHaveBeenCalled()
  })

  test("explore with no match sends suggestions to stderr not stdout", async () => {
    const stderrSpy = jest.spyOn(process.stderr, "write").mockImplementation()
    listRegistryPlugins.mockReturnValue([])
    listInstalledPlugins.mockReturnValue([])

    await handlePluginsCommand({
      positional: ["plugins", "explore"],
      flags: { name: "nonexistent" },
      humanMode: true,
      outputHumanTable: mockOutputHumanTable
    })

    expect(stderrSpy).toHaveBeenCalledWith(expect.stringContaining("No plugins matched"))
    expect(stderrSpy).toHaveBeenCalledWith(expect.stringContaining("Try a broader search"))
    stderrSpy.mockRestore()
  })

  test("remove subcommand success", async () => {
    removePlugin.mockReturnValue(true)
    await handlePluginsCommand({
      positional: ["plugins", "remove", "p1"],
      output: mockOutput
    })
    expect(mockOutput).toHaveBeenCalledWith({ ok: true, removed: true })
  })

  test("remove subcommand validation error", async () => {
    await handlePluginsCommand({
      positional: ["plugins", "remove"],
      outputError: mockOutputError
    })
    expect(mockOutputError).toHaveBeenCalled()
  })

  test("show subcommand success", async () => {
    getPlugin.mockReturnValue({ name: "p1" })
    getPluginInstallGuidance.mockReturnValue({ info: "how" })

    await handlePluginsCommand({
      positional: ["plugins", "show", "p1"],
      output: mockOutput
    })

    expect(mockOutput).toHaveBeenCalledWith({
      plugin: { name: "p1" },
      install_guidance: { info: "how" }
    })
  })

  test("show subcommand not found", async () => {
    getPlugin.mockReturnValue(null)
    await handlePluginsCommand({
      positional: ["plugins", "show", "missing"],
      outputError: mockOutputError
    })
    expect(mockOutputError).toHaveBeenCalledWith(expect.objectContaining({
      code: 92
    }))
  })

  test("show subcommand validation error", async () => {
    await handlePluginsCommand({
      positional: ["plugins", "show"],
      outputError: mockOutputError
    })
    expect(mockOutputError).toHaveBeenCalled()
  })

  test("doctor subcommand for specific plugin", async () => {
    doctorPlugin.mockReturnValue({ ok: true })
    await handlePluginsCommand({
      positional: ["plugins", "doctor", "p1"],
      output: mockOutput
    })
    expect(doctorPlugin).toHaveBeenCalledWith("p1")
    expect(mockOutput).toHaveBeenCalledWith({ ok: true })
  })

  test("doctor subcommand for all", async () => {
    doctorAllPlugins.mockReturnValue({ ok: true })
    await handlePluginsCommand({
      positional: ["plugins", "doctor"],
      output: mockOutput
    })
    expect(doctorAllPlugins).toHaveBeenCalled()
  })

  test("learn subcommand success json", async () => {
    getPluginLearn.mockReturnValue({ plugin: "browser-use", installed: false, source: "registry-bundled", learn_markdown: "# Learn" })
    await handlePluginsCommand({
      positional: ["plugins", "learn", "browser-use"],
      humanMode: false,
      output: mockOutput,
    })
    expect(getPluginLearn).toHaveBeenCalledWith("browser-use")
    expect(mockOutput).toHaveBeenCalledWith(expect.objectContaining({ plugin: "browser-use" }))
  })

  test("learn subcommand success human", async () => {
    getPluginLearn.mockReturnValue({ plugin: "browser-use", installed: false, source: "registry-bundled", learn_markdown: "# Learn" })
    await handlePluginsCommand({
      positional: ["plugins", "learn", "browser-use"],
      humanMode: true,
      output: mockOutput,
    })
    expect(consoleSpy).toHaveBeenCalledWith("# Learn")
    expect(mockOutput).not.toHaveBeenCalled()
  })

  test("learn subcommand validation error", async () => {
    await handlePluginsCommand({
      positional: ["plugins", "learn"],
      outputError: mockOutputError,
    })
    expect(mockOutputError).toHaveBeenCalledWith(expect.objectContaining({ code: 85 }))
  })

  test("unknown subcommand shows help", async () => {
    await handlePluginsCommand({
      positional: ["plugins", "unknown"],
      humanMode: false,
      output: mockOutput,
      outputHumanTable: mockOutputHumanTable,
      outputError: mockOutputError
    })
    expect(mockOutputError).not.toHaveBeenCalled()
    expect(mockOutput).toHaveBeenCalledWith(expect.objectContaining({
      subcommands: expect.any(Array),
      usage: expect.any(String)
    }))
  })
})
