const { compactKeys, outputHumanTable } = require("../cli/output");

describe("compactKeys", () => {
  test("returns primitives as-is", () => {
    expect(compactKeys(null)).toBeNull();
    expect(compactKeys(42)).toBe(42);
    expect(compactKeys("hello")).toBe("hello");
    expect(compactKeys(true)).toBe(true);
    expect(compactKeys(undefined)).toBeUndefined();
  });

  test("compacts known keys", () => {
    const input = {
      version: "1.0",
      command: "test",
      namespace: "ns1",
      resource: "res1",
      action: "act1",
      description: "A test command",
      adapter: "process",
      commands: ["cmd1", "cmd2"],
      error: "something broke",
      message: "all good",
      suggestions: ["try again"],
      name: "my-plugin",
      duration_ms: 150,
      data: { key: "val" },
    };
    expect(compactKeys(input)).toEqual({
      v: "1.0",
      c: "test",
      ns: "ns1",
      r: "res1",
      a: "act1",
      desc: "A test command",
      ad: "process",
      cmds: ["cmd1", "cmd2"],
      err: "something broke",
      msg: "all good",
      sug: ["try again"],
      n: "my-plugin",
      ms: 150,
      d: { key: "val" },
    });
  });

  test("preserves unknown keys", () => {
    const input = { unknownFlag: "keep-me", result: "ok" };
    expect(compactKeys(input)).toEqual({
      unknownFlag: "keep-me",
      result: "ok",
    });
  });

  test("handles nested objects recursively", () => {
    const input = {
      version: "1",
      data: {
        command: "nested-cmd",
        extra: { name: "inner", version: "2" },
      },
    };
    expect(compactKeys(input)).toEqual({
      v: "1",
      d: {
        c: "nested-cmd",
        extra: { n: "inner", v: "2" },
      },
    });
  });

  test("handles arrays recursively", () => {
    const input = [
      { command: "a", description: "cmd a" },
      { command: "b", description: "cmd b" },
    ];
    expect(compactKeys(input)).toEqual([
      { c: "a", desc: "cmd a" },
      { c: "b", desc: "cmd b" },
    ]);
  });

  test("handles empty objects and arrays", () => {
    expect(compactKeys({})).toEqual({});
    expect(compactKeys([])).toEqual([]);
  });

  test("handles arrays of primitives", () => {
    expect(compactKeys([1, "two", true])).toEqual([1, "two", true]);
  });
});

describe("outputHumanTable", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  test("prints a table with headers and rows", () => {
    const spy = jest.spyOn(console, "log").mockImplementation(() => {});

    const rows = [
      { name: "Alice", role: "Developer" },
      { name: "Bob", role: "Designer" },
    ];
    const columns = [
      { key: "name", label: "Name" },
      { key: "role", label: "Role" },
    ];

    outputHumanTable(rows, columns);

    expect(spy).toHaveBeenCalledTimes(4);
    const calls = spy.mock.calls.map(([msg]) => msg);
    // widths: name=5 (max of "Name"=4, "Alice"=5, "Bob"=3), role=9 (max of "Role"=4, "Developer"=9, "Designer"=8)
    expect(calls[0]).toBe("  Name   Role     ");
    expect(calls[1]).toBe("  ────────────────");
    expect(calls[2]).toBe("  Alice  Developer");
    expect(calls[3]).toBe("  Bob    Designer ");

    spy.mockRestore();
  });

  test("returns true when rows are printed", () => {
    const spy = jest.spyOn(console, "log").mockImplementation(() => {});

    const result = outputHumanTable([{ x: "1" }], [{ key: "x", label: "X" }]);
    expect(result).toBe(true);

    spy.mockRestore();
  });

  test("handles empty rows by printing a placeholder", () => {
    const spy = jest.spyOn(console, "log").mockImplementation(() => {});

    const result = outputHumanTable([], [{ key: "n", label: "N" }]);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith("  (empty)");
    expect(result).toBe(true);

    spy.mockRestore();
  });

  test("handles null/undefined rows by printing a placeholder", () => {
    const spy = jest.spyOn(console, "log").mockImplementation(() => {});

    expect(outputHumanTable(null, [{ key: "n", label: "N" }])).toBe(true);
    expect(outputHumanTable(undefined, [{ key: "n", label: "N" }])).toBe(true);

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith("  (empty)");

    spy.mockRestore();
  });

  test("pads columns to match the widest value", () => {
    const spy = jest.spyOn(console, "log").mockImplementation(() => {});

    const rows = [
      { short: "a", long: "very long value here" },
    ];
    const columns = [
      { key: "short", label: "Short" },
      { key: "long", label: "Long" },
    ];

    outputHumanTable(rows, columns);

    const calls = spy.mock.calls.map(([msg]) => msg);
    // widths: short=5 (max of "Short"=5, "a"=1), long=19 (max of "Long"=4, "very long value here"=19)
    expect(calls[0]).toBe("  Short  Long                ");
    expect(calls[1]).toBe("  ───────────────────────────");
    expect(calls[2]).toBe("  a      very long value here");

    spy.mockRestore();
  });
});
