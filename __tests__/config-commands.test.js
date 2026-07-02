"use strict";

jest.mock("../cli/config-core", () => ({
  readCache: jest.fn(),
  writeCache: jest.fn(),
  emptyConfig: jest.fn(),
  cacheFilePath: jest.fn(),
}));

jest.mock("../cli/plugins-store", () => ({
  listInstalledPlugins: jest.fn(),
  readServerPluginsLock: jest.fn(),
}));

const { readCache, writeCache, emptyConfig, cacheFilePath } = require("../cli/config-core");
const { listInstalledPlugins, readServerPluginsLock } = require("../cli/plugins-store");
const { upsertCommand, removeCommandsByNamespace, showConfig } = require("../cli/config-commands");

function makeCmd(overrides = {}) {
  return {
    namespace: "ai",
    resource: "text",
    action: "summarize",
    adapter: "http",
    ...overrides,
  };
}

const BASE_EMPTY = { version: "1", ttl: 3600, mcp_servers: [], specs: [], commands: [] };

beforeEach(() => {
  jest.resetAllMocks();
  emptyConfig.mockReturnValue({ ...BASE_EMPTY, commands: [] });
  writeCache.mockImplementation(cfg => cfg);
  cacheFilePath.mockReturnValue("/home/user/.supercli/config.json");
  listInstalledPlugins.mockReturnValue([]);
  readServerPluginsLock.mockReturnValue({ installed: {} });
});

// ─── upsertCommand ────────────────────────────────────────────────────────────

describe("upsertCommand", () => {
  test("adds command when cache is null (uses emptyConfig)", async () => {
    readCache.mockReturnValue(null);
    const cmd = makeCmd();
    const result = await upsertCommand(cmd);
    expect(result).toBe(cmd);
    const written = writeCache.mock.calls[0][0];
    expect(written.commands).toEqual([cmd]);
  });

  test("adds command when cache has empty commands array", async () => {
    readCache.mockReturnValue({ commands: [] });
    const cmd = makeCmd();
    await upsertCommand(cmd);
    const written = writeCache.mock.calls[0][0];
    expect(written.commands).toHaveLength(1);
    expect(written.commands[0]).toBe(cmd);
  });

  test("adds command when cache commands field is not an array", async () => {
    readCache.mockReturnValue({ commands: null });
    const cmd = makeCmd();
    await upsertCommand(cmd);
    const written = writeCache.mock.calls[0][0];
    expect(written.commands).toEqual([cmd]);
  });

  test("appends when no existing command matches namespace+resource+action", async () => {
    const existing = makeCmd({ namespace: "ns", resource: "r", action: "a" });
    readCache.mockReturnValue({ commands: [existing] });
    const newCmd = makeCmd({ namespace: "ns2", resource: "r", action: "a" });
    await upsertCommand(newCmd);
    const written = writeCache.mock.calls[0][0];
    expect(written.commands).toHaveLength(2);
    expect(written.commands[0]).toEqual(existing);
    expect(written.commands[1]).toBe(newCmd);
  });

  test("updates existing command when namespace+resource+action match", async () => {
    const original = makeCmd({ description: "old" });
    readCache.mockReturnValue({ commands: [original] });
    const updated = makeCmd({ description: "new" });
    await upsertCommand(updated);
    const written = writeCache.mock.calls[0][0];
    expect(written.commands).toHaveLength(1);
    expect(written.commands[0].description).toBe("new");
  });

  test("updates correct command when multiple commands exist", async () => {
    const keep = makeCmd({ namespace: "other", resource: "r", action: "a" });
    const old = makeCmd({ description: "old" });
    readCache.mockReturnValue({ commands: [keep, old] });
    const updated = makeCmd({ description: "updated" });
    await upsertCommand(updated);
    const written = writeCache.mock.calls[0][0];
    expect(written.commands).toHaveLength(2);
    expect(written.commands[0]).toEqual(keep);
    expect(written.commands[1].description).toBe("updated");
  });

  test("does not mutate original commands array from cache", async () => {
    const commands = [makeCmd({ description: "original" })];
    readCache.mockReturnValue({ commands });
    await upsertCommand(makeCmd({ description: "updated" }));
    expect(commands[0].description).toBe("original");
  });

  test("returns the commandDef passed in", async () => {
    readCache.mockReturnValue({ commands: [] });
    const cmd = makeCmd();
    const returned = await upsertCommand(cmd);
    expect(returned).toBe(cmd);
  });

  test("calls writeCache exactly once", async () => {
    readCache.mockReturnValue({ commands: [] });
    await upsertCommand(makeCmd());
    expect(writeCache).toHaveBeenCalledTimes(1);
  });

  test("null entries in existing commands are preserved then replaced on match", async () => {
    readCache.mockReturnValue({ commands: [null, makeCmd({ description: "old" })] });
    const updated = makeCmd({ description: "new" });
    await upsertCommand(updated);
    const written = writeCache.mock.calls[0][0];
    expect(written.commands[0]).toBeNull();
    expect(written.commands[1].description).toBe("new");
  });

  test("ignores null entries when searching for match to upsert", async () => {
    readCache.mockReturnValue({ commands: [null] });
    const cmd = makeCmd();
    await upsertCommand(cmd);
    const written = writeCache.mock.calls[0][0];
    expect(written.commands[written.commands.length - 1]).toBe(cmd);
  });
});

// ─── removeCommandsByNamespace ────────────────────────────────────────────────

describe("removeCommandsByNamespace", () => {
  test("returns 0 when cache is null", async () => {
    readCache.mockReturnValue(null);
    const removed = await removeCommandsByNamespace("ns");
    expect(removed).toBe(0);
    expect(writeCache).toHaveBeenCalledTimes(1);
  });

  test("returns 0 when no commands match namespace", async () => {
    readCache.mockReturnValue({ commands: [makeCmd({ namespace: "other" })] });
    const removed = await removeCommandsByNamespace("ns");
    expect(removed).toBe(0);
  });

  test("removes one matching command and returns 1", async () => {
    readCache.mockReturnValue({ commands: [makeCmd()] });
    const removed = await removeCommandsByNamespace("ai");
    expect(removed).toBe(1);
    const written = writeCache.mock.calls[0][0];
    expect(written.commands).toHaveLength(0);
  });

  test("removes multiple matching commands and returns correct count", async () => {
    readCache.mockReturnValue({
      commands: [
        makeCmd({ resource: "r1", action: "a1" }),
        makeCmd({ resource: "r2", action: "a2" }),
        makeCmd({ namespace: "other" }),
      ],
    });
    const removed = await removeCommandsByNamespace("ai");
    expect(removed).toBe(2);
    const written = writeCache.mock.calls[0][0];
    expect(written.commands).toHaveLength(1);
    expect(written.commands[0].namespace).toBe("other");
  });

  test("keeps non-matching namespace commands intact", async () => {
    const keep = makeCmd({ namespace: "keep" });
    readCache.mockReturnValue({ commands: [makeCmd(), keep] });
    await removeCommandsByNamespace("ai");
    const written = writeCache.mock.calls[0][0];
    expect(written.commands).toEqual([keep]);
  });

  test("handles non-array commands field (treats as empty)", async () => {
    readCache.mockReturnValue({ commands: "bad" });
    const removed = await removeCommandsByNamespace("ai");
    expect(removed).toBe(0);
    const written = writeCache.mock.calls[0][0];
    expect(written.commands).toEqual([]);
  });

  test("skips null entries without throwing", async () => {
    readCache.mockReturnValue({ commands: [null, makeCmd()] });
    const removed = await removeCommandsByNamespace("ai");
    expect(removed).toBe(1);
  });

  test("calls writeCache exactly once", async () => {
    readCache.mockReturnValue({ commands: [] });
    await removeCommandsByNamespace("ns");
    expect(writeCache).toHaveBeenCalledTimes(1);
  });

  test("empty namespace string removes commands with empty namespace", async () => {
    const cmd = makeCmd({ namespace: "" });
    readCache.mockReturnValue({ commands: [cmd, makeCmd()] });
    const removed = await removeCommandsByNamespace("");
    expect(removed).toBe(1);
  });
});

// ─── showConfig ───────────────────────────────────────────────────────────────

describe("showConfig", () => {
  test("returns cached:false with message when no cache", async () => {
    readCache.mockReturnValue(null);
    const result = await showConfig();
    expect(result.cached).toBe(false);
    expect(result.message).toMatch(/No config cached/);
  });

  test("returns full summary when cache exists", async () => {
    readCache.mockReturnValue({
      version: "2",
      ttl: 7200,
      fetchedAt: 0,
      commands: [makeCmd(), makeCmd({ action: "a2" })],
      mcp_servers: [{ name: "s" }],
      specs: [1, 2, 3],
    });
    listInstalledPlugins.mockReturnValue([1, 2]);
    readServerPluginsLock.mockReturnValue({ installed: { p1: {}, p2: {}, p3: {} } });

    const result = await showConfig();
    expect(result.version).toBe("2");
    expect(result.ttl).toBe(7200);
    expect(result.commands).toBe(2);
    expect(result.plugins).toBe(2);
    expect(result.server_plugins).toBe(3);
    expect(result.mcp_servers).toBe(1);
    expect(result.specs).toBe(3);
    expect(result.cacheFile).toBe("/home/user/.supercli/config.json");
  });

  test("defaults counts to 0 when commands/mcp_servers/specs are absent", async () => {
    readCache.mockReturnValue({ version: "1", fetchedAt: 0 });
    const result = await showConfig();
    expect(result.commands).toBe(0);
    expect(result.mcp_servers).toBe(0);
    expect(result.specs).toBe(0);
  });

  test("fetchedAt is converted to ISO string", async () => {
    const ts = 1_000_000_000_000;
    readCache.mockReturnValue({ fetchedAt: ts, commands: [], mcp_servers: [], specs: [] });
    const result = await showConfig();
    expect(result.fetchedAt).toBe(new Date(ts).toISOString());
  });

  test("server_plugins counts keys from installed object", async () => {
    readCache.mockReturnValue({ commands: [], mcp_servers: [], specs: [], fetchedAt: 0 });
    readServerPluginsLock.mockReturnValue({ installed: { a: 1, b: 2 } });
    const result = await showConfig();
    expect(result.server_plugins).toBe(2);
  });

  test("server_plugins is 0 when installed field is absent", async () => {
    readCache.mockReturnValue({ commands: [], mcp_servers: [], specs: [], fetchedAt: 0 });
    readServerPluginsLock.mockReturnValue({});
    const result = await showConfig();
    expect(result.server_plugins).toBe(0);
  });

  test("uses cacheFilePath() from config-core", async () => {
    cacheFilePath.mockReturnValue("/custom/path/config.json");
    readCache.mockReturnValue({ commands: [], mcp_servers: [], specs: [], fetchedAt: 0 });
    const result = await showConfig();
    expect(result.cacheFile).toBe("/custom/path/config.json");
  });

  test("plugins count reflects listInstalledPlugins length", async () => {
    readCache.mockReturnValue({ commands: [], mcp_servers: [], specs: [], fetchedAt: 0 });
    listInstalledPlugins.mockReturnValue(["p1", "p2", "p3", "p4"]);
    const result = await showConfig();
    expect(result.plugins).toBe(4);
  });
});
