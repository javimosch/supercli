"use strict"

const os = require("os")
const path = require("path")

// Require the module fresh inside each test so that module-level constants
// (if any) do not cache a stale env. Jest caches require() across tests in the
// same file, which is fine here because every getter reads process.env at
// call-time rather than at require-time.
const {
  getSupercliHome,
  getServer,
  getApiKey,
  getClientId,
  getOpenAiBaseUrl,
  getOpenAiModel,
  getOpenAiApiKey,
  interpolateEnvPlaceholders,
} = require("../cli/env")

// Snapshot of the original env vars we touch so we can restore them after each test.
const ENV_KEYS = [
  "SUPERCLI_HOME",
  "SUPERCLI_SERVER",
  "SUPERCLI_API_KEY",
  "SUPERCLI_CLIENT_ID",
  "OPENAI_BASE_URL",
  "OPENAI_MODEL",
  "OPENAI_API_KEY",
]

let savedEnv = {}

beforeEach(() => {
  savedEnv = {}
  for (const key of ENV_KEYS) {
    savedEnv[key] = process.env[key]
    delete process.env[key]
  }
})

afterEach(() => {
  for (const key of ENV_KEYS) {
    if (savedEnv[key] === undefined) {
      delete process.env[key]
    } else {
      process.env[key] = savedEnv[key]
    }
  }
})

// ──────────────────────────────────────────────────────────────────────────────
// getSupercliHome
// ──────────────────────────────────────────────────────────────────────────────

describe("getSupercliHome", () => {
  test("returns SUPERCLI_HOME when set", () => {
    process.env.SUPERCLI_HOME = "/custom/supercli"
    expect(getSupercliHome()).toBe("/custom/supercli")
  })

  test("falls back to ~/.supercli when env var is unset", () => {
    const expected = path.join(os.homedir(), ".supercli")
    expect(getSupercliHome()).toBe(expected)
  })

  test("falls back to default when SUPERCLI_HOME is empty string", () => {
    process.env.SUPERCLI_HOME = ""
    const expected = path.join(os.homedir(), ".supercli")
    expect(getSupercliHome()).toBe(expected)
  })

  test("preserves trailing slash if caller set one", () => {
    process.env.SUPERCLI_HOME = "/data/scli/"
    expect(getSupercliHome()).toBe("/data/scli/")
  })
})

// ──────────────────────────────────────────────────────────────────────────────
// getServer
// ──────────────────────────────────────────────────────────────────────────────

describe("getServer", () => {
  test("returns SUPERCLI_SERVER when set", () => {
    process.env.SUPERCLI_SERVER = "https://panel.example.com"
    expect(getServer()).toBe("https://panel.example.com")
  })

  test("returns null when SUPERCLI_SERVER is unset", () => {
    expect(getServer()).toBeNull()
  })

  test("returns null when SUPERCLI_SERVER is empty string", () => {
    process.env.SUPERCLI_SERVER = ""
    expect(getServer()).toBeNull()
  })
})

// ──────────────────────────────────────────────────────────────────────────────
// getApiKey
// ──────────────────────────────────────────────────────────────────────────────

describe("getApiKey", () => {
  test("returns SUPERCLI_API_KEY when set", () => {
    process.env.SUPERCLI_API_KEY = "sk-secret-token"
    expect(getApiKey()).toBe("sk-secret-token")
  })

  test("returns null when SUPERCLI_API_KEY is unset", () => {
    expect(getApiKey()).toBeNull()
  })

  test("returns null when SUPERCLI_API_KEY is empty string", () => {
    process.env.SUPERCLI_API_KEY = ""
    expect(getApiKey()).toBeNull()
  })
})

// ──────────────────────────────────────────────────────────────────────────────
// getClientId
// ──────────────────────────────────────────────────────────────────────────────

describe("getClientId", () => {
  test("returns trimmed SUPERCLI_CLIENT_ID when set", () => {
    process.env.SUPERCLI_CLIENT_ID = "  my-client-id  "
    expect(getClientId()).toBe("my-client-id")
  })

  test("returns the value without leading whitespace", () => {
    process.env.SUPERCLI_CLIENT_ID = "\tabc123"
    expect(getClientId()).toBe("abc123")
  })

  test("returns null when SUPERCLI_CLIENT_ID is unset", () => {
    expect(getClientId()).toBeNull()
  })

  test("returns null when SUPERCLI_CLIENT_ID is empty string", () => {
    process.env.SUPERCLI_CLIENT_ID = ""
    expect(getClientId()).toBeNull()
  })

  test("returns null when SUPERCLI_CLIENT_ID is all whitespace", () => {
    process.env.SUPERCLI_CLIENT_ID = "   "
    expect(getClientId()).toBeNull()
  })

  test("preserves internal whitespace in multi-word IDs", () => {
    process.env.SUPERCLI_CLIENT_ID = "  foo bar  "
    expect(getClientId()).toBe("foo bar")
  })
})

// ──────────────────────────────────────────────────────────────────────────────
// getOpenAiBaseUrl
// ──────────────────────────────────────────────────────────────────────────────

describe("getOpenAiBaseUrl", () => {
  test("returns OPENAI_BASE_URL when set", () => {
    process.env.OPENAI_BASE_URL = "http://localhost:11434/v1"
    expect(getOpenAiBaseUrl()).toBe("http://localhost:11434/v1")
  })

  test("returns null when OPENAI_BASE_URL is unset (no local LLM)", () => {
    expect(getOpenAiBaseUrl()).toBeNull()
  })

  test("returns null when OPENAI_BASE_URL is empty string", () => {
    process.env.OPENAI_BASE_URL = ""
    expect(getOpenAiBaseUrl()).toBeNull()
  })

  test("can serve as hasLocalLLM gate via truthy check", () => {
    process.env.OPENAI_BASE_URL = "http://localhost:1234"
    expect(!!getOpenAiBaseUrl()).toBe(true)
  })

  test("gate returns false when env var is missing", () => {
    expect(!!getOpenAiBaseUrl()).toBe(false)
  })
})

// ──────────────────────────────────────────────────────────────────────────────
// getOpenAiModel
// ──────────────────────────────────────────────────────────────────────────────

describe("getOpenAiModel", () => {
  test("returns OPENAI_MODEL when set", () => {
    process.env.OPENAI_MODEL = "llama3.2"
    expect(getOpenAiModel()).toBe("llama3.2")
  })

  test("falls back to gpt-3.5-turbo when OPENAI_MODEL is unset", () => {
    expect(getOpenAiModel()).toBe("gpt-3.5-turbo")
  })

  test("falls back to default when OPENAI_MODEL is empty string", () => {
    process.env.OPENAI_MODEL = ""
    expect(getOpenAiModel()).toBe("gpt-3.5-turbo")
  })
})

// ──────────────────────────────────────────────────────────────────────────────
// getOpenAiApiKey
// ──────────────────────────────────────────────────────────────────────────────

describe("getOpenAiApiKey", () => {
  test("returns OPENAI_API_KEY when set", () => {
    process.env.OPENAI_API_KEY = "sk-real-key"
    expect(getOpenAiApiKey()).toBe("sk-real-key")
  })

  test("falls back to 'dummy' when OPENAI_API_KEY is unset", () => {
    expect(getOpenAiApiKey()).toBe("dummy")
  })

  test("falls back to 'dummy' when OPENAI_API_KEY is empty string", () => {
    process.env.OPENAI_API_KEY = ""
    expect(getOpenAiApiKey()).toBe("dummy")
  })
})

// ──────────────────────────────────────────────────────────────────────────────
// interpolateEnvPlaceholders
// ──────────────────────────────────────────────────────────────────────────────

describe("interpolateEnvPlaceholders", () => {
  test("replaces ${VARNAME} with env var value", () => {
    process.env.SUPERCLI_SERVER = "https://panel.example.com"
    expect(interpolateEnvPlaceholders("url: ${SUPERCLI_SERVER}")).toBe(
      "url: https://panel.example.com"
    )
  })

  test("replaces multiple placeholders in one string", () => {
    process.env.SUPERCLI_SERVER = "https://example.com"
    process.env.SUPERCLI_API_KEY = "tok"
    expect(
      interpolateEnvPlaceholders("${SUPERCLI_SERVER}/path?key=${SUPERCLI_API_KEY}")
    ).toBe("https://example.com/path?key=tok")
  })

  test("replaces unknown placeholder with empty string", () => {
    expect(interpolateEnvPlaceholders("hello ${DOES_NOT_EXIST_XYZ123}")).toBe("hello ")
  })

  test("leaves string unchanged when there are no placeholders", () => {
    expect(interpolateEnvPlaceholders("no placeholders here")).toBe("no placeholders here")
  })

  test("returns empty string unchanged", () => {
    expect(interpolateEnvPlaceholders("")).toBe("")
  })

  test("returns non-string values unchanged (number)", () => {
    expect(interpolateEnvPlaceholders(42)).toBe(42)
  })

  test("returns non-string values unchanged (null)", () => {
    expect(interpolateEnvPlaceholders(null)).toBeNull()
  })

  test("returns non-string values unchanged (undefined)", () => {
    expect(interpolateEnvPlaceholders(undefined)).toBeUndefined()
  })

  test("returns non-string values unchanged (array)", () => {
    const arr = ["a", "b"]
    expect(interpolateEnvPlaceholders(arr)).toBe(arr)
  })

  test("only matches uppercase A-Z, 0-9, underscore patterns", () => {
    // lowercase variable names must NOT be replaced
    process.env.lowercase = "should-not-appear"
    expect(interpolateEnvPlaceholders("${lowercase}")).toBe("${lowercase}")
    delete process.env.lowercase
  })

  test("handles adjacent placeholders", () => {
    process.env.SUPERCLI_HOME = "/home"
    process.env.SUPERCLI_SERVER = "/srv"
    expect(interpolateEnvPlaceholders("${SUPERCLI_HOME}${SUPERCLI_SERVER}")).toBe("/home/srv")
  })

  test("does not replace $VAR (without braces)", () => {
    process.env.SUPERCLI_HOME = "should-not-appear"
    expect(interpolateEnvPlaceholders("$SUPERCLI_HOME")).toBe("$SUPERCLI_HOME")
  })

  test("handles mixed set and unset placeholders", () => {
    process.env.SUPERCLI_API_KEY = "key123"
    expect(
      interpolateEnvPlaceholders("${SUPERCLI_API_KEY}:${MISSING_VAR_ABC}")
    ).toBe("key123:")
    delete process.env.MISSING_VAR_ABC
  })

  test("same placeholder repeated twice gets same substitution", () => {
    process.env.SUPERCLI_HOME = "/data"
    expect(
      interpolateEnvPlaceholders("${SUPERCLI_HOME} and ${SUPERCLI_HOME}")
    ).toBe("/data and /data")
  })
})
