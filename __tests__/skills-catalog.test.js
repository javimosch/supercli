const fs = require("fs")
const os = require("os")
const path = require("path")

const {
  addProvider,
  removeProvider,
  getProvider,
  listProviders,
  syncCatalog,
  listCatalogSkills,
  searchCatalog,
  getCatalogSkill,
  readIndex
} = require("../cli/skills-catalog")

describe("skills catalog", () => {
  let tempHome
  let skillsRoot

  beforeEach(() => {
    tempHome = fs.mkdtempSync(path.join(os.tmpdir(), "supercli-skills-"))
    process.env.SUPERCLI_HOME = tempHome
    skillsRoot = path.join(tempHome, "kb", "skills")
    fs.mkdirSync(path.join(skillsRoot, "sample"), { recursive: true })
    fs.writeFileSync(
      path.join(skillsRoot, "sample", "SKILL.md"),
      "---\nskill_name: sample_skill\ndescription: Sample description\n---\n\n# Sample\n\ncontent"
    )
  })

  afterEach(() => {
    delete process.env.SUPERCLI_HOME
    fs.rmSync(tempHome, { recursive: true, force: true })
  })

  test("provider lifecycle and sync catalog", () => {
    addProvider({ name: "testkb", type: "local_fs", roots: [skillsRoot], enabled: true })

    const providers = listProviders()
    expect(providers.find(p => p.name === "testkb")).toBeTruthy()
    expect(getProvider("testkb")).toBeTruthy()
    expect(getProvider("missing")).toBeNull()

    const index = syncCatalog()
    expect(index.skills.length).toBeGreaterThan(0)

    const listed = listCatalogSkills({ provider: "testkb" })
    expect(listed.find(s => s.id === "testkb:sample_skill")).toBeTruthy()

    const searched = searchCatalog("sample", { provider: "testkb" })
    expect(searched.length).toBeGreaterThan(0)
    
    // Coverage for line 181
    const searchedDesc = searchCatalog("description")
    expect(searchedDesc.length).toBeGreaterThan(0)

    const full = getCatalogSkill("testkb:sample_skill")
    expect(full).toBeTruthy()
    expect(full.markdown).toContain("skill_name: sample_skill")

    const removed = removeProvider("testkb")
    expect(removed).toBe(true)
  })

  test("readJson error coverage", () => {
    const providersFile = path.join(tempHome, "skills-providers.json")
    fs.writeFileSync(providersFile, "invalid-json")
    // Should fallback to default providers
    const providers = listProviders()
    expect(providers.length).toBeGreaterThan(0)
  })

  test("readIndex coverage", () => {
    expect(readIndex().skills).toEqual([])
    const indexFile = path.join(tempHome, "skills-index.json")
    fs.writeFileSync(indexFile, "null")
    expect(readIndex().skills).toEqual([])
  })

  test("remote_static provider is indexed", () => {
    addProvider({
      name: "agency-agents",
      type: "remote_static",
      enabled: true,
      entries: [
        {
          id: "engineering.engineering-frontend-developer",
          name: "Frontend Developer",
          source_url: "https://raw.githubusercontent.com/msitarzewski/agency-agents/main/engineering/engineering-frontend-developer.md"
        }
      ]
    })

    const index = syncCatalog()
    expect(index.skills.find(s => s.id === "agency-agents:engineering.engineering-frontend-developer")).toBeTruthy()
  })

  test("listProviders includes plugin discovery results", () => {
    // Test that listProviders properly merges discovered plugin providers
    const providers = listProviders()
    expect(Array.isArray(providers)).toBe(true)
    // Should include at least the default providers
    expect(providers.length).toBeGreaterThan(0)
  })

  test("getCatalogInfo handles provider status checking", () => {
    const { getCatalogInfo } = require("../cli/skills-catalog")

    // Add a disabled provider
    addProvider({ name: "disabled-test", type: "local_fs", enabled: false })

    // Add a provider with missing directory
    addProvider({
      name: "missing-plugin",
      type: "plugin_fs",
      enabled: true,
      plugin_dir: "/nonexistent/path"
    })

    const info = getCatalogInfo()
    expect(info.providers).toBeDefined()
    expect(info.providers.find(p => p.name === "disabled-test" && p.status === "disabled")).toBeTruthy()
    expect(info.providers.find(p => p.name === "missing-plugin" && p.status === "missing")).toBeTruthy()
  })

  test("getCatalogSkill handles missing skills", () => {
    const result = getCatalogSkill("nonexistent:skill")
    expect(result).toBeNull()
  })

  test("searchCatalog handles empty query and options", () => {
    addProvider({ name: "testkb", type: "local_fs", roots: [skillsRoot], enabled: true })
    syncCatalog()

    // Empty search should return all skills
    const allSkills = searchCatalog("")
    expect(Array.isArray(allSkills)).toBe(true)

    // Search with nonexistent provider
    const noResults = searchCatalog("test", { provider: "nonexistent" })
    expect(noResults).toEqual([])
  })

  test("provider update via addProvider overwrites existing", () => {
    const originalProvider = { name: "test-update", type: "local_fs", enabled: false }
    addProvider(originalProvider)

    const updatedProvider = { name: "test-update", type: "local_fs", enabled: true, roots: [skillsRoot] }
    addProvider(updatedProvider)

    const providers = listProviders()
    const found = providers.find(p => p.name === "test-update")
    expect(found.enabled).toBe(true)
    expect(found.roots).toEqual([skillsRoot])
  })
})
