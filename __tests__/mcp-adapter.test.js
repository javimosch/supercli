const { execute } = require("../cli/adapters/mcp")
const { spawn } = require("child_process")
const EventEmitter = require("events")

jest.mock("child_process")

describe("mcp adapter", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.fetch = jest.fn()
  })

  test("throws if tool or source missing", async () => {
    await expect(execute({ adapterConfig: {} }, {}, {})).rejects.toThrow(/requires 'tool'/)
    await expect(execute({ adapterConfig: { tool: "t" } }, {}, {})).rejects.toThrow(/one of: 'server', 'url', or 'command'/)
  })

  describe("stdio source", () => {
    let mockChild

    beforeEach(() => {
      mockChild = new EventEmitter()
      mockChild.stdout = new EventEmitter()
      mockChild.stdout.setEncoding = jest.fn()
      mockChild.stderr = new EventEmitter()
      mockChild.stderr.setEncoding = jest.fn()
      mockChild.stdin = { write: jest.fn(), end: jest.fn() }
      mockChild.kill = jest.fn()
      spawn.mockReturnValue(mockChild)
    })

    test("successfully calls stdio tool", async () => {
      const promise = execute({
        adapterConfig: { tool: "calc", command: "node", commandArgs: ["tool.js"] }
      }, { x: 1 }, {})

      mockChild.stdout.emit("data", '{"result": 42}')
      mockChild.emit("close", 0)

      const result = await promise
      expect(result).toEqual({ result: 42 })
      expect(mockChild.stdin.write).toHaveBeenCalledWith(expect.stringContaining('"tool":"calc"'))
    })

    test("handles stdio tool error exit", async () => {
      const promise = execute({
        adapterConfig: { tool: "calc", command: "node" }
      }, {}, {})

      mockChild.stderr.emit("data", "fatal error")
      mockChild.emit("close", 1)

      await expect(promise).rejects.toMatchObject({
        message: expect.stringContaining("exited with code 1: fatal error")
      })
    })

    test("handles stdio tool crash", async () => {
      const promise = execute({
        adapterConfig: { tool: "calc", command: "node" }
      }, {}, {})

      mockChild.emit("error", new Error("spawn error"))

      await expect(promise).rejects.toMatchObject({
        message: expect.stringContaining("Failed to start MCP stdio command: spawn error")
      })
    })

    test("handles invalid JSON response", async () => {
      const promise = execute({
        adapterConfig: { tool: "calc", command: "node" }
      }, {}, {})

      mockChild.stdout.emit("data", "not-json")
      mockChild.emit("close", 0)

      await expect(promise).rejects.toMatchObject({
        message: expect.stringContaining("response is not valid JSON")
      })
    })

    test("handles timeout", async () => {
      jest.useFakeTimers()
      const promise = execute({
        adapterConfig: { tool: "calc", command: "node", timeout_ms: 100 }
      }, {}, {})

      jest.advanceTimersByTime(101)

      await expect(promise).rejects.toMatchObject({
        message: expect.stringContaining("timed out after 100ms")
      })
      jest.useRealTimers()
    })
  })

  describe("http source", () => {
    test("successfully calls http mcp tool (direct url)", async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: "ok" })
      })

      const result = await execute({
        adapterConfig: { tool: "t1", url: "http://mcp.local" }
      }, { arg1: "v1" }, {})

      expect(global.fetch).toHaveBeenCalledWith(
        "http://mcp.local/tool",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ tool: "t1", input: { arg1: "v1" } })
        })
      )
      expect(result).toEqual({ data: "ok" })
    })

    test("resolves server url from local context", async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ ok: true })
      })

      const context = {
        config: {
          mcp_servers: [{ name: "s1", url: "http://server1" }]
        }
      }

      await execute({
        adapterConfig: { tool: "t1", server: "s1" }
      }, {}, context)

      expect(global.fetch).toHaveBeenCalledWith("http://server1/tool", expect.anything())
    })

    test("resolves server url from remote server", async () => {
      global.fetch
        .mockResolvedValueOnce({ // resolveHttpServerUrl fetch
          ok: true,
          json: () => Promise.resolve([{ name: "s2", url: "http://remote-s2" }])
        })
        .mockResolvedValueOnce({ // tool call fetch
          ok: true,
          json: () => Promise.resolve({ ok: true })
        })

      const context = { server: "http://api.test" }

      await execute({
        adapterConfig: { tool: "t1", server: "s2" }
      }, {}, context)

      expect(global.fetch).toHaveBeenCalledWith("http://api.test/api/mcp?format=json")
      expect(global.fetch).toHaveBeenCalledWith("http://remote-s2/tool", expect.anything())
    })

    test("throws if server not found", async () => {
      const context = { config: { mcp_servers: [] } }
      await expect(execute({
        adapterConfig: { tool: "t1", server: "missing" }
      }, {}, context)).rejects.toThrow(/not found in local config/)
    })

    test("handles fetch remote mcp list failure", async () => {
      global.fetch.mockResolvedValue({ ok: false, status: 500 })
      const context = { server: "http://api.test" }

      await expect(execute({
        adapterConfig: { tool: "t1", server: "s1" }
      }, {}, context)).rejects.toMatchObject({ code: 105 })
    })

    test("handles tool call failure", async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        status: 400,
        text: () => Promise.resolve("bad tool")
      })

      await expect(execute({
        adapterConfig: { tool: "t1", url: "http://u" }
      }, {}, {})).rejects.toThrow(/MCP tool call failed: 400 bad tool/)
    })
  })
})
