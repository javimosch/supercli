const { validateAdapterConfig } = require("../cli/adapter-schema")

describe("adapter-schema", () => {
  test("accepts valid process adapter", () => {
    expect(() => validateAdapterConfig({
      adapter: "process",
      adapterConfig: { command: "br", baseArgs: ["list"], timeout_ms: 5000 }
    })).not.toThrow()
  })

  test("ignores unknown adapters", () => {
    expect(() => validateAdapterConfig({ adapter: "custom" })).not.toThrow()
  })

  test("rejects non-object adapterConfig", () => {
    expect(() => validateAdapterConfig({ adapter: "http", adapterConfig: "string" })).toThrow(/requires adapterConfig object/)
  })

  test("rejects invalid common types", () => {
    expect(() => validateAdapterConfig({ adapter: "process", adapterConfig: { command: "a", parseJson: "yes" } })).toThrow(/must be boolean/)
    expect(() => validateAdapterConfig({ adapter: "process", adapterConfig: { command: "a", cwd: 123 } })).toThrow(/must be string/)
    expect(() => validateAdapterConfig({ adapter: "process", adapterConfig: { command: "a", safetyLevel: true } })).toThrow(/must be string/)
  })

  test("timeout_ms validation", () => {
    expect(() => validateAdapterConfig({ adapter: "process", adapterConfig: { command: "a", timeout_ms: "none" } })).toThrow(/positive number/)
    expect(() => validateAdapterConfig({ adapter: "process", adapterConfig: { command: "a", timeout_ms: -1 } })).toThrow(/positive number/)
    expect(() => validateAdapterConfig({ adapter: "process", adapterConfig: { command: "a", timeout_ms: 20000 } })).toThrow(/cannot exceed 15000ms/)
  })

  test("http adapter validation", () => {
    expect(() => validateAdapterConfig({ adapter: "http", adapterConfig: { url: 123 } })).toThrow(/requires adapterConfig.url/)
    expect(() => validateAdapterConfig({ adapter: "http", adapterConfig: { url: "u", method: 1 } })).toThrow(/method must be string/)
    expect(() => validateAdapterConfig({ adapter: "http", adapterConfig: { url: "u" } })).not.toThrow()
  })

  test("openapi adapter validation", () => {
    expect(() => validateAdapterConfig({ adapter: "openapi", adapterConfig: { spec: 1 } })).toThrow(/requires adapterConfig.spec/)
    expect(() => validateAdapterConfig({ adapter: "openapi", adapterConfig: { spec: "s", operationId: 1 } })).toThrow(/requires adapterConfig.operationId/)
    expect(() => validateAdapterConfig({ adapter: "openapi", adapterConfig: { spec: "s", operationId: "o" } })).not.toThrow()
  })

  test("mcp adapter validation", () => {
    expect(() => validateAdapterConfig({ adapter: "mcp", adapterConfig: { tool: 1 } })).toThrow(/requires adapterConfig.tool/)
    expect(() => validateAdapterConfig({ adapter: "mcp", adapterConfig: { tool: "t" } })).toThrow(/requires one source/)
    expect(() => validateAdapterConfig({ adapter: "mcp", adapterConfig: { tool: "t", server: "s" } })).not.toThrow()
  })

  test("process adapter validation", () => {
    expect(() => validateAdapterConfig({ adapter: "process", adapterConfig: { command: 1 } })).toThrow(/requires adapterConfig.command/)
    expect(() => validateAdapterConfig({ adapter: "process", adapterConfig: { command: "a", baseArgs: "none" } })).toThrow(/must be an array/)
    expect(() => validateAdapterConfig({ adapter: "process", adapterConfig: { command: "a", positionalArgs: "none" } })).toThrow(/must be an array/)
    expect(() => validateAdapterConfig({ adapter: "process", adapterConfig: { command: "a", passthrough: "yes" } })).toThrow(/must be boolean/)
    expect(() => validateAdapterConfig({ adapter: "process", adapterConfig: { command: "a", flagsBeforePositionals: "yes" } })).toThrow(/must be boolean/)
    expect(() => validateAdapterConfig({ adapter: "process", adapterConfig: { command: "a", missingDependencyHelp: 1 } })).toThrow(/must be string/)
    expect(() => validateAdapterConfig({ adapter: "process", adapterConfig: { command: "a", env: [] } })).toThrow(/must be object/)
  })

  test("builtin adapter validation", () => {
    expect(() => validateAdapterConfig({ adapter: "builtin", adapterConfig: { builtin: 1 } })).toThrow(/requires adapterConfig.builtin/)
    expect(() => validateAdapterConfig({ adapter: "builtin", adapterConfig: { builtin: "b" } })).not.toThrow()
  })

  test("shell adapter validation", () => {
    expect(() => validateAdapterConfig({ adapter: "shell", adapterConfig: { script: 1, unsafe: true } })).toThrow(/requires adapterConfig.script/)
    expect(() => validateAdapterConfig({ adapter: "shell", adapterConfig: { script: "s", unsafe: true, shell: 1 } })).toThrow(/shell must be string/)
    expect(() => validateAdapterConfig({ adapter: "shell", adapterConfig: { script: "s", unsafe: true, env: "none" } })).toThrow(/must be object/)
  })

  test("rejects interactive config", () => {
    expect(() => validateAdapterConfig({
      adapter: "http",
      adapterConfig: { url: "https://example.com", non_interactive: false }
    })).toThrow(/Interactive command execution is not supported/)
  })

  test("requires unsafe true for shell adapter", () => {
    expect(() => validateAdapterConfig({
      adapter: "shell",
      adapterConfig: { script: "echo hi" }
    })).toThrow(/unsafe=true/)
  })

  test("accepts shell adapter with unsafe true", () => {
    expect(() => validateAdapterConfig({
      adapter: "shell",
      adapterConfig: { script: "echo '{\"ok\":true}'", unsafe: true, timeout_ms: 1000 }
    })).not.toThrow()
  })

  test("accepts process safety metadata", () => {
    expect(() => validateAdapterConfig({
      adapter: "process",
      adapterConfig: {
        command: "docker",
        safetyLevel: "guarded",
        interactiveFlags: ["-i", "--interactive"],
        requiresInteractive: false
      }
    })).not.toThrow()
  })

  test("rejects non-array interactiveFlags", () => {
    expect(() => validateAdapterConfig({
      adapter: "process",
      adapterConfig: { command: "docker", interactiveFlags: "--tty" }
    })).toThrow(/interactiveFlags must be an array/)
  })

  test("rejects non-string interactiveFlags values", () => {
    expect(() => validateAdapterConfig({
      adapter: "process",
      adapterConfig: { command: "docker", interactiveFlags: ["--tty", 42] }
    })).toThrow(/interactiveFlags values must be strings/)
  })
})
