const { execute } = require("../cli/adapters/http")

describe("http adapter", () => {
  beforeEach(() => {
    global.fetch = jest.fn()
  })

  test("throws if url missing", async () => {
    await expect(execute({ adapterConfig: {} }, {}, {})).rejects.toThrow(/requires 'url'/)
  })

  test("performs GET request with placeholders and query params", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => "application/json" },
      json: () => Promise.resolve({ data: "ok" })
    })

    const result = await execute({
      adapterConfig: { url: "https://api.test/users/{id}" }
    }, { id: "123", q: "search", human: true }, {})

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.test/users/123?q=search",
      expect.objectContaining({ method: "GET" })
    )
    expect(result).toEqual({ data: "ok" })
  })

  test("performs POST request with body from flags", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => "application/json" },
      json: () => Promise.resolve({ ok: true })
    })

    const result = await execute({
      adapterConfig: { url: "https://api.test/users", method: "POST" }
    }, { name: "alice", role: "admin" }, {})

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.test/users",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ name: "alice", role: "admin" })
      })
    )
  })

  test("performs POST request with predefined body", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => "text/plain" },
      text: () => Promise.resolve("raw-response")
    })

    const result = await execute({
      adapterConfig: { 
        url: "https://api.test/users", 
        method: "PATCH",
        body: { fixed: true }
      }
    }, { ignored: "val" }, {})

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.test/users",
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify({ fixed: true })
      })
    )
    expect(result).toEqual({ raw: "raw-response" })
  })

  test("handles HTTP error codes (500)", async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Server Error",
      text: () => Promise.resolve("error details")
    })

    await expect(execute({ adapterConfig: { url: "u" } }, {}, {}))
      .rejects.toMatchObject({
        code: 105,
        type: "integration_error",
        recoverable: true
      })
  })

  test("handles HTTP error codes (404)", async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 404,
      statusText: "Not Found",
      text: () => Promise.resolve("")
    })

    await expect(execute({ adapterConfig: { url: "u" } }, {}, {}))
      .rejects.toMatchObject({
        code: 92,
        type: "resource_not_found",
        recoverable: false
      })
  })
  
  test("handles fetch text failure in error path", async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 400,
      statusText: "Bad Request",
      text: () => Promise.reject("cant-read-body")
    })

    await expect(execute({ adapterConfig: { url: "u" } }, {}, {}))
      .rejects.toThrow(/HTTP request failed: 400 Bad Request/)
  })
})
