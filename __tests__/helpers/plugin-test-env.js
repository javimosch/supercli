const fs = require("fs")
const os = require("os")
const path = require("path")
const { execSync } = require("child_process")

const CLI = path.join(__dirname, "..", "..", "cli", "supercli.js")

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

function makePluginEnv(name) {
  const fakeDir = fs.mkdtempSync(path.join(os.tmpdir(), `dcli-${name}-`))
  const tempHome = fs.mkdtempSync(path.join(os.tmpdir(), `dcli-home-${name}-`))
  const env = {
    ...process.env,
    PATH: `${fakeDir}:${process.env.PATH || ""}`,
    SUPERCLI_HOME: tempHome
  }
  return { name, fakeDir, tempHome, env }
}

function withInstalledPlugin(ctx) {
  beforeAll(() => {
    const install = runNoServer(
      `plugins install ./plugins/${ctx.name} --on-conflict replace --json`,
      { env: ctx.env }
    )
    expect(install.ok).toBe(true)
  })

  afterAll(() => {
    runNoServer(`plugins remove ${ctx.name} --json`, { env: ctx.env })
    fs.rmSync(ctx.fakeDir, { recursive: true, force: true })
    fs.rmSync(ctx.tempHome, { recursive: true, force: true })
  })
}

module.exports = { runNoServer, makePluginEnv, withInstalledPlugin }
