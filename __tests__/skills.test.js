const {
  normalizeSkillId,
  buildCommandSkillMarkdown,
  buildTeachSkillMarkdown,
  buildPluginsUsageSkillMarkdown,
  listSkillsMetadata,
  handleSkillsCommand,
  renderYamlObject
} = require("../cli/skills")
const catalog = require("../cli/skills-catalog")

jest.mock("../cli/skills-catalog")

describe("skills", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("renderYamlObject coverage", () => {
    // Line 66: non-object in array
    expect(renderYamlObject([1, 2])).toBe("- 1\n- 2")
    // Line 72: top-level scalar
    expect(renderYamlObject("scalar")).toBe("\"scalar\"")
    // Empty array
    expect(renderYamlObject([])).toBe("[]")
    // Array with empty object
    expect(renderYamlObject([{}])).toBe("- {}")
    // Object with multiple keys
    expect(renderYamlObject({ a: 1, b: 2 })).toBe("a: 1\nb: 2")
  })

  test("normalizeSkillId validates dotted ids", () => {
    expect(normalizeSkillId("a.b.c")).toEqual({ id: "a.b.c", namespace: "a", resource: "b", action: "c" })
    expect(normalizeSkillId("a.b")).toBeNull()
    expect(normalizeSkillId(123)).toBeNull()
  })

  test("normalizeSkillId handles edge cases", () => {
    expect(normalizeSkillId("")).toBeNull()
    expect(normalizeSkillId(null)).toBeNull()
    expect(normalizeSkillId("a..c")).toBeNull()
    expect(normalizeSkillId(".a.b")).toBeNull()
    expect(normalizeSkillId("  a.b.c  ")).toEqual({ id: "a.b.c", namespace: "a", resource: "b", action: "c" })
  })

  test("buildCommandSkillMarkdown returns frontmatter and examples", () => {
    const md = buildCommandSkillMarkdown({
      namespace: "ai",
      resource: "text",
      action: "summarize",
      description: "Summarize text",
      adapter: "mcp",
      adapterConfig: { tool: "summarize" },
      args: [{ name: "text", type: "string", required: true }]
    })

    expect(md.startsWith("---\n")).toBe(true)
    expect(md).toContain("skill_name: \"ai_text_summarize\"")
    expect(md).toContain("supercli ai text summarize --text <text> --json")
  })

  test("buildCommandSkillMarkdown with showDag includes dag", () => {
    const md = buildCommandSkillMarkdown({
      namespace: "ai",
      resource: "text",
      action: "summarize",
      description: "Summarize text",
      args: [{ name: "text", type: "string", required: true }]
    }, { showDag: true })

    expect(md).toContain("dag:")
    expect(md).toContain("type:")
  })

  test("buildCommandSkillMarkdown with optional args", () => {
    const md = buildCommandSkillMarkdown({
      namespace: "ai",
      resource: "text",
      action: "summarize",
      description: "Summarize text",
      args: [{ name: "text", type: "string", required: false }]
    })

    expect(md).toContain("--text <text>")
  })

  test("buildTeachSkillMarkdown can include dag", () => {
    const md = buildTeachSkillMarkdown({ showDag: true })
    expect(md).toContain("skill_name: \"teach_skills_usage\"")
    expect(md).toContain("dag:")
  })

  test("buildPluginsUsageSkillMarkdown returns markdown", () => {
    const md = buildPluginsUsageSkillMarkdown({ showDag: true })
    expect(md).toContain("skill_name: \"plugins_registry_usage\"")
    expect(md).toContain("dag:")
    expect(md).toContain("# Instruction")
  })

  test("listSkillsMetadata keeps name and description only", () => {
    const skills = listSkillsMetadata({
      commands: [{ namespace: "x", resource: "y", action: "z", description: "desc" }]
    })
    expect(skills).toEqual(expect.arrayContaining([{ name: "x.y.z", description: "desc" }]))
    const item = skills.find(s => s.name === "x.y.z")
    expect(item.description).toBe("desc")
  })

  describe("handleSkillsCommand", () => {
    let mockOutput, mockOutputHumanTable, mockOutputError

    beforeEach(() => {
      mockOutput = jest.fn()
      mockOutputHumanTable = jest.fn()
      mockOutputError = jest.fn()
    })

    test("list subcommand", () => {
      const result = handleSkillsCommand({
        positional: ["skills", "list"],
        flags: {},
        config: { commands: [{ namespace: "a", resource: "b", action: "c", description: "test" }] },
        humanMode: false,
        output: mockOutput,
        outputHumanTable: mockOutputHumanTable,
        outputError: mockOutputError
      })

      expect(result).toBe(true)
      const payload = mockOutput.mock.calls[0][0]
      expect(payload.skills).toEqual(expect.arrayContaining([{ name: "a.b.c", description: "test" }]))
    })

    test("list human mode", () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation()
      const result = handleSkillsCommand({
        positional: ["skills", "list"],
        flags: {},
        config: { commands: [{ namespace: "a", resource: "b", action: "c", description: "test" }] },
        humanMode: true,
        output: mockOutput,
        outputHumanTable: mockOutputHumanTable,
        outputError: mockOutputError
      })

      expect(result).toBe(true)
      expect(mockOutputHumanTable).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })

    test("list --catalog subcommand", () => {
      catalog.listCatalogSkills.mockReturnValue([{ name: "cat-skill" }])
      catalog.readIndex.mockReturnValue({ updated_at: "now" })
      
      const result = handleSkillsCommand({
        positional: ["skills", "list"],
        flags: { catalog: true },
        config: {},
        output: mockOutput
      })

      expect(result).toBe(true)
      expect(catalog.listCatalogSkills).toHaveBeenCalled()
      expect(mockOutput).toHaveBeenCalledWith(expect.objectContaining({
        skills: [{ name: "cat-skill" }]
      }))
    })

    test("teach subcommand", () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation()
      const result = handleSkillsCommand({
        positional: ["skills", "teach"],
        flags: { format: "skill.md" },
        config: {},
        output: mockOutput
      })

      expect(result).toBe(true)
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("teach_skills_usage"))
      consoleSpy.mockRestore()
    })

    test("teach subcommand invalid format", () => {
      const result = handleSkillsCommand({
        positional: ["skills", "teach"],
        flags: { format: "json" },
        config: {},
        outputError: mockOutputError
      })

      expect(result).toBe(true)
      expect(mockOutputError).toHaveBeenCalledWith(expect.objectContaining({ code: 85 }))
    })

    test("get subcommand (local)", () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation()
      const result = handleSkillsCommand({
        positional: ["skills", "get", "a.b.c"],
        flags: { format: "skill.md" },
        config: { commands: [{ namespace: "a", resource: "b", action: "c", description: "test" }] },
        output: mockOutput
      })

      expect(result).toBe(true)
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("skill_name: \"a_b_c\""))
      consoleSpy.mockRestore()
    })

    test("get subcommand (plugins usage)", () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation()
      const result = handleSkillsCommand({
        positional: ["skills", "get", "plugins.registry.usage"],
        flags: { format: "skill.md" },
        config: {},
        output: mockOutput
      })

      expect(result).toBe(true)
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("skill_name: \"plugins_registry_usage\""))
      consoleSpy.mockRestore()
    })

    test("get subcommand (catalog)", () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation()
      catalog.getCatalogSkill.mockReturnValue({ markdown: "catalog-md" })
      
      const result = handleSkillsCommand({
        positional: ["skills", "get", "provider:skill"],
        flags: { format: "skill.md" },
        config: {},
        output: mockOutput
      })

      expect(result).toBe(true)
      expect(catalog.getCatalogSkill).toHaveBeenCalledWith("provider:skill")
      expect(consoleSpy).toHaveBeenCalledWith("catalog-md")
      consoleSpy.mockRestore()
    })

    test("get subcommand (catalog not found)", () => {
      catalog.getCatalogSkill.mockReturnValue(null)
      
      const result = handleSkillsCommand({
        positional: ["skills", "get", "provider:missing"],
        flags: { format: "skill.md" },
        config: {},
        outputError: mockOutputError
      })

      expect(result).toBe(true)
      expect(mockOutputError).toHaveBeenCalledWith(expect.objectContaining({ code: 92 }))
    })

    test("get subcommand invalid format", () => {
      const result = handleSkillsCommand({
        positional: ["skills", "get", "a.b.c"],
        flags: { format: "json" },
        config: {},
        outputError: mockOutputError
      })

      expect(result).toBe(true)
      expect(mockOutputError).toHaveBeenCalledWith(expect.objectContaining({ code: 85 }))
    })

    test("get subcommand invalid skill id", () => {
      const result = handleSkillsCommand({
        positional: ["skills", "get", "invalid"],
        flags: { format: "skill.md" },
        config: {},
        outputError: mockOutputError
      })

      expect(result).toBe(true)
      expect(mockOutputError).toHaveBeenCalledWith(expect.objectContaining({ code: 85 }))
    })

    test("get subcommand command not found", () => {
      const result = handleSkillsCommand({
        positional: ["skills", "get", "missing.res.act"],
        flags: { format: "skill.md" },
        config: { commands: [] },
        outputError: mockOutputError
      })

      expect(result).toBe(true)
      expect(mockOutputError).toHaveBeenCalledWith(expect.objectContaining({ code: 92 }))
    })

    test("sync subcommand", () => {
      catalog.syncCatalog.mockReturnValue({ updated_at: "now", providers: 1, skills: [1, 2] })
      
      const result = handleSkillsCommand({
        positional: ["skills", "sync"],
        flags: {},
        output: mockOutput
      })

      expect(result).toBe(true)
      expect(catalog.syncCatalog).toHaveBeenCalled()
      expect(mockOutput).toHaveBeenCalledWith(expect.objectContaining({ ok: true, skills: 2 }))
    })

    test("search subcommand", () => {
      catalog.searchCatalog.mockReturnValue([{ name: "found" }])
      
      const result = handleSkillsCommand({
        positional: ["skills", "search", "query"],
        flags: {},
        output: mockOutput
      })

      expect(result).toBe(true)
      expect(catalog.searchCatalog).toHaveBeenCalledWith("query", expect.anything())
      expect(mockOutput).toHaveBeenCalledWith({ skills: [{ name: "found" }] })
    })

    test("search subcommand validation error", () => {
      const result = handleSkillsCommand({
        positional: ["skills", "search"],
        flags: {},
        outputError: mockOutputError
      })

      expect(result).toBe(true)
      expect(mockOutputError).toHaveBeenCalledWith(expect.objectContaining({ code: 85 }))
    })

    describe("providers subcommand", () => {
      test("list", () => {
        catalog.listProviders.mockReturnValue([{ name: "p1" }])
        handleSkillsCommand({
          positional: ["skills", "providers", "list"],
          flags: {},
          output: mockOutput
        })
        expect(mockOutput).toHaveBeenCalledWith({ providers: [{ name: "p1" }] })
      })

      test("list human mode", () => {
        const consoleSpy = jest.spyOn(console, "log").mockImplementation()
        catalog.listProviders.mockReturnValue([{ name: "p1" }])
        handleSkillsCommand({
          positional: ["skills", "providers", "list"],
          flags: {},
          humanMode: true,
          outputHumanTable: mockOutputHumanTable
        })
        expect(mockOutputHumanTable).toHaveBeenCalled()
        consoleSpy.mockRestore()
      })

      test("add", () => {
        catalog.addProvider.mockReturnValue({ name: "p1" })
        handleSkillsCommand({
          positional: ["skills", "providers", "add"],
          flags: { name: "p1", roots: "r1" },
          output: mockOutput
        })
        expect(catalog.addProvider).toHaveBeenCalledWith(expect.objectContaining({ name: "p1", roots: ["r1"] }))
      })

      test("add validation error", () => {
        handleSkillsCommand({
          positional: ["skills", "providers", "add"],
          flags: { name: "p1" }, // missing roots
          outputError: mockOutputError
        })
        expect(mockOutputError).toHaveBeenCalledWith(expect.objectContaining({ code: 85 }))
      })

      test("remove", () => {
        catalog.removeProvider.mockReturnValue(true)
        handleSkillsCommand({
          positional: ["skills", "providers", "remove", "p1"],
          flags: {},
          output: mockOutput
        })
        expect(catalog.removeProvider).toHaveBeenCalledWith("p1")
        expect(mockOutput).toHaveBeenCalledWith({ ok: true, removed: true })
      })

      test("remove validation error", () => {
        handleSkillsCommand({
          positional: ["skills", "providers", "remove"],
          flags: {},
          outputError: mockOutputError
        })
        expect(mockOutputError).toHaveBeenCalled()
      })

      test("show", () => {
        catalog.getProvider.mockReturnValue({ name: "p1" })
        handleSkillsCommand({
          positional: ["skills", "providers", "show", "p1"],
          flags: {},
          output: mockOutput
        })
        expect(catalog.getProvider).toHaveBeenCalledWith("p1")
        expect(mockOutput).toHaveBeenCalledWith({ provider: { name: "p1" } })
      })

      test("show not found", () => {
        catalog.getProvider.mockReturnValue(null)
        handleSkillsCommand({
          positional: ["skills", "providers", "show", "p1"],
          flags: {},
          outputError: mockOutputError
        })
        expect(mockOutputError).toHaveBeenCalledWith(expect.objectContaining({ code: 92 }))
      })

      test("show validation error", () => {
        handleSkillsCommand({
          positional: ["skills", "providers", "show"],
          flags: {},
          outputError: mockOutputError
        })
        expect(mockOutputError).toHaveBeenCalledWith(expect.objectContaining({ code: 85 }))
      })

      test("unknown action", () => {
        handleSkillsCommand({
          positional: ["skills", "providers", "unknown"],
          flags: {},
          outputError: mockOutputError
        })
        expect(mockOutputError).toHaveBeenCalledWith(expect.objectContaining({ code: 85 }))
      })
    })

    test("unknown subcommand", () => {
      const result = handleSkillsCommand({
        positional: ["skills", "unknown"],
        flags: {},
        outputError: mockOutputError
      })
      expect(result).toBe(true)
      expect(mockOutputError).toHaveBeenCalledWith(expect.objectContaining({ code: 85 }))
    })
  })
})
