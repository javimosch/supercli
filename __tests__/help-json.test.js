const { buildCapabilities } = require("../cli/help-json")

describe("help-json", () => {
  test("includes plugins and hides sync when no server", () => {
    const data = buildCapabilities({ commands: [] }, false)

    expect(data.commands.discover).toBeDefined()
    expect(data.commands.plugins).toBeDefined()
    expect(data.commands.plugins.subcommands).toEqual(expect.arrayContaining(["learn"]))
    expect(data.commands.mcp.subcommands).toEqual(expect.arrayContaining(["tools", "call", "bind", "doctor"]))
    expect(data.commands.sync).toBeUndefined()
    expect(data.flags["--help-json"]).toBeDefined()
    expect(data.agent_onboarding.no_llm_discovery).toBe(true)
  })

  test("includes sync when server is available", () => {
    const data = buildCapabilities({ commands: [{ namespace: "a" }] }, true)

    expect(data.commands.sync).toBeDefined()
    expect(data.total_commands).toBe(1)
    expect(data.namespaces).toEqual(["a"])
  })
})
