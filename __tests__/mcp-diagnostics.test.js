"use strict"

const {
  commandBinary,
  checkCommandAvailable,
} = require("../cli/mcp-diagnostics")

// ──────────────────────────────────────────────────────────────────────────────
// commandBinary — extracts the executable name from a command string
// ──────────────────────────────────────────────────────────────────────────────

describe("commandBinary", () => {
  test("returns the first token of a command", () => {
    expect(commandBinary("npx some-mcp-server --flag")).toBe("npx")
  })

  test("collapses leading/inner whitespace", () => {
    expect(commandBinary("   node   server.js  ")).toBe("node")
  })

  test("handles a bare binary with no args", () => {
    expect(commandBinary("docker")).toBe("docker")
  })

  test("returns empty string for empty / whitespace input", () => {
    expect(commandBinary("")).toBe("")
    expect(commandBinary("   ")).toBe("")
  })

  test("returns empty string for null/undefined", () => {
    expect(commandBinary(null)).toBe("")
    expect(commandBinary(undefined)).toBe("")
  })

  test("coerces non-string input via String()", () => {
    expect(commandBinary(123)).toBe("123")
  })
})

// ──────────────────────────────────────────────────────────────────────────────
// checkCommandAvailable — the no-binary short-circuit (no process spawned)
// ──────────────────────────────────────────────────────────────────────────────

describe("checkCommandAvailable", () => {
  test("reports failure for an empty command without probing PATH", () => {
    const result = checkCommandAvailable("")
    expect(result.ok).toBe(false)
    expect(result.message).toBe("Missing command")
  })

  test("finds a binary that exists in PATH (sh)", () => {
    const result = checkCommandAvailable("sh -c 'echo hi'")
    expect(result.ok).toBe(true)
    expect(result.message).toContain("sh")
  })

  test("reports a clear message for a binary that does not exist", () => {
    const result = checkCommandAvailable("definitely-not-a-real-binary-xyz")
    expect(result.ok).toBe(false)
    expect(result.message).toContain("not found in PATH")
  })
})
