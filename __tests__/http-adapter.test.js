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

  test("throws if path placeholders remain unresolved", async () => {
    await expect(execute({
      adapterConfig: { url: "https://api.test/users/{id}/profile/{section}" }
    }, { id: "123" }, {}))
      .rejects.toThrow(/Missing required path parameters: section/)
  })

  test("injects Content-Type: application/json if body/bodyTemplate present", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => "application/json" },
      json: () => Promise.resolve({ ok: true })
    })

    await execute({
      adapterConfig: {
        url: "https://api.test/users",
        method: "POST",
        body: { fixed: true }
      }
    }, {}, {})

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.test/users",
      expect.objectContaining({
        headers: expect.objectContaining({
          "Content-Type": "application/json"
        })
      })
    )
  })

  test("does not overwrite user-supplied Content-Type header", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => "application/json" },
      json: () => Promise.resolve({ ok: true })
    })

    await execute({
      adapterConfig: {
        url: "https://api.test/users",
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: { fixed: true }
      }
    }, {}, {})

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.test/users",
      expect.objectContaining({
        headers: expect.objectContaining({
          "content-type": "application/x-www-form-urlencoded"
        })
      })
    )
  })

  test("performs POST request with bodyTemplate placeholder interpolation", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => "application/json" },
      json: () => Promise.resolve({ ok: true })
    })

    await execute({
      adapterConfig: {
        url: "https://api.test/users",
        method: "POST",
        bodyTemplate: {
          name: "{{username}}",
          age: "{{userAge}}",
          active: true
        }
      }
    }, { username: "alice", userAge: "25" }, {})

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.test/users",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          name: "alice",
          age: 25,  // Should convert numeric string to number
          active: true
        })
      })
    )
  })

  test("bodyTemplate handles JSON string flag values", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => "application/json" },
      json: () => Promise.resolve({ ok: true })
    })

    await execute({
      adapterConfig: {
        url: "https://api.test/users",
        method: "POST",
        bodyTemplate: {
          tags: "{{tagsArray}}",
          config: "{{configObj}}"
        }
      }
    }, {
      tagsArray: '["tag1", "tag2"]',
      configObj: '{"setting": "value"}'
    }, {})

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.test/users",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          tags: ["tag1", "tag2"],
          config: { setting: "value" }
        })
      })
    )
  })

  test("bodyTemplate removes null values for unresolved placeholders", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => "application/json" },
      json: () => Promise.resolve({ ok: true })
    })

    await execute({
      adapterConfig: {
        url: "https://api.test/users",
        method: "POST",
        bodyTemplate: {
          name: "{{username}}",
          optional: "{{missing}}",
          required: "fixed-value"
        }
      }
    }, { username: "alice" }, {})

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.test/users",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          name: "alice",
          required: "fixed-value"
          // optional field should be removed since missing is undefined
        })
      })
    )
  })

  test("bodyTemplate handles numeric conversion correctly", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => "application/json" },
      json: () => Promise.resolve({ ok: true })
    })

    await execute({
      adapterConfig: {
        url: "https://api.test/users",
        method: "POST",
        bodyTemplate: {
          integerVal: "{{intStr}}",
          floatVal: "{{floatStr}}",
          stringVal: "{{textStr}}",
          emptyStr: "{{empty}}"
        }
      }
    }, {
      intStr: "42",
      floatStr: "3.14",
      textStr: "not-a-number",
      empty: ""
    }, {})

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.test/users",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          integerVal: 42,
          floatVal: 3.14,
          stringVal: "not-a-number",
          emptyStr: ""  // Empty string should remain string
        })
      })
    )
  })
})

