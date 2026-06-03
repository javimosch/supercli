const { execSync } = require("child_process")
const path = require("path")

const CLI = path.join(__dirname, "..", "cli", "supercli.js")

describe("supercli --version", () => {
  test("--version --human returns version text", () => {
    const out = execSync(`node ${CLI} --version --human`, {
      encoding: "utf-8"
    })
    expect(out).toContain("SuperCLI v")
    expect(out).toContain("JavaScript")
  })

  test("--version --json returns version envelope", () => {
    const out = execSync(`node ${CLI} --version --json`, {
      encoding: "utf-8"
    })
    const data = JSON.parse(out)
    expect(data.name).toBe("SuperCLI")
    expect(data.implementation).toBe("JavaScript")
    expect(data.version).toBeDefined()
    expect(data.node_version).toBeDefined()
  })

  test("--version alone produces exit code 0 with JSON (non-TTY)", () => {
    const out = execSync(`node ${CLI} --version`, {
      encoding: "utf-8"
    })
    const data = JSON.parse(out)
    expect(data.name).toBe("SuperCLI")
    expect(data.version).toBe("1.31.4")
  })

  test("--version --compact returns compact version envelope", () => {
    const out = execSync(`node ${CLI} --version --compact`, {
      encoding: "utf-8"
    })
    const data = JSON.parse(out)
    expect(data.n).toBe("SuperCLI")
    expect(data.v).toBe("1.31.4")
  })
})
