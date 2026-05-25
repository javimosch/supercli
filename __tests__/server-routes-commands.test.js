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

  test("GET / filters null results from storage", async () => {
    mockStorage.listKeys.mockResolvedValue(["command:a", "command:b", "command:c"])
    mockStorage.get.mockImplementation(key => {
      if (key === "command:a") return Promise.resolve({ _id: "command:a", namespace: "a" })
      if (key === "command:b") return Promise.resolve(null)
      if (key === "command:c") return Promise.resolve({ _id: "command:c", namespace: "c" })
    })
    await getHandler(commandsRouter, "get", "/")({ query: { format: "json" }, headers: {} }, res)
    expect(res.json).toHaveBeenCalled()
    const result = res.json.mock.calls[0][0]
    expect(result).toHaveLength(2)
    expect(result.map(c => c._id)).toEqual(["command:a", "command:c"])
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
