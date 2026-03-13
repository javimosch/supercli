const commandsRouter = require("../server/routes/commands")
const { getStorage } = require("../server/storage/adapter")
const { bumpVersion } = require("../server/services/configService")

jest.mock("../server/storage/adapter")
jest.mock("../server/services/configService")

function getHandler(router, method, path) {
  const route = router.stack.find(s => s.route && s.route.path === path && s.route.methods[method])
  return route ? route.route.stack[0].handle : null
}

describe("server routes - commands", () => {
  let res, mockStorage

  beforeEach(() => {
    jest.clearAllMocks()
    mockStorage = {
      listKeys: jest.fn().mockResolvedValue([]),
      get: jest.fn(),
      set: jest.fn(),
      delete: jest.fn()
    }
    getStorage.mockReturnValue(mockStorage)
    res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      render: jest.fn().mockReturnThis(),
      redirect: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    }
  })

  test("GET / success", async () => {
    mockStorage.listKeys.mockResolvedValue(["command:a"])
    mockStorage.get.mockResolvedValue({ _id: "command:a" })
    await getHandler(commandsRouter, "get", "/")({ query: { format: "json" }, headers: {} }, res)
    expect(res.json).toHaveBeenCalled()
  })

  test("POST / success", async () => {
    await getHandler(commandsRouter, "post", "/")({
      body: {
        namespace: "n",
        resource: "r",
        action: "a",
        adapter: "http",
        adapterConfig: { url: "https://example.com" },
      },
      headers: {},
    }, res)
    expect(res.status).toHaveBeenCalledWith(201)
  })

  test("PUT / success", async () => {
    await getHandler(commandsRouter, "put", "/:id")({
      params: { id: "old" },
      body: {
        namespace: "n",
        resource: "r",
        action: "a",
        adapter: "http",
        adapterConfig: { url: "https://example.com" },
      },
    }, res)
    expect(res.json).toHaveBeenCalledWith({ ok: true })
  })

  test("DELETE / success", async () => {
    await getHandler(commandsRouter, "delete", "/:id")({ params: { id: "1" } }, res)
    expect(res.json).toHaveBeenCalledWith({ ok: true })
  })
})
