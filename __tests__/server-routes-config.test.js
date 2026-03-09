const configRouter = require("../server/routes/config")
const configService = require("../server/services/configService")

jest.mock("../server/services/configService")

function getHandler(router, method, path) {
  const route = router.stack.find(s => s.route && s.route.path === path && s.route.methods[method])
  return route ? route.route.stack[0].handle : null
}

describe("server routes - config", () => {
  let req, res

  beforeEach(() => {
    jest.clearAllMocks()
    res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis()
    }
  })

  test("GET / aggregates full config", async () => {
    const handler = getHandler(configRouter, "get", "/")
    configService.getCLIConfig.mockResolvedValue({ version: "1" })
    
    await handler({}, res)
    
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ version: "1" }))
  })

  test("GET / handles error", async () => {
    const handler = getHandler(configRouter, "get", "/")
    configService.getCLIConfig.mockRejectedValue(new Error("fail"))
    
    await handler({}, res)
    
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: "fail" })
  })

  test("GET /tree returns namespaces", async () => {
    const handler = getHandler(configRouter, "get", "/tree")
    configService.getNamespaces.mockResolvedValue(["ns1"])
    
    await handler({}, res)
    
    expect(res.json).toHaveBeenCalledWith({ namespaces: ["ns1"] })
  })

  test("GET /tree/:ns returns resources", async () => {
    const handler = getHandler(configRouter, "get", "/tree/:ns")
    configService.getResources.mockResolvedValue(["r1"])
    
    await handler({ params: { ns: "n" } }, res)
    
    expect(configService.getResources).toHaveBeenCalledWith("n")
    expect(res.json).toHaveBeenCalledWith({ resources: ["r1"] })
  })

  test("GET /tree/:ns/:res returns actions", async () => {
    const handler = getHandler(configRouter, "get", "/tree/:ns/:res")
    configService.getActions.mockResolvedValue(["a1"])
    
    await handler({ params: { ns: "n", res: "r" } }, res)
    
    expect(configService.getActions).toHaveBeenCalledWith("n", "r")
    expect(res.json).toHaveBeenCalledWith({ actions: ["a1"] })
  })

  test("GET /command/:ns/:res/:act returns command", async () => {
    const handler = getHandler(configRouter, "get", "/command/:ns/:res/:act")
    configService.getCommand.mockResolvedValue({ id: "c1" })
    
    await handler({ params: { ns: "n", res: "r", act: "a" } }, res)
    
    expect(res.json).toHaveBeenCalledWith({ id: "c1" })
  })

  test("GET /command/:ns/:res/:act returns 404 if missing", async () => {
    const handler = getHandler(configRouter, "get", "/command/:ns/:res/:act")
    configService.getCommand.mockResolvedValue(null)
    
    await handler({ params: { ns: "n", res: "r", act: "a" } }, res)
    
    expect(res.status).toHaveBeenCalledWith(404)
  })
})
