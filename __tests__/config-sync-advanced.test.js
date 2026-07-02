"use strict";

// Tests for the non-trivial exports of cli/config-sync.js that need mocking:
// runServerPluginPostInstall, ensurePluginDir, extractZipToDir,
// syncServerPlugins (conflict resolution, partial updates, stale-lock detection),
// syncClientPluginResources, syncCliAdapters.

const path = require("path");
const fs = require("fs");

// child_process is destructured in config-sync.js so must be mocked at module level
jest.mock("child_process", () => ({ spawnSync: jest.fn() }));

jest.mock("../cli/plugins-store", () => ({
  listInstalledPlugins: jest.fn(),
  readServerPluginsLock: jest.fn(),
  writeServerPluginsLock: jest.fn(),
  readPluginsLock: jest.fn(),
  SUPERCLI_PLUGINS_DIR: "/mock/plugins",
}));

jest.mock("../cli/config-core", () => ({
  readCache: jest.fn(),
  writeCache: jest.fn(() => ({ written: true })),
  emptyConfig: jest.fn(() => ({})),
  normalizeConfig: jest.fn((c) => c),
  fetchRemoteConfig: jest.fn(),
  getClientId: jest.fn(() => "test-client-id"),
  normalizeMcpServers: jest.fn((s) => s),
}));

const { spawnSync } = require("child_process");
const pluginsStore = require("../cli/plugins-store");
const configCore = require("../cli/config-core");

const {
  runServerPluginPostInstall,
  ensurePluginDir,
  extractZipToDir,
  syncServerPlugins,
  syncClientPluginResources,
  syncCliAdapters,
} = require("../cli/config-sync");

const PLUGIN_DIR = "/fake/plugins/myplugin/1.0.0";

// ─── runServerPluginPostInstall ───────────────────────────────────────────────

describe("runServerPluginPostInstall", () => {
  let existsSyncSpy;

  beforeEach(() => {
    jest.resetAllMocks();
    existsSyncSpy = jest.spyOn(fs, "existsSync");
    pluginsStore.listInstalledPlugins.mockReturnValue([]);
    pluginsStore.readServerPluginsLock.mockReturnValue({ installed: {} });
  });

  afterEach(() => {
    existsSyncSpy.mockRestore();
  });

  test("returns policy_denied when hookPolicy is deny", () => {
    const plugin = { name: "test", manifest: { post_install: { script: "install.js" } } };
    const result = runServerPluginPostInstall(PLUGIN_DIR, plugin, "deny");
    expect(result).toEqual({ policy: "deny", executed: false, reason: "policy_denied" });
    expect(spawnSync).not.toHaveBeenCalled();
  });

  test("returns hook_missing when manifest has no post_install (policy allow)", () => {
    const plugin = { name: "test", manifest: {} };
    const result = runServerPluginPostInstall(PLUGIN_DIR, plugin, "allow");
    expect(result).toEqual({ policy: "allow", executed: false, reason: "hook_missing" });
  });

  test("returns policy_denied when manifest missing and policy is deny", () => {
    const plugin = { name: "test", manifest: {} };
    const result = runServerPluginPostInstall(PLUGIN_DIR, plugin, "deny");
    expect(result.reason).toBe("policy_denied");
  });

  test("returns unsupported_runtime for non-node runtime", () => {
    const plugin = { name: "test", manifest: { post_install: { runtime: "python", script: "install.py" } } };
    const result = runServerPluginPostInstall(PLUGIN_DIR, plugin, "allow");
    expect(result).toEqual({ policy: "allow", executed: false, reason: "unsupported_runtime" });
  });

  test("treats node runtime as supported", () => {
    existsSyncSpy.mockReturnValue(true);
    spawnSync.mockReturnValue({ error: null, status: 0 });
    const plugin = { name: "test", manifest: { post_install: { runtime: "node", script: "install.js" } } };
    const result = runServerPluginPostInstall(PLUGIN_DIR, plugin, "allow");
    expect(result.reason).toBeUndefined();
    expect(result.executed).toBe(true);
  });

  test("returns hook_missing when post_install.script is empty string", () => {
    const plugin = { name: "test", manifest: { post_install: { script: "" } } };
    const result = runServerPluginPostInstall(PLUGIN_DIR, plugin, "allow");
    expect(result).toEqual({ policy: "allow", executed: false, reason: "hook_missing" });
  });

  test("returns script_not_found for path traversal attempt", () => {
    existsSyncSpy.mockReturnValue(true);
    const plugin = { name: "test", manifest: { post_install: { script: "../evil.js" } } };
    const result = runServerPluginPostInstall(PLUGIN_DIR, plugin, "allow");
    expect(result).toEqual({ policy: "allow", executed: false, reason: "script_not_found" });
    expect(spawnSync).not.toHaveBeenCalled();
  });

  test("returns script_not_found when script file does not exist on disk", () => {
    existsSyncSpy.mockReturnValue(false);
    const plugin = { name: "test", manifest: { post_install: { script: "install.js" } } };
    const result = runServerPluginPostInstall(PLUGIN_DIR, plugin, "allow");
    expect(result).toEqual({ policy: "allow", executed: false, reason: "script_not_found" });
  });

  test("returns executed=true ok=true on successful script run", () => {
    existsSyncSpy.mockReturnValue(true);
    spawnSync.mockReturnValue({ error: null, status: 0, stdout: "", stderr: "" });
    const plugin = { name: "test", manifest: { post_install: { script: "install.js" } } };
    const result = runServerPluginPostInstall(PLUGIN_DIR, plugin, "allow");
    expect(result).toEqual({ policy: "allow", executed: true, ok: true });
  });

  test("returns ok=false with stderr when script exits non-zero", () => {
    existsSyncSpy.mockReturnValue(true);
    spawnSync.mockReturnValue({ error: null, status: 1, stderr: "install failed" });
    const plugin = { name: "test", manifest: { post_install: { script: "install.js" } } };
    const result = runServerPluginPostInstall(PLUGIN_DIR, plugin, "allow");
    expect(result).toEqual({ policy: "allow", executed: true, ok: false, error: "install failed" });
  });

  test("falls back to 'exit N' message when stderr is empty on non-zero exit", () => {
    existsSyncSpy.mockReturnValue(true);
    spawnSync.mockReturnValue({ error: null, status: 2, stderr: "" });
    const plugin = { name: "test", manifest: { post_install: { script: "install.js" } } };
    const result = runServerPluginPostInstall(PLUGIN_DIR, plugin, "allow");
    expect(result.error).toBe("exit 2");
  });

  test("returns ok=false with error.message when spawnSync sets result.error", () => {
    existsSyncSpy.mockReturnValue(true);
    spawnSync.mockReturnValue({ error: new Error("ENOENT"), status: null });
    const plugin = { name: "test", manifest: { post_install: { script: "install.js" } } };
    const result = runServerPluginPostInstall(PLUGIN_DIR, plugin, "allow");
    expect(result).toEqual({ policy: "allow", executed: true, ok: false, error: "ENOENT" });
  });

  test("caps timeout at 15000ms when manifest specifies higher value", () => {
    existsSyncSpy.mockReturnValue(true);
    spawnSync.mockReturnValue({ error: null, status: 0 });
    const plugin = { name: "test", manifest: { post_install: { script: "install.js", timeout_ms: 60000 } } };
    runServerPluginPostInstall(PLUGIN_DIR, plugin, "allow");
    expect(spawnSync).toHaveBeenCalledWith(
      "node",
      [expect.any(String)],
      expect.objectContaining({ timeout: 15000 })
    );
  });

  test("uses specified timeout when within 15000ms limit", () => {
    existsSyncSpy.mockReturnValue(true);
    spawnSync.mockReturnValue({ error: null, status: 0 });
    const plugin = { name: "test", manifest: { post_install: { script: "install.js", timeout_ms: 5000 } } };
    runServerPluginPostInstall(PLUGIN_DIR, plugin, "allow");
    expect(spawnSync).toHaveBeenCalledWith(
      "node",
      [expect.any(String)],
      expect.objectContaining({ timeout: 5000 })
    );
  });

  test("defaults to 15000ms when timeout_ms is non-numeric", () => {
    existsSyncSpy.mockReturnValue(true);
    spawnSync.mockReturnValue({ error: null, status: 0 });
    const plugin = { name: "test", manifest: { post_install: { script: "install.js", timeout_ms: "fast" } } };
    runServerPluginPostInstall(PLUGIN_DIR, plugin, "allow");
    expect(spawnSync).toHaveBeenCalledWith(
      "node",
      [expect.any(String)],
      expect.objectContaining({ timeout: 15000 })
    );
  });

  test("sets SUPERCLI_PLUGIN_NAME and SUPERCLI_PLUGIN_DIR in env", () => {
    existsSyncSpy.mockReturnValue(true);
    spawnSync.mockReturnValue({ error: null, status: 0 });
    const plugin = { name: "my-plugin", manifest: { post_install: { script: "install.js" } } };
    runServerPluginPostInstall(PLUGIN_DIR, plugin, "allow");
    const callEnv = spawnSync.mock.calls[0][2].env;
    expect(callEnv.SUPERCLI_PLUGIN_NAME).toBe("my-plugin");
    expect(callEnv.SUPERCLI_PLUGIN_DIR).toBe(PLUGIN_DIR);
  });
});

// ─── extractZipToDir ─────────────────────────────────────────────────────────

describe("extractZipToDir", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("succeeds without throwing when unzip exits 0", () => {
    spawnSync.mockReturnValue({ error: null, status: 0 });
    expect(() => extractZipToDir("/archive.zip", "/target")).not.toThrow();
    expect(spawnSync).toHaveBeenCalledWith(
      "unzip",
      ["-o", "/archive.zip", "-d", "/target"],
      expect.objectContaining({ encoding: "utf-8", timeout: 15000 })
    );
  });

  test("throws with ENOENT message suggesting install when unzip is missing", () => {
    const enoentError = Object.assign(new Error("not found"), { code: "ENOENT" });
    spawnSync.mockReturnValue({ error: enoentError, status: null });
    expect(() => extractZipToDir("/archive.zip", "/target")).toThrow(/unzip.*command is required/i);
  });

  test("thrown error has code 105, type integration_error, recoverable true (ENOENT)", () => {
    const enoentError = Object.assign(new Error("not found"), { code: "ENOENT" });
    spawnSync.mockReturnValue({ error: enoentError, status: null });
    expect.assertions(3);
    try {
      extractZipToDir("/archive.zip", "/target");
    } catch (err) {
      expect(err.code).toBe(105);
      expect(err.type).toBe("integration_error");
      expect(err.recoverable).toBe(true);
    }
  });

  test("throws with spawnSync error message on non-ENOENT spawn failure", () => {
    spawnSync.mockReturnValue({ error: new Error("EPERM"), status: null });
    expect.assertions(2);
    try {
      extractZipToDir("/archive.zip", "/target");
    } catch (err) {
      expect(err.code).toBe(105);
      expect(err.message).toBe("EPERM");
    }
  });

  test("throws code 105 when unzip exits non-zero with stderr message", () => {
    spawnSync.mockReturnValue({ error: null, status: 1, stderr: "bad zipfile" });
    expect.assertions(2);
    try {
      extractZipToDir("/archive.zip", "/target");
    } catch (err) {
      expect(err.code).toBe(105);
      expect(err.message).toContain("bad zipfile");
    }
  });

  test("includes 'exit N' in message when unzip exits non-zero with empty stderr", () => {
    spawnSync.mockReturnValue({ error: null, status: 2, stderr: "" });
    expect.assertions(1);
    try {
      extractZipToDir("/archive.zip", "/target");
    } catch (err) {
      expect(err.message).toContain("exit 2");
    }
  });
});

// ─── ensurePluginDir ──────────────────────────────────────────────────────────

describe("ensurePluginDir", () => {
  let mkdirSyncSpy;

  beforeEach(() => {
    jest.resetAllMocks();
    mkdirSyncSpy = jest.spyOn(fs, "mkdirSync").mockImplementation(() => {});
  });

  afterEach(() => {
    mkdirSyncSpy.mockRestore();
  });

  test("returns path composed of rootDir, sanitized name, and sanitized version", () => {
    const dir = ensurePluginDir("/plugins", "alpha", "2.1.0");
    expect(dir).toBe(path.join("/plugins", "alpha", "2.1.0"));
  });

  test("creates directory with recursive: true", () => {
    ensurePluginDir("/plugins", "alpha", "2.1.0");
    expect(mkdirSyncSpy).toHaveBeenCalledWith(path.join("/plugins", "alpha", "2.1.0"), { recursive: true });
  });

  test("sanitizes invalid characters in plugin name", () => {
    const dir = ensurePluginDir("/root", "bad!name", "1.0.0");
    expect(dir).toContain("bad-name");
    expect(dir).not.toContain("!");
  });

  test("sanitizes plus sign in version string", () => {
    const dir = ensurePluginDir("/root", "myplugin", "1.0.0+build");
    expect(dir).toContain("1.0.0-build");
    expect(dir).not.toContain("+");
  });

  test("uses '0.0.0' fallback when version is empty", () => {
    const dir = ensurePluginDir("/root", "myplugin", "");
    expect(dir).toContain("0.0.0");
  });
});

// ─── syncServerPlugins ────────────────────────────────────────────────────────

describe("syncServerPlugins", () => {
  let fetchMock;
  let mkdirSyncSpy;
  let rmSyncSpy;
  let existsSyncSpy;
  let writeFileSyncSpy;

  beforeEach(() => {
    jest.resetAllMocks();
    fetchMock = jest.fn();
    global.fetch = fetchMock;

    mkdirSyncSpy = jest.spyOn(fs, "mkdirSync").mockImplementation(() => {});
    rmSyncSpy = jest.spyOn(fs, "rmSync").mockImplementation(() => {});
    existsSyncSpy = jest.spyOn(fs, "existsSync").mockReturnValue(true);
    writeFileSyncSpy = jest.spyOn(fs, "writeFileSync").mockImplementation(() => {});
    // spawnSync is already a jest.fn() from jest.mock("child_process")
    spawnSync.mockReturnValue({ error: null, status: 0 });

    pluginsStore.readServerPluginsLock.mockReturnValue({ installed: {} });
    pluginsStore.listInstalledPlugins.mockReturnValue([]);
    pluginsStore.writeServerPluginsLock.mockImplementation(() => {});
  });

  afterEach(() => {
    mkdirSyncSpy.mockRestore();
    rmSyncSpy.mockRestore();
    existsSyncSpy.mockRestore();
    writeFileSyncSpy.mockRestore();
  });

  function makePluginsResponse(plugins = [], settings = {}) {
    return {
      status: 200,
      ok: true,
      json: async () => ({
        settings: { default_hooks_policy: "deny", max_zip_mb: 10, ...settings },
        plugins,
      }),
    };
  }

  function makePlugin(overrides = {}) {
    return {
      name: "test-plugin",
      enabled: true,
      checksum: "abc123",
      version: "1.0.0",
      manifest: { commands: [] },
      ...overrides,
    };
  }

  test("returns skipped=true reason=server_plugins_endpoint_missing on 404", async () => {
    fetchMock.mockResolvedValue({ status: 404, ok: false });
    const result = await syncServerPlugins("http://server");
    expect(result).toMatchObject({
      skipped: true,
      reason: "server_plugins_endpoint_missing",
      total: 0,
      enabled: 0,
    });
  });

  test("throws on non-ok non-404 response", async () => {
    fetchMock.mockResolvedValue({ status: 500, ok: false, statusText: "Internal Server Error" });
    await expect(syncServerPlugins("http://server")).rejects.toThrow(
      "Failed to fetch server plugins: 500"
    );
  });

  test("records plugin as unchanged when checksum matches lock", async () => {
    pluginsStore.readServerPluginsLock.mockReturnValue({
      installed: {
        "test-plugin": { checksum: "abc123", plugin_dir: "/mock/plugins/server/test-plugin/1.0.0" },
      },
    });
    fetchMock.mockResolvedValue(makePluginsResponse([makePlugin()]));
    const result = await syncServerPlugins("http://server");
    expect(result.unchanged).toContain("test-plugin");
    expect(result.updated).not.toContain("test-plugin");
  });

  test("records plugin as updated when checksum differs from lock", async () => {
    pluginsStore.readServerPluginsLock.mockReturnValue({
      installed: {
        "test-plugin": { checksum: "old-checksum", plugin_dir: "/mock/plugins/server/test-plugin/1.0.0" },
      },
    });
    fetchMock.mockResolvedValue(makePluginsResponse([makePlugin({ checksum: "new-checksum" })]));
    const result = await syncServerPlugins("http://server");
    expect(result.updated).toContain("test-plugin");
    expect(result.unchanged).not.toContain("test-plugin");
  });

  test("conflict resolution: shadows local plugin with same name, does not install it", async () => {
    pluginsStore.listInstalledPlugins.mockReturnValue([{ name: "conflicting" }]);
    fetchMock.mockResolvedValue(makePluginsResponse([makePlugin({ name: "conflicting" })]));
    const result = await syncServerPlugins("http://server");
    expect(result.shadowed_by_local).toContain("conflicting");
    expect(result.updated).not.toContain("conflicting");
  });

  test("stale-lock detection: removes lock entry and dir when plugin absent from server", async () => {
    pluginsStore.readServerPluginsLock.mockReturnValue({
      installed: {
        "stale-plugin": { checksum: "old", plugin_dir: "/mock/plugins/server/stale-plugin/1.0.0" },
      },
    });
    fetchMock.mockResolvedValue(makePluginsResponse([]));
    const result = await syncServerPlugins("http://server");
    expect(result.removed).toContain("stale-plugin");
    expect(rmSyncSpy).toHaveBeenCalledWith(
      "/mock/plugins/server/stale-plugin/1.0.0",
      { recursive: true, force: true }
    );
  });

  test("skips dir removal when stale plugin dir does not exist", async () => {
    existsSyncSpy.mockReturnValue(false);
    pluginsStore.readServerPluginsLock.mockReturnValue({
      installed: { "stale-plugin": { checksum: "old", plugin_dir: "/nonexistent" } },
    });
    fetchMock.mockResolvedValue(makePluginsResponse([]));
    const result = await syncServerPlugins("http://server");
    expect(result.removed).toContain("stale-plugin");
    expect(rmSyncSpy).not.toHaveBeenCalled();
  });

  test("partial update: only changed plugin updated when multiple present", async () => {
    pluginsStore.readServerPluginsLock.mockReturnValue({
      installed: {
        "stable-plugin": { checksum: "same-checksum", plugin_dir: "/d/stable/1.0.0" },
      },
    });
    fetchMock.mockResolvedValue(
      makePluginsResponse([
        makePlugin({ name: "stable-plugin", checksum: "same-checksum" }),
        makePlugin({ name: "new-plugin", checksum: "brand-new", version: "2.0.0" }),
      ])
    );
    const result = await syncServerPlugins("http://server");
    expect(result.unchanged).toContain("stable-plugin");
    expect(result.updated).toContain("new-plugin");
    expect(result.updated).not.toContain("stable-plugin");
    expect(result.unchanged).not.toContain("new-plugin");
  });

  test("skips disabled plugins (enabled: false)", async () => {
    fetchMock.mockResolvedValue(
      makePluginsResponse([makePlugin({ name: "off-plugin", enabled: false })])
    );
    const result = await syncServerPlugins("http://server");
    expect(result.total).toBe(1);
    expect(result.enabled).toBe(0);
    expect(result.updated).not.toContain("off-plugin");
  });

  test("throws code 105 when plugin is missing manifest", async () => {
    fetchMock.mockResolvedValue(
      makePluginsResponse([makePlugin({ manifest: null })])
    );
    await expect(syncServerPlugins("http://server")).rejects.toMatchObject({ code: 105 });
  });

  test("throws code 105 when manifest is not an object", async () => {
    fetchMock.mockResolvedValue(
      makePluginsResponse([makePlugin({ manifest: "string-manifest" })])
    );
    await expect(syncServerPlugins("http://server")).rejects.toMatchObject({ code: 105 });
  });

  test("writes updated lock after sync completes", async () => {
    fetchMock.mockResolvedValue(makePluginsResponse([makePlugin()]));
    await syncServerPlugins("http://server");
    expect(pluginsStore.writeServerPluginsLock).toHaveBeenCalledWith(
      expect.objectContaining({ version: 1 })
    );
  });

  test("installed entry includes name, version, checksum, source, and commands", async () => {
    fetchMock.mockResolvedValue(
      makePluginsResponse([
        makePlugin({ manifest: { commands: [{ name: "run" }] }, description: "A plugin" }),
      ])
    );
    await syncServerPlugins("http://server");
    const lockArg = pluginsStore.writeServerPluginsLock.mock.calls[0][0];
    const entry = lockArg.installed["test-plugin"];
    expect(entry.name).toBe("test-plugin");
    expect(entry.version).toBe("1.0.0");
    expect(entry.checksum).toBe("abc123");
    expect(entry.source).toBe("server");
    expect(Array.isArray(entry.commands)).toBe(true);
  });

  test("zip plugin: fetches archive and extracts it when source_type is zip", async () => {
    const zipBytes = Buffer.from("PK fake zip");
    fetchMock
      .mockResolvedValueOnce(
        makePluginsResponse([makePlugin({ source_type: "zip" })])
      )
      .mockResolvedValueOnce({
        ok: true,
        arrayBuffer: async () => zipBytes,
      });
    await syncServerPlugins("http://server");
    expect(fetchMock).toHaveBeenCalledWith(
      "http://server/api/plugins/test-plugin/archive"
    );
    expect(writeFileSyncSpy).toHaveBeenCalledWith(
      expect.stringContaining("plugin.zip"),
      expect.any(Buffer)
    );
    expect(spawnSync).toHaveBeenCalledWith(
      "unzip",
      expect.arrayContaining(["-o"]),
      expect.any(Object)
    );
  });

  test("throws code 105 when zip archive download fails", async () => {
    fetchMock
      .mockResolvedValueOnce(makePluginsResponse([makePlugin({ source_type: "zip" })]))
      .mockResolvedValueOnce({ ok: false, status: 503 });
    await expect(syncServerPlugins("http://server")).rejects.toMatchObject({ code: 105 });
  });

  test("counts diagnostics totals correctly across enabled/disabled split", async () => {
    fetchMock.mockResolvedValue(
      makePluginsResponse([
        makePlugin({ name: "on", enabled: true }),
        makePlugin({ name: "off", enabled: false }),
      ])
    );
    const result = await syncServerPlugins("http://server");
    expect(result.total).toBe(2);
    expect(result.enabled).toBe(1);
  });
});

// ─── syncClientPluginResources ────────────────────────────────────────────────

describe("syncClientPluginResources", () => {
  let fetchMock;

  beforeEach(() => {
    jest.resetAllMocks();
    fetchMock = jest.fn();
    global.fetch = fetchMock;
    configCore.getClientId.mockReturnValue("cid-abc");
  });

  test("returns synced=0 errors=[] when no installed plugins have server_resources", async () => {
    pluginsStore.readPluginsLock.mockReturnValue({
      installed: { simple: { name: "simple" } },
    });
    const result = await syncClientPluginResources("http://server");
    expect(result).toEqual({ synced: 0, errors: [] });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test("returns synced=0 when installed is empty", async () => {
    pluginsStore.readPluginsLock.mockReturnValue({ installed: {} });
    const result = await syncClientPluginResources("http://server");
    expect(result).toEqual({ synced: 0, errors: [] });
  });

  test("posts to /api/plugins/client-resources for plugins with mcp resources", async () => {
    pluginsStore.readPluginsLock.mockReturnValue({
      installed: { "with-mcp": { server_resources: { mcp: true } } },
    });
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
    const result = await syncClientPluginResources("http://server");
    expect(fetchMock).toHaveBeenCalledWith(
      "http://server/api/plugins/client-resources",
      expect.objectContaining({ method: "POST" })
    );
    expect(result.synced).toBe(1);
  });

  test("posts to /api/plugins/client-resources for plugins with specs resources", async () => {
    pluginsStore.readPluginsLock.mockReturnValue({
      installed: { "with-specs": { server_resources: { specs: ["spec1"] } } },
    });
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({}) });
    const result = await syncClientPluginResources("http://server");
    expect(result.synced).toBe(1);
  });

  test("includes client_id in POST body", async () => {
    pluginsStore.readPluginsLock.mockReturnValue({
      installed: { "res-plugin": { server_resources: { mcp: true } } },
    });
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({}) });
    await syncClientPluginResources("http://server");
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.client_id).toBe("cid-abc");
  });

  test("returns errors array on network failure", async () => {
    pluginsStore.readPluginsLock.mockReturnValue({
      installed: { "res-plugin": { server_resources: { mcp: true } } },
    });
    fetchMock.mockRejectedValue(new Error("network error"));
    const result = await syncClientPluginResources("http://server");
    expect(result.errors).toContain("network error");
    expect(result.synced).toBe(0);
  });

  test("returns errors array on non-ok response", async () => {
    pluginsStore.readPluginsLock.mockReturnValue({
      installed: { "res-plugin": { server_resources: { mcp: true } } },
    });
    fetchMock.mockResolvedValue({ ok: false, status: 500, statusText: "Error" });
    const result = await syncClientPluginResources("http://server");
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.synced).toBe(0);
  });
});

// ─── syncCliAdapters ──────────────────────────────────────────────────────────

describe("syncCliAdapters", () => {
  let fetchMock;
  let mkdirSyncSpy;
  let readdirSyncSpy;
  let unlinkSyncSpy;
  let writeFileSyncSpy;
  let existsSyncSpy;

  beforeEach(() => {
    jest.resetAllMocks();
    fetchMock = jest.fn();
    global.fetch = fetchMock;
    mkdirSyncSpy = jest.spyOn(fs, "mkdirSync").mockImplementation(() => {});
    readdirSyncSpy = jest.spyOn(fs, "readdirSync").mockReturnValue([]);
    unlinkSyncSpy = jest.spyOn(fs, "unlinkSync").mockImplementation(() => {});
    writeFileSyncSpy = jest.spyOn(fs, "writeFileSync").mockImplementation(() => {});
    existsSyncSpy = jest.spyOn(fs, "existsSync").mockReturnValue(true);
  });

  afterEach(() => {
    mkdirSyncSpy.mockRestore();
    readdirSyncSpy.mockRestore();
    unlinkSyncSpy.mockRestore();
    writeFileSyncSpy.mockRestore();
    existsSyncSpy.mockRestore();
  });

  function makeAdapterListResponse(adapters = []) {
    return { ok: true, json: async () => ({ adapters }) };
  }

  function makeCLIAdapter(overrides = {}) {
    return {
      name: "my-adapter",
      execution_context: "cli",
      description: "A CLI adapter",
      timeout_ms: 5000,
      memory_limit_mb: 64,
      allow_network: false,
      updated_at: "2024-01-01T00:00:00Z",
      ...overrides,
    };
  }

  test("throws when /api/adapters returns non-ok response", async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 503 });
    await expect(syncCliAdapters("http://server")).rejects.toThrow(
      "Failed to fetch adapters: 503"
    );
  });

  test("returns total=0 synced=0 failed=0 when no cli adapters in response", async () => {
    fetchMock.mockResolvedValue(
      makeAdapterListResponse([{ name: "server-side", execution_context: "server" }])
    );
    const result = await syncCliAdapters("http://server");
    expect(result).toEqual({ total: 0, synced: 0, failed: 0 });
  });

  test("returns total=0 synced=0 failed=0 when adapters array is empty", async () => {
    fetchMock.mockResolvedValue(makeAdapterListResponse([]));
    const result = await syncCliAdapters("http://server");
    expect(result).toEqual({ total: 0, synced: 0, failed: 0 });
  });

  test("syncs one cli adapter and writes it to adapters dir", async () => {
    fetchMock
      .mockResolvedValueOnce(makeAdapterListResponse([makeCLIAdapter()]))
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ source: "module.exports = () => {};" }),
      });
    const result = await syncCliAdapters("http://server");
    expect(result).toMatchObject({ total: 1, synced: 1, failed: 0 });
    expect(writeFileSyncSpy).toHaveBeenCalledWith(
      expect.stringContaining("my-adapter.js"),
      expect.stringContaining("module.exports"),
      "utf-8"
    );
  });

  test("written file includes JSDoc metadata header with @name and @context", async () => {
    fetchMock
      .mockResolvedValueOnce(makeAdapterListResponse([makeCLIAdapter()]))
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ source: "// code" }),
      });
    await syncCliAdapters("http://server");
    const content = writeFileSyncSpy.mock.calls[0][1];
    expect(content).toMatch(/@name my-adapter/);
    expect(content).toMatch(/@context cli/);
  });

  test("counts failed when adapter source fetch returns non-ok", async () => {
    fetchMock
      .mockResolvedValueOnce(makeAdapterListResponse([makeCLIAdapter()]))
      .mockResolvedValueOnce({ ok: false, status: 404 });
    const result = await syncCliAdapters("http://server");
    expect(result).toMatchObject({ total: 1, synced: 0, failed: 1 });
    expect(writeFileSyncSpy).not.toHaveBeenCalled();
  });

  test("counts failed when source fetch throws network error", async () => {
    fetchMock
      .mockResolvedValueOnce(makeAdapterListResponse([makeCLIAdapter()]))
      .mockRejectedValueOnce(new Error("network"));
    const result = await syncCliAdapters("http://server");
    expect(result).toMatchObject({ total: 1, synced: 0, failed: 1 });
  });

  test("removes local .js files not present in server adapter list", async () => {
    readdirSyncSpy.mockReturnValue(["old-adapter.js", "other.txt"]);
    fetchMock.mockResolvedValue(makeAdapterListResponse([]));
    await syncCliAdapters("http://server");
    expect(unlinkSyncSpy).toHaveBeenCalledWith(
      expect.stringContaining("old-adapter.js")
    );
    expect(unlinkSyncSpy).not.toHaveBeenCalledWith(expect.stringContaining("other.txt"));
  });

  test("does not remove local adapter if still present in server list", async () => {
    readdirSyncSpy.mockReturnValue(["my-adapter.js"]);
    fetchMock
      .mockResolvedValueOnce(makeAdapterListResponse([makeCLIAdapter({ name: "my-adapter" })]))
      .mockResolvedValueOnce({ ok: true, json: async () => ({ source: "" }) });
    await syncCliAdapters("http://server");
    expect(unlinkSyncSpy).not.toHaveBeenCalled();
  });

  test("handles multiple adapters: syncs cli, ignores server-context", async () => {
    fetchMock
      .mockResolvedValueOnce(
        makeAdapterListResponse([
          makeCLIAdapter({ name: "cli-one" }),
          { name: "srv", execution_context: "server" },
          makeCLIAdapter({ name: "cli-two" }),
        ])
      )
      .mockResolvedValueOnce({ ok: true, json: async () => ({ source: "" }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ source: "" }) });
    const result = await syncCliAdapters("http://server");
    expect(result).toMatchObject({ total: 2, synced: 2, failed: 0 });
  });
});
