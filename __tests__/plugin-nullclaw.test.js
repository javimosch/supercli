const { spawnSync } = require("child_process")
const { addProvider, removeProvider, syncCatalog } = require("../cli/skills-catalog")
const {
  CATALOG_FILES,
  run,
  buildRemoteEntriesFromTree
} = require("../plugins/nullclaw/scripts/post-install")
const { run: runUninstall } = require("../plugins/nullclaw/scripts/post-uninstall")

jest.mock("child_process")
jest.mock("../cli/skills-catalog")

describe("plugin-nullclaw", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("buildRemoteEntriesFromTree keeps only curated nullclaw docs", () => {
    const entries = buildRemoteEntriesFromTree({
      tree: [
        { type: "blob", path: "README.md" },
        { type: "blob", path: "AGENTS.md" },
        { type: "blob", path: "docs/en/commands.md" },
        { type: "blob", path: "docs/zh/commands.md" },
        { type: "blob", path: "spec/webchannel_v1.json" }
      ]
    })

    expect(entries.map(entry => entry.id)).toEqual([
      "root.readme",
      "root.agents",
      "docs.en.commands"
    ])
    expect(entries.every(entry => entry.source_url.includes("raw.githubusercontent.com/nullclaw/nullclaw/main/"))).toBe(true)
  })

  test("run stores provider and syncs catalog", () => {
    spawnSync.mockReturnValue({
      status: 0,
      stdout: JSON.stringify({
        tree: CATALOG_FILES.map(file => ({ type: "blob", path: file.path }))
      })
    })
    syncCatalog.mockReturnValue({ skills: [1, 2, 3, 4] })

    const result = run()

    expect(addProvider).toHaveBeenCalledWith(expect.objectContaining({
      name: "nullclaw",
      type: "remote_static",
      entries: expect.arrayContaining([
        expect.objectContaining({ id: "root.agents" }),
        expect.objectContaining({ id: "docs.en.architecture" })
      ])
    }))
    expect(syncCatalog).toHaveBeenCalled()
    expect(result).toEqual({
      provider: "nullclaw",
      entries: CATALOG_FILES.length,
      synced_skills: 4
    })
  })

  test("run throws on curl failure", () => {
    spawnSync.mockReturnValue({ status: 22, stderr: "404" })
    expect(() => run()).toThrow(/Failed to fetch nullclaw metadata/)
  })

  test("post-uninstall removes provider and syncs catalog", () => {
    removeProvider.mockReturnValue(true)
    syncCatalog.mockReturnValue({ skills: [1] })
    const result = runUninstall()
    expect(removeProvider).toHaveBeenCalledWith("nullclaw")
    expect(addProvider).not.toHaveBeenCalled()
    expect(syncCatalog).toHaveBeenCalled()
    expect(result).toEqual({ provider: "nullclaw", removed: true, synced_skills: 1 })
  })
})
