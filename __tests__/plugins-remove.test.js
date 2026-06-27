"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

jest.mock("fs");
jest.mock("child_process");
jest.mock("../cli/plugins-store");
// plugins-manifest and plugins-hooks are only needed by installPlugin, not removePlugin
jest.mock("../cli/plugins-manifest");
jest.mock("../cli/plugins-hooks");
jest.mock("../cli/config");

const { removePlugin } = require("../cli/plugins-install");
const { readPluginsLock, writePluginsLock } = require("../cli/plugins-store");

describe("removePlugin", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(os, "tmpdir").mockReturnValue("/tmp");
    readPluginsLock.mockReturnValue({ installed: {} });
  });

  // ── missing-plugin guard ──────────────────────────────────────────────────

  test("returns false when plugin not found in lock", () => {
    readPluginsLock.mockReturnValue({ installed: {} });
    expect(removePlugin("no-such-plugin")).toBe(false);
  });

  test("does not call writePluginsLock when plugin not found", () => {
    readPluginsLock.mockReturnValue({ installed: {} });
    removePlugin("no-such-plugin");
    expect(writePluginsLock).not.toHaveBeenCalled();
  });

  // ── successful removal ────────────────────────────────────────────────────

  test("returns true when plugin exists and has no hooks", () => {
    readPluginsLock.mockReturnValue({ installed: { myplugin: { name: "myplugin" } } });
    expect(removePlugin("myplugin")).toBe(true);
  });

  test("calls writePluginsLock with plugin deleted", () => {
    readPluginsLock.mockReturnValue({ installed: { myplugin: { name: "myplugin" } } });
    removePlugin("myplugin");
    expect(writePluginsLock).toHaveBeenCalledTimes(1);
    const written = writePluginsLock.mock.calls[0][0];
    expect(written.installed.myplugin).toBeUndefined();
  });

  test("removes only the named plugin, leaves others intact", () => {
    readPluginsLock.mockReturnValue({
      installed: {
        alpha: { name: "alpha" },
        beta: { name: "beta" },
      },
    });
    removePlugin("alpha");
    const written = writePluginsLock.mock.calls[0][0];
    expect(written.installed.alpha).toBeUndefined();
    expect(written.installed.beta).toEqual({ name: "beta" });
  });

  // ── no lifecycle hooks ────────────────────────────────────────────────────

  test("succeeds when plugin has no lifecycle_hooks field", () => {
    readPluginsLock.mockReturnValue({ installed: { p: { name: "p" } } });
    expect(removePlugin("p")).toBe(true);
    expect(writePluginsLock).toHaveBeenCalled();
  });

  test("succeeds when lifecycle_hooks is null", () => {
    readPluginsLock.mockReturnValue({ installed: { p: { name: "p", lifecycle_hooks: null } } });
    expect(removePlugin("p")).toBe(true);
  });

  test("succeeds when lifecycle_hooks.post_uninstall is null", () => {
    readPluginsLock.mockReturnValue({
      installed: { p: { name: "p", lifecycle_hooks: { post_uninstall: null } } },
    });
    expect(removePlugin("p")).toBe(true);
    expect(spawnSync).not.toHaveBeenCalled();
  });

  test("succeeds when lifecycle_hooks.post_uninstall is undefined", () => {
    readPluginsLock.mockReturnValue({
      installed: { p: { name: "p", lifecycle_hooks: { post_uninstall: undefined } } },
    });
    expect(removePlugin("p")).toBe(true);
    expect(spawnSync).not.toHaveBeenCalled();
  });

  // ── stored hook via script_source ─────────────────────────────────────────

  test("runs post_uninstall hook via script_source when script_path absent", () => {
    fs.existsSync.mockReturnValue(false);
    fs.mkdtempSync.mockReturnValue("/tmp/dcli-plugin-hook-abc");
    spawnSync.mockReturnValue({ status: 0, stdout: "" });
    readPluginsLock.mockReturnValue({
      installed: {
        p: {
          name: "p",
          lifecycle_hooks: {
            post_uninstall: {
              runtime: "node",
              timeout_ms: 5000,
              script_name: "post-uninstall.js",
              script_source: "process.exit(0)",
            },
          },
        },
      },
    });
    expect(removePlugin("p")).toBe(true);
    expect(spawnSync).toHaveBeenCalledWith(
      "node",
      [path.join("/tmp/dcli-plugin-hook-abc", "post-uninstall.js")],
      expect.objectContaining({ encoding: "utf-8" })
    );
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      path.join("/tmp/dcli-plugin-hook-abc", "post-uninstall.js"),
      "process.exit(0)"
    );
    expect(fs.rmSync).toHaveBeenCalledWith("/tmp/dcli-plugin-hook-abc", {
      recursive: true,
      force: true,
    });
  });

  test("runs post_uninstall hook via script_path when file exists", () => {
    fs.existsSync.mockReturnValue(true);
    spawnSync.mockReturnValue({ status: 0, stdout: "" });
    readPluginsLock.mockReturnValue({
      installed: {
        p: {
          name: "p",
          lifecycle_hooks: {
            post_uninstall: {
              runtime: "node",
              timeout_ms: 5000,
              script_path: "/plugins/p/post-uninstall.js",
              script_name: "post-uninstall.js",
              script_source: "",
            },
          },
        },
      },
    });
    expect(removePlugin("p")).toBe(true);
    expect(spawnSync).toHaveBeenCalledWith(
      "node",
      ["/plugins/p/post-uninstall.js"],
      expect.objectContaining({ encoding: "utf-8" })
    );
    // When script_path is used, no tmp dir is created
    expect(fs.mkdtempSync).not.toHaveBeenCalled();
  });

  // ── unsupported runtime ───────────────────────────────────────────────────

  test("throws with code 85 when stored hook runtime is unsupported", () => {
    readPluginsLock.mockReturnValue({
      installed: {
        p: {
          name: "p",
          lifecycle_hooks: {
            post_uninstall: { runtime: "python", timeout_ms: 1000, script_source: "pass" },
          },
        },
      },
    });
    expect(() => removePlugin("p")).toThrow(/Unsupported stored uninstall runtime 'python'/);
  });

  test("unsupported runtime error has code 85 and type invalid_argument", () => {
    readPluginsLock.mockReturnValue({
      installed: {
        p: {
          name: "p",
          lifecycle_hooks: {
            post_uninstall: { runtime: "bash", timeout_ms: 1000, script_source: "exit 0" },
          },
        },
      },
    });
    let caught;
    try {
      removePlugin("p");
    } catch (e) {
      caught = e;
    }
    expect(caught).toBeDefined();
    expect(caught.code).toBe(85);
    expect(caught.type).toBe("invalid_argument");
  });

  // ── force flag ────────────────────────────────────────────────────────────

  test("throws hook error when force is false (default)", () => {
    fs.existsSync.mockReturnValue(false);
    fs.mkdtempSync.mockReturnValue("/tmp/hook-xyz");
    spawnSync.mockReturnValue({ status: 1, stderr: "hook blew up" });
    readPluginsLock.mockReturnValue({
      installed: {
        p: {
          name: "p",
          lifecycle_hooks: {
            post_uninstall: { runtime: "node", timeout_ms: 1000, script_name: "h.js", script_source: "" },
          },
        },
      },
    });
    expect(() => removePlugin("p")).toThrow(/hook blew up/);
    expect(writePluginsLock).not.toHaveBeenCalled();
  });

  test("continues and updates lock when force is true and hook fails", () => {
    fs.existsSync.mockReturnValue(false);
    fs.mkdtempSync.mockReturnValue("/tmp/hook-xyz");
    spawnSync.mockReturnValue({ status: 1, stderr: "hook blew up" });
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    readPluginsLock.mockReturnValue({
      installed: {
        p: {
          name: "p",
          lifecycle_hooks: {
            post_uninstall: { runtime: "node", timeout_ms: 1000, script_name: "h.js", script_source: "" },
          },
        },
      },
    });
    expect(removePlugin("p", true)).toBe(true);
    expect(writePluginsLock).toHaveBeenCalledTimes(1);
    const written = writePluginsLock.mock.calls[0][0];
    expect(written.installed.p).toBeUndefined();
    warnSpy.mockRestore();
  });

  test("emits console.warn with plugin name when force overrides hook failure", () => {
    fs.existsSync.mockReturnValue(false);
    fs.mkdtempSync.mockReturnValue("/tmp/hook-xyz");
    spawnSync.mockReturnValue({ status: 1, stderr: "boom" });
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    readPluginsLock.mockReturnValue({
      installed: {
        mypkg: {
          name: "mypkg",
          lifecycle_hooks: {
            post_uninstall: { runtime: "node", timeout_ms: 1000, script_name: "h.js", script_source: "" },
          },
        },
      },
    });
    removePlugin("mypkg", true);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("mypkg"),
      expect.any(String)
    );
    warnSpy.mockRestore();
  });

  // ── spawnSync error paths ─────────────────────────────────────────────────

  test("throws integration_error when spawnSync returns error object", () => {
    fs.existsSync.mockReturnValue(false);
    fs.mkdtempSync.mockReturnValue("/tmp/hook-err");
    spawnSync.mockReturnValue({ status: 0, error: new Error("ENOENT"), stdout: "" });
    readPluginsLock.mockReturnValue({
      installed: {
        p: {
          name: "p",
          lifecycle_hooks: {
            post_uninstall: { runtime: "node", timeout_ms: 1000, script_name: "h.js", script_source: "" },
          },
        },
      },
    });
    let caught;
    try {
      removePlugin("p");
    } catch (e) {
      caught = e;
    }
    expect(caught).toBeDefined();
    expect(caught.code).toBe(105);
    expect(caught.type).toBe("integration_error");
  });

  // ── tmpDir cleanup ────────────────────────────────────────────────────────

  test("cleans up tmpDir via rmSync even when hook succeeds", () => {
    fs.existsSync.mockReturnValue(false);
    fs.mkdtempSync.mockReturnValue("/tmp/cleanup-test");
    spawnSync.mockReturnValue({ status: 0, stdout: "" });
    readPluginsLock.mockReturnValue({
      installed: {
        p: {
          name: "p",
          lifecycle_hooks: {
            post_uninstall: { runtime: "node", timeout_ms: 1000, script_name: "h.js", script_source: "" },
          },
        },
      },
    });
    removePlugin("p");
    expect(fs.rmSync).toHaveBeenCalledWith("/tmp/cleanup-test", { recursive: true, force: true });
  });

  test("cleans up tmpDir via rmSync even when spawnSync exits non-zero", () => {
    fs.existsSync.mockReturnValue(false);
    fs.mkdtempSync.mockReturnValue("/tmp/cleanup-fail");
    spawnSync.mockReturnValue({ status: 2, stderr: "err" });
    readPluginsLock.mockReturnValue({
      installed: {
        p: {
          name: "p",
          lifecycle_hooks: {
            post_uninstall: { runtime: "node", timeout_ms: 1000, script_name: "h.js", script_source: "" },
          },
        },
      },
    });
    try {
      removePlugin("p");
    } catch {}
    expect(fs.rmSync).toHaveBeenCalledWith("/tmp/cleanup-fail", { recursive: true, force: true });
  });
});
