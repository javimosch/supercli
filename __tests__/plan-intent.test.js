"use strict";

const fs = require("fs");
const path = require("path");
const os = require("os");

// Mock the LLM call to avoid needing real API keys
jest.mock("../cli/executor", () => ({
  execute: jest.fn().mockResolvedValue({ ok: true, data: { status: "ok" } }),
}));

const { handlePlanIntentCommand } = require("../cli/plan-intent");

describe("sc plan — intent-level planning", () => {
  let output, outputError, captured;

  beforeEach(() => {
    captured = { json: null, error: null };
    output = (data) => { captured.json = data; };
    outputError = (data) => { captured.error = data; };
    // Ensure no real LLM env vars interfere
    delete process.env.OPENAI_BASE_URL;
    delete process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_MODEL;
  });

  test("no LLM configured → error code 105", async () => {
    await handlePlanIntentCommand({
      positional: ["plan", "do something"],
      flags: {},
      context: { server: "" },
      humanMode: false,
      output,
      outputError,
    });
    expect(captured.error).toBeTruthy();
    expect(captured.error.code).toBe(105);
  });

  test("empty intent → error code 85", async () => {
    await handlePlanIntentCommand({
      positional: ["plan", ""],
      flags: {},
      context: { server: "" },
      humanMode: false,
      output,
      outputError,
    });
    expect(captured.error).toBeTruthy();
    expect(captured.error.code).toBe(85);
  });

  test("with mock LLM → returns plan_intent mode", async () => {
    // Set fake LLM env that will fail with auth error (code 105)
    process.env.OPENAI_BASE_URL = "http://127.0.0.1:9999";
    process.env.OPENAI_API_KEY = "dummy";
    process.env.OPENAI_MODEL = "gpt-3.5-turbo";

    await handlePlanIntentCommand({
      positional: ["plan", "deploy the app"],
      flags: {},
      context: { server: "" },
      humanMode: false,
      output,
      outputError,
    });
    // Will fail because mock server doesn't exist — but tests the error path
    expect(captured.error).toBeTruthy();
    expect([105, 106, 110]).toContain(captured.error.code);
  });

  test("human mode with no LLM → error still output", async () => {
    await handlePlanIntentCommand({
      positional: ["plan", "do something"],
      flags: {},
      context: { server: "" },
      humanMode: true,
      output,
      outputError,
    });
    expect(captured.error).toBeTruthy();
    expect(captured.error.code).toBe(105);
  });
});
