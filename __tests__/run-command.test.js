"use strict";

/**
 * Coverage for cli/run.js — the `supercli run <plugin> <resource> <action>`
 * one-shot discover+install+execute command (issue #335).
 *
 * These tests cover the usage-validation paths, which return before any
 * network/catalog/install calls. cli/executor is mocked with an explicit
 * factory (rather than left to load for real) since it pulls in the vm2
 * native sandbox, which these tests have no need to exercise.
 */

const fs = require("fs");
const os = require("os");
const path = require("path");

jest.mock("../cli/executor", () => ({ execute: jest.fn() }));
jest.mock("../cli/plugins-update", () => ({ updatePlugins: jest.fn() }));
jest.mock("../cli/plugins-install", () => ({ installPlugin: jest.fn(), getPlugin: jest.fn() }));
jest.mock("../cli/config", () => ({ loadConfig: jest.fn() }));
jest.mock("../cli/plugins-store", () => ({
  REMOTE_CATALOG_FILE: "/tmp/supercli-test-remote-catalog.json",
}));
jest.mock("../cli/plugins-registry", () => ({ listRegistryPlugins: jest.fn() }));

const { handleRunCommand, catalogIsFresh, findSuggestions } = require("../cli/run");
const { updatePlugins } = require("../cli/plugins-update");
const { installPlugin, getPlugin } = require("../cli/plugins-install");
const { loadConfig } = require("../cli/config");
const { execute } = require("../cli/executor");
const { listRegistryPlugins } = require("../cli/plugins-registry");
const { REMOTE_CATALOG_FILE } = require("../cli/plugins-store");

function cleanupCatalog() {
  try {
    if (fs.existsSync(REMOTE_CATALOG_FILE)) fs.unlinkSync(REMOTE_CATALOG_FILE);
  } catch (e) {}
}

describe("handleRunCommand — usage validation", () => {
  test("missing plugin name reports invalid_argument with usage message", async () => {
    const outputError = jest.fn();
    const output = jest.fn();

    await handleRunCommand({
      positional: ["run"],
      flags: {},
      humanMode: false,
      output,
      outputError,
    });

    expect(output).not.toHaveBeenCalled();
    expect(outputError).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 85,
        type: "invalid_argument",
        message: expect.stringContaining("Usage: supercli run"),
        recoverable: false,
      })
    );
  });

  test("missing resource/action reports invalid_argument scoped to the plugin", async () => {
    const outputError = jest.fn();
    const output = jest.fn();

    await handleRunCommand({
      positional: ["run", "claude-session-optimizer"],
      flags: {},
      humanMode: false,
      output,
      outputError,
    });

    expect(output).not.toHaveBeenCalled();
    expect(outputError).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 85,
        type: "invalid_argument",
        message: "Usage: supercli run claude-session-optimizer <resource> <action> [--args]",
        recoverable: false,
      })
    );
  });

  test("missing action alone also reports invalid_argument", async () => {
    const outputError = jest.fn();
    const output = jest.fn();

    await handleRunCommand({
      positional: ["run", "claude-session-optimizer", "self"],
      flags: {},
      humanMode: false,
      output,
      outputError,
    });

    expect(output).not.toHaveBeenCalled();
    expect(outputError).toHaveBeenCalledWith(
      expect.objectContaining({ code: 85, type: "invalid_argument" })
    );
  });
});

describe("catalogIsFresh", () => {
  test("returns true for a catalog file modified within the last hour", () => {
    const tmp = path.join(os.tmpdir(), `supercli-run-fresh-${Date.now()}.json`);
    fs.writeFileSync(tmp, "{}");
    try {
      const now = Date.now();
      expect(catalogIsFresh(tmp, now)).toBe(true);
    } finally {
      fs.unlinkSync(tmp);
    }
  });

  test("returns false for a catalog file older than one hour", () => {
    const tmp = path.join(os.tmpdir(), `supercli-run-stale-${Date.now()}.json`);
    fs.writeFileSync(tmp, "{}");
    try {
      const twoHoursLater = Date.now() + 2 * 60 * 60 * 1000;
      expect(catalogIsFresh(tmp, twoHoursLater)).toBe(false);
    } finally {
      fs.unlinkSync(tmp);
    }
  });

  test("returns false when the catalog file is missing", () => {
    const missing = path.join(os.tmpdir(), `supercli-run-missing-${Date.now()}.json`);
    expect(catalogIsFresh(missing, Date.now())).toBe(false);
  });
});

describe("findSuggestions", () => {
  test("returns exact-name matches first", () => {
    listRegistryPlugins.mockReturnValue([
      { name: "claude-session-optimizer" },
      { name: "claude-cli" },
    ]);
    expect(findSuggestions("claude-session-optimizer")).toEqual([
      "claude-session-optimizer",
      "claude-cli",
    ]);
  });

  test("falls back to fuzzy matches when no exact name match exists", () => {
    listRegistryPlugins.mockReturnValue([
      { name: "github-mcp" },
      { name: "github-cli" },
    ]);
    expect(findSuggestions("git")).toEqual(["github-mcp", "github-cli"]);
  });
});

describe("handleRunCommand — run flow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    cleanupCatalog();
  });

  afterAll(() => {
    cleanupCatalog();
  });

  test("skips catalog update when the local catalog is fresh", async () => {
    fs.mkdirSync(path.dirname(REMOTE_CATALOG_FILE), { recursive: true });
    fs.writeFileSync(REMOTE_CATALOG_FILE, "{}");

    getPlugin.mockReturnValue({ name: "beads" });
    loadConfig.mockResolvedValue({
      commands: [
        { namespace: "beads", resource: "install", action: "steps", adapter: "shell" },
      ],
    });
    execute.mockResolvedValue({ ok: true });

    const output = jest.fn();
    const outputError = jest.fn();

    await handleRunCommand({
      positional: ["run", "beads", "install", "steps"],
      flags: {},
      humanMode: false,
      output,
      outputError,
    });

    expect(updatePlugins).not.toHaveBeenCalled();
    expect(installPlugin).not.toHaveBeenCalled();
    expect(execute).toHaveBeenCalled();
    expect(outputError).not.toHaveBeenCalled();
  });

  test("updates catalog, installs, and executes when plugin is not installed", async () => {
    getPlugin.mockReturnValue(null);
    updatePlugins.mockResolvedValue({ added: 1, changed: 0 });
    installPlugin.mockReturnValue({ installed_commands: 3 });
    loadConfig.mockResolvedValue({
      commands: [
        { namespace: "beads", resource: "install", action: "steps", adapter: "shell" },
      ],
    });
    execute.mockResolvedValue({ ok: true });

    const output = jest.fn();
    const outputError = jest.fn();

    await handleRunCommand({
      positional: ["run", "beads", "install", "steps"],
      flags: {},
      humanMode: false,
      output,
      outputError,
    });

    expect(updatePlugins).toHaveBeenCalledWith({ check: false });
    expect(installPlugin).toHaveBeenCalled();
    expect(execute).toHaveBeenCalled();
    expect(outputError).not.toHaveBeenCalled();
    expect(output).toHaveBeenCalledWith(
      expect.objectContaining({ command: "beads.install.steps" })
    );
  });

  test("reports plugin not found with available plugin suggestions", async () => {
    getPlugin.mockReturnValue(null);
    updatePlugins.mockResolvedValue({ added: 0, changed: 0 });
    installPlugin.mockImplementation(() => {
      throw new Error("not found");
    });
    listRegistryPlugins.mockReturnValue([
      { name: "claude-session-optimizer" },
      { name: "github-mcp" },
    ]);

    const output = jest.fn();
    const outputError = jest.fn();

    await handleRunCommand({
      positional: ["run", "claude-sesion-optimizer", "self", "auto"],
      flags: {},
      humanMode: false,
      output,
      outputError,
    });

    expect(output).not.toHaveBeenCalled();
    expect(outputError).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 92,
        type: "resource_not_found",
        message: expect.stringContaining("claude-sesion-optimizer"),
        suggestions: expect.arrayContaining([
          expect.stringContaining("Available plugins"),
        ]),
      })
    );
  });

  test("reports command not found when plugin is installed but resource/action is missing", async () => {
    getPlugin.mockReturnValue({ name: "beads" });
    loadConfig.mockResolvedValue({
      commands: [{ namespace: "beads", resource: "install", action: "steps" }],
    });

    const output = jest.fn();
    const outputError = jest.fn();

    await handleRunCommand({
      positional: ["run", "beads", "missing", "action"],
      flags: {},
      humanMode: false,
      output,
      outputError,
    });

    expect(output).not.toHaveBeenCalled();
    expect(outputError).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 92,
        type: "resource_not_found",
        message: "Command 'beads.missing.action' not found in plugin 'beads'.",
      })
    );
  });
});
