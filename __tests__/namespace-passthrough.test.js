const { findNamespacePassthrough } = require("../cli/namespace-passthrough");

describe("namespace-passthrough", () => {
  const mockConfig = {
    commands: [
      {
        namespace: "test",
        resource: "res",
        action: "act",
      },
      {
        namespace: "pass",
        adapterConfig: { passthrough: true },
      },
    ],
  };

  test("returns null if no namespace", () => {
    expect(findNamespacePassthrough(mockConfig, [], [])).toBeNull();
  });

  test("returns null if config missing", () => {
    expect(findNamespacePassthrough(null, ["pass"], ["pass"])).toBeNull();
  });

  test("returns null if not a passthrough namespace", () => {
    expect(findNamespacePassthrough(mockConfig, ["test"], ["test"])).toBeNull();
  });

  test("returns passthrough result if namespace matches and no exact command", () => {
    const result = findNamespacePassthrough(
      mockConfig,
      ["pass"],
      ["pass", "arg1", "arg2"],
    );
    expect(result).toMatchObject({
      namespace: "pass",
      passthroughArgs: ["arg1", "arg2"],
    });
  });

  test("returns null if exact command exists", () => {
    const configWithExact = {
      commands: [
        {
          namespace: "pass",
          adapterConfig: { passthrough: true },
        },
        {
          namespace: "pass",
          resource: "res",
          action: "act",
        },
      ],
    };
    expect(
      findNamespacePassthrough(
        configWithExact,
        ["pass"],
        ["pass", "res", "act"],
      ),
    ).toBeNull();
  });

  test("handles rawArgs where namespace index is -1", () => {
    const result = findNamespacePassthrough(mockConfig, ["pass"], ["other"]);
    expect(result.passthroughArgs).toEqual([]);
  });
});
