const { EventEmitter } = require("events")
const pluginsRouter = require("../server/routes/plugins")
const pluginsService = require("../server/services/pluginsService")

jest.mock("../server/services/pluginsService")

function getHandler(router, method, path) {
  const route = router.stack.find(s => s.route && s.route.path === path && s.route.methods[method])
  return route ? route.route.stack[0].handle : null
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
})
