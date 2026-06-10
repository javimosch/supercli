const { safePluginName, safePluginVersion, resolveHooksPolicy } = require("../cli/config-sync");

describe("safePluginName", () => {
  test("returns empty string for null/undefined", () => {
    expect(safePluginName(null)).toBe("");
    expect(safePluginName(undefined)).toBe("");
  });

  test("returns empty string for empty input", () => {
    expect(safePluginName("")).toBe("");
  });

  test("preserves alphanumeric, dot, underscore, hyphen", () => {
    expect(safePluginName("my-plugin_v2.0")).toBe("my-plugin_v2.0");
  });

  test("replaces invalid characters with hyphens", () => {
    expect(safePluginName("bad!plugin@name")).toBe("bad-plugin-name");
  });

  test("replaces spaces with hyphens", () => {
    expect(safePluginName("my plugin")).toBe("my-plugin");
  });

  test("handles numeric inputs via string conversion", () => {
    expect(safePluginName(123)).toBe("123");
  });
});

describe("safePluginVersion", () => {
  test("returns '0.0.0' for null/undefined", () => {
    expect(safePluginVersion(null)).toBe("0.0.0");
    expect(safePluginVersion(undefined)).toBe("0.0.0");
  });

  test("returns '0.0.0' for empty string", () => {
    expect(safePluginVersion("")).toBe("0.0.0");
  });

  test("preserves semver", () => {
    expect(safePluginVersion("1.2.3")).toBe("1.2.3");
  });

  test("replaces invalid characters with hyphens", () => {
    expect(safePluginVersion("1.0.0-beta+1")).toBe("1.0.0-beta-1");
  });

  test("handles string conversion for non-string inputs", () => {
    expect(safePluginVersion(42)).toBe("42");
  });
});

describe("resolveHooksPolicy", () => {
  test("returns allow when plugin policy is allow", () => {
    const plugin = { hooks_policy: "allow" };
    expect(resolveHooksPolicy(plugin, {})).toBe("allow");
  });

  test("returns deny when plugin policy is deny", () => {
    const plugin = { hooks_policy: "deny" };
    expect(resolveHooksPolicy(plugin, {})).toBe("deny");
  });

  test("falls back to settings default_hooks_policy for inherit", () => {
    const plugin = { hooks_policy: "inherit" };
    const settings = { default_hooks_policy: "allow" };
    expect(resolveHooksPolicy(plugin, settings)).toBe("allow");
  });

  test("falls back to 'deny' when plugin policy is missing", () => {
    const plugin = {};
    expect(resolveHooksPolicy(plugin, {})).toBe("deny");
  });

  test("falls back to 'deny' when settings has no default_hooks_policy", () => {
    const plugin = { hooks_policy: "inherit" };
    const settings = {};
    expect(resolveHooksPolicy(plugin, settings)).toBe("deny");
  });
});
