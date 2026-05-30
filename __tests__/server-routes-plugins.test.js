const { EventEmitter } = require("events")
const pluginsRouter = require("../server/routes/plugins")
const pluginsService = require("../server/services/pluginsService")

jest.mock("../server/services/pluginsService")

function getHandler(router, method, path) {
  const route = router.stack.find(s => s.route && s.route.path === path && s.route.methods[method])
  return route ? route.route.stack[route.route.stack.length - 1].handle : null
}

function multipartReq(fields, file) {
  const boundary = "----supercli-boundary"
  const chunks = []

  for (const [name, value] of Object.entries(fields)) {
    chunks.push(Buffer.from(`--${boundary}\r\n`))
    chunks.push(Buffer.from(`Content-Disposition: form-data; name="${name}"\r\n\r\n`))
    chunks.push(Buffer.from(String(value)))
    chunks.push(Buffer.from("\r\n"))
  }

  chunks.push(Buffer.from(`--${boundary}\r\n`))
  chunks.push(Buffer.from("Content-Disposition: form-data; name=\"archive\"; filename=\"plugin.zip\"\r\n"))
  chunks.push(Buffer.from("Content-Type: application/zip\r\n\r\n"))
  chunks.push(file)
  chunks.push(Buffer.from("\r\n"))
  chunks.push(Buffer.from(`--${boundary}--\r\n`))

  const req = new EventEmitter()
  req.headers = {
    "content-type": `multipart/form-data; boundary=${boundary}`,
  }
  req.body = undefined
  req._bodyBuffer = Buffer.concat(chunks)
  return req
}

describe("server routes - plugins", () => {
  let res

  beforeEach(() => {
    jest.clearAllMocks()
    res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      render: jest.fn().mockReturnThis(),
      setHeader: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    }
  })

  test("GET / returns plugins and settings", async () => {
    pluginsService.listServerPlugins.mockResolvedValue([{ name: "resend" }])
    pluginsService.getSettings.mockResolvedValue({ max_zip_mb: 10, default_hooks_policy: "deny" })

    await getHandler(pluginsRouter, "get", "/")({ query: { format: "json" }, headers: {} }, res)

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      plugins: [{ name: "resend" }],
      settings: expect.any(Object),
    }))
  })

  test("POST / uses JSON plugin upsert by default", async () => {
    pluginsService.upsertJsonPlugin.mockResolvedValue({ name: "demo" })

    await getHandler(pluginsRouter, "post", "/")({ body: { name: "demo", manifest: { name: "demo", commands: [] } } }, res)

    expect(pluginsService.upsertJsonPlugin).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(201)
  })

  test("POST /upload parses multipart payload and calls zip upsert", async () => {
    pluginsService.upsertZipPlugin.mockResolvedValue({ name: "zip-demo" })

    const req = multipartReq(
      {
        name: "zip-demo",
        version: "1.0.0",
        enabled: "true",
        hooks_policy: "inherit",
        manifest: JSON.stringify({ name: "zip-demo", commands: [] }),
      },
      Buffer.from([0x50, 0x4b, 0x03, 0x04, 0x00]),
    )

    const run = getHandler(pluginsRouter, "post", "/upload")(req, res)
    req.emit("data", req._bodyBuffer)
    req.emit("end")
    await run

    expect(pluginsService.upsertZipPlugin).toHaveBeenCalledWith(expect.objectContaining({
      name: "zip-demo",
      source_type: "zip",
      archive_buffer: expect.any(Buffer),
      manifest: expect.objectContaining({ name: "zip-demo" }),
    }))
    expect(res.status).toHaveBeenCalledWith(201)
  })

  test("PATCH /:name updates metadata", async () => {
    pluginsService.updatePluginMetadata.mockResolvedValue({ name: "demo", enabled: false })

    await getHandler(pluginsRouter, "patch", "/:name")({ params: { name: "demo" }, body: { enabled: false } }, res)

    expect(pluginsService.updatePluginMetadata).toHaveBeenCalledWith("demo", { enabled: false })
    expect(res.json).toHaveBeenCalledWith({ ok: true, plugin: { name: "demo", enabled: false } })
  })

  test("GET /:name/archive sends zip buffer", async () => {
    pluginsService.getPluginArchiveBuffer.mockResolvedValue(Buffer.from([0x50, 0x4b]))

    await getHandler(pluginsRouter, "get", "/:name/archive")({ params: { name: "demo" } }, res)

    expect(res.setHeader).toHaveBeenCalledWith("Content-Type", "application/zip")
    expect(res.send).toHaveBeenCalledWith(expect.any(Buffer))
  })

  test("returns 400 for invalid service input errors", async () => {
    pluginsService.upsertJsonPlugin.mockRejectedValue(
      Object.assign(new Error("bad payload"), { code: 85, type: "invalid_argument" }),
    )

    await getHandler(pluginsRouter, "post", "/")({ body: { source_type: "json" } }, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: "bad payload" }))
  })

  test("returns 404 for not found errors", async () => {
    pluginsService.getServerPlugin.mockRejectedValue(
      Object.assign(new Error("plugin not found"), { code: 92, type: "not_found" }),
    )

    await getHandler(pluginsRouter, "get", "/:name")({ params: { name: "missing" } }, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      error: "plugin not found",
      type: "not_found"
    }))
  })

  test("returns 500 for generic service errors", async () => {
    pluginsService.listServerPlugins.mockRejectedValue(
      Object.assign(new Error("database error"), { code: 500 }),
    )

    await getHandler(pluginsRouter, "get", "/")({ query: {}, headers: {} }, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      error: "database error",
      type: "internal_error"
    }))
  })

  test("POST /upload handles multipart parsing errors", async () => {
    const req = {
      headers: { "content-type": "multipart/form-data; boundary=test" },
      on: jest.fn(),
      body: undefined,
    }

    const handler = getHandler(pluginsRouter, "post", "/upload")
    const promise = handler(req, res)

    // Simulate data event with malformed boundary
    const dataCallback = req.on.mock.calls.find(call => call[0] === "data")[1]
    const endCallback = req.on.mock.calls.find(call => call[0] === "end")[1]

    dataCallback(Buffer.from("invalid multipart data"))
    endCallback()
    await promise

    expect(res.status).toHaveBeenCalledWith(400)
  })

  test("POST /upload handles missing boundary", async () => {
    const req = {
      headers: { "content-type": "multipart/form-data" }, // no boundary
      on: jest.fn(),
      body: undefined,
    }

    await getHandler(pluginsRouter, "post", "/upload")(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      error: "Multipart boundary is required"
    }))
  })

  test("DELETE /:name removes plugin successfully", async () => {
    pluginsService.removeServerPlugin.mockResolvedValue({ name: "demo", removed: true })

    await getHandler(pluginsRouter, "delete", "/:name")({ params: { name: "demo" } }, res)

    expect(pluginsService.removeServerPlugin).toHaveBeenCalledWith("demo")
    expect(res.json).toHaveBeenCalledWith({ ok: true, removed: { name: "demo", removed: true } })
  })

  test("parseBoolean function edge cases with varied uploads", async () => {
    // Test parseBoolean through actual usage in upload endpoint
    pluginsService.upsertZipPlugin.mockResolvedValue({ name: "test" })

    // Test case: enabled="TRUE" (uppercase)
    const req1 = multipartReq(
      { name: "test1", enabled: "TRUE", manifest: JSON.stringify({ name: "test1" }) },
      Buffer.from([0x50, 0x4b])
    )
    const run1 = getHandler(pluginsRouter, "post", "/upload")(req1, res)
    req1.emit("data", req1._bodyBuffer)
    req1.emit("end")
    await run1

    // Test case: enabled="" (empty string)
    const req2 = multipartReq(
      { name: "test2", enabled: "", manifest: JSON.stringify({ name: "test2" }) },
      Buffer.from([0x50, 0x4b])
    )
    const run2 = getHandler(pluginsRouter, "post", "/upload")(req2, res)
    req2.emit("data", req2._bodyBuffer)
    req2.emit("end")
    await run2

    expect(pluginsService.upsertZipPlugin).toHaveBeenCalledTimes(2)
  })
})
