const jobsRouter = require("../server/routes/jobs")
const { getStorage } = require("../server/storage/adapter")

jest.mock("../server/storage/adapter")

function getHandler(router, method, path) {
  const route = router.stack.find(s => s.route && s.route.path === path && s.route.methods[method])
  return route ? route.route.stack[0].handle : null
}

describe("server routes - jobs", () => {
  let res, mockStorage

  beforeEach(() => {
    jest.clearAllMocks()
    mockStorage = {
      listKeys: jest.fn().mockResolvedValue([]),
      get: jest.fn(),
      set: jest.fn()
    }
    getStorage.mockReturnValue(mockStorage)
    res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      render: jest.fn().mockReturnThis()
    }
  })

  test("POST / success", async () => {
    await getHandler(jobsRouter, "post", "/")({ body: { command: "test" } }, res)
    expect(res.status).toHaveBeenCalledWith(201)
  })

  test("GET / success", async () => {
    mockStorage.listKeys.mockResolvedValue(["job:1"])
    mockStorage.get.mockResolvedValue({ command: "c1", timestamp: "2024-01-01" })
    await getHandler(jobsRouter, "get", "/")({ query: { format: "json" }, headers: {} }, res)
    expect(res.json).toHaveBeenCalled()
  })

  test("GET /stats success", async () => {
    mockStorage.listKeys.mockResolvedValue(["job:1"])
    mockStorage.get.mockResolvedValue({ command: "c1", status: "success", duration_ms: 10 })
    await getHandler(jobsRouter, "get", "/stats")({}, res)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ total: 1 }))
  })

  test("GET /:id success", async () => {
    mockStorage.get.mockResolvedValue({ id: "job:1" })
    await getHandler(jobsRouter, "get", "/:id")({ params: { id: "1" } }, res)
    expect(res.json).toHaveBeenCalled()
  })
})
