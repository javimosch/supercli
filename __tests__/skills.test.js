const {
  normalizeSkillId,
  buildCommandSkillMarkdown,
  buildTeachSkillMarkdown,
  listSkillsMetadata,
  handleSkillsCommand
} = require("../cli/skills")

describe("skills", () => {
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

  test("listSkillsMetadata keeps name and description only", () => {
    const skills = listSkillsMetadata({
      commands: [{ namespace: "x", resource: "y", action: "z", description: "desc" }]
    })
    expect(skills).toEqual(expect.arrayContaining([{ name: "x.y.z", description: "desc" }]))
    expect(Object.keys(skills[0]).sort()).toEqual(["description", "name"])
  })

  test("handleSkillsCommand list subcommand", () => {
    const mockOutput = jest.fn()
    const mockOutputHumanTable = jest.fn()
    const result = handleSkillsCommand({
      positional: ["skills", "list"],
      flags: {},
      config: { commands: [{ namespace: "a", resource: "b", action: "c", description: "test" }] },
      humanMode: false,
      output: mockOutput,
      outputHumanTable: mockOutputHumanTable,
      outputError: jest.fn()
    })

    expect(result).toBe(true)
    const payload = mockOutput.mock.calls[0][0]
    expect(payload.skills).toEqual(expect.arrayContaining([{ name: "a.b.c", description: "test" }]))
  })

  test("handleSkillsCommand teach subcommand", () => {
    const mockOutput = jest.fn()
    const consoleSpy = jest.spyOn(console, "log").mockImplementation()
    const result = handleSkillsCommand({
      positional: ["skills", "teach"],
      flags: { format: "skill.md" },
      config: {},
      humanMode: false,
      output: mockOutput,
      outputHumanTable: jest.fn(),
      outputError: jest.fn()
    })

    expect(result).toBe(true)
    consoleSpy.mockRestore()
  })

  test("handleSkillsCommand get subcommand", () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation()
    const result = handleSkillsCommand({
      positional: ["skills", "get", "a.b.c"],
      flags: { format: "skill.md" },
      config: { commands: [{ namespace: "a", resource: "b", action: "c", description: "test" }] },
      humanMode: false,
      output: jest.fn(),
      outputHumanTable: jest.fn(),
      outputError: jest.fn()
    })

    expect(result).toBe(true)
    consoleSpy.mockRestore()
  })

  test("handleSkillsCommand get with invalid format", () => {
    const mockOutputError = jest.fn()
    const result = handleSkillsCommand({
      positional: ["skills", "get", "a.b.c"],
      flags: { format: "json" },
      config: {},
      humanMode: false,
      output: jest.fn(),
      outputHumanTable: jest.fn(),
      outputError: mockOutputError
    })

    expect(result).toBe(true)
    expect(mockOutputError).toHaveBeenCalled()
  })

  test("handleSkillsCommand teach with invalid format", () => {
    const mockOutputError = jest.fn()
    const result = handleSkillsCommand({
      positional: ["skills", "teach"],
      flags: { format: "json" },
      config: {},
      humanMode: false,
      output: jest.fn(),
      outputHumanTable: jest.fn(),
      outputError: mockOutputError
    })

    expect(result).toBe(true)
    expect(mockOutputError).toHaveBeenCalled()
  })

  test("handleSkillsCommand get with invalid skill id", () => {
    const mockOutputError = jest.fn()
    const result = handleSkillsCommand({
      positional: ["skills", "get", "invalid"],
      flags: { format: "skill.md" },
      config: {},
      humanMode: false,
      output: jest.fn(),
      outputHumanTable: jest.fn(),
      outputError: mockOutputError
    })

    expect(result).toBe(true)
    expect(mockOutputError).toHaveBeenCalled()
  })

  test("handleSkillsCommand get with non-existent skill", () => {
    const mockOutputError = jest.fn()
    const result = handleSkillsCommand({
      positional: ["skills", "get", "x.y.z"],
      flags: { format: "skill.md" },
      config: { commands: [] },
      humanMode: false,
      output: jest.fn(),
      outputHumanTable: jest.fn(),
      outputError: mockOutputError
    })

    expect(result).toBe(true)
    expect(mockOutputError).toHaveBeenCalled()
  })

  test("handleSkillsCommand unknown subcommand", () => {
    const mockOutputError = jest.fn()
    const result = handleSkillsCommand({
      positional: ["skills", "unknown"],
      flags: {},
      config: {},
      humanMode: false,
      output: jest.fn(),
      outputHumanTable: jest.fn(),
      outputError: mockOutputError
    })

    expect(result).toBe(true)
    expect(mockOutputError).toHaveBeenCalled()
  })

  test("handleSkillsCommand list in human mode", () => {
    const mockOutput = jest.fn()
    const mockOutputHumanTable = jest.fn()
    const consoleSpy = jest.spyOn(console, "log").mockImplementation()
    const result = handleSkillsCommand({
      positional: ["skills", "list"],
      flags: {},
      config: { commands: [{ namespace: "a", resource: "b", action: "c", description: "test" }] },
      humanMode: true,
      output: mockOutput,
      outputHumanTable: mockOutputHumanTable,
      outputError: jest.fn()
    })

    expect(result).toBe(true)
    expect(mockOutputHumanTable).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  test("handleSkillsCommand get with show-dag flag", () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation()
    const result = handleSkillsCommand({
      positional: ["skills", "get", "a.b.c"],
      flags: { format: "skill.md", "show-dag": true },
      config: { commands: [{ namespace: "a", resource: "b", action: "c", description: "test" }] },
      humanMode: false,
      output: jest.fn(),
      outputHumanTable: jest.fn(),
      outputError: jest.fn()
    })

    expect(result).toBe(true)
    consoleSpy.mockRestore()
  })
})
