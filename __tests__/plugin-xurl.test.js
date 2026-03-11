const { addProvider, removeProvider, syncCatalog } = require("../cli/skills-catalog")
const {
  CATALOG_FILES,
  buildRemoteEntries,
  run
} = require("../plugins/xurl/scripts/post-install")
const { run: runUninstall } = require("../plugins/xurl/scripts/post-uninstall")

jest.mock("../cli/skills-catalog")

describe("plugin-xurl", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("buildRemoteEntries maps curated xurl docs", () => {
    const entries = buildRemoteEntries()

    expect(entries).toHaveLength(CATALOG_FILES.length)
    expect(entries.map(entry => entry.id)).toEqual(["root.skill", "root.readme"])
    expect(entries.every(entry => entry.source_url.includes("raw.githubusercontent.com/xdevplatform/xurl/main/"))).toBe(true)
  })

  test("run stores provider and syncs catalog", () => {
    syncCatalog.mockReturnValue({ skills: [1, 2] })

    const result = run()

    expect(addProvider).toHaveBeenCalledWith(expect.objectContaining({
      name: "xurl",
      type: "remote_static",
      entries: expect.arrayContaining([
        expect.objectContaining({ id: "root.skill" }),
        expect.objectContaining({ id: "root.readme" })
      ])
    }))
    expect(syncCatalog).toHaveBeenCalled()
    expect(result).toEqual({ provider: "xurl", entries: CATALOG_FILES.length, synced_skills: 2 })
  })

  test("post-uninstall removes provider and syncs catalog", () => {
    removeProvider.mockReturnValue(true)
    syncCatalog.mockReturnValue({ skills: [1] })

    const result = runUninstall()

    expect(removeProvider).toHaveBeenCalledWith("xurl")
    expect(syncCatalog).toHaveBeenCalled()
    expect(result).toEqual({ provider: "xurl", removed: true, synced_skills: 1 })
  })
})
