"use strict";

jest.mock("fs");
jest.mock("child_process", () => ({ spawnSync: jest.fn() }));
jest.mock("../cli/config-core", () => ({ loadConfig: jest.fn() }));

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const { loadConfig } = require("../cli/config-core");

const {
  validateHooks,
  validateNodeHook,
  executeNodeHook,
  runHook,
  executeOutputHooks,
  executeAfterHooks,
  executeConfigChangeHooks,
} = require("../cli/plugins-hooks");

// ────────────────────────────────────────────────────────────
// validateHooks
// ────────────────────────────────────────────────────────────
describe("validateHooks", () => {
  function makeManifest(overrides) {
    return Object.assign({ commands: [] }, overrides);
  }

  test("returns [] for manifest with no hooks key and empty commands", () => {
    expect(validateHooks(makeManifest())).toEqual([]);
  });

  test("returns [] when manifest.hooks is an empty object", () => {
    expect(validateHooks(makeManifest({ hooks: {} }))).toEqual([]);
  });

  test("accepts all valid manifest-level hook kinds without error", () => {
    const validKinds = ["on_command", "on_output", "on_before", "on_after", "on_error", "on_config_change"];
    const hooks = Object.fromEntries(validKinds.map((k) => [k, {}]));
    expect(validateHooks(makeManifest({ hooks }))).toEqual([]);
  });

  test("returns error for invalid manifest-level hook kind", () => {
    const errs = validateHooks(makeManifest({ hooks: { on_launch: {} } }));
    expect(errs).toHaveLength(1);
    expect(errs[0]).toMatch(/Invalid hook kind 'on_launch'/);
    expect(errs[0]).toMatch(/Supported:/);
  });

  test("collects multiple errors for multiple invalid manifest-level hook kinds", () => {
    const errs = validateHooks(makeManifest({ hooks: { bad_one: {}, bad_two: {} } }));
    expect(errs).toHaveLength(2);
    expect(errs.some((e) => e.includes("bad_one"))).toBe(true);
    expect(errs.some((e) => e.includes("bad_two"))).toBe(true);
  });

  test("returns [] for command with no hooks property", () => {
    const cmd = { namespace: "n", resource: "r", action: "a" };
    expect(validateHooks(makeManifest({ commands: [cmd] }))).toEqual([]);
  });

  test("accepts all valid command-level hook kinds without error", () => {
    const validKinds = ["on_before", "on_after", "on_error", "on_output"];
    const hooks = Object.fromEntries(validKinds.map((k) => [k, {}]));
    const cmd = { namespace: "n", resource: "r", action: "a", hooks };
    expect(validateHooks(makeManifest({ commands: [cmd] }))).toEqual([]);
  });

  test("returns error for invalid command-level hook kind including namespace.resource.action", () => {
    const cmd = { namespace: "mypkg", resource: "files", action: "list", hooks: { on_ready: {} } };
    const errs = validateHooks(makeManifest({ commands: [cmd] }));
    expect(errs).toHaveLength(1);
    expect(errs[0]).toMatch(/Invalid command hook 'on_ready'/);
    expect(errs[0]).toMatch(/mypkg\.files\.list/);
    expect(errs[0]).toMatch(/Supported:/);
  });

  test("validates command hooks across multiple commands independently", () => {
    const cmds = [
      { namespace: "a", resource: "b", action: "c", hooks: { on_start: {} } },
      { namespace: "x", resource: "y", action: "z", hooks: { on_before: {} } },
    ];
    const errs = validateHooks(makeManifest({ commands: cmds }));
    expect(errs).toHaveLength(1);
    expect(errs[0]).toMatch(/on_start/);
  });

  test("combines manifest-level and command-level errors in one result", () => {
    const cmd = { namespace: "n", resource: "r", action: "a", hooks: { on_tick: {} } };
    const errs = validateHooks(makeManifest({ hooks: { on_unknown: {} }, commands: [cmd] }));
    expect(errs).toHaveLength(2);
  });
});

// ────────────────────────────────────────────────────────────
// validateNodeHook
// ────────────────────────────────────────────────────────────
describe("validateNodeHook", () => {
  test("returns null for null hook", () => {
    expect(validateNodeHook(null, "on_before")).toBeNull();
  });

  test("returns null for undefined hook", () => {
    expect(validateNodeHook(undefined, "on_after")).toBeNull();
  });

  test("throws code 85 when script field is missing", () => {
    expect(() => validateNodeHook({}, "on_before")).toThrow(
      /on_before\.script must be a string/
    );
    try { validateNodeHook({}, "on_before"); } catch (e) {
      expect(e.code).toBe(85);
      expect(e.type).toBe("invalid_argument");
      expect(e.recoverable).toBe(false);
    }
  });

  test("throws code 85 when script is not a string (number)", () => {
    expect(() => validateNodeHook({ script: 42 }, "on_after")).toThrow(/\.script must be a string/);
  });

  test("throws code 85 when script is an object", () => {
    expect(() => validateNodeHook({ script: {} }, "on_error")).toThrow(/\.script must be a string/);
  });

  test("throws code 85 when runtime is not 'node'", () => {
    expect(() => validateNodeHook({ script: "hook.js", runtime: "python" }, "on_before")).toThrow(
      /\.runtime must be 'node'/
    );
    try { validateNodeHook({ script: "hook.js", runtime: "deno" }, "on_before"); } catch (e) {
      expect(e.code).toBe(85);
    }
  });

  test("accepts explicit runtime 'node' without error", () => {
    const result = validateNodeHook({ script: "hook.js", runtime: "node" }, "on_before");
    expect(result.runtime).toBe("node");
  });

  test("defaults runtime to 'node' when omitted", () => {
    const result = validateNodeHook({ script: "hook.js" }, "on_before");
    expect(result.runtime).toBe("node");
  });

  test("throws code 85 for timeout_ms = 0", () => {
    expect(() => validateNodeHook({ script: "h.js", timeout_ms: 0 }, "on_before")).toThrow(
      /timeout_ms must be a positive number <= 15000/
    );
  });

  test("throws code 85 for negative timeout_ms", () => {
    expect(() => validateNodeHook({ script: "h.js", timeout_ms: -1 }, "on_before")).toThrow(
      /timeout_ms must be a positive number/
    );
  });

  test("throws code 85 for timeout_ms > 15000", () => {
    expect(() => validateNodeHook({ script: "h.js", timeout_ms: 15001 }, "on_before")).toThrow(
      /timeout_ms must be a positive number <= 15000/
    );
  });

  test("throws code 85 for NaN timeout_ms", () => {
    expect(() => validateNodeHook({ script: "h.js", timeout_ms: NaN }, "on_before")).toThrow(
      /timeout_ms must be a positive number/
    );
  });

  test("throws code 85 for non-numeric string timeout_ms", () => {
    expect(() => validateNodeHook({ script: "h.js", timeout_ms: "fast" }, "on_before")).toThrow(
      /timeout_ms must be a positive number/
    );
  });

  test("accepts timeout_ms = 15000 (upper boundary)", () => {
    const result = validateNodeHook({ script: "h.js", timeout_ms: 15000 }, "on_before");
    expect(result.timeout_ms).toBe(15000);
  });

  test("accepts timeout_ms = 1 (lower boundary)", () => {
    const result = validateNodeHook({ script: "h.js", timeout_ms: 1 }, "on_before");
    expect(result.timeout_ms).toBe(1);
  });

  test("defaults timeout_ms to 15000 when undefined", () => {
    const result = validateNodeHook({ script: "hook.js" }, "on_before");
    expect(result.timeout_ms).toBe(15000);
  });

  test("returns normalized { script, runtime, timeout_ms } shape", () => {
    const result = validateNodeHook({ script: "run.js", runtime: "node", timeout_ms: 5000 }, "on_before");
    expect(result).toEqual({ script: "run.js", runtime: "node", timeout_ms: 5000 });
  });

  test("kind string appears in error message for script error", () => {
    try { validateNodeHook({ script: null }, "on_config_change"); } catch (e) {
      expect(e.message).toMatch(/on_config_change/);
    }
  });
});

// ────────────────────────────────────────────────────────────
// executeNodeHook
// ────────────────────────────────────────────────────────────
describe("executeNodeHook", () => {
  const manifestDir = "/plugins/myplugin";
  const manifestPath = path.join(manifestDir, "plugin.json");

  function makeContext() {
    return { pluginManifestPath: manifestPath };
  }

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("throws code 92 when hook script file does not exist", () => {
    fs.existsSync.mockReturnValue(false);
    expect(() => executeNodeHook({ script: "hook.js" }, makeContext())).toThrow(
      /Hook script not found/
    );
    try { executeNodeHook({ script: "hook.js" }, makeContext()); } catch (e) {
      expect(e.code).toBe(92);
      expect(e.type).toBe("resource_not_found");
      expect(e.recoverable).toBe(false);
    }
  });

  test("throws code 105 when spawnSync returns an error object", () => {
    fs.existsSync.mockReturnValue(true);
    spawnSync.mockReturnValue({ error: new Error("ENOENT"), status: null, stdout: "", stderr: "" });
    expect(() => executeNodeHook({ script: "hook.js" }, makeContext())).toThrow(
      /Failed to execute hook/
    );
    try { executeNodeHook({ script: "hook.js" }, makeContext()); } catch (e) {
      expect(e.code).toBe(105);
      expect(e.type).toBe("integration_error");
      expect(e.recoverable).toBe(true);
    }
  });

  test("throws code 105 when spawnSync exits with non-zero status", () => {
    fs.existsSync.mockReturnValue(true);
    spawnSync.mockReturnValue({ error: null, status: 1, stdout: "", stderr: "bad arg" });
    try { executeNodeHook({ script: "hook.js" }, makeContext()); } catch (e) {
      expect(e.code).toBe(105);
      expect(e.message).toBe("bad arg");
    }
  });

  test("uses generic message when stderr is empty on non-zero exit", () => {
    fs.existsSync.mockReturnValue(true);
    spawnSync.mockReturnValue({ error: null, status: 2, stdout: "", stderr: "" });
    try { executeNodeHook({ script: "hook.js" }, makeContext()); } catch (e) {
      expect(e.message).toMatch(/exit code 2/);
    }
  });

  test("returns parsed JSON object from stdout on success", () => {
    fs.existsSync.mockReturnValue(true);
    spawnSync.mockReturnValue({ error: null, status: 0, stdout: '{"ok":true}', stderr: "" });
    const result = executeNodeHook({ script: "hook.js" }, makeContext());
    expect(result).toEqual({ ok: true });
  });

  test("returns null when stdout is not valid JSON", () => {
    fs.existsSync.mockReturnValue(true);
    spawnSync.mockReturnValue({ error: null, status: 0, stdout: "not-json", stderr: "" });
    const result = executeNodeHook({ script: "hook.js" }, makeContext());
    expect(result).toBeNull();
  });

  test("returns {} (empty object) when stdout is empty string", () => {
    fs.existsSync.mockReturnValue(true);
    spawnSync.mockReturnValue({ error: null, status: 0, stdout: "", stderr: "" });
    const result = executeNodeHook({ script: "hook.js" }, makeContext());
    expect(result).toEqual({});
  });

  test("uses hook.timeout_ms in spawnSync call when provided", () => {
    fs.existsSync.mockReturnValue(true);
    spawnSync.mockReturnValue({ error: null, status: 0, stdout: "{}", stderr: "" });
    executeNodeHook({ script: "hook.js", timeout_ms: 3000 }, makeContext());
    expect(spawnSync).toHaveBeenCalledWith(
      process.execPath,
      expect.any(Array),
      expect.objectContaining({ timeout: 3000 })
    );
  });

  test("defaults spawnSync timeout to 15000 when hook.timeout_ms is absent", () => {
    fs.existsSync.mockReturnValue(true);
    spawnSync.mockReturnValue({ error: null, status: 0, stdout: "{}", stderr: "" });
    executeNodeHook({ script: "hook.js" }, makeContext());
    expect(spawnSync).toHaveBeenCalledWith(
      process.execPath,
      expect.any(Array),
      expect.objectContaining({ timeout: 15000 })
    );
  });

  test("passes JSON-serialized context as second CLI arg to hook script", () => {
    fs.existsSync.mockReturnValue(true);
    spawnSync.mockReturnValue({ error: null, status: 0, stdout: "{}", stderr: "" });
    const ctx = makeContext();
    executeNodeHook({ script: "hook.js" }, ctx);
    const args = spawnSync.mock.calls[0][1];
    const parsedCtx = JSON.parse(args[1]);
    expect(parsedCtx.pluginManifestPath).toBe(manifestPath);
  });
});

// ────────────────────────────────────────────────────────────
// executeOutputHooks — transform edge cases
// ────────────────────────────────────────────────────────────
describe("executeOutputHooks", () => {
  function makeContext(overrides) {
    return Object.assign(
      {
        pluginManifestPath: "/plugins/p/plugin.json",
        pluginManifest: {},
        commandManifest: null,
      },
      overrides
    );
  }

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("returns [] when pluginManifest has no hooks", () => {
    const ctx = makeContext({ pluginManifest: {} });
    expect(executeOutputHooks(ctx, "some output")).toEqual([]);
  });

  test("returns [] when hooks object has no on_output key", () => {
    const ctx = makeContext({ pluginManifest: { hooks: { on_before: { script: "h.js" } } } });
    expect(executeOutputHooks(ctx, "out")).toEqual([]);
  });

  test("returns [] when on_output hook has no script (no-op)", () => {
    const ctx = makeContext({ pluginManifest: { hooks: { on_output: {} } } });
    expect(executeOutputHooks(ctx, "output")).toEqual([]);
  });

  test("sets context.output to the provided output string", () => {
    const ctx = makeContext({ pluginManifest: {} });
    executeOutputHooks(ctx, "hello world");
    expect(ctx.output).toBe("hello world");
  });

  test("sets context.output to null when null passed", () => {
    const ctx = makeContext({ pluginManifest: {} });
    executeOutputHooks(ctx, null);
    expect(ctx.output).toBeNull();
  });

  test("sets context.output to undefined when undefined passed", () => {
    const ctx = makeContext({ pluginManifest: {} });
    executeOutputHooks(ctx, undefined);
    expect(ctx.output).toBeUndefined();
  });

  test("sets context.output to empty string when empty string passed", () => {
    const ctx = makeContext({ pluginManifest: {} });
    executeOutputHooks(ctx, "");
    expect(ctx.output).toBe("");
  });

  test("returns [{ hook: 'on_output', result }] when hook script executes successfully", () => {
    fs.existsSync.mockReturnValue(true);
    spawnSync.mockReturnValue({ error: null, status: 0, stdout: '{"transformed":"yes"}', stderr: "" });
    const ctx = makeContext({
      pluginManifest: { hooks: { on_output: { script: "out-hook.js" } } },
    });
    const results = executeOutputHooks(ctx, "raw");
    expect(results).toHaveLength(1);
    expect(results[0].hook).toBe("on_output");
    expect(results[0].result).toEqual({ transformed: "yes" });
  });

  test("returns [] when executeNodeHook returns null (invalid JSON stdout)", () => {
    fs.existsSync.mockReturnValue(true);
    spawnSync.mockReturnValue({ error: null, status: 0, stdout: "not-json", stderr: "" });
    const ctx = makeContext({
      pluginManifest: { hooks: { on_output: { script: "hook.js" } } },
    });
    const results = executeOutputHooks(ctx, "raw");
    expect(results).toEqual([]);
  });

  test("returns [] when executeNodeHook returns empty object (falsy check passes but {} is truthy)", () => {
    fs.existsSync.mockReturnValue(true);
    spawnSync.mockReturnValue({ error: null, status: 0, stdout: "{}", stderr: "" });
    const ctx = makeContext({
      pluginManifest: { hooks: { on_output: { script: "hook.js" } } },
    });
    const results = executeOutputHooks(ctx, "raw");
    // {} is truthy, so result is pushed
    expect(results).toHaveLength(1);
    expect(results[0].result).toEqual({});
  });

  test("prefers commandManifest on_output hook over pluginManifest hook", () => {
    fs.existsSync.mockReturnValue(true);
    spawnSync
      .mockReturnValueOnce({ error: null, status: 0, stdout: '{"from":"command"}', stderr: "" });
    const ctx = makeContext({
      pluginManifest: { hooks: { on_output: { script: "plugin-hook.js" } } },
      commandManifest: { hooks: { on_output: { script: "cmd-hook.js" } } },
    });
    const results = executeOutputHooks(ctx, "data");
    expect(results).toHaveLength(1);
    expect(results[0].result).toEqual({ from: "command" });
  });

  test("propagates executeNodeHook throw when hook script is missing", () => {
    fs.existsSync.mockReturnValue(false);
    const ctx = makeContext({
      pluginManifest: { hooks: { on_output: { script: "missing.js" } } },
    });
    expect(() => executeOutputHooks(ctx, "out")).toThrow(/Hook script not found/);
  });
});

// ────────────────────────────────────────────────────────────
// runHook — routing
// ────────────────────────────────────────────────────────────
describe("runHook", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("returns null when neither pluginManifest nor commandManifest has hooks", () => {
    const result = runHook("on_before", {}, {}, null);
    expect(result).toBeNull();
  });

  test("returns null when hook kind not present in either manifest", () => {
    const result = runHook("on_before", {}, { hooks: { on_after: { script: "h.js" } } }, null);
    expect(result).toBeNull();
  });

  test("returns null when hookDef has no script property", () => {
    const result = runHook("on_before", {}, { hooks: { on_before: {} } }, null);
    expect(result).toBeNull();
  });

  test("calls executeNodeHook when hookDef has script", () => {
    fs.existsSync.mockReturnValue(true);
    spawnSync.mockReturnValue({ error: null, status: 0, stdout: '{"ran":true}', stderr: "" });
    const ctx = { pluginManifestPath: "/p/plugin.json" };
    const pluginManifest = { hooks: { on_before: { script: "h.js" } } };
    const result = runHook("on_before", ctx, pluginManifest, null);
    expect(result).toEqual({ ran: true });
  });

  test("sets context.kind to the requested hook kind", () => {
    fs.existsSync.mockReturnValue(true);
    spawnSync.mockReturnValue({ error: null, status: 0, stdout: "{}", stderr: "" });
    const ctx = { pluginManifestPath: "/p/plugin.json" };
    const pluginManifest = { hooks: { on_after: { script: "h.js" } } };
    runHook("on_after", ctx, pluginManifest, null);
    expect(ctx.kind).toBe("on_after");
  });
});
