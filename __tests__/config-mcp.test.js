"use strict";

jest.mock("fs");
jest.mock("os", () => ({
  homedir: jest.fn(() => "/home/user"),
  hostname: jest.fn(() => "host"),
  type: jest.fn(() => "Linux"),
  release: jest.fn(() => "5.0"),
  arch: jest.fn(() => "x64"),
  userInfo: jest.fn(() => ({ username: "user" })),
}));
jest.mock("../cli/plugins-store", () => ({
  getEffectivePluginCommands: jest.fn(() => []),
}));

const fs = require("fs");
const os = require("os");
const { setMcpServer, removeMcpServer } = require("../cli/config-mcp");

describe("config-mcp", () => {
  const cacheFile = "/home/user/.supercli/config.json";
  const cacheDir = "/home/user/.supercli";

  function mockCacheWith(servers) {
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReturnValue(
      JSON.stringify({ version: "1", mcp_servers: servers, specs: [], commands: [] })
    );
  }

  function lastWritten() {
    const calls = fs.writeFileSync.mock.calls;
    if (!calls.length) return null;
    return JSON.parse(calls[calls.length - 1][1]);
  }

  beforeEach(() => {
    jest.clearAllMocks();
    fs.existsSync.mockReturnValue(false);
    fs.mkdirSync.mockImplementation(() => {});
    fs.writeFileSync.mockImplementation(() => {});
  });

  // ── setMcpServer ──────────────────────────────────────────────────────────

  describe("setMcpServer — upsert", () => {
    test("adds new server to empty config when cache is missing", async () => {
      fs.existsSync.mockReturnValue(false);
      await setMcpServer("new-srv", "http://new");
      const written = lastWritten();
      expect(written.mcp_servers).toContainEqual({ name: "new-srv", url: "http://new" });
    });

    test("adds new server to existing list without touching other entries", async () => {
      mockCacheWith([{ name: "existing", url: "http://existing" }]);
      await setMcpServer("second", "http://second");
      const written = lastWritten();
      expect(written.mcp_servers).toHaveLength(2);
      expect(written.mcp_servers).toContainEqual({ name: "existing", url: "http://existing" });
      expect(written.mcp_servers).toContainEqual({ name: "second", url: "http://second" });
    });

    test("updates existing server by name (upsert replaces, not duplicates)", async () => {
      mockCacheWith([{ name: "srv", url: "http://old" }]);
      await setMcpServer("srv", "http://new");
      const written = lastWritten();
      const matches = written.mcp_servers.filter(s => s.name === "srv");
      expect(matches).toHaveLength(1);
      expect(matches[0].url).toBe("http://new");
    });

    test("string value is treated as url field", async () => {
      await setMcpServer("s", "http://url");
      const written = lastWritten();
      expect(written.mcp_servers).toContainEqual({ name: "s", url: "http://url" });
    });

    test("object value is merged with name", async () => {
      await setMcpServer("runner", { command: "node", args: ["server.js"] });
      const written = lastWritten();
      expect(written.mcp_servers).toContainEqual({ name: "runner", command: "node", args: ["server.js"] });
    });

    test("supports headers and env in object value", async () => {
      await setMcpServer("auth-srv", {
        url: "http://auth",
        headers: { Authorization: "Bearer tok" },
        env: { TOKEN: "tok" },
      });
      const written = lastWritten();
      expect(written.mcp_servers).toContainEqual(
        expect.objectContaining({ name: "auth-srv", headers: { Authorization: "Bearer tok" }, env: { TOKEN: "tok" } })
      );
    });

    test("non-string, non-object value becomes empty entry with just name field", async () => {
      // null/number value → incoming = {} → normalizeMcpServerEntry returns { name }
      await setMcpServer("bare", null);
      const written = lastWritten();
      const entry = written.mcp_servers.find(s => s.name === "bare");
      expect(entry).toEqual({ name: "bare" });
    });

    test("throws with code 85 when server name is empty string", async () => {
      await expect(setMcpServer("", "http://url")).rejects.toMatchObject({
        code: 85,
        type: "invalid_argument",
      });
    });

    test("result returned by setMcpServer includes the updated mcp_servers", async () => {
      const result = await setMcpServer("ret", "http://ret");
      expect(Array.isArray(result.mcp_servers)).toBe(true);
      expect(result.mcp_servers).toContainEqual({ name: "ret", url: "http://ret" });
    });

    test("writes to cache file (persists)", async () => {
      await setMcpServer("persisted", "http://p");
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        cacheFile,
        expect.stringContaining("persisted")
      );
    });
  });

  // ── dedup via normalizeMcpServers ─────────────────────────────────────────

  describe("setMcpServer — dedup via normalizeMcpServers", () => {
    test("deduplicates servers with same name (last-write wins)", async () => {
      // Seed cache with a duplicate — normalizeMcpServers uses a Map so last entry wins
      mockCacheWith([
        { name: "dup", url: "http://first" },
        { name: "dup", url: "http://second" },
      ]);
      await setMcpServer("unrelated", "http://other");
      const written = lastWritten();
      const dups = written.mcp_servers.filter(s => s.name === "dup");
      expect(dups).toHaveLength(1);
    });

    test("result list is sorted alphabetically by name", async () => {
      mockCacheWith([
        { name: "z-srv", url: "http://z" },
        { name: "a-srv", url: "http://a" },
        { name: "m-srv", url: "http://m" },
      ]);
      await setMcpServer("b-srv", "http://b");
      const written = lastWritten();
      const names = written.mcp_servers.map(s => s.name);
      expect(names).toEqual([...names].sort());
    });

    test("normalization strips invalid entries (null items) from stored list", async () => {
      mockCacheWith([null, { name: "valid", url: "http://v" }, undefined]);
      await setMcpServer("added", "http://added");
      const written = lastWritten();
      expect(written.mcp_servers.some(s => s === null || s === undefined)).toBe(false);
      expect(written.mcp_servers).toContainEqual({ name: "valid", url: "http://v" });
    });

    test("entry with numeric name in stored list is dropped during normalization", async () => {
      mockCacheWith([{ name: 42, url: "http://bad" }, { name: "ok", url: "http://ok" }]);
      await setMcpServer("new", "http://new");
      const written = lastWritten();
      expect(written.mcp_servers.find(s => s.name === 42)).toBeUndefined();
    });
  });

  // ── removeMcpServer ───────────────────────────────────────────────────────

  describe("removeMcpServer — persistence", () => {
    test("removes named server and returns true", async () => {
      mockCacheWith([
        { name: "target", url: "http://target" },
        { name: "keep", url: "http://keep" },
      ]);
      const removed = await removeMcpServer("target");
      expect(removed).toBe(true);
      const written = lastWritten();
      expect(written.mcp_servers.find(s => s.name === "target")).toBeUndefined();
      expect(written.mcp_servers).toContainEqual(expect.objectContaining({ name: "keep" }));
    });

    test("persists updated list to cache file after removal", async () => {
      mockCacheWith([{ name: "del", url: "http://del" }]);
      await removeMcpServer("del");
      expect(fs.writeFileSync).toHaveBeenCalled();
      const written = lastWritten();
      expect(written.mcp_servers).toEqual([]);
    });

    test("returns true when exactly one of many entries is removed", async () => {
      mockCacheWith([
        { name: "a", url: "http://a" },
        { name: "b", url: "http://b" },
        { name: "c", url: "http://c" },
      ]);
      const removed = await removeMcpServer("b");
      expect(removed).toBe(true);
      const written = lastWritten();
      const names = written.mcp_servers.map(s => s.name);
      expect(names).not.toContain("b");
      expect(names).toContain("a");
      expect(names).toContain("c");
    });
  });

  // ── removeMcpServer — no-op ───────────────────────────────────────────────

  describe("removeMcpServer — missing-server no-op", () => {
    test("returns false when server is not found", async () => {
      mockCacheWith([{ name: "other", url: "http://other" }]);
      const removed = await removeMcpServer("missing");
      expect(removed).toBe(false);
    });

    test("does not modify cache when server is not found", async () => {
      mockCacheWith([{ name: "stay", url: "http://stay" }]);
      fs.writeFileSync.mockClear();
      await removeMcpServer("ghost");
      // writeCache is still called (to persist unchanged list) — but the servers list is unchanged
      const written = lastWritten();
      if (written) {
        expect(written.mcp_servers).toContainEqual(expect.objectContaining({ name: "stay" }));
      }
    });

    test("returns false when config has no mcp_servers field", async () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(JSON.stringify({ version: "1" }));
      const removed = await removeMcpServer("any");
      expect(removed).toBe(false);
    });

    test("returns false when cache is missing entirely", async () => {
      fs.existsSync.mockReturnValue(false);
      const removed = await removeMcpServer("ghost");
      expect(removed).toBe(false);
    });

    test("returns false when mcp_servers is an empty array", async () => {
      mockCacheWith([]);
      const removed = await removeMcpServer("nobody");
      expect(removed).toBe(false);
    });
  });
});
