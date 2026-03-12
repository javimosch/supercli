const { handleMcpRegistryCommand } = require("../cli/mcp-local");

describe("mcp-local", () => {
  let mockOutput, mockOutputHumanTable, mockOutputError;
  let mockSetMcpServer, mockRemoveMcpServer, mockListMcpServers;
  let mockLoadConfig, mockExecuteCommand, mockUpsertCommand, mockDiscoverTools;

  beforeEach(() => {
    mockOutput = jest.fn();
    mockOutputHumanTable = jest.fn();
    mockOutputError = jest.fn();
    mockSetMcpServer = jest.fn();
    mockRemoveMcpServer = jest.fn();
    mockListMcpServers = jest.fn();
    mockLoadConfig = jest.fn().mockResolvedValue({ mcp_servers: [] });
    mockExecuteCommand = jest.fn().mockResolvedValue({ ok: true });
    mockUpsertCommand = jest.fn(async (c) => c);
    mockDiscoverTools = jest.fn().mockResolvedValue([]);
  });

  test("list subcommand", async () => {
    const servers = [{ name: "s1", url: "u1" }];
    mockListMcpServers.mockResolvedValue(servers);

    await handleMcpRegistryCommand({
      positional: ["mcp", "list"],
      humanMode: false,
      output: mockOutput,
      listMcpServers: mockListMcpServers,
    });

    expect(mockListMcpServers).toHaveBeenCalled();
    expect(mockOutput).toHaveBeenCalledWith({ mcp_servers: servers });
  });

  test("list subcommand in human mode", async () => {
    const servers = [{ name: "s1", url: "u1" }];
    mockListMcpServers.mockResolvedValue(servers);
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();

    await handleMcpRegistryCommand({
      positional: ["mcp", "list"],
      humanMode: true,
      outputHumanTable: mockOutputHumanTable,
      listMcpServers: mockListMcpServers,
    });

    expect(mockOutputHumanTable).toHaveBeenCalled();
    expect(mockOutputHumanTable.mock.calls[0][0][0]).toEqual(
      expect.objectContaining({ transport: "http", source: "u1" }),
    );
    consoleSpy.mockRestore();
  });

  test("tools subcommand", async () => {
    mockListMcpServers.mockResolvedValue([{ name: "browser-use", command: "npx" }]);
    mockDiscoverTools.mockResolvedValue([{ name: "navigate", description: "Navigate" }]);

    await handleMcpRegistryCommand({
      positional: ["mcp", "tools"],
      flags: { "mcp-server": "browser-use" },
      output: mockOutput,
      outputError: mockOutputError,
      listMcpServers: mockListMcpServers,
      discoverTools: mockDiscoverTools,
    });

    expect(mockDiscoverTools).toHaveBeenCalledWith(
      expect.objectContaining({ name: "browser-use" }),
    );
    expect(mockOutput).toHaveBeenCalledWith(
      expect.objectContaining({ discovered: 1 }),
    );
  });

  test("call subcommand", async () => {
    await handleMcpRegistryCommand({
      positional: ["mcp", "call"],
      flags: {
        "mcp-server": "browser-use",
        tool: "navigate",
        "input-json": '{"url":"https://example.com"}',
      },
      output: mockOutput,
      outputError: mockOutputError,
      loadConfig: mockLoadConfig,
      executeCommand: mockExecuteCommand,
      serverUrl: "http://server",
    });

    expect(mockExecuteCommand).toHaveBeenCalledWith(
      expect.objectContaining({
        adapter: "mcp",
        adapterConfig: expect.objectContaining({ server: "browser-use", tool: "navigate" }),
      }),
      { url: "https://example.com" },
      expect.objectContaining({ server: "http://server" }),
    );
    expect(mockOutput).toHaveBeenCalledWith(expect.objectContaining({ ok: true }));
  });

  test("call subcommand supports timeout", async () => {
    await handleMcpRegistryCommand({
      positional: ["mcp", "call"],
      flags: {
        "mcp-server": "browser-use",
        tool: "navigate",
        "timeout-ms": "180000",
      },
      output: mockOutput,
      outputError: mockOutputError,
      loadConfig: mockLoadConfig,
      executeCommand: mockExecuteCommand,
      serverUrl: "http://server",
    });

    expect(mockExecuteCommand).toHaveBeenCalledWith(
      expect.objectContaining({
        adapterConfig: expect.objectContaining({ timeout_ms: 180000 }),
      }),
      expect.any(Object),
      expect.any(Object),
    );
  });

  test("call subcommand rejects oversized timeout", async () => {
    await handleMcpRegistryCommand({
      positional: ["mcp", "call"],
      flags: {
        "mcp-server": "browser-use",
        tool: "navigate",
        "timeout-ms": "180001",
      },
      outputError: mockOutputError,
      executeCommand: mockExecuteCommand,
    });

    expect(mockOutputError).toHaveBeenCalledWith(expect.objectContaining({ code: 85 }));
    expect(mockExecuteCommand).not.toHaveBeenCalled();
  });

  test("bind subcommand", async () => {
    await handleMcpRegistryCommand({
      positional: ["mcp", "bind"],
      flags: {
        "mcp-server": "browser-use",
        tool: "navigate",
        as: "ai.browser.probe",
      },
      output: mockOutput,
      outputError: mockOutputError,
      upsertCommand: mockUpsertCommand,
    });

    expect(mockUpsertCommand).toHaveBeenCalledWith(
      expect.objectContaining({
        namespace: "ai",
        resource: "browser",
        action: "probe",
        adapter: "mcp",
      }),
    );
    expect(mockOutput).toHaveBeenCalledWith(
      expect.objectContaining({ command: "ai.browser.probe" }),
    );
  });

  test("doctor subcommand", async () => {
    const diagnose = jest.fn().mockResolvedValue({
      server: "browser-use",
      status: "degraded",
      transport: "stdio",
      checks: [{ id: "tools", ok: false, message: "No tools discovered" }],
      issues: ["No tools discovered"],
      tools: [],
    });
    mockListMcpServers.mockResolvedValue([{ name: "browser-use", command: "npx" }]);

    await handleMcpRegistryCommand({
      positional: ["mcp", "doctor"],
      flags: { "mcp-server": "browser-use" },
      output: mockOutput,
      outputError: mockOutputError,
      listMcpServers: mockListMcpServers,
      diagnoseServer: diagnose,
      discoverTools: mockDiscoverTools,
    });

    expect(diagnose).toHaveBeenCalledWith(
      expect.objectContaining({ name: "browser-use" }),
      expect.objectContaining({ discoverTools: mockDiscoverTools }),
    );
    expect(mockOutput).toHaveBeenCalledWith(expect.objectContaining({ status: "degraded" }));
  });

  test("doctor subcommand validation error", async () => {
    await handleMcpRegistryCommand({
      positional: ["mcp", "doctor"],
      flags: {},
      outputError: mockOutputError,
    });

    expect(mockOutputError).toHaveBeenCalledWith(expect.objectContaining({ code: 85 }));
  });

  test("add subcommand", async () => {
    await handleMcpRegistryCommand({
      positional: ["mcp", "add", "s1"],
      flags: { url: "u1" },
      output: mockOutput,
      setMcpServer: mockSetMcpServer,
    });

    expect(mockSetMcpServer).toHaveBeenCalledWith("s1", expect.objectContaining({ url: "u1" }));
    expect(mockOutput).toHaveBeenCalledWith(
      expect.objectContaining({ ok: true }),
    );
  });

  test("add subcommand supports command and JSON fields", async () => {
    await handleMcpRegistryCommand({
      positional: ["mcp", "add", "browser-use"],
      flags: {
        command: "npx",
        "args-json": '["mcp-remote","https://api.browser-use.com/mcp"]',
        "headers-json": '{"X-Browser-Use-API-Key":"k"}',
        "env-json": '{"BROWSER_USE_API_KEY":"k"}',
        "timeout-ms": "12000"
      },
      output: mockOutput,
      setMcpServer: mockSetMcpServer,
      outputError: mockOutputError
    });

    expect(mockSetMcpServer).toHaveBeenCalledWith(
      "browser-use",
      expect.objectContaining({
        command: "npx",
        args: ["mcp-remote", "https://api.browser-use.com/mcp"],
        headers: { "X-Browser-Use-API-Key": "k" },
        env: { BROWSER_USE_API_KEY: "k" },
        timeout_ms: 12000
      })
    );
    expect(mockOutputError).not.toHaveBeenCalled();
  });

  test("add subcommand reports invalid JSON flags", async () => {
    await handleMcpRegistryCommand({
      positional: ["mcp", "add", "s1"],
      flags: { command: "npx", "args-json": "[" },
      outputError: mockOutputError,
      setMcpServer: mockSetMcpServer,
    });

    expect(mockOutputError).toHaveBeenCalledWith(
      expect.objectContaining({ code: 85 }),
    );
    expect(mockSetMcpServer).not.toHaveBeenCalled();
  });

  test("add subcommand validation error", async () => {
    await handleMcpRegistryCommand({
      positional: ["mcp", "add"],
      flags: {},
      outputError: mockOutputError,
    });

    expect(mockOutputError).toHaveBeenCalledWith(
      expect.objectContaining({ code: 85 }),
    );
  });

  test("remove subcommand", async () => {
    mockRemoveMcpServer.mockResolvedValue(true);

    await handleMcpRegistryCommand({
      positional: ["mcp", "remove", "s1"],
      output: mockOutput,
      removeMcpServer: mockRemoveMcpServer,
    });

    expect(mockRemoveMcpServer).toHaveBeenCalledWith("s1");
    expect(mockOutput).toHaveBeenCalledWith({ ok: true, removed: true });
  });

  test("remove subcommand validation error", async () => {
    await handleMcpRegistryCommand({
      positional: ["mcp", "remove"],
      outputError: mockOutputError,
    });

    expect(mockOutputError).toHaveBeenCalled();
  });

  test("unknown subcommand", async () => {
    await handleMcpRegistryCommand({
      positional: ["mcp", "unknown"],
      outputError: mockOutputError,
    });

    expect(mockOutputError).toHaveBeenCalledWith(
      expect.objectContaining({ code: 85 }),
    );
  });
});
