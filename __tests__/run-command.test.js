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

jest.mock("../cli/executor", () => ({ execute: jest.fn() }));

const { handleRunCommand } = require("../cli/run");

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
