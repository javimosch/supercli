const { compactKeys } = require("../cli/output");

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
