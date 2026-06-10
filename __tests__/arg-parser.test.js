const { CLI_VERSION, RESERVED_FLAGS, parseArgs, userFlags, readStdin } = require("../cli/arg-parser");

describe("parseArgs", () => {
  test("parses --flag value pairs", () => {
    const result = parseArgs(["--name", "test", "--count", "3"]);
    expect(result.flags).toEqual({ name: "test", count: "3" });
    expect(result.positional).toEqual([]);
  });

  test("parses --flag=value syntax", () => {
    const result = parseArgs(["--name=test", "--count=3"]);
    expect(result.flags).toEqual({ name: "test", count: "3" });
    expect(result.positional).toEqual([]);
  });

  test("parses boolean flags (--flag without value)", () => {
    const result = parseArgs(["--verbose", "--json"]);
    expect(result.flags).toEqual({ verbose: true, json: true });
  });

  test("treats bare arguments as positional", () => {
    const result = parseArgs(["install", "lodash", "--force"]);
    expect(result.flags).toEqual({ force: true });
    expect(result.positional).toEqual(["install", "lodash"]);
  });

  test("empty argv returns empty flags and positional", () => {
    const result = parseArgs([]);
    expect(result.flags).toEqual({});
    expect(result.positional).toEqual([]);
  });

  test("-- ends option parsing, subsequent args become positional", () => {
    const result = parseArgs(["--flag1", "val1", "--", "--flag2", "val2"]);
    expect(result.flags).toEqual({ flag1: "val1" });
    expect(result.positional).toEqual(["--flag2", "val2"]);
  });

  test("handles --flag= with empty value as empty string", () => {
    const result = parseArgs(["--name="]);
    expect(result.flags).toEqual({ name: "" });
  });

  test("handles --flag= with nothing after = as empty key (skipped)", () => {
    const result = parseArgs(["--=value"]);
    expect(result.flags).toEqual({});
  });

  test("includes rawArgs in result", () => {
    const result = parseArgs(["a", "b"]);
    expect(result.rawArgs).toEqual(["a", "b"]);
  });

  test("next arg starting with -- is not consumed as flag value", () => {
    const result = parseArgs(["--flag", "--other"]);
    expect(result.flags).toEqual({ flag: true, other: true });
  });

  test("mixed positional and flags", () => {
    const result = parseArgs(["run", "--mode", "prod", "test", "--dry-run"]);
    expect(result.flags).toEqual({ mode: "prod", "dry-run": true });
    expect(result.positional).toEqual(["run", "test"]);
  });
});

describe("userFlags", () => {
  test("filters out reserved flags", () => {
    const flags = {
      human: true,
      json: true,
      compact: true,
      "no-color": true,
      format: "json",
      myflag: "keep",
      output: "keep",
    };
    expect(userFlags(flags)).toEqual({ myflag: "keep", output: "keep" });
  });

  test("returns empty object when all flags are reserved", () => {
    expect(userFlags({ help: true, version: true })).toEqual({});
  });

  test("returns same object when no reserved flags present", () => {
    expect(userFlags({ custom: "value", verbose: true })).toEqual({ custom: "value", verbose: true });
  });

  test("handles empty object", () => {
    expect(userFlags({})).toEqual({});
  });
});

describe("CLI_VERSION", () => {
  test("is a string", () => {
    expect(typeof CLI_VERSION).toBe("string");
  });

  test("matches package.json version", () => {
    const pkg = require("../package.json");
    expect(CLI_VERSION).toBe(pkg.version);
  });
});

describe("RESERVED_FLAGS", () => {
  test("is an array of strings", () => {
    expect(Array.isArray(RESERVED_FLAGS)).toBe(true);
    RESERVED_FLAGS.forEach((flag) => {
      expect(typeof flag).toBe("string");
    });
  });

  test("includes common reserved flags", () => {
    expect(RESERVED_FLAGS).toContain("help");
    expect(RESERVED_FLAGS).toContain("json");
    expect(RESERVED_FLAGS).toContain("version");
  });
});

describe("readStdin", () => {
  const EventEmitter = require("events");
  let originalStdin;

  beforeEach(() => {
    originalStdin = process.stdin;
  });

  afterEach(() => {
    Object.defineProperty(process, "stdin", {
      value: originalStdin,
      configurable: true,
      writable: true,
    });
  });

  function mockStdinStream() {
    const emitter = new EventEmitter();
    emitter.isTTY = false;
    emitter.setEncoding = jest.fn();
    emitter.destroy = jest.fn();
    emitter.on = emitter.addListener;
    return emitter;
  }

  test("returns null when stdin is TTY", async () => {
    Object.defineProperty(process, "stdin", {
      value: { isTTY: true },
      configurable: true,
      writable: true,
    });
    const result = await readStdin();
    expect(result).toBeNull();
  });

  test("returns null when stdin has no data (empty string)", async () => {
    const stdin = mockStdinStream();
    Object.defineProperty(process, "stdin", {
      value: stdin,
      configurable: true,
      writable: true,
    });
    const promise = readStdin();
    stdin.emit("data", "");
    stdin.emit("end");
    const result = await promise;
    expect(result).toBeNull();
  });

  test("parses JSON data from stdin", async () => {
    const stdin = mockStdinStream();
    Object.defineProperty(process, "stdin", {
      value: stdin,
      configurable: true,
      writable: true,
    });
    const promise = readStdin();
    stdin.emit("data", '{"key": "value"}');
    stdin.emit("end");
    const result = await promise;
    expect(result).toEqual({ key: "value" });
  });

  test("returns raw text wrapped in _stdin when not JSON", async () => {
    const stdin = mockStdinStream();
    Object.defineProperty(process, "stdin", {
      value: stdin,
      configurable: true,
      writable: true,
    });
    const promise = readStdin();
    stdin.emit("data", "plain text");
    stdin.emit("end");
    const result = await promise;
    expect(result).toEqual({ _stdin: "plain text" });
  });
});
