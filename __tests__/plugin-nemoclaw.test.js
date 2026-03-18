const { spawnSync } = require("child_process")
const { addProvider, removeProvider, syncCatalog } = require("../cli/skills-catalog")
const {
  CATALOG_FILES,
  run,
  buildRemoteEntriesFromTree,
  resolveRepoConfig
} = require("../plugins/nemoclaw/scripts/post-install")
const { run: runUninstall } = require("../plugins/nemoclaw/scripts/post-uninstall")

jest.mock("child_process")
jest.mock("../cli/skills-catalog")

describe("plugin-nemoclaw", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("buildRemoteEntriesFromTree keeps only curated NemoClaw docs", () => {
    const entries = buildRemoteEntriesFromTree({
      tree: [
        { type: "blob", path: "README.md" },
        { type: "blob", path: "docs/reference/commands.md" },
        { type: "blob", path: "docs/reference/architecture.md" },
        { type: "blob", path: "docs/random.md" }
      ]
    })

    expect(entries.map(entry => entry.id)).toEqual([
      "root.readme",
      "docs.reference.commands",
      "docs.reference.architecture"
    ])
    expect(entries.every(entry => entry.source_url.includes("raw.githubusercontent.com/NVIDIA/NemoClaw/main/"))).toBe(true)
  })

  test("run stores provider and syncs catalog", () => {
    spawnSync.mockReturnValue({
      status: 0,
      stdout: JSON.stringify({
        tree: CATALOG_FILES.map(file => ({ type: "blob", path: file.path }))
      })
    })
    syncCatalog.mockReturnValue({ skills: [1, 2, 3] })

    const result = run()

    expect(addProvider).toHaveBeenCalledWith(expect.objectContaining({
      name: "nemoclaw",
      type: "remote_static",
      entries: expect.arrayContaining([
        expect.objectContaining({ id: "root.readme" }),
        expect.objectContaining({ id: "docs.reference.commands" })
      ])
    }))
    expect(syncCatalog).toHaveBeenCalled()
    expect(result).toEqual({
      provider: "nemoclaw",
      entries: CATALOG_FILES.length,
      synced_skills: 3
    })
  })

  test("resolveRepoConfig supports private fork overrides", () => {
    const repo = resolveRepoConfig({
      NEMOCLAW_DOCS_REPO: "acme/NemoClaw",
      NEMOCLAW_DOCS_REF: "dev",
      NEMOCLAW_SOURCE_REPO: "https://github.com/acme/NemoClaw"
    })

    expect(repo.owner).toBe("acme")
    expect(repo.repo).toBe("NemoClaw")
    expect(repo.ref).toBe("dev")
    expect(repo.sourceRepo).toBe("https://github.com/acme/NemoClaw")
    expect(repo.rawBaseUrl).toBe("https://raw.githubusercontent.com/acme/NemoClaw/dev")
  })

  test("run throws on curl failure", () => {
    spawnSync.mockReturnValue({ status: 22, stderr: "404" })
    expect(() => run()).toThrow(/Failed to fetch nemoclaw metadata/)
  })

  test("post-uninstall removes provider and syncs catalog", () => {
    removeProvider.mockReturnValue(true)
    syncCatalog.mockReturnValue({ skills: [1] })
    const result = runUninstall()
    expect(removeProvider).toHaveBeenCalledWith("nemoclaw")
    expect(addProvider).not.toHaveBeenCalled()
    expect(syncCatalog).toHaveBeenCalled()
    expect(result).toEqual({ provider: "nemoclaw", removed: true, synced_skills: 1 })
  })
})
