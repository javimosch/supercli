"use strict";

// Set env vars BEFORE requiring the module — server-command.js captures them at load time
const OLD_SERVER = process.env.SUPERCLI_SERVER;
const OLD_KEY = process.env.SUPERCLI_API_KEY;
process.env.SUPERCLI_SERVER = "http://localhost:3000";
process.env.SUPERCLI_API_KEY = "test-key";

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

const { handleServerCommand } = require("../cli/server-command");

describe("sc server — server command handler", () => {
  let output, outputError, captured;

  beforeEach(() => {
    captured = { json: null, error: null };
    output = (data) => { captured.json = data; };
    outputError = (data) => { captured.error = data; };
    mockFetch.mockReset();
  });

  afterAll(() => {
    if (OLD_SERVER) process.env.SUPERCLI_SERVER = OLD_SERVER;
    else delete process.env.SUPERCLI_SERVER;
    if (OLD_KEY) process.env.SUPERCLI_API_KEY = OLD_KEY;
    else delete process.env.SUPERCLI_API_KEY;
  });

  test("no resource → error 85", async () => {
    await handleServerCommand({
      positional: ["server"],
      flags: {},
      humanMode: false,
      output,
      outputError,
    });
    expect(captured.error).toBeTruthy();
    expect(captured.error.code).toBe(85);
  });

  test("server status → fetches /api/settings", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ admin_mode_enabled: true, max_zip_mb: 50, default_hooks_policy: "allow", auth: { required: true } }),
    });
    await handleServerCommand({
      positional: ["server", "status"],
      flags: {},
      humanMode: false,
      output,
      outputError,
    });
    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:3000/api/settings?format=json",
      expect.objectContaining({ headers: expect.objectContaining({ "X-API-Key": "test-key" }) }),
    );
    expect(captured.json).toBeTruthy();
    expect(captured.json.admin_mode).toBe(true);
  });

  test("server plugins list → fetches /api/plugins", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ plugins: [] }),
    });
    await handleServerCommand({
      positional: ["server", "plugins", "list"],
      flags: {},
      humanMode: false,
      output,
      outputError,
    });
    expect(mockFetch).toHaveBeenCalled();
  });

  test("server commands list → fetches /api/commands", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ commands: [] }),
    });
    await handleServerCommand({
      positional: ["server", "commands", "list"],
      flags: {},
      humanMode: false,
      output,
      outputError,
    });
    expect(mockFetch).toHaveBeenCalled();
  });

  test("server adapters list → fetches /api/adapters", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ adapters: [] }),
    });
    await handleServerCommand({
      positional: ["server", "adapters", "list"],
      flags: {},
      humanMode: false,
      output,
      outputError,
    });
    expect(mockFetch).toHaveBeenCalled();
  });

  test("server jobs list → fetches /api/jobs", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ jobs: [] }),
    });
    await handleServerCommand({
      positional: ["server", "jobs", "list"],
      flags: {},
      humanMode: false,
      output,
      outputError,
    });
    expect(mockFetch).toHaveBeenCalled();
  });

  test("server fetch error → outputError 500", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => "Internal Server Error",
    });
    await handleServerCommand({
      positional: ["server", "status"],
      flags: {},
      humanMode: false,
      output,
      outputError,
    });
    expect(captured.error).toBeTruthy();
    expect(captured.error.code).toBe(500);
  });

  test("unknown resource → error 85", async () => {
    await handleServerCommand({
      positional: ["server", "unknown"],
      flags: {},
      humanMode: false,
      output,
      outputError,
    });
    expect(captured.error).toBeTruthy();
    expect(captured.error.code).toBe(85);
  });

  test("server specs list → fetches /api/specs", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ specs: [] }),
    });
    await handleServerCommand({
      positional: ["server", "specs", "list"],
      flags: {},
      humanMode: false,
      output,
      outputError,
    });
    expect(mockFetch).toHaveBeenCalled();
  });

  test("server mcp list → fetches /api/mcp", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ mcp: [] }),
    });
    await handleServerCommand({
      positional: ["server", "mcp", "list"],
      flags: {},
      humanMode: false,
      output,
      outputError,
    });
    expect(mockFetch).toHaveBeenCalled();
  });

  test("server status in human mode → outputs text", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ admin_mode_enabled: false, max_zip_mb: 50, default_hooks_policy: "allow", auth: { required: false } }),
    });
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();
    await handleServerCommand({
      positional: ["server", "status"],
      flags: {},
      humanMode: true,
      output,
      outputError,
    });
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
