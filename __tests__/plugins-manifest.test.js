const { commandKey } = require("../cli/plugins-manifest");

describe("commandKey", () => {
  test("formats namespace, resource, action as ns.res.act", () => {
    expect(commandKey({ namespace: "git", resource: "branch", action: "list" })).toBe("git.branch.list");
  });

  test("formats namespace, resource, action with dots in namespace", () => {
    expect(commandKey({ namespace: "github.cli", resource: "issue", action: "create" })).toBe("github.cli.issue.create");
  });

  test("handles single-character values", () => {
    expect(commandKey({ namespace: "a", resource: "b", action: "c" })).toBe("a.b.c");
  });
});
