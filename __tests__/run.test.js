"use strict";

// Mock dependencies for run.js
jest.mock("../cli/plugins-update", () => ({
  updatePlugins: jest.fn().mockResolvedValue({ added: 0, changed: 0 }),
}));
jest.mock("../cli/plugins-install", () => ({
  installPlugin: jest.fn(),
  getPlugin: jest.fn().mockReturnValue(null),
}));
jest.mock("../cli/config", () => ({
  loadConfig: jest.fn().mockResolvedValue({ commands: [] }),
}));
jest.mock("../cli/executor", () => ({
  execute: jest.fn().mockResolvedValue({ ok: true, data: { status: "ok" } }),
}));

const { handleRunCommand } = require("../cli/run");
const { getPlugin } = require("../cli/plugins-install");
const { installPlugin } = require("../cli/plugins-install");
const { execute } = require("../cli/executor");
const { loadConfig } = require("../cli/config");

const mockCmd = { namespace: "someplugin", resource: "self", action: "version", adapter: "http", adapterConfig: {} };

describe("sc run — one-shot install+execute", () => {
  let output, outputError, captured;

  beforeEach(() => {
    captured = { json: null, error: null };
    output = (data) => { captured.json = data; };
    outputError = (data) => { captured.error = data; };
    jest.clearAllMocks();
    getPlugin.mockReturnValue(null);
    installPlugin.mockReturnValue({ installed_commands: 1 });
    execute.mockResolvedValue({ ok: true, data: { status: "ok" } });
    loadConfig.mockResolvedValue({ commands: [mockCmd] });
  });

  test("missing plugin name → error 85", async () => {
    await handleRunCommand({
      positional: ["run"],
      flags: {},
      humanMode: false,
      output,
      outputError,
    });
    expect(captured.error.code).toBe(85);
    expect(captured.error.message).toContain("Usage");
  });

  test("missing resource/action → error 85", async () => {
    await handleRunCommand({
      positional: ["run", "someplugin"],
      flags: {},
      humanMode: false,
      output,
      outputError,
    });
    expect(captured.error.code).toBe(85);
  });

  test("missing action → error 85", async () => {
    await handleRunCommand({
      positional: ["run", "someplugin", "self"],
      flags: {},
      humanMode: false,
      output,
      outputError,
    });
    expect(captured.error.code).toBe(85);
  });

  test("plugin already installed → skips install, executes", async () => {
    getPlugin.mockReturnValue({ name: "someplugin" });
    await handleRunCommand({
      positional: ["run", "someplugin", "self", "version"],
      flags: {},
      humanMode: false,
      output,
      outputError,
    });
    expect(installPlugin).not.toHaveBeenCalled();
    expect(execute).toHaveBeenCalled();
  });

  test("plugin not installed → installs then executes", async () => {
    getPlugin.mockReturnValue(null);
    await handleRunCommand({
      positional: ["run", "someplugin", "self", "version"],
      flags: {},
      humanMode: false,
      output,
      outputError,
    });
    expect(installPlugin).toHaveBeenCalledWith("someplugin", expect.any(Object));
    expect(execute).toHaveBeenCalled();
  });

  test("install failure → error 92", async () => {
    getPlugin.mockReturnValue(null);
    installPlugin.mockImplementation(() => {
      throw new Error("Plugin not found in registry");
    });
    await handleRunCommand({
      positional: ["run", "badplugin", "self", "version"],
      flags: {},
      humanMode: false,
      output,
      outputError,
    });
    expect(captured.error.code).toBe(92);
  });

  test("command not found after install → error 92", async () => {
    getPlugin.mockReturnValue(null);
    installPlugin.mockReturnValue({ installed_commands: 0 });
    loadConfig.mockResolvedValue({ commands: [] });
    await handleRunCommand({
      positional: ["run", "someplugin", "self", "version"],
      flags: {},
      humanMode: false,
      output,
      outputError,
    });
    expect(captured.error.code).toBe(92);
  });

  test("human mode writes progress to stderr", async () => {
    getPlugin.mockReturnValue({ name: "someplugin" });
    const stderrSpy = jest.spyOn(process.stderr, "write").mockImplementation();
    await handleRunCommand({
      positional: ["run", "someplugin", "self", "version"],
      flags: {},
      humanMode: true,
      output,
      outputError,
    });
    expect(stderrSpy).toHaveBeenCalled();
    stderrSpy.mockRestore();
  });
});
