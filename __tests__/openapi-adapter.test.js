const { execute } = require("../cli/adapters/openapi")

describe("openapi adapter", () => {
  const mockSpec = {
    servers: [{ url: "https://api.test/v1" }],
    paths: {
      "/users/{id}": {
        get: {
          operationId: "getUser",
          parameters: [
            { name: "id", in: "path" },
            { name: "q", in: "query" }
          ]
        },
        post: {
          operationId: "createUser"
        }
      }
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()
    global.fetch = jest.fn()
  })

  test("throws if spec or operationId missing", async () => {
    await expect(execute({ adapterConfig: {} }, {}, {})).rejects.toThrow(/requires 'spec' and 'operationId'/)
  })

  test("successfully executes GET operation with path and query params", async () => {
    // 1. Fetch spec from local config
    global.fetch
      .mockResolvedValueOnce({ // fetchSpec fetch
        ok: true,
        json: () => Promise.resolve(mockSpec)
      })
      .mockResolvedValueOnce({ // actual API call fetch
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve({ user: "alice" })
      })

    const context = {
      config: {
        specs: [{ name: "my-spec", url: "http://specs/my.json" }]
      }
    }

    const result = await execute({
      adapterConfig: { spec: "my-spec", operationId: "getUser" }
    }, { id: "123", q: "query-val" }, context)

    expect(global.fetch).toHaveBeenCalledWith("http://specs/my.json")
    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.test/v1/users/123?q=query-val",
      expect.objectContaining({ method: "GET" })
    )
    expect(result).toEqual({ user: "alice" })
  })

  test("successfully executes POST operation with body", async () => {
    global.fetch
      .mockResolvedValueOnce({ // fetchSpec fetch
        ok: true,
        json: () => Promise.resolve(mockSpec)
      })
      .mockResolvedValueOnce({ // actual API call fetch
        ok: true,
        headers: { get: () => "text/plain" },
        text: () => Promise.resolve("done")
      })

    const context = {
      config: {
        specs: [{ name: "my-spec", url: "u" }]
      }
    }

    const result = await execute({
      adapterConfig: { spec: "my-spec", operationId: "createUser" }
    }, { name: "bob" }, context)

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.test/v1/users",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ name: "bob" })
      })
    )
    expect(result).toEqual({ raw: "done" })
  })

  test("handles API call failure (500)", async () => {
    global.fetch
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockSpec) })
      .mockResolvedValueOnce({ 
        ok: false, 
        status: 500, 
        statusText: "Err", 
        text: () => Promise.resolve("body"),
        headers: { get: () => "text/plain" }
      })
    
    const context = { config: { specs: [{ name: "s", url: "u" }] } }
    await expect(execute({
      adapterConfig: { spec: "s", operationId: "getUser" }
    }, { id: "1" }, context)).rejects.toMatchObject({ code: 105 })
  })
      .mockResolvedValueOnce({ // actual API call fetch
        ok: true,
        headers: { get: () => "text/plain" },
        text: () => Promise.resolve("done")
      })

    const context = {
      config: {
        specs: [{ name: "my-spec", url: "u" }]
      }
    }

    const result = await execute({
      adapterConfig: { spec: "my-spec", operationId: "createUser" }
    }, { name: "bob" }, context)

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.test/v1/users",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ name: "bob" })
      })
    )
    expect(result).toEqual({ raw: "done" })
  })

  test("resolves spec from remote server if not in local config", async () => {
    global.fetch
      .mockResolvedValueOnce({ // fetchSpec list fetch
        ok: true,
        json: () => Promise.resolve([{ name: "remote-spec", url: "http://remote/spec.json" }])
      })
      .mockResolvedValueOnce({ // fetch actual spec fetch
        ok: true,
        json: () => Promise.resolve(mockSpec)
      })
      .mockResolvedValueOnce({ // API call
        ok: true,
        headers: { get: () => "json" },
        json: () => Promise.resolve({ ok: true })
      })

    const context = { server: "http://api.test", config: { specs: [] } }

    await execute({
      adapterConfig: { spec: "remote-spec", operationId: "getUser" }
    }, { id: "1" }, context)

    expect(global.fetch).toHaveBeenCalledWith("http://api.test/api/specs?format=json")
    expect(global.fetch).toHaveBeenCalledWith("http://remote/spec.json")
  })

  test("throws if spec not found and no server", async () => {
    const context = { config: { specs: [] } }
    await expect(execute({
      adapterConfig: { spec: "missing", operationId: "op" }
    }, {}, context)).rejects.toThrow(/not found in local config/)
  })

  test("throws if remote spec list fetch fails", async () => {
    global.fetch.mockResolvedValue({ ok: false, status: 500 })
    const context = { server: "http://api.test", config: { specs: [] } }
    await expect(execute({
      adapterConfig: { spec: "any", operationId: "op" }
    }, {}, context)).rejects.toThrow(/Failed to fetch specs list: 500/)
  })

  test("throws if remote spec not found in list", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([])
    })
    const context = { server: "http://api.test", config: { specs: [] } }
    await expect(execute({
      adapterConfig: { spec: "missing", operationId: "op" }
    }, {}, context)).rejects.toThrow(/OpenAPI spec 'missing' not found/)
  })

  test("throws if actual spec fetch fails", async () => {
    global.fetch
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([{ name: "s", url: "u" }]) })
      .mockResolvedValueOnce({ ok: false, status: 404 })
    const context = { server: "http://api.test", config: { specs: [] } }
    await expect(execute({
      adapterConfig: { spec: "s", operationId: "op" }
    }, {}, context)).rejects.toThrow(/Failed to fetch OpenAPI spec from u: 404/)
  })

  test("throws if operationId not found in spec", async () => {
    global.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve(mockSpec) })
    const context = { config: { specs: [{ name: "s", url: "u" }] } }
    await expect(execute({
      adapterConfig: { spec: "s", operationId: "missingOp" }
    }, {}, context)).rejects.toThrow(/Operation 'missingOp' not found in spec/)
  })

  test("handles API call failure (500)", async () => {
    global.fetch
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockSpec) })
      .mockResolvedValueOnce({ ok: false, status: 500, statusText: "Err", text: () => Promise.resolve("body") })
    
    const context = { config: { specs: [{ name: "s", url: "u" }] } }
    await expect(execute({
      adapterConfig: { spec: "s", operationId: "getUser" }
    }, { id: "1" }, context)).rejects.toMatchObject({ code: 105 })
  })

  test("uses spec cache", async () => {
    global.fetch
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockSpec) })
      .mockResolvedValue({ ok: true, headers: { get: () => "json" }, json: () => Promise.resolve({}) })

    const context = { config: { specs: [{ name: "cached", url: "u" }] } }
    
    await execute({ adapterConfig: { spec: "cached", operationId: "getUser" } }, { id: "1" }, context)
    await execute({ adapterConfig: { spec: "cached", operationId: "getUser" } }, { id: "2" }, context)

    // Spec fetched only once
    expect(global.fetch).toHaveBeenCalledWith("u")
    expect(global.fetch).toHaveBeenCalledTimes(3) // 1 spec fetch + 2 API calls
  })
})
