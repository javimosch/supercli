"use strict";

const fs = require("fs");
const path = require("path");
const os = require("os");

const { handleReviewCommand } = require("../cli/review");

function writeResults(data) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "review-test-"));
  const file = path.join(dir, "results.json");
  fs.writeFileSync(file, JSON.stringify(data));
  return file;
}

function cleanup(file) {
  try { fs.rmSync(path.dirname(file), { recursive: true, force: true }); } catch {}
}

const sampleResults = {
  version: "1.0",
  mode: "act",
  plan_summary: "Test plan",
  total_steps: 3,
  succeeded: 2,
  failed: 1,
  skipped: 0,
  dry_run: 0,
  rollbacks_executed: 1,
  aborted: false,
  status: "completed_with_errors",
  results: [
    { step_id: "health", command: "system.test.foo", status: "success", exit_code: 0 },
    { step_id: "bad", command: "nonexistent.fake.command", status: "error", exit_code: 92, error: "Command nonexistent.fake.command not found in config" },
    { step_id: "dependent", command: "monitor.disk.space", status: "success", exit_code: 0 },
  ],
  rollbacks: [
    { failed_step: "bad", rollback: { status: "executed" } },
  ],
};

const healthyResults = {
  version: "1.0",
  mode: "act",
  plan_summary: "All good",
  total_steps: 2,
  succeeded: 2,
  failed: 0,
  skipped: 0,
  status: "completed",
  results: [
    { step_id: "s1", command: "system.test.foo", status: "success", exit_code: 0 },
    { step_id: "s2", command: "monitor.disk.space", status: "success", exit_code: 0 },
  ],
  rollbacks: [],
};

const abortedResults = {
  version: "1.0",
  mode: "act",
  plan_summary: "Aborted",
  total_steps: 2,
  succeeded: 1,
  failed: 1,
  status: "aborted",
  aborted: true,
  results: [
    { step_id: "bad", command: "nonexistent.x.y", status: "error", exit_code: 92, error: "not found" },
    { step_id: "good", command: "system.test.foo", status: "skipped", exit_code: 0 },
  ],
  rollbacks: [],
};

const verifyFailedResults = {
  version: "1.0",
  mode: "act",
  plan_summary: "Verify failed",
  total_steps: 1,
  succeeded: 0,
  failed: 1,
  status: "completed_with_errors",
  results: [
    { step_id: "s1", command: "system.test.foo", status: "verify_failed", exit_code: 0, verify: { status: "failed", error: "verify command not found" } },
  ],
  rollbacks: [],
};

describe("sc review — audit and failure analysis", () => {
  let output, outputError, captured;

  beforeEach(() => {
    captured = { json: null, error: null };
    output = (data) => { captured.json = data; };
    outputError = (data) => { captured.error = data; };
  });

  test("review from file → mode review", async () => {
    const file = writeResults(sampleResults);
    try {
      await handleReviewCommand({
        positional: ["review"],
        flags: { file },
        context: { server: "" },
        humanMode: false,
        output,
        outputError,
      });
      expect(captured.json).toBeTruthy();
      expect(captured.json.mode).toBe("review");
    } finally { cleanup(file); }
  });

  test("health assessment: degraded for completed_with_errors", async () => {
    const file = writeResults(sampleResults);
    try {
      await handleReviewCommand({
        positional: ["review"],
        flags: { file },
        context: { server: "" },
        humanMode: false,
        output,
        outputError,
      });
      expect(captured.json.summary.health).toBe("degraded");
    } finally { cleanup(file); }
  });

  test("health assessment: healthy for all-success", async () => {
    const file = writeResults(healthyResults);
    try {
      await handleReviewCommand({
        positional: ["review"],
        flags: { file },
        context: { server: "" },
        humanMode: false,
        output,
        outputError,
      });
      expect(captured.json.summary.health).toBe("healthy");
      expect(captured.json.summary.success_rate).toBe(100);
    } finally { cleanup(file); }
  });

  test("health assessment: aborted", async () => {
    const file = writeResults(abortedResults);
    try {
      await handleReviewCommand({
        positional: ["review"],
        flags: { file },
        context: { server: "" },
        humanMode: false,
        output,
        outputError,
      });
      expect(captured.json.summary.health).toBe("aborted");
      expect(captured.json.summary.aborted).toBe(true);
    } finally { cleanup(file); }
  });

  test("success rate calculated correctly", async () => {
    const file = writeResults(sampleResults);
    try {
      await handleReviewCommand({
        positional: ["review"],
        flags: { file },
        context: { server: "" },
        humanMode: false,
        output,
        outputError,
      });
      expect(captured.json.summary.success_rate).toBe(67);
      expect(captured.json.summary.total_steps).toBe(3);
      expect(captured.json.summary.succeeded).toBe(2);
      expect(captured.json.summary.failed).toBe(1);
    } finally { cleanup(file); }
  });

  test("failure groups categorized", async () => {
    const file = writeResults(sampleResults);
    try {
      await handleReviewCommand({
        positional: ["review"],
        flags: { file },
        context: { server: "" },
        humanMode: false,
        output,
        outputError,
      });
      expect(captured.json.failures.groups).toHaveLength(1);
      expect(captured.json.failures.groups[0].category).toBe("command_not_found");
      expect(captured.json.failures.groups[0].suggestion).toBeTruthy();
    } finally { cleanup(file); }
  });

  test("verify_failed steps categorized", async () => {
    const file = writeResults(verifyFailedResults);
    try {
      await handleReviewCommand({
        positional: ["review"],
        flags: { file },
        context: { server: "" },
        humanMode: false,
        output,
        outputError,
      });
      expect(captured.json.failures.verify_failed_count).toBe(1);
      const vg = captured.json.failures.groups.find(g => g.category === "verify_failed");
      expect(vg).toBeTruthy();
    } finally { cleanup(file); }
  });

  test("audit trail has all steps", async () => {
    const file = writeResults(sampleResults);
    try {
      await handleReviewCommand({
        positional: ["review"],
        flags: { file },
        context: { server: "" },
        humanMode: false,
        output,
        outputError,
      });
      expect(captured.json.audit_trail).toHaveLength(3);
      expect(captured.json.audit_trail[0].step_id).toBe("health");
      expect(captured.json.audit_trail[0].status).toBe("success");
      expect(captured.json.audit_trail[1].status).toBe("error");
    } finally { cleanup(file); }
  });

  test("rollback audit", async () => {
    const file = writeResults(sampleResults);
    try {
      await handleReviewCommand({
        positional: ["review"],
        flags: { file },
        context: { server: "" },
        humanMode: false,
        output,
        outputError,
      });
      expect(captured.json.rollbacks).toHaveLength(1);
      expect(captured.json.rollbacks[0].failed_step).toBe("bad");
      expect(captured.json.rollbacks[0].rollback_status).toBe("executed");
    } finally { cleanup(file); }
  });

  test("no input → error code 85", async () => {
    await handleReviewCommand({
      positional: ["review"],
      flags: {},
      context: { server: "" },
      humanMode: false,
      output,
      outputError,
    });
    expect(captured.error).toBeTruthy();
    expect(captured.error.code).toBe(85);
  });

  test("invalid JSON → error code 85", async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "review-test-"));
    const file = path.join(dir, "bad.json");
    fs.writeFileSync(file, "not json");
    try {
      await handleReviewCommand({
        positional: ["review"],
        flags: { file },
        context: { server: "" },
        humanMode: false,
        output,
        outputError,
      });
      expect(captured.error).toBeTruthy();
      expect(captured.error.code).toBe(85);
    } finally { cleanup(file); }
  });

  test("--save writes review to file", async () => {
    const file = writeResults(sampleResults);
    const savePath = path.join(path.dirname(file), "review-save.json");
    try {
      await handleReviewCommand({
        positional: ["review"],
        flags: { file, save: savePath },
        context: { server: "" },
        humanMode: false,
        output,
        outputError,
      });
      expect(fs.existsSync(savePath)).toBe(true);
      const saved = JSON.parse(fs.readFileSync(savePath, "utf-8"));
      expect(saved.mode).toBe("review");
      expect(saved.summary).toBeTruthy();
    } finally { cleanup(file); }
  });

  test("human mode outputs text", async () => {
    const file = writeResults(sampleResults);
    try {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();
      await handleReviewCommand({
        positional: ["review"],
        flags: { file },
        context: { server: "" },
        humanMode: true,
        output,
        outputError,
      });
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    } finally { cleanup(file); }
  });

  test("by_status counts are correct", async () => {
    const file = writeResults(sampleResults);
    try {
      await handleReviewCommand({
        positional: ["review"],
        flags: { file },
        context: { server: "" },
        humanMode: false,
        output,
        outputError,
      });
      expect(captured.json.by_status.success).toBe(2);
      expect(captured.json.by_status.error).toBe(1);
      expect(captured.json.by_status.verify_failed).toBe(0);
    } finally { cleanup(file); }
  });

  test("rolled_back health status", async () => {
    const rolledBackResults = {
      ...sampleResults,
      status: "completed",
      results: [
        { step_id: "bad", command: "nonexistent.x.y", status: "error", exit_code: 92, error: "not found" },
      ],
      rollbacks: [{ failed_step: "bad", rollback: { status: "executed" } }],
    };
    const file = writeResults(rolledBackResults);
    try {
      await handleReviewCommand({
        positional: ["review"],
        flags: { file },
        context: { server: "" },
        humanMode: false,
        output,
        outputError,
      });
      expect(captured.json.summary.health).toBe("rolled_back");
    } finally { cleanup(file); }
  });

  test("results without results array → error 85", async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "review-test-"));
    const file = path.join(dir, "noresults.json");
    fs.writeFileSync(file, JSON.stringify({ status: "ok" }));
    try {
      await handleReviewCommand({
        positional: ["review"],
        flags: { file },
        context: { server: "" },
        humanMode: false,
        output,
        outputError,
      });
      expect(captured.error).toBeTruthy();
      expect(captured.error.code).toBe(85);
    } finally { cleanup(file); }
  });
});
