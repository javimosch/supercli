const { handleMcpRegistryCommand } = require("../cli/mcp-local");

describe("mcp-local", () => {
  let mockOutput, mockOutputHumanTable, mockOutputError;
  let mockSetMcpServer, mockRemoveMcpServer, mockListMcpServers;

  beforeEach(() => {
    mockOutput = jest.fn();
    mockOutputHumanTable = jest.fn();
    mockOutputError = jest.fn();
    mockSetMcpServer = jest.fn();
    mockRemoveMcpServer = jest.fn();
    mockListMcpServers = jest.fn();
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
    consoleSpy.mockRestore();
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
