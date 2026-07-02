"use strict"

const path = require("path")
const {
  isPathContained,
  resolveContained,
  resolveBundledPluginDir,
  resolveBundledManifest,
  slugify,
} = require("../cli/path-helpers")

// ──────────────────────────────────────────────────────────────────────────────
// isPathContained
// ──────────────────────────────────────────────────────────────────────────────

describe("isPathContained", () => {
  const base = "/tmp/plugins/myplugin"

  test("direct child file is contained", () => {
    expect(isPathContained("/tmp/plugins/myplugin/script.js", base)).toBe(true)
  })

  test("nested child file is contained", () => {
    expect(isPathContained("/tmp/plugins/myplugin/hooks/post-install.js", base)).toBe(true)
  })

  test("the base directory itself is NOT contained (no sep suffix match)", () => {
    // /tmp/plugins/myplugin does not start with /tmp/plugins/myplugin/ (with sep)
    expect(isPathContained("/tmp/plugins/myplugin", base)).toBe(false)
  })

  test("sibling directory with longer name is NOT contained", () => {
    // /tmp/plugins/myplugin-extra starts with /tmp/plugins/myplugin but should fail
    expect(isPathContained("/tmp/plugins/myplugin-extra/file.js", base)).toBe(false)
  })

  test("parent directory is NOT contained", () => {
    expect(isPathContained("/tmp/plugins", base)).toBe(false)
  })

  test("path that traverses up with .. is NOT contained", () => {
    expect(isPathContained("/tmp/plugins/myplugin/../../evil.sh", base)).toBe(false)
  })

  test("completely unrelated path is NOT contained", () => {
    expect(isPathContained("/etc/passwd", base)).toBe(false)
  })

  test("works when base has trailing separator", () => {
    expect(isPathContained("/tmp/plugins/myplugin/a.js", "/tmp/plugins/myplugin/")).toBe(true)
  })

  test("works with deeply nested subdirectory", () => {
    expect(isPathContained("/tmp/plugins/myplugin/a/b/c/d.json", base)).toBe(true)
  })

  test("root / is NOT contained inside /tmp/plugins/myplugin", () => {
    expect(isPathContained("/", base)).toBe(false)
  })
})

// ──────────────────────────────────────────────────────────────────────────────
// resolveContained
// ──────────────────────────────────────────────────────────────────────────────

describe("resolveContained", () => {
  const base = "/tmp/sandbox"

  test("resolves a simple relative filename to an absolute path", () => {
    expect(resolveContained(base, "script.js")).toBe("/tmp/sandbox/script.js")
  })

  test("resolves a nested relative path", () => {
    expect(resolveContained(base, "hooks/post.js")).toBe("/tmp/sandbox/hooks/post.js")
  })

  test("returns null on simple traversal attempt (../)", () => {
    expect(resolveContained(base, "../escape.sh")).toBeNull()
  })

  test("returns null on deep traversal attempt", () => {
    expect(resolveContained(base, "sub/../../escape.sh")).toBeNull()
  })

  test("returns null for absolute path outside base", () => {
    expect(resolveContained(base, "/etc/shadow")).toBeNull()
  })

  test("returns absolute path when absolute path is inside base", () => {
    expect(resolveContained(base, "/tmp/sandbox/child.js")).toBe("/tmp/sandbox/child.js")
  })

  test("returns null for absolute path that is the base itself", () => {
    // resolving base itself produces /tmp/sandbox which fails the isPathContained check
    expect(resolveContained(base, "/tmp/sandbox")).toBeNull()
  })

  test("returns null for sibling directory sharing a name prefix", () => {
    expect(resolveContained(base, "../sandbox-extra/evil.js")).toBeNull()
  })

  test("resolves dot (.) to base itself — returns null (base is not contained in itself)", () => {
    expect(resolveContained(base, ".")).toBeNull()
  })

  test("resolves a filename with spaces", () => {
    expect(resolveContained(base, "my file.js")).toBe("/tmp/sandbox/my file.js")
  })
})

// ──────────────────────────────────────────────────────────────────────────────
// resolveBundledPluginDir
// ──────────────────────────────────────────────────────────────────────────────

describe("resolveBundledPluginDir", () => {
  test("returns an absolute path", () => {
    const result = resolveBundledPluginDir("my-plugin")
    expect(path.isAbsolute(result)).toBe(true)
  })

  test("path ends with plugins/<name>", () => {
    const result = resolveBundledPluginDir("my-plugin")
    expect(result.endsWith(path.join("plugins", "my-plugin"))).toBe(true)
  })

  test("different plugin names produce different paths", () => {
    expect(resolveBundledPluginDir("alpha")).not.toBe(resolveBundledPluginDir("beta"))
  })

  test("path contains the plugin name segment", () => {
    const result = resolveBundledPluginDir("docker")
    expect(result).toContain("docker")
  })

  test("plugin dir is a child of the plugins directory", () => {
    const dockerDir = resolveBundledPluginDir("docker")
    const pluginsDir = path.dirname(dockerDir)
    expect(path.basename(pluginsDir)).toBe("plugins")
  })
})

// ──────────────────────────────────────────────────────────────────────────────
// resolveBundledManifest
// ──────────────────────────────────────────────────────────────────────────────

describe("resolveBundledManifest", () => {
  test("returns an absolute path", () => {
    const result = resolveBundledManifest("my-plugin")
    expect(path.isAbsolute(result)).toBe(true)
  })

  test("path ends with plugin.json", () => {
    const result = resolveBundledManifest("my-plugin")
    expect(result.endsWith("plugin.json")).toBe(true)
  })

  test("manifest is inside the plugin directory", () => {
    const pluginDir = resolveBundledPluginDir("my-plugin")
    const manifest = resolveBundledManifest("my-plugin")
    expect(manifest).toBe(path.join(pluginDir, "plugin.json"))
  })

  test("different plugin names produce different manifest paths", () => {
    expect(resolveBundledManifest("alpha")).not.toBe(resolveBundledManifest("beta"))
  })

  test("manifest path contains plugin name segment", () => {
    const result = resolveBundledManifest("kubectl")
    expect(result).toContain("kubectl")
    expect(result).toContain("plugin.json")
  })
})

// ──────────────────────────────────────────────────────────────────────────────
// slugify
// ──────────────────────────────────────────────────────────────────────────────

describe("slugify", () => {
  test("lowercases the string", () => {
    expect(slugify("MyPlugin")).toBe("myplugin")
  })

  test("replaces spaces with hyphens", () => {
    expect(slugify("my plugin")).toBe("my-plugin")
  })

  test("replaces underscores with hyphens", () => {
    expect(slugify("my_plugin")).toBe("my-plugin")
  })

  test("collapses multiple separators into one hyphen", () => {
    expect(slugify("my   plugin---name")).toBe("my-plugin-name")
  })

  test("strips leading hyphens", () => {
    expect(slugify("--leading")).toBe("leading")
  })

  test("strips trailing hyphens", () => {
    expect(slugify("trailing--")).toBe("trailing")
  })

  test("handles mixed separators and case", () => {
    expect(slugify("My  Plugin_Name")).toBe("my-plugin-name")
  })

  test("returns empty string for empty input", () => {
    expect(slugify("")).toBe("")
  })

  test("returns empty string for non-string input (null)", () => {
    expect(slugify(null)).toBe("")
  })

  test("returns empty string for non-string input (number)", () => {
    expect(slugify(42)).toBe("")
  })

  test("returns empty string for non-string input (undefined)", () => {
    expect(slugify(undefined)).toBe("")
  })

  test("preserves digits", () => {
    expect(slugify("plugin2go")).toBe("plugin2go")
  })

  test("handles plugin names with dots (e.g. semver-like)", () => {
    expect(slugify("plugin.v2.0")).toBe("plugin-v2-0")
  })

  test("returns empty string for all-special-character input", () => {
    expect(slugify("!!!")).toBe("")
  })

  test("preserves already-slug strings unchanged", () => {
    expect(slugify("my-plugin")).toBe("my-plugin")
  })

  test("handles unicode by collapsing non-ASCII to hyphens", () => {
    expect(slugify("naïve")).toBe("na-ve")
  })
})
