"use strict";

jest.mock("../cli/executor", () => ({ execute: jest.fn() }));
jest.mock("../cli/plan-runtime", () => ({
  buildLocalPlan: jest.fn(),
  annotateServerPlan: jest.fn(),
  outputHumanPlan: jest.fn(),
}));

const { execute } = require("../cli/executor");
const { buildLocalPlan, annotateServerPlan, outputHumanPlan } = require("../cli/plan-runtime");
const { handleExecute, handlePlan, handleExecutePlan } = require("../cli/execute-handler");

// ─── shared fixtures ──────────────────────────────────────────────────────────

function makeCmd(overrides = {}) {
  return {
    namespace: "ai",
    resource: "text",
    action: "summarize",
    adapter: "http",
    ...overrides,
  };
}

function makeIo(overrides = {}) {
  return {
    SERVER: "https://example.com",
    humanMode: false,
    output: jest.fn(),
    outputError: jest.fn(),
    outputHumanTable: jest.fn(),
    writeLog: jest.fn(),
    getClientId: jest.fn().mockReturnValue("client-abc"),
    makeStreamEmitter: jest.fn().mockReturnValue(jest.fn()),
    ...overrides,
  };
}

// ─── handleExecute ─────────────────────────────────────────────────────────────

describe("handleExecute", () => {
  let stderrSpy;
  let consoleSpy;

  beforeEach(() => {
    jest.resetAllMocks();
    stderrSpy = jest.spyOn(process.stderr, "write").mockImplementation(() => {});
    consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    stderrSpy.mockRestore();
    consoleSpy.mockRestore();
  });

  test("forwards cmd, uFlags and config to execute()", async () => {
    const cmd = makeCmd();
    const uFlags = { limit: 5 };
    const config = { apiKey: "xyz" };
    const io = makeIo({ SERVER: "https://srv.io" });
    execute.mockResolvedValue({ id: 1 });

    await handleExecute(cmd, uFlags, config, io);

    expect(execute).toHaveBeenCalledWith(
      cmd,
      uFlags,
      expect.objectContaining({ server: "https://srv.io", config })
    );
  });

  test("passes empty string as server when SERVER is falsy", async () => {
    const cmd = makeCmd();
    const io = makeIo({ SERVER: null });
    execute.mockResolvedValue({});

    await handleExecute(cmd, {}, {}, io);

    expect(execute).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.objectContaining({ server: "" })
    );
  });

  test("passes null onStreamEvent when adapterConfig is absent", async () => {
    const cmd = makeCmd(); // no adapterConfig
    const io = makeIo();
    execute.mockResolvedValue({});

    await handleExecute(cmd, {}, {}, io);

    expect(execute).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.objectContaining({ onStreamEvent: null })
    );
    expect(io.makeStreamEmitter).not.toHaveBeenCalled();
  });

  test("passes null onStreamEvent when stream is not jsonl", async () => {
    const cmd = makeCmd({ adapterConfig: { stream: "text" } });
    const io = makeIo();
    execute.mockResolvedValue({});

    await handleExecute(cmd, {}, {}, io);

    expect(execute).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.objectContaining({ onStreamEvent: null })
    );
    expect(io.makeStreamEmitter).not.toHaveBeenCalled();
  });

  test("calls makeStreamEmitter and passes result as onStreamEvent when stream is jsonl", async () => {
    const emitterFn = jest.fn();
    const io = makeIo({ makeStreamEmitter: jest.fn().mockReturnValue(emitterFn) });
    const cmd = makeCmd({ adapterConfig: { stream: "jsonl" } });
    execute.mockResolvedValue({});

    await handleExecute(cmd, {}, {}, io);

    expect(io.makeStreamEmitter).toHaveBeenCalledWith("ai.text.summarize");
    expect(execute).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.objectContaining({ onStreamEvent: emitterFn })
    );
  });

  test("calls writeLog with correct fields", async () => {
    const cmd = makeCmd();
    const uFlags = { q: "hello" };
    const io = makeIo();
    execute.mockResolvedValue({ done: true });

    await handleExecute(cmd, uFlags, {}, io);

    expect(io.writeLog).toHaveBeenCalledWith(
      expect.objectContaining({
        command: "ai.text.summarize",
        args: uFlags,
        status: "success",
        client_id: "client-abc",
      })
    );
    const logged = io.writeLog.mock.calls[0][0];
    expect(typeof logged.duration_ms).toBe("number");
    expect(typeof logged.timestamp).toBe("string");
  });

  test("calls getClientId to populate client_id in writeLog", async () => {
    const io = makeIo();
    io.getClientId.mockReturnValue("custom-client");
    execute.mockResolvedValue({});

    await handleExecute(makeCmd(), {}, {}, io);

    expect(io.getClientId).toHaveBeenCalled();
    expect(io.writeLog).toHaveBeenCalledWith(
      expect.objectContaining({ client_id: "custom-client" })
    );
  });

  test("calls output with structured envelope in non-human mode", async () => {
    const io = makeIo({ humanMode: false });
    execute.mockResolvedValue({ items: [1, 2] });

    await handleExecute(makeCmd(), {}, {}, io);

    expect(io.output).toHaveBeenCalledWith(
      expect.objectContaining({
        version: "1.0",
        command: "ai.text.summarize",
        data: { items: [1, 2] },
      })
    );
    const envelope = io.output.mock.calls[0][0];
    expect(typeof envelope.duration_ms).toBe("number");
  });

  test("does not call outputHumanTable or outputError in non-human mode", async () => {
    const io = makeIo({ humanMode: false });
    execute.mockResolvedValue([{ a: 1 }]);

    await handleExecute(makeCmd(), {}, {}, io);

    expect(io.outputHumanTable).not.toHaveBeenCalled();
    expect(io.outputError).not.toHaveBeenCalled();
  });

  test("human mode + array result: calls outputHumanTable with up to 20 rows", async () => {
    const io = makeIo({ humanMode: true });
    const rows = Array.from({ length: 5 }, (_, i) => ({ id: i, name: `r${i}` }));
    execute.mockResolvedValue(rows);

    await handleExecute(makeCmd(), {}, {}, io);

    expect(io.outputHumanTable).toHaveBeenCalledWith(
      rows,
      expect.arrayContaining([expect.objectContaining({ key: "id" })])
    );
  });

  test("human mode + array > 20 rows: slices to 20 and logs 'and N more'", async () => {
    const io = makeIo({ humanMode: true });
    const rows = Array.from({ length: 25 }, (_, i) => ({ id: i }));
    execute.mockResolvedValue(rows);

    await handleExecute(makeCmd(), {}, {}, io);

    const tableArg = io.outputHumanTable.mock.calls[0][0];
    expect(tableArg).toHaveLength(20);
    const loggedLines = consoleSpy.mock.calls.map((c) => c.join(" ")).join("\n");
    expect(loggedLines).toContain("5 more");
  });

  test("human mode + object result: logs each key-value pair", async () => {
    const io = makeIo({ humanMode: true });
    execute.mockResolvedValue({ status: "ok", count: 3 });

    await handleExecute(makeCmd(), {}, {}, io);

    const loggedLines = consoleSpy.mock.calls.map((c) => c.join(" ")).join("\n");
    expect(loggedLines).toContain("status");
    expect(loggedLines).toContain("ok");
    expect(loggedLines).toContain("count");
    expect(loggedLines).toContain("3");
  });

  test("human mode + nested object value: JSON.stringify applied", async () => {
    const io = makeIo({ humanMode: true });
    execute.mockResolvedValue({ meta: { version: "1.0" } });

    await handleExecute(makeCmd(), {}, {}, io);

    const loggedLines = consoleSpy.mock.calls.map((c) => c.join(" ")).join("\n");
    expect(loggedLines).toContain('"version":"1.0"');
  });

  test("propagates error thrown by execute()", async () => {
    const io = makeIo();
    const err = Object.assign(new Error("adapter failed"), { code: 110 });
    execute.mockRejectedValue(err);

    await expect(handleExecute(makeCmd(), {}, {}, io)).rejects.toThrow("adapter failed");
    expect(io.output).not.toHaveBeenCalled();
    expect(io.writeLog).not.toHaveBeenCalled();
  });
});

// ─── handlePlan ────────────────────────────────────────────────────────────────

describe("handlePlan", () => {
  let consoleSpy;

  beforeEach(() => {
    jest.resetAllMocks();
    consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    delete global.fetch;
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    delete global.fetch;
  });

  function makeIoPlan(overrides = {}) {
    return {
      SERVER: "https://srv.io",
      hasServer: false,
      humanMode: false,
      output: jest.fn(),
      outputError: jest.fn(),
      ...overrides,
    };
  }

  test("no server: calls buildLocalPlan and passes result to output", async () => {
    const localPlan = { plan_id: "lp1", persisted: false };
    buildLocalPlan.mockReturnValue(localPlan);
    const io = makeIoPlan({ hasServer: false, humanMode: false });
    const cmd = makeCmd();
    const args = { q: "a" };

    await handlePlan(cmd, args, io);

    expect(buildLocalPlan).toHaveBeenCalledWith(cmd, args);
    expect(io.output).toHaveBeenCalledWith(localPlan);
  });

  test("no server + human mode: calls outputHumanPlan", async () => {
    const localPlan = { plan_id: "lp1", steps: [] };
    buildLocalPlan.mockReturnValue(localPlan);
    const io = makeIoPlan({ hasServer: false, humanMode: true });

    await handlePlan(makeCmd(), {}, io);

    expect(outputHumanPlan).toHaveBeenCalledWith(localPlan);
    expect(io.output).not.toHaveBeenCalled();
  });

  test("with server: fetches /api/plans and outputs annotated plan", async () => {
    const serverPlan = { plan_id: "sp1", steps: [] };
    const annotated = { ...serverPlan, persisted: true, execution_mode: "server" };
    annotateServerPlan.mockReturnValue(annotated);
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(serverPlan),
    });
    const io = makeIoPlan({ hasServer: true, humanMode: false });
    const cmd = makeCmd();

    await handlePlan(cmd, { q: "b" }, io);

    expect(global.fetch).toHaveBeenCalledWith(
      "https://srv.io/api/plans",
      expect.objectContaining({ method: "POST" })
    );
    expect(annotateServerPlan).toHaveBeenCalledWith(serverPlan);
    expect(io.output).toHaveBeenCalledWith(annotated);
  });

  test("with server + human mode: calls outputHumanPlan with annotated plan", async () => {
    const annotated = { plan_id: "sp2", persisted: true, steps: [] };
    annotateServerPlan.mockReturnValue(annotated);
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({}),
    });
    const io = makeIoPlan({ hasServer: true, humanMode: true });

    await handlePlan(makeCmd(), {}, io);

    expect(outputHumanPlan).toHaveBeenCalledWith(annotated);
    expect(io.output).not.toHaveBeenCalled();
  });

  test("with server: POST body includes command and args", async () => {
    annotateServerPlan.mockReturnValue({});
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({}),
    });
    const io = makeIoPlan({ hasServer: true });
    const cmd = makeCmd();

    await handlePlan(cmd, { limit: 10 }, io);

    const [, opts] = global.fetch.mock.calls[0];
    const body = JSON.parse(opts.body);
    expect(body.command).toBe("ai.text.summarize");
    expect(body.args).toEqual({ limit: 10 });
    expect(body.cmd).toEqual(cmd);
  });

  test("with server + fetch throws: calls outputError with code 105", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("network failure"));
    const io = makeIoPlan({ hasServer: true });

    await handlePlan(makeCmd(), {}, io);

    expect(io.outputError).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 105,
        type: "integration_error",
        recoverable: true,
      })
    );
    const err = io.outputError.mock.calls[0][0];
    expect(err.message).toContain("network failure");
  });
});

// ─── handleExecutePlan ─────────────────────────────────────────────────────────

describe("handleExecutePlan", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    delete global.fetch;
  });

  afterEach(() => {
    delete global.fetch;
  });

  function makeIoExec(overrides = {}) {
    return {
      SERVER: "https://srv.io",
      output: jest.fn(),
      outputError: jest.fn(),
      ...overrides,
    };
  }

  test("fetches the execute endpoint for the given planId", async () => {
    const io = makeIoExec();
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({ status: "executed" }),
    });

    await handleExecutePlan("plan-99", io);

    expect(global.fetch).toHaveBeenCalledWith(
      "https://srv.io/api/plans/plan-99/execute",
      expect.objectContaining({ method: "POST" })
    );
  });

  test("passes JSON result to output", async () => {
    const io = makeIoExec();
    const result = { status: "executed", id: "plan-99" };
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(result),
    });

    await handleExecutePlan("plan-99", io);

    expect(io.output).toHaveBeenCalledWith(result);
  });

  test("calls outputError with code 105 when fetch throws", async () => {
    const io = makeIoExec();
    global.fetch = jest.fn().mockRejectedValue(new Error("connection refused"));

    await handleExecutePlan("plan-99", io);

    expect(io.outputError).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 105,
        type: "integration_error",
        recoverable: true,
      })
    );
    const err = io.outputError.mock.calls[0][0];
    expect(err.message).toContain("connection refused");
  });

  test("does not call output when fetch throws", async () => {
    const io = makeIoExec();
    global.fetch = jest.fn().mockRejectedValue(new Error("timeout"));

    await handleExecutePlan("plan-42", io);

    expect(io.output).not.toHaveBeenCalled();
  });
});
