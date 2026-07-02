"use strict";

const fs = require("fs");
const os = require("os");

jest.mock("fs");
jest.mock("os", () => ({
  homedir: jest.fn(() => "/home/testuser"),
  hostname: jest.fn(() => "test-host"),
  type: jest.fn(() => "Linux"),
  release: jest.fn(() => "5.15.0"),
  arch: jest.fn(() => "x64"),
  userInfo: jest.fn(() => ({ username: "testuser" })),
}));
jest.mock("../cli/plugins-store", () => ({
  getEffectivePluginCommands: jest.fn(() => []),
}));

global.fetch = jest.fn();

const {
  getClientId,
  ensureCacheDir,
  emptyConfig,
  normalizeMcpServerEntry,
  normalizeMcpServers,
  normalizeConfig,
  readCache,
  writeCache,
  fetchRemoteConfig,
  loadConfig,
  cacheFilePath,
} = require("../cli/config-core");
const { getEffectivePluginCommands } = require("../cli/plugins-store");

const MOCK_HOME = "/home/testuser";
const CACHE_DIR = `${MOCK_HOME}/.supercli`;
const CACHE_FILE = `${CACHE_DIR}/config.json`;

beforeEach(() => {
  jest.resetAllMocks();
  os.homedir.mockReturnValue(MOCK_HOME);
  os.hostname.mockReturnValue("test-host");
  os.type.mockReturnValue("Linux");
  os.release.mockReturnValue("5.15.0");
  os.arch.mockReturnValue("x64");
  os.userInfo.mockReturnValue({ username: "testuser" });
  getEffectivePluginCommands.mockReturnValue([]);
  jest.spyOn(Date, "now").mockReturnValue(9999000);
});

afterEach(() => {
  jest.restoreAllMocks();
  delete process.env.SUPERCLI_CLIENT_ID;
  delete process.env.SUPERCLI_SERVER;
});

// ---------------------------------------------------------------------------
// fetchRemoteConfig — happy paths and schema validation
// ---------------------------------------------------------------------------
describe("fetchRemoteConfig", () => {
  test("throws if server is not provided (undefined)", async () => {
    await expect(fetchRemoteConfig()).rejects.toThrow(
      "SUPERCLI_SERVER is not configured"
    );
  });

  test("throws if server is null", async () => {
    await expect(fetchRemoteConfig(null)).rejects.toThrow(
      "SUPERCLI_SERVER is not configured"
    );
  });

  test("throws if server is empty string", async () => {
    await expect(fetchRemoteConfig("")).rejects.toThrow(
      "SUPERCLI_SERVER is not configured"
    );
  });

  test("fetches from <server>/api/config", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ version: "1", mcp_servers: [], specs: [], commands: [] }),
    });
    await fetchRemoteConfig("http://example.com");
    expect(global.fetch).toHaveBeenCalledWith("http://example.com/api/config");
  });

  test("throws with status code and message on non-ok response (404)", async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 404,
      statusText: "Not Found",
    });
    await expect(fetchRemoteConfig("http://example.com")).rejects.toThrow(
      "Failed to fetch config: 404 Not Found"
    );
  });

  test("throws with status code and message on non-ok response (500)", async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });
    await expect(fetchRemoteConfig("http://example.com")).rejects.toThrow(
      "Failed to fetch config: 500 Internal Server Error"
    );
  });

  test("propagates network-level fetch rejection", async () => {
    global.fetch.mockRejectedValue(new Error("ECONNREFUSED"));
    await expect(fetchRemoteConfig("http://example.com")).rejects.toThrow(
      "ECONNREFUSED"
    );
  });

  test("returns parsed JSON on success — full schema", async () => {
    const payload = {
      version: "2",
      ttl: 7200,
      mcp_servers: [{ name: "s1", url: "http://s1" }],
      specs: [{ id: "spec1" }],
      commands: [{ id: "cmd1" }],
    };
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(payload),
    });
    const result = await fetchRemoteConfig("http://example.com");
    expect(result).toEqual(payload);
  });

  test("schema: returns minimal response without optional arrays", async () => {
    const payload = { version: "2" };
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(payload),
    });
    const result = await fetchRemoteConfig("http://example.com");
    expect(result).toEqual({ version: "2" });
  });

  test("schema: returns response even when mcp_servers entries have extra fields", async () => {
    const payload = {
      version: "1",
      mcp_servers: [{ name: "tool", url: "http://tool", unknownField: true }],
    };
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(payload),
    });
    const result = await fetchRemoteConfig("http://example.com");
    expect(result.mcp_servers[0].unknownField).toBe(true);
  });

  test("schema: works with mcpServers object-style response", async () => {
    const payload = {
      version: "2",
      mcpServers: { "browser-use": { command: "npx", args: ["mcp-remote"] } },
    };
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(payload),
    });
    const result = await fetchRemoteConfig("http://example.com");
    expect(result.mcpServers).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// writeCache — error handling and data correctness
// ---------------------------------------------------------------------------
describe("writeCache", () => {
  test("creates cache directory when it does not exist", () => {
    fs.existsSync.mockReturnValue(false);
    writeCache({ version: "1" });
    expect(fs.mkdirSync).toHaveBeenCalledWith(CACHE_DIR, { recursive: true });
  });

  test("does not call mkdirSync when cache directory already exists", () => {
    fs.existsSync.mockReturnValue(true);
    writeCache({ version: "1" });
    expect(fs.mkdirSync).not.toHaveBeenCalled();
  });

  test("writes JSON to cache file path", () => {
    fs.existsSync.mockReturnValue(true);
    writeCache({ version: "1", mcp_servers: [], specs: [], commands: [] });
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      CACHE_FILE,
      expect.any(String)
    );
  });

  test("adds fetchedAt timestamp to written data", () => {
    fs.existsSync.mockReturnValue(true);
    writeCache({ version: "1" });
    const written = JSON.parse(fs.writeFileSync.mock.calls[0][1]);
    expect(written.fetchedAt).toBe(9999000);
  });

  test("returns the data object including fetchedAt", () => {
    fs.existsSync.mockReturnValue(true);
    const result = writeCache({ version: "1", mcp_servers: [], specs: [], commands: [] });
    expect(result.fetchedAt).toBe(9999000);
    expect(result.version).toBe("1");
  });

  test("propagates writeFileSync error to caller", () => {
    fs.existsSync.mockReturnValue(true);
    fs.writeFileSync.mockImplementation(() => {
      throw new Error("EACCES: permission denied");
    });
    expect(() => writeCache({ version: "1" })).toThrow("EACCES: permission denied");
  });

  test("propagates mkdirSync error when cache dir cannot be created", () => {
    fs.existsSync.mockReturnValue(false);
    fs.mkdirSync.mockImplementation(() => {
      throw new Error("EPERM: operation not permitted");
    });
    expect(() => writeCache({ version: "1" })).toThrow("EPERM: operation not permitted");
  });

  test("normalizes mcp_servers in written config", () => {
    fs.existsSync.mockReturnValue(true);
    writeCache({
      mcp_servers: [
        { name: "s1", url: "http://s1" },
        null,
        { name: 123 },
      ],
    });
    const written = JSON.parse(fs.writeFileSync.mock.calls[0][1]);
    expect(written.mcp_servers).toHaveLength(1);
    expect(written.mcp_servers[0].name).toBe("s1");
  });

  test("handles null config input by writing emptyConfig defaults", () => {
    fs.existsSync.mockReturnValue(true);
    const result = writeCache(null);
    expect(result.mcp_servers).toEqual([]);
    expect(result.specs).toEqual([]);
    expect(result.commands).toEqual([]);
  });

  test("merges mcpServers object-style into mcp_servers array", () => {
    fs.existsSync.mockReturnValue(true);
    writeCache({
      mcpServers: { "tool-a": { url: "http://a" } },
    });
    const written = JSON.parse(fs.writeFileSync.mock.calls[0][1]);
    expect(written.mcp_servers).toContainEqual(
      expect.objectContaining({ name: "tool-a", url: "http://a" })
    );
  });

  test("written JSON is pretty-printed (2-space indent)", () => {
    fs.existsSync.mockReturnValue(true);
    writeCache({ version: "1" });
    const raw = fs.writeFileSync.mock.calls[0][1];
    expect(raw).toContain("\n  ");
  });
});

// ---------------------------------------------------------------------------
// readCache
// ---------------------------------------------------------------------------
describe("readCache", () => {
  test("returns null when cache file does not exist", () => {
    fs.existsSync.mockReturnValue(false);
    expect(readCache()).toBeNull();
  });

  test("returns normalized config when cache file exists", () => {
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReturnValue(
      JSON.stringify({ version: "2", mcp_servers: [], specs: [], commands: [] })
    );
    const result = readCache();
    expect(result.version).toBe("2");
    expect(Array.isArray(result.mcp_servers)).toBe(true);
  });

  test("returns null on invalid JSON in cache file", () => {
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReturnValue("not-valid-json{{");
    expect(readCache()).toBeNull();
  });

  test("returns null when readFileSync throws", () => {
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockImplementation(() => {
      throw new Error("ENOENT");
    });
    expect(readCache()).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// normalizeConfig
// ---------------------------------------------------------------------------
describe("normalizeConfig", () => {
  test("returns emptyConfig defaults for null input", () => {
    const result = normalizeConfig(null);
    expect(result.mcp_servers).toEqual([]);
    expect(result.specs).toEqual([]);
    expect(result.commands).toEqual([]);
  });

  test("preserves version from valid config", () => {
    const result = normalizeConfig({ version: "3" });
    expect(result.version).toBe("3");
  });

  test("replaces non-array specs with empty array", () => {
    const result = normalizeConfig({ specs: "bad" });
    expect(result.specs).toEqual([]);
  });

  test("replaces non-array commands with empty array", () => {
    const result = normalizeConfig({ commands: null });
    expect(result.commands).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// normalizeMcpServerEntry
// ---------------------------------------------------------------------------
describe("normalizeMcpServerEntry", () => {
  test("returns null for falsy name", () => {
    expect(normalizeMcpServerEntry(null, { url: "http://x" })).toBeNull();
    expect(normalizeMcpServerEntry("", { url: "http://x" })).toBeNull();
  });

  test("returns null for non-string name", () => {
    expect(normalizeMcpServerEntry(123, { url: "http://x" })).toBeNull();
  });

  test("returns null for null/array entry", () => {
    expect(normalizeMcpServerEntry("s1", null)).toBeNull();
    expect(normalizeMcpServerEntry("s1", [])).toBeNull();
  });

  test("returns normalized entry with url", () => {
    const result = normalizeMcpServerEntry("s1", { url: "http://s1" });
    expect(result).toEqual({ name: "s1", url: "http://s1" });
  });

  test("filters non-string items from args array", () => {
    const result = normalizeMcpServerEntry("s1", { args: ["a", 2, null, "b"] });
    expect(result.args).toEqual(["a", "b"]);
  });

  test("strips non-string header values", () => {
    const result = normalizeMcpServerEntry("s1", {
      headers: { good: "val", bad: 42 },
    });
    expect(result.headers).toEqual({ good: "val" });
  });

  test("omits timeout_ms if non-positive", () => {
    const r1 = normalizeMcpServerEntry("s1", { timeout_ms: 0 });
    expect(r1.timeout_ms).toBeUndefined();
    const r2 = normalizeMcpServerEntry("s1", { timeout_ms: -100 });
    expect(r2.timeout_ms).toBeUndefined();
  });

  test("includes stateful=true when set", () => {
    const result = normalizeMcpServerEntry("s1", { stateful: true });
    expect(result.stateful).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// normalizeMcpServers
// ---------------------------------------------------------------------------
describe("normalizeMcpServers", () => {
  test("returns empty array for empty config", () => {
    expect(normalizeMcpServers({})).toEqual([]);
  });

  test("converts mcpServers object format to sorted array", () => {
    const result = normalizeMcpServers({
      mcpServers: {
        "z-server": { url: "http://z" },
        "a-server": { url: "http://a" },
      },
    });
    expect(result.map((s) => s.name)).toEqual(["a-server", "z-server"]);
  });

  test("deduplicates by name, mcp_servers array wins over mcpServers", () => {
    const result = normalizeMcpServers({
      mcpServers: { "s1": { url: "http://old" } },
      mcp_servers: [{ name: "s1", url: "http://new" }],
    });
    expect(result).toHaveLength(1);
    expect(result[0].url).toBe("http://new");
  });

  test("skips invalid entries in mcp_servers array", () => {
    const result = normalizeMcpServers({
      mcp_servers: [null, { name: "" }, { name: "valid", url: "http://ok" }],
    });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("valid");
  });
});

// ---------------------------------------------------------------------------
// loadConfig
// ---------------------------------------------------------------------------
describe("loadConfig", () => {
  test("returns emptyConfig defaults when no cache exists", async () => {
    fs.existsSync.mockReturnValue(false);
    const result = await loadConfig();
    expect(result.mcp_servers).toEqual([]);
    expect(result.commands).toEqual([]);
  });

  test("merges plugin commands with cached commands", async () => {
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReturnValue(
      JSON.stringify({ version: "1", commands: [{ id: "cached" }] })
    );
    getEffectivePluginCommands.mockReturnValue([{ id: "plugin" }]);
    const result = await loadConfig();
    expect(result.commands).toEqual([{ id: "cached" }, { id: "plugin" }]);
  });

  test("handles corrupted cache gracefully", async () => {
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReturnValue("broken{{json");
    const result = await loadConfig();
    expect(result.commands).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// emptyConfig
// ---------------------------------------------------------------------------
describe("emptyConfig", () => {
  test("returns object with required fields", () => {
    const config = emptyConfig();
    expect(config).toEqual({
      version: "1",
      ttl: 3600,
      mcp_servers: [],
      specs: [],
      commands: [],
    });
  });

  test("returns a fresh object on each call", () => {
    const a = emptyConfig();
    const b = emptyConfig();
    a.mcp_servers.push("x");
    expect(b.mcp_servers).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// getClientId
// ---------------------------------------------------------------------------
describe("getClientId", () => {
  test("returns env var value when SUPERCLI_CLIENT_ID is set", () => {
    process.env.SUPERCLI_CLIENT_ID = "  my-client-id  ";
    expect(getClientId()).toBe("my-client-id");
  });

  test("returns stable sha256 hash based on system info", () => {
    const id1 = getClientId();
    const id2 = getClientId();
    expect(id1).toBe(id2);
    expect(id1).toMatch(/^[0-9a-f]{64}$/);
  });
});

// ---------------------------------------------------------------------------
// ensureCacheDir
// ---------------------------------------------------------------------------
describe("ensureCacheDir", () => {
  test("creates cache directory when it does not exist", () => {
    fs.existsSync.mockReturnValue(false);
    ensureCacheDir();
    expect(fs.mkdirSync).toHaveBeenCalledWith(CACHE_DIR, { recursive: true });
  });

  test("does not call mkdirSync when directory exists", () => {
    fs.existsSync.mockReturnValue(true);
    ensureCacheDir();
    expect(fs.mkdirSync).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// cacheFilePath
// ---------------------------------------------------------------------------
describe("cacheFilePath", () => {
  test("returns path under homedir/.supercli/config.json", () => {
    expect(cacheFilePath()).toBe(CACHE_FILE);
  });
});
