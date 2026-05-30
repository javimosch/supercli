const { createPlan } = require("../cli/planner")

describe("planner", () => {
  test("creates default http plan with expected steps", () => {
    const cmd = {
      namespace: "api",
      resource: "users",
      action: "list",
      adapter: "http",
      adapterConfig: { method: "GET", url: "https://example.com/users" }
    }

    const plan = createPlan(cmd, { limit: 10 })

    expect(plan.command).toBe("api.users.list")
    expect(plan.args).toEqual({ limit: 10 })
    expect(plan.steps).toHaveLength(4)
    expect(plan.steps[2]).toMatchObject({
      type: "adapter_request",
      adapter: "http",
      method: "GET",
      url: "https://example.com/users"
    })
    expect(plan.side_effects).toBe(false)
    expect(plan.risk_level).toBe("safe")
  })

  test("marks mutation command as medium risk by default", () => {
    const cmd = {
      namespace: "api",
      resource: "users",
      action: "create",
      adapter: "openapi",
      mutation: true,
      adapterConfig: { operationId: "createUser" }
    }

    const plan = createPlan(cmd, {})

    expect(plan.side_effects).toBe(true)
    expect(plan.risk_level).toBe("medium")
    expect(plan.steps[2]).toMatchObject({
      adapter: "openapi",
      operationId: "createUser"
    })
  })

  test("creates plan with mcp adapter", () => {
    const cmd = {
      namespace: "tools",
      resource: "files",
      action: "read",
      adapter: "mcp",
      adapterConfig: { tool: "file_reader" }
    }

    const plan = createPlan(cmd, { path: "/test.txt" })

    expect(plan.command).toBe("tools.files.read")
    expect(plan.args).toEqual({ path: "/test.txt" })
    expect(plan.steps).toHaveLength(4)
    expect(plan.steps[2]).toMatchObject({
      type: "adapter_request",
      adapter: "mcp",
      tool: "file_reader",
      description: "Call MCP tool: file_reader"
    })
    expect(plan.side_effects).toBe(false)
    expect(plan.risk_level).toBe("safe")
  })

  test("creates plan with unknown adapter using fallback description", () => {
    const cmd = {
      namespace: "custom",
      resource: "data",
      action: "process",
      adapter: "unknown_adapter"
    }

    const plan = createPlan(cmd, {})

    expect(plan.command).toBe("custom.data.process")
    expect(plan.steps).toHaveLength(4)
    expect(plan.steps[2]).toMatchObject({
      type: "adapter_request",
      adapter: "unknown_adapter",
      description: "Execute via unknown_adapter adapter"
    })
  })

  test("creates http plan with default method when no config provided", () => {
    const cmd = {
      namespace: "api",
      resource: "status",
      action: "check",
      adapter: "http"
      // No adapterConfig provided
    }

    const plan = createPlan(cmd, {})

    expect(plan.command).toBe("api.status.check")
    expect(plan.steps).toHaveLength(4)
    expect(plan.steps[2]).toMatchObject({
      type: "adapter_request",
      adapter: "http",
      method: "GET",
      url: undefined,
      description: "HTTP GET (dynamic)"
    })
  })

  test("creates http plan with partial config using defaults", () => {
    const cmd = {
      namespace: "api",
      resource: "data",
      action: "fetch",
      adapter: "http",
      adapterConfig: { url: "https://api.example.com/data" }
      // No method provided, should default to GET
    }

    const plan = createPlan(cmd, {})

    expect(plan.command).toBe("api.data.fetch")
    expect(plan.steps[2]).toMatchObject({
      type: "adapter_request",
      adapter: "http",
      method: "GET",
      url: "https://api.example.com/data",
      description: "HTTP GET https://api.example.com/data"
    })
  })
})
