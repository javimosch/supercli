const mcpRouter = require("../server/routes/mcp")
const specsRouter = require("../server/routes/specs")
const plansRouter = require("../server/routes/plans")
const { getStorage } = require("../server/storage/adapter")
const planner = require("../cli/planner")
const executor = require("../cli/executor")

jest.mock("../server/storage/adapter")
jest.mock("../cli/planner")
jest.mock("../cli/executor")

function getHandler(router, method, path) {
  const route = router.stack.find(s => s.route && s.route.path === path && s.route.methods[method])
  return route ? route.route.stack[0].handle : null
}

describe("server routes - misc", () => {
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
      redirect: jest.fn().mockReturnThis()
    }
  })

  describe("mcp routes", () => {
    test("GET / success", async () => {
      mockStorage.listKeys.mockResolvedValue(["mcp:a"])
      mockStorage.get.mockResolvedValue({ name: "a" })
      await getHandler(mcpRouter, "get", "/")({ query: { format: "json" }, headers: {} }, res)
      expect(res.json).toHaveBeenCalled()
    })
    test("POST / success", async () => {
      await getHandler(mcpRouter, "post", "/")({ body: { name: "a", url: "u" }, headers: {} }, res)
      expect(res.status).toHaveBeenCalledWith(201)
    })
    test("PUT / success", async () => {
      await getHandler(mcpRouter, "put", "/:id")({ params: { id: "mcp:a" }, body: { name: "a", url: "u" } }, res)
      expect(res.json).toHaveBeenCalledWith({ ok: true })
    })
    test("DELETE / success", async () => {
      await getHandler(mcpRouter, "delete", "/:id")({ params: { id: "mcp:a" } }, res)
      expect(res.json).toHaveBeenCalledWith({ ok: true })
    })
  })

  describe("specs routes", () => {
    test("GET / success", async () => {
      mockStorage.listKeys.mockResolvedValue(["spec:a"])
      mockStorage.get.mockResolvedValue({ name: "a" })
      await getHandler(specsRouter, "get", "/")({ query: { format: "json" }, headers: {} }, res)
      expect(res.json).toHaveBeenCalled()
    })
    test("POST / success", async () => {
      await getHandler(specsRouter, "post", "/")({ body: { name: "a", url: "u" }, headers: {} }, res)
      expect(res.status).toHaveBeenCalledWith(201)
    })
    test("PUT / success", async () => {
      await getHandler(specsRouter, "put", "/:id")({ params: { id: "spec:a" }, body: { name: "a", url: "u" } }, res)
      expect(res.json).toHaveBeenCalledWith({ ok: true })
    })
    test("DELETE / success", async () => {
      await getHandler(specsRouter, "delete", "/:id")({ params: { id: "spec:a" } }, res)
      expect(res.json).toHaveBeenCalledWith({ ok: true })
    })
  })

  describe("plans routes", () => {
    test("POST / success", async () => {
      mockStorage.get.mockResolvedValue({ id: "cmd" })
      planner.createPlan.mockReturnValue({ plan_id: "p1" })
      await getHandler(plansRouter, "post", "/")({ body: { command: "n.r.a" } }, res)
      expect(res.status).toHaveBeenCalledWith(201)
    })
    test("GET / success", async () => {
      mockStorage.listKeys.mockResolvedValue(["plan:p1"])
      mockStorage.get.mockResolvedValue({ created_at: "2024-01-01" })
      await getHandler(plansRouter, "get", "/")({}, res)
      expect(res.json).toHaveBeenCalled()
    })
    test("GET /:id success", async () => {
      mockStorage.get.mockResolvedValue({ id: "p1" })
      await getHandler(plansRouter, "get", "/:id")({ params: { id: "p1" } }, res)
      expect(res.json).toHaveBeenCalledWith({ id: "p1" })
    })
    test("POST /:id/execute success", async () => {
      mockStorage.get.mockImplementation((k) => {
        if (k === "plan:p1") return { status: "planned", command: "n.r.a", plan_id: "p1" }
        if (k === "command:n.r.a") return { adapter: "builtin" }
        return null
      })
      executor.execute.mockResolvedValue({ ok: true })
      await getHandler(plansRouter, "post", "/:id/execute")({ params: { id: "p1" } }, res)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ status: "success" }))
    })
    test("DELETE /:id success", async () => {
      await getHandler(plansRouter, "delete", "/:id")({ params: { id: "p1" } }, res)
      expect(res.json).toHaveBeenCalledWith({ ok: true })
    })
  })
})
