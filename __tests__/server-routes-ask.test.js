const askRouter = require("../server/routes/ask")
const configService = require("../server/services/configService")

jest.mock("../server/services/configService")

function getHandler(router, method, path) {
  const route = router.stack.find(s => s.route && s.route.path === path && s.route.methods[method])
  return route ? route.route.stack[0].handle : null
}

describe("server routes - ask", () => {
  let req, res

  beforeEach(() => {
    jest.clearAllMocks()
    res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis()
    }
    global.fetch = jest.fn()
    process.env.OPENAI_BASE_URL = "http://openai"
  })

  afterEach(() => {
    delete process.env.OPENAI_BASE_URL
  })

  test("POST / returns 400 if query missing", async () => {
    const handler = getHandler(askRouter, "post", "/")
    await handler({ body: {} }, res)
    expect(res.status).toHaveBeenCalledWith(400)
  })

  test("POST / returns 501 if OPENAI_BASE_URL missing", async () => {
    delete process.env.OPENAI_BASE_URL
    const handler = getHandler(askRouter, "post", "/")
    await handler({ body: { query: "hi" } }, res)
    expect(res.status).toHaveBeenCalledWith(501)
  })

  test("POST / successfully calls LLM and returns steps", async () => {
    const handler = getHandler(askRouter, "post", "/")
    configService.getNamespaces.mockResolvedValue(["n"])
    configService.getResources.mockResolvedValue(["r"])
    configService.getActions.mockResolvedValue(["a"])
    configService.getCommand.mockResolvedValue({ description: "desc", args: [{ name: "f", required: true }] })
    
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        choices: [{ message: { content: '[{"command": "n.r.a"}]' } }]
      })
    })

    await handler({ body: { query: "help" } }, res)
    
    expect(res.json).toHaveBeenCalledWith({ steps: [{ command: "n.r.a" }] })
  })

  test("POST / handles markdown-wrapped JSON from LLM", async () => {
    const handler = getHandler(askRouter, "post", "/")
    configService.getNamespaces.mockResolvedValue([])
    
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        choices: [{ message: { content: '```json\n[{"ok":true}]\n```' } }]
      })
    })

    await handler({ body: { query: "help" } }, res)
    expect(res.json).toHaveBeenCalledWith({ steps: [{ ok: true }] })
  })

  test("POST / handles LLM error", async () => {
    const handler = getHandler(askRouter, "post", "/")
    configService.getNamespaces.mockResolvedValue([])
    
    global.fetch.mockResolvedValue({
      ok: false,
      status: 401,
      text: () => Promise.resolve("unauthorized")
    })

    await handler({ body: { query: "help" } }, res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: expect.stringContaining("LLM Error 401") })
  })
})
