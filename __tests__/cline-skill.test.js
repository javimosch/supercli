const fs = require("fs")
const os = require("os")
const path = require("path")
const { execSync } = require("child_process")

const CLI = path.join(__dirname, "..", "cli", "supercli.js")

function runNoServer(args, options = {}) {
  try {
    const env = { ...process.env }
    delete env.SUPERCLI_SERVER
    const out = execSync(`node ${CLI} ${args}`, {
      encoding: "utf-8",
      timeout: 15000,
      env: { ...env, ...(options.env || {}) }
    })
    return { ok: true, output: out.trim(), code: 0 }
  } catch (err) {
    return {
      ok: false,
      output: (err.stdout || "").trim(),
      stderr: (err.stderr || "").trim(),
      code: err.status
    }
  }
}

describe("cline local skill", () => {
  const tempHome = fs.mkdtempSync(path.join(os.tmpdir(), "dcli-home-cline-skill-"))
  const env = { ...process.env, SUPERCLI_HOME: tempHome }

  afterAll(() => {
    fs.rmSync(tempHome, { recursive: true, force: true })
  })

  test("syncs and resolves repo skill", () => {
    const sync = runNoServer("skills sync --json", { env })
    expect(sync.ok).toBe(true)

    const list = runNoServer("skills list --catalog --provider repo --json", { env })
    expect(list.ok).toBe(true)
    const listData = JSON.parse(list.output)
    expect(listData.skills.some(skill => skill.id === "repo:cline-non-interactive")).toBe(true)

    const get = runNoServer("skills get repo:cline-non-interactive", { env })
    expect(get.ok).toBe(true)
    expect(get.output).toContain("supercli cline task run")
  })
})
