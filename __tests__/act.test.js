"use strict";

const fs = require("fs");
const path = require("path");
const os = require("os");

// Mock config for act.js tests
const mockConfig = {
  commands: [
    { namespace: "system", resource: "test", action: "foo", adapter: "http", endpoint: "http://localhost/health" },
    { namespace: "monitor", resource: "disk", action: "space", adapter: "shell", command: "df" },
    { namespace: "monitor", resource: "memory", action: "usage", adapter: "shell", command: "free" },
  ],
};

// Mock execute function
jest.mock("../cli/executor", () => ({
  execute: jest.fn().mockResolvedValue({ ok: true, data: { status: "ok" } }),
}));

const { handleActCommand } = require("../cli/act");

// Helper to create temp plan files
function writePlan(plan) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "act-test-"));
  const file = path.join(dir, "plan.json");
  fs.writeFileSync(file, JSON.stringify(plan));
  return file;
}

function cleanup(file) {
  try {
    fs.rmSync(path.dirname(file), { recursive: true, force: true });
  } catch {}
}

describe("sc act — DAG execution", () => {
  let output, outputError, captured;

  beforeEach(() => {
    captured = { json: null, error: null };
    output = (data) => { captured.json = data; };
    outputError = (data) => { captured.error = data; };
  });

  test("empty steps → error 'no steps to execute'", async () => {
    const file = writePlan({ summary: "empty", steps: [], rollback: [] });
    try {
      await handleActCommand({
        positional: ["act"],
        flags: { file },
        context: { config: mockConfig, server: "" },
        humanMode: false,
        output,
        outputError,
      });
      expect(captured.error).toBeTruthy();
      expect(captured.error.code).toBe(85);
    } finally {
      cleanup(file);
    }
  });

  test("single step success → completed, succeeded 1/1", async () => {
    const file = writePlan({
      summary: "single",
      steps: [{ id: "s1", command: "system.test.foo", args: {}, depends_on: [], verify: null, on_failure: "abort" }],
      rollback: [],
    });
    try {
      await handleActCommand({
        positional: ["act"],
        flags: { file },
        context: { config: mockConfig, server: "" },
        humanMode: false,
        output,
        outputError,
      });
      expect(captured.json).toBeTruthy();
      expect(captured.json.status).toBe("completed");
      expect(captured.json.succeeded).toBe(1);
      expect(captured.json.total_steps).toBe(1);
    } finally {
      cleanup(file);
    }
  });

  test("dry_run mode → no execution, status dry_run", async () => {
    const file = writePlan({
      summary: "dry",
      steps: [
        { id: "s1", command: "system.test.foo", args: {}, depends_on: [], verify: null, on_failure: "abort" },
        { id: "s2", command: "monitor.disk.space", args: {}, depends_on: ["s1"], verify: null, on_failure: "abort" },
      ],
      rollback: [],
    });
    try {
      await handleActCommand({
        positional: ["act"],
        flags: { file, "dry-run": true },
        context: { config: mockConfig, server: "" },
        humanMode: false,
        output,
        outputError,
      });
      expect(captured.json).toBeTruthy();
      expect(captured.json.dry_run).toBe(2);
      expect(captured.json.results).toHaveLength(2);
      expect(captured.json.results[0].status).toBe("dry_run");
    } finally {
      cleanup(file);
    }
  });

  test("missing command field → step status error", async () => {
    const file = writePlan({
      summary: "missing cmd",
      steps: [{ id: "s1", args: {}, depends_on: [], on_failure: "abort" }],
      rollback: [],
    });
    try {
      await handleActCommand({
        positional: ["act"],
        flags: { file },
        context: { config: mockConfig, server: "" },
        humanMode: false,
        output,
        outputError,
      });
      expect(captured.json.results[0].status).toBe("error");
      expect(captured.json.results[0].exit_code).toBe(85);
    } finally {
      cleanup(file);
    }
  });

  test("unknown command → step status error, exit_code 92", async () => {
    const file = writePlan({
      summary: "unknown",
      steps: [{ id: "s1", command: "nonexistent.fake.command", args: {}, depends_on: [], verify: null, on_failure: "continue" }],
      rollback: [],
    });
    try {
      await handleActCommand({
        positional: ["act"],
        flags: { file },
        context: { config: mockConfig, server: "" },
        humanMode: false,
        output,
        outputError,
      });
      expect(captured.json.results[0].status).toBe("error");
      expect(captured.json.results[0].exit_code).toBe(92);
    } finally {
      cleanup(file);
    }
  });

  test("on_failure abort → status aborted when step fails", async () => {
    const file = writePlan({
      summary: "abort test",
      steps: [
        { id: "bad", command: "nonexistent.fake.command", args: {}, depends_on: [], verify: null, on_failure: "abort" },
        { id: "good", command: "system.test.foo", args: {}, depends_on: ["bad"], verify: null, on_failure: "abort" },
      ],
      rollback: [],
    });
    try {
      await handleActCommand({
        positional: ["act"],
        flags: { file },
        context: { config: mockConfig, server: "" },
        humanMode: false,
        output,
        outputError,
      });
      expect(captured.json.status).toBe("aborted");
      expect(captured.json.aborted).toBe(true);
    } finally {
      cleanup(file);
    }
  });

  test("on_failure continue → status completed_with_errors", async () => {
    const file = writePlan({
      summary: "continue test",
      steps: [
        { id: "bad", command: "nonexistent.fake.command", args: {}, depends_on: [], verify: null, on_failure: "continue" },
        { id: "good", command: "system.test.foo", args: {}, depends_on: [], verify: null, on_failure: "abort" },
      ],
      rollback: [],
    });
    try {
      await handleActCommand({
        positional: ["act"],
        flags: { file },
        context: { config: mockConfig, server: "" },
        humanMode: false,
        output,
        outputError,
      });
      expect(captured.json.status).toBe("completed_with_errors");
      expect(captured.json.failed).toBe(1);
      expect(captured.json.succeeded).toBe(1);
    } finally {
      cleanup(file);
    }
  });

  test("rollback executed when step fails", async () => {
    const file = writePlan({
      summary: "rollback test",
      steps: [{ id: "bad", command: "nonexistent.fake.command", args: {}, depends_on: [], verify: null, on_failure: "abort" }],
      rollback: [{ if_failed_step: "bad", command: "system.test.foo", args: {} }],
    });
    try {
      await handleActCommand({
        positional: ["act"],
        flags: { file },
        context: { config: mockConfig, server: "" },
        humanMode: false,
        output,
        outputError,
      });
      expect(captured.json.rollbacks_executed).toBe(1);
    } finally {
      cleanup(file);
    }
  });

  test("parallel execution: 2 no-dep steps both succeed", async () => {
    const file = writePlan({
      summary: "parallel",
      steps: [
        { id: "s1", command: "system.test.foo", args: {}, depends_on: [], verify: null, on_failure: "abort" },
        { id: "s2", command: "monitor.disk.space", args: {}, depends_on: [], verify: null, on_failure: "abort" },
      ],
      rollback: [],
    });
    try {
      await handleActCommand({
        positional: ["act"],
        flags: { file },
        context: { config: mockConfig, server: "" },
        humanMode: false,
        output,
        outputError,
      });
      expect(captured.json.succeeded).toBe(2);
      expect(captured.json.status).toBe("completed");
    } finally {
      cleanup(file);
    }
  });

  test("sequential deps: A before B in results", async () => {
    const file = writePlan({
      summary: "sequential",
      steps: [
        { id: "A", command: "system.test.foo", args: {}, depends_on: [], verify: null, on_failure: "abort" },
        { id: "B", command: "monitor.disk.space", args: {}, depends_on: ["A"], verify: null, on_failure: "abort" },
      ],
      rollback: [],
    });
    try {
      await handleActCommand({
        positional: ["act"],
        flags: { file },
        context: { config: mockConfig, server: "" },
        humanMode: false,
        output,
        outputError,
      });
      const ids = captured.json.results.map((r) => r.step_id);
      expect(ids.indexOf("A")).toBeLessThan(ids.indexOf("B"));
    } finally {
      cleanup(file);
    }
  });

  test("invalid format command → error", async () => {
    const file = writePlan({
      summary: "bad format",
      steps: [{ id: "s1", command: "invalidformat", args: {}, depends_on: [], verify: null, on_failure: "continue" }],
      rollback: [],
    });
    try {
      await handleActCommand({
        positional: ["act"],
        flags: { file },
        context: { config: mockConfig, server: "" },
        humanMode: false,
        output,
        outputError,
      });
      expect(captured.json.results[0].status).toBe("error");
      expect(captured.json.results[0].exit_code).toBe(85);
    } finally {
      cleanup(file);
    }
  });

  test("no input → error code 85", async () => {
    await handleActCommand({
      positional: ["act"],
      flags: {},
      context: { config: mockConfig, server: "" },
      humanMode: false,
      output,
      outputError,
    });
    expect(captured.error).toBeTruthy();
    expect(captured.error.code).toBe(85);
  });

  test("human mode outputs text", async () => {
    const file = writePlan({
      summary: "human test",
      steps: [{ id: "s1", command: "system.test.foo", args: {}, depends_on: [], verify: null, on_failure: "abort" }],
      rollback: [],
    });
    try {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();
      await handleActCommand({
        positional: ["act"],
        flags: { file },
        context: { config: mockConfig, server: "" },
        humanMode: true,
        output,
        outputError,
      });
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    } finally {
      cleanup(file);
    }
  });
});
