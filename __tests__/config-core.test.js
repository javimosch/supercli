"use strict";

jest.mock("fs")
jest.mock("os", () => ({
  homedir: jest.fn(() => "/home/user"),
  hostname: jest.fn(() => "host"),
  type: jest.fn(() => "Linux"),
  release: jest.fn(() => "5.0"),
  arch: jest.fn(() => "x64"),
  userInfo: jest.fn(() => ({ username: "user" })),
}))
jest.mock("../cli/plugins-store", () => ({
  getEffectivePluginCommands: jest.fn(() => []),
}))

const { normalizeMcpServerEntry } = require("../cli/config-core")

describe("normalizeMcpServerEntry", () => {
  describe("name validation", () => {
    test("returns null for null name", () => {
      expect(normalizeMcpServerEntry(null, { url: "http://x" })).toBeNull()
    })

    test("returns null for empty string name", () => {
      expect(normalizeMcpServerEntry("", { url: "http://x" })).toBeNull()
    })

    test("returns null for numeric name", () => {
      expect(normalizeMcpServerEntry(42, { url: "http://x" })).toBeNull()
    })

    test("returns null for undefined name", () => {
      expect(normalizeMcpServerEntry(undefined, { url: "http://x" })).toBeNull()
    })
  })

  describe("entry validation", () => {
    test("returns null for null entry", () => {
      expect(normalizeMcpServerEntry("srv", null)).toBeNull()
    })

    test("returns null for array entry", () => {
      expect(normalizeMcpServerEntry("srv", ["http://x"])).toBeNull()
    })

    test("returns null for non-object entry", () => {
      expect(normalizeMcpServerEntry("srv", "http://x")).toBeNull()
    })

    test("returns null for undefined entry", () => {
      expect(normalizeMcpServerEntry("srv", undefined)).toBeNull()
    })
  })

  describe("url and command fields", () => {
    test("includes url when it is a string", () => {
      const out = normalizeMcpServerEntry("srv", { url: "http://example.com" })
      expect(out).toEqual({ name: "srv", url: "http://example.com" })
    })

    test("omits url when it is not a string", () => {
      const out = normalizeMcpServerEntry("srv", { url: 1234 })
      expect(out).not.toHaveProperty("url")
    })

    test("includes command when it is a string", () => {
      const out = normalizeMcpServerEntry("srv", { command: "node" })
      expect(out).toEqual({ name: "srv", command: "node" })
    })

    test("omits command when it is not a string", () => {
      const out = normalizeMcpServerEntry("srv", { command: true })
      expect(out).not.toHaveProperty("command")
    })
  })

  describe("args and commandArgs filtering", () => {
    test("includes only string elements from args", () => {
      const out = normalizeMcpServerEntry("srv", { args: ["a", 2, null, "b"] })
      expect(out.args).toEqual(["a", "b"])
    })

    test("omits args entirely when not an array", () => {
      const out = normalizeMcpServerEntry("srv", { args: "bad" })
      expect(out).not.toHaveProperty("args")
    })

    test("includes only string elements from commandArgs", () => {
      const out = normalizeMcpServerEntry("srv", { commandArgs: ["x", 0, "y"] })
      expect(out.commandArgs).toEqual(["x", "y"])
    })

    test("omits commandArgs when not an array", () => {
      const out = normalizeMcpServerEntry("srv", { commandArgs: {} })
      expect(out).not.toHaveProperty("commandArgs")
    })
  })

  describe("headers filtering", () => {
    test("keeps string-to-string header entries", () => {
      const out = normalizeMcpServerEntry("srv", { headers: { Auth: "Bearer x", Bad: 123 } })
      expect(out.headers).toEqual({ Auth: "Bearer x" })
    })

    test("omits headers when they are an array", () => {
      const out = normalizeMcpServerEntry("srv", { headers: ["bad"] })
      expect(out).not.toHaveProperty("headers")
    })

    test("omits headers when not an object", () => {
      const out = normalizeMcpServerEntry("srv", { headers: "bad" })
      expect(out).not.toHaveProperty("headers")
    })
  })

  describe("env filtering", () => {
    test("keeps string-to-string env entries", () => {
      const out = normalizeMcpServerEntry("srv", { env: { TOKEN: "abc", NUM: 1 } })
      expect(out.env).toEqual({ TOKEN: "abc" })
    })

    test("omits env when it is an array", () => {
      const out = normalizeMcpServerEntry("srv", { env: ["bad"] })
      expect(out).not.toHaveProperty("env")
    })
  })

  describe("timeout_ms", () => {
    test("includes timeout_ms for positive number", () => {
      const out = normalizeMcpServerEntry("srv", { timeout_ms: 5000 })
      expect(out.timeout_ms).toBe(5000)
    })

    test("omits timeout_ms when zero", () => {
      const out = normalizeMcpServerEntry("srv", { timeout_ms: 0 })
      expect(out).not.toHaveProperty("timeout_ms")
    })

    test("omits timeout_ms when negative", () => {
      const out = normalizeMcpServerEntry("srv", { timeout_ms: -1 })
      expect(out).not.toHaveProperty("timeout_ms")
    })

    test("omits timeout_ms when it is a string", () => {
      const out = normalizeMcpServerEntry("srv", { timeout_ms: "5000" })
      expect(out).not.toHaveProperty("timeout_ms")
    })
  })

  describe("stateful flag", () => {
    test("includes stateful when exactly true", () => {
      const out = normalizeMcpServerEntry("srv", { stateful: true })
      expect(out.stateful).toBe(true)
    })

    test("omits stateful when it is the string 'true'", () => {
      const out = normalizeMcpServerEntry("srv", { stateful: "true" })
      expect(out).not.toHaveProperty("stateful")
    })

    test("omits stateful when false", () => {
      const out = normalizeMcpServerEntry("srv", { stateful: false })
      expect(out).not.toHaveProperty("stateful")
    })
  })

  describe("combined entry", () => {
    test("normalizes a full valid entry correctly", () => {
      const out = normalizeMcpServerEntry("my-server", {
        url: "http://mcp.example.com",
        command: "node",
        args: ["server.js", 0],
        headers: { Authorization: "Bearer tok", "X-Num": 1 },
        env: { API_KEY: "key" },
        timeout_ms: 3000,
        stateful: true,
      })
      expect(out).toEqual({
        name: "my-server",
        url: "http://mcp.example.com",
        command: "node",
        args: ["server.js"],
        headers: { Authorization: "Bearer tok" },
        env: { API_KEY: "key" },
        timeout_ms: 3000,
        stateful: true,
      })
    })
  })
})
