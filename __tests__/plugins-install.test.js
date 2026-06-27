"use strict";

jest.mock("fs");
jest.mock("child_process", () => ({ spawnSync: jest.fn() }));
jest.mock("../cli/plugins-store", () => ({
  readPluginsLock: jest.fn(),
  writePluginsLock: jest.fn(),
  listInstalledPlugins: jest.fn(),
  getPlugin: jest.fn(),
}));
jest.mock("../cli/plugins-manifest", () => ({
  loadPluginManifest: jest.fn(),
  commandKey: jest.fn(),
}));
jest.mock("../cli/plugins-hooks", () => ({
  validateNodeHook: jest.fn(),
}));
jest.mock("../cli/config", () => ({
  syncClientPluginResources: jest.fn(),
}));

const fs = require("fs");
const path = require("path");
const { parsePostInstallResult, resolveHookScriptPath, serializeHook } = require("../cli/plugins-install");
const { validateNodeHook } = require("../cli/plugins-hooks");

describe("parsePostInstallResult", () => {
  test("returns null for null stdout", () => {
    expect(parsePostInstallResult(null)).toBeNull();
  });

  test("returns null for undefined stdout", () => {
    expect(parsePostInstallResult(undefined)).toBeNull();
  });

  test("returns null for empty string", () => {
    expect(parsePostInstallResult("")).toBeNull();
  });

  test("returns null for whitespace-only string", () => {
    expect(parsePostInstallResult("   \n  \t  ")).toBeNull();
  });

  test("returns parsed object for valid JSON object string", () => {
    const obj = { status: "ok", count: 3, nested: { key: "val" } };
    expect(parsePostInstallResult(JSON.stringify(obj))).toEqual(obj);
  });

  test("returns parsed array for valid JSON array string", () => {
    const arr = ["alpha", "beta", 42];
    expect(parsePostInstallResult(JSON.stringify(arr))).toEqual(arr);
  });

  test("returns { raw: text } fallback for invalid JSON", () => {
    expect(parsePostInstallResult("not valid json")).toEqual({ raw: "not valid json" });
  });

  test("returns { raw: text } fallback for partial JSON object", () => {
    expect(parsePostInstallResult("{key: value}")).toEqual({ raw: "{key: value}" });
  });

  test("trims surrounding whitespace before attempting JSON parse", () => {
    const obj = { trimmed: true };
    expect(parsePostInstallResult("  " + JSON.stringify(obj) + "\n")).toEqual(obj);
  });

  test("raw fallback preserves trimmed text content", () => {
    expect(parsePostInstallResult("  plain text  ")).toEqual({ raw: "plain text" });
  });
});

describe("resolveHookScriptPath", () => {
  const manifestDir = "/app/plugins/myplugin";

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("throws code 85 for path traversal via ../", () => {
    const run = () => resolveHookScriptPath(manifestDir, "../evil.js", "post-install");
    expect(run).toThrow("Invalid post-install script path '../evil.js'");
    try {
      run();
    } catch (e) {
      expect(e.code).toBe(85);
      expect(e.type).toBe("invalid_argument");
      expect(e.recoverable).toBe(false);
    }
  });

  test("throws code 85 for absolute path outside manifestDir", () => {
    const run = () => resolveHookScriptPath(manifestDir, "/etc/passwd", "post-install");
    try {
      run();
    } catch (e) {
      expect(e.code).toBe(85);
      expect(e.type).toBe("invalid_argument");
    }
  });

  test("throws code 85 for multi-level traversal subdir/../../escape.js", () => {
    const run = () => resolveHookScriptPath(manifestDir, "subdir/../../escape.js", "post-install");
    try {
      run();
    } catch (e) {
      expect(e.code).toBe(85);
    }
  });

  test("throws code 92 when script file does not exist", () => {
    fs.existsSync.mockReturnValue(false);
    const run = () => resolveHookScriptPath(manifestDir, "hook.js", "post-install");
    expect(run).toThrow("post-install script not found: hook.js");
    try {
      run();
    } catch (e) {
      expect(e.code).toBe(92);
      expect(e.type).toBe("resource_not_found");
      expect(e.recoverable).toBe(false);
    }
  });

  test("returns resolved absolute path when file exists", () => {
    fs.existsSync.mockReturnValue(true);
    const result = resolveHookScriptPath(manifestDir, "hook.js", "post-install");
    expect(result).toBe(path.join(manifestDir, "hook.js"));
  });

  test("allows valid nested path within manifestDir", () => {
    fs.existsSync.mockReturnValue(true);
    const result = resolveHookScriptPath(manifestDir, "scripts/setup.js", "post-install");
    expect(result).toBe(path.join(manifestDir, "scripts", "setup.js"));
  });

  test("error message includes the kind label", () => {
    const run = () => resolveHookScriptPath(manifestDir, "../x.js", "post-uninstall");
    expect(run).toThrow("post-uninstall");
  });
});

describe("serializeHook", () => {
  const manifestPath = "/app/plugins/myplugin/plugin.json";
  const manifestDir = "/app/plugins/myplugin";

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("returns null when validateNodeHook returns null", () => {
    validateNodeHook.mockReturnValue(null);
    expect(serializeHook(manifestPath, null, "post_uninstall")).toBeNull();
  });

  test("returns null for undefined hook when validateNodeHook returns null", () => {
    validateNodeHook.mockReturnValue(null);
    expect(serializeHook(manifestPath, undefined, "post_uninstall")).toBeNull();
  });

  test("returns serialized object with all required fields", () => {
    const scriptSource = 'console.log("uninstall complete")';
    validateNodeHook.mockReturnValue({ script: "uninstall.js", runtime: "node", timeout_ms: 5000 });
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReturnValue(scriptSource);

    const result = serializeHook(manifestPath, { script: "uninstall.js" }, "post_uninstall");

    expect(result).toEqual({
      runtime: "node",
      timeout_ms: 5000,
      script_path: path.join(manifestDir, "uninstall.js"),
      script_name: "uninstall.js",
      script_source: scriptSource,
    });
  });

  test("round-trip: script_name is basename of script_path", () => {
    validateNodeHook.mockReturnValue({ script: "scripts/teardown.js", runtime: "node", timeout_ms: 10000 });
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReturnValue("// teardown");

    const result = serializeHook(manifestPath, { script: "scripts/teardown.js" }, "post_uninstall");

    expect(result.script_name).toBe("teardown.js");
    expect(result.script_path).toBe(path.join(manifestDir, "scripts", "teardown.js"));
    expect(path.basename(result.script_path)).toBe(result.script_name);
  });

  test("reads script source from the resolved path", () => {
    const source = "module.exports = function cleanup() {}";
    validateNodeHook.mockReturnValue({ script: "hook.js", runtime: "node", timeout_ms: 8000 });
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReturnValue(source);

    const result = serializeHook(manifestPath, { script: "hook.js" }, "post_uninstall");

    expect(result.script_source).toBe(source);
    expect(fs.readFileSync).toHaveBeenCalledWith(path.join(manifestDir, "hook.js"), "utf-8");
  });

  test("propagates error thrown by validateNodeHook", () => {
    validateNodeHook.mockImplementation(() => {
      throw Object.assign(new Error("bad runtime"), { code: 85 });
    });
    expect(() => serializeHook(manifestPath, { runtime: "deno" }, "post_uninstall")).toThrow("bad runtime");
  });

  test("propagates traversal error (code 85) from resolveHookScriptPath", () => {
    validateNodeHook.mockReturnValue({ script: "../evil.js", runtime: "node", timeout_ms: 5000 });

    try {
      serializeHook(manifestPath, { script: "../evil.js" }, "post_uninstall");
      fail("expected to throw");
    } catch (e) {
      expect(e.code).toBe(85);
      expect(e.type).toBe("invalid_argument");
    }
  });

  test("propagates resource_not_found error (code 92) when script file missing", () => {
    validateNodeHook.mockReturnValue({ script: "missing.js", runtime: "node", timeout_ms: 5000 });
    fs.existsSync.mockReturnValue(false);

    try {
      serializeHook(manifestPath, { script: "missing.js" }, "post_uninstall");
      fail("expected to throw");
    } catch (e) {
      expect(e.code).toBe(92);
      expect(e.type).toBe("resource_not_found");
    }
  });

  test("kind underscores are converted to hyphens in resolveHookScriptPath error", () => {
    validateNodeHook.mockReturnValue({ script: "../bad.js", runtime: "node", timeout_ms: 5000 });

    try {
      serializeHook(manifestPath, { script: "../bad.js" }, "post_uninstall");
      fail("expected to throw");
    } catch (e) {
      expect(e.message).toContain("post-uninstall");
    }
  });
});
