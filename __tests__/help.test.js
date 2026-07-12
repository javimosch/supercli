"use strict"

const {
  displayJsonHelp,
  renderTopLevelHelp,
} = require("../cli/help")

// ──────────────────────────────────────────────────────────────────────────────
// displayJsonHelp
// ──────────────────────────────────────────────────────────────────────────────

describe("displayJsonHelp", () => {
  const help = displayJsonHelp()

  test("returns core identity fields", () => {
    expect(help.name).toBe("SuperCLI")
    expect(help.repository).toBe("https://github.com/javimosch/supercli")
    expect(typeof help.description).toBe("string")
  })

  test("advertises the documented output modes", () => {
    const modes = help.output_modes.join(" ")
    expect(modes).toContain("--json")
    expect(modes).toContain("--human")
    expect(modes).toContain("--compact")
  })

  test("exposes exit codes as {code, description} pairs", () => {
    expect(Array.isArray(help.exit_codes)).toBe(true)
    for (const entry of help.exit_codes) {
      expect(typeof entry.code).toBe("number")
      expect(typeof entry.description).toBe("string")
    }
  })

  test("includes the success exit code (0)", () => {
    const success = help.exit_codes.find((e) => e.code === 0)
    expect(success).toBeDefined()
    expect(success.description).toBe("success")
  })
})

// ──────────────────────────────────────────────────────────────────────────────
// renderTopLevelHelp (JSON / non-human path)
// ──────────────────────────────────────────────────────────────────────────────

describe("renderTopLevelHelp", () => {
  const config = {
    commands: [
      { namespace: "aws", resource: "cfn", action: "deploy" },
      { namespace: "aws", resource: "cfn", action: "delete" },
      { namespace: "aws", resource: "s3", action: "sync" },
      { namespace: "git", resource: "repo", action: "clone" },
    ],
  }

  function render() {
    let captured
    renderTopLevelHelp(config, {
      humanMode: false,
      output: (payload) => {
        captured = payload
      },
      hasServer: false,
    })
    return captured
  }

  test("groups commands by namespace without duplicates", () => {
    const out = render()
    expect(out.namespaces.map((n) => n.name)).toEqual(["aws", "git"])
  })

  test("nests resources and their actions under each namespace", () => {
    const out = render()
    const aws = out.namespaces.find((n) => n.name === "aws")
    const cfn = aws.resources.find((r) => r.name === "cfn")
    expect(cfn.actions).toEqual(["deploy", "delete"])
    expect(aws.resources.map((r) => r.name)).toEqual(["cfn", "s3"])
  })

  test("does not throw and returns nothing in human mode", () => {
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {})
    try {
      const result = renderTopLevelHelp(config, {
        humanMode: true,
        output: () => {},
        hasServer: true,
      })
      expect(result).toBeUndefined()
      expect(logSpy).toHaveBeenCalled()
    } finally {
      logSpy.mockRestore()
    }
  })
})
