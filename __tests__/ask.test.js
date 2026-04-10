const { handleAskCommand } = require("../cli/ask")

describe("ask", () => {
  let mockOutput
  let mockOutputError
  let consoleSpy

  const mockConfig = {
    commands: [
      {
        namespace: "resend",
        resource: "emails",
        action: "send",
        description: "Send an email via the Resend API",
        args: [
          { name: "from", required: true },
          { name: "to", required: true },
          { name: "subject", required: true },
          { name: "text", required: false }
        ]
      },
      {
        namespace: "test",
        resource: "res",
        action: "act",
        description: "Test action",
        args: [{ name: "foo", required: true }, { name: "bar", required: false }]
      }
    ],
    features: { ask: true }
  }

  const mockContext = {
    server: "http://api.test"
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockOutput = jest.fn()
    mockOutputError = jest.fn()
    consoleSpy = jest.spyOn(console, "log").mockImplementation()
    global.fetch = jest.fn()

    delete process.env.OPENAI_BASE_URL
    delete process.env.OPENAI_MODEL
    delete process.env.OPENAI_API_KEY
  })

  afterEach(() => {
    consoleSpy.mockRestore()
  })

  test("returns error if query is missing", async () => {
    await handleAskCommand({
      positional: ["ask"],
      outputError: mockOutputError
    })
    expect(mockOutputError).toHaveBeenCalledWith(expect.objectContaining({
      code: 85,
      type: "invalid_argument",
      message: expect.stringContaining("Usage:")
    }))
  })

  test("returns error if 'ask' is not configured", async () => {
    await handleAskCommand({
      positional: ["ask", "help me"],
      config: { features: {} },
      context: {},
      outputError: mockOutputError
    })
    expect(mockOutputError).toHaveBeenCalledWith(expect.objectContaining({
      code: 105,
      type: "integration_error",
      message: expect.stringContaining("requires LLM configuration")
    }))
  })

  describe("local LLM resolution", () => {
    beforeEach(() => {
      process.env.OPENAI_BASE_URL = "http://localhost:1234/v1"
    })

    test("successfully returns suggested steps without executing", async () => {
      const mockConfigMulti = {
        commands: [
          { namespace: "resend", resource: "emails", action: "send", description: "Send email", args: [] },
          { namespace: "test", resource: "res", action: "act2" }
        ],
        features: { ask: true }
      }
      const mockSteps = [{ command: "resend.emails.send", args: { from: "a@b.com", to: "c@d.com" } }]

      global.fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          choices: [{ message: { content: JSON.stringify(mockSteps) } }]
        })
      })

      await handleAskCommand({
        positional: ["ask", "send an email"],
        config: mockConfigMulti,
        context: {},
        output: mockOutput,
        humanMode: false
      })

      expect(mockOutput).toHaveBeenCalledWith(expect.objectContaining({
        mode: "ask_suggest",
        llm_powered: true,
        query: "send an email",
        suggested_steps: expect.arrayContaining([
          expect.objectContaining({
            step: 1,
            command: "resend.emails.send",
            args: { from: "a@b.com", to: "c@d.com" }
          })
        ])
      }))
    })

    test("strips markdown formatting from LLM response", async () => {
      const mockSteps = [{ command: "resend.emails.send", args: { from: "a@b.com" } }]
      global.fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          choices: [{ message: { content: "```json\n" + JSON.stringify(mockSteps) + "\n```" } }]
        })
      })

      await handleAskCommand({
        positional: ["ask", "test"],
        config: mockConfig,
        context: {},
        output: mockOutput,
        humanMode: false
      })

      expect(mockOutput).toHaveBeenCalledWith(expect.objectContaining({
        suggested_steps: expect.arrayContaining([
          expect.objectContaining({ command: "resend.emails.send" })
        ])
      }))
    })

    test("strips generic code blocks from LLM response", async () => {
      const mockSteps = [{ command: "resend.emails.send", args: {} }]
      global.fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          choices: [{ message: { content: "```\n" + JSON.stringify(mockSteps) + "\n```" } }]
        })
      })

      await handleAskCommand({
        positional: ["ask", "test"],
        config: mockConfig,
        context: {},
        output: mockOutput,
        humanMode: false
      })

      expect(mockOutput).toHaveBeenCalledWith(expect.objectContaining({
        suggested_steps: expect.arrayContaining([
          expect.objectContaining({ command: "resend.emails.send" })
        ])
      }))
    })

    test("handles auth error (401) from local LLM", async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        status: 401,
        text: () => Promise.resolve(JSON.stringify({ error: { message: "Unauthorized" } }))
      })

      await handleAskCommand({
        positional: ["ask", "test"],
        config: mockConfig,
        context: {},
        outputError: mockOutputError
      })

      expect(mockOutputError).toHaveBeenCalledWith(expect.objectContaining({
        message: expect.stringContaining("authentication failed"),
        recoverable: false
      }))
    })

    test("handles invalid response format from local LLM", async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ choices: [] })
      })

      await handleAskCommand({
        positional: ["ask", "test"],
        config: mockConfig,
        context: {},
        outputError: mockOutputError
      })

      expect(mockOutputError).toHaveBeenCalledWith(expect.objectContaining({
        details: expect.objectContaining({
          api_message: expect.stringContaining("Invalid response format")
        })
      }))
    })

    test("handles LLM response that is not a JSON array", async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          choices: [{ message: { content: '{"not": "an array"}' } }]
        })
      })

      await handleAskCommand({
        positional: ["ask", "test"],
        config: mockConfig,
        context: {},
        outputError: mockOutputError
      })

      expect(mockOutputError).toHaveBeenCalledWith(expect.objectContaining({
        details: expect.objectContaining({
          api_message: expect.stringContaining("JSON array")
        })
      }))
    })

    test("includes dry_run command in suggestions", async () => {
      const mockSteps = [{ command: "resend.emails.send", args: { from: "a@b.com", to: "c@d.com" } }]
      global.fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          choices: [{ message: { content: JSON.stringify(mockSteps) } }]
        })
      })

      await handleAskCommand({
        positional: ["ask", "send email"],
        config: mockConfig,
        context: {},
        output: mockOutput,
        humanMode: false
      })

      expect(mockOutput).toHaveBeenCalledWith(expect.objectContaining({
        suggested_steps: expect.arrayContaining([
          expect.objectContaining({
            dry_run: expect.stringContaining("supercli resend emails send")
          })
        ])
      }))
    })

    test("includes next_steps with discover fallback", async () => {
      const mockSteps = [{ command: "resend.emails.send", args: {} }]
      global.fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          choices: [{ message: { content: JSON.stringify(mockSteps) } }]
        })
      })

      await handleAskCommand({
        positional: ["ask", "send email"],
        config: mockConfig,
        context: {},
        output: mockOutput,
        humanMode: false
      })

      expect(mockOutput).toHaveBeenCalledWith(expect.objectContaining({
        next_steps: expect.arrayContaining([
          expect.stringContaining("supercli discover --intent")
        ])
      }))
    })
  })

  describe("remote LLM resolution", () => {
    beforeEach(() => {
      delete process.env.OPENAI_BASE_URL
    })

    test("successfully returns suggested steps via server", async () => {
      const mockSteps = [{ command: "resend.emails.send", args: {} }]
      global.fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ steps: mockSteps })
      })

      await handleAskCommand({
        positional: ["ask", "remote", "query"],
        config: { features: { ask: true }, commands: mockConfig.commands },
        context: { server: "http://api.test" },
        output: mockOutput,
        outputError: mockOutputError,
        humanMode: false
      })

      expect(global.fetch).toHaveBeenCalledWith(
        "http://api.test/api/ask",
        expect.objectContaining({ method: "POST" })
      )
      expect(mockOutput).toHaveBeenCalledWith(expect.objectContaining({
        mode: "ask_suggest",
        llm_powered: true,
        suggested_steps: expect.arrayContaining([
          expect.objectContaining({ command: "resend.emails.send" })
        ])
      }))
    })

    test("handles server error with suggestions", async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        status: 500,
        text: () => Promise.resolve("Internal Server Error")
      })

      await handleAskCommand({
        positional: ["ask", "test"],
        config: { features: { ask: true } },
        context: { server: "http://api.test" },
        outputError: mockOutputError
      })

      expect(mockOutputError).toHaveBeenCalledWith(expect.objectContaining({
        code: 105,
        recoverable: true,
        suggestions: expect.arrayContaining([
          expect.stringContaining("supercli discover")
        ])
      }))
    })
  })

  describe("human mode", () => {
    test("outputs formatted suggestions to console", async () => {
      process.env.OPENAI_BASE_URL = "http://localhost"
      const mockSteps = [{ command: "resend.emails.send", args: { from: "a@b.com", to: "c@d.com" } }]

      global.fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          choices: [{ message: { content: JSON.stringify(mockSteps) } }]
        })
      })

      await handleAskCommand({
        positional: ["ask", "send an email"],
        config: mockConfig,
        context: mockContext,
        humanMode: true,
        output: mockOutput
      })

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Query:"))
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Suggested Steps:"))
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("resend.emails.send"))
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Next Steps:"))
    })

    test("outputs discover fallback in next steps", async () => {
      process.env.OPENAI_BASE_URL = "http://localhost"
      const mockSteps = [{ command: "resend.emails.send", args: {} }]

      global.fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          choices: [{ message: { content: JSON.stringify(mockSteps) } }]
        })
      })

      await handleAskCommand({
        positional: ["ask", "send email"],
        config: mockConfig,
        context: mockContext,
        humanMode: true,
        output: mockOutput
      })

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("discover --intent"))
    })
  })

  describe("error types", () => {
    beforeEach(() => {
      process.env.OPENAI_BASE_URL = "http://localhost:1234/v1"
    })

    test("network error suggests connectivity troubleshooting", async () => {
      global.fetch.mockRejectedValue(new Error("Connection refused"))

      await handleAskCommand({
        positional: ["ask", "test"],
        config: mockConfig,
        context: {},
        outputError: mockOutputError
      })

      expect(mockOutputError).toHaveBeenCalledWith(expect.objectContaining({
        message: expect.stringContaining("Cannot reach"),
        recoverable: true,
        suggestions: expect.arrayContaining([
          expect.stringContaining("OPENAI_BASE_URL"),
          expect.stringContaining("curl")
        ])
      }))
    })

    test("rate limit error suggests waiting", async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        status: 429,
        text: () => Promise.resolve(JSON.stringify({ error: { message: "Rate limit" } }))
      })

      await handleAskCommand({
        positional: ["ask", "test"],
        config: mockConfig,
        context: {},
        outputError: mockOutputError
      })

      expect(mockOutputError).toHaveBeenCalledWith(expect.objectContaining({
        message: expect.stringContaining("rate limit"),
        recoverable: true
      }))
    })

    test("server error (5xx) suggests retry", async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        status: 502,
        text: () => Promise.resolve("Bad Gateway")
      })

      await handleAskCommand({
        positional: ["ask", "test"],
        config: mockConfig,
        context: {},
        outputError: mockOutputError
      })

      expect(mockOutputError).toHaveBeenCalledWith(expect.objectContaining({
        message: expect.stringContaining("server error"),
        recoverable: true
      }))
    })
  })
})
