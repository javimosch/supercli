const fs = require("fs")
const os = require("os")
const path = require("path")
const { execSync, spawnSync } = require("child_process")

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

function writeFakeDockerBinary(dir) {
  const bin = path.join(dir, "docker")
  fs.writeFileSync(bin, [
    "#!/usr/bin/env node",
    "const args = process.argv.slice(2);",
    "if (args.includes('--version')) { console.log('Docker version 26.1.0, build test'); process.exit(0); }",
    "console.log(JSON.stringify({ ok: true, args }));"
  ].join("\n"), "utf-8")
  fs.chmodSync(bin, 0o755)
  return bin
}

describe("docker plugin", () => {
  const fakeDir = fs.mkdtempSync(path.join(os.tmpdir(), "dcli-docker-"))
  const tempHome = fs.mkdtempSync(path.join(os.tmpdir(), "dcli-home-docker-"))
  writeFakeDockerBinary(fakeDir)
  const env = { ...process.env, PATH: `${fakeDir}:${process.env.PATH || ""}`, SUPERCLI_HOME: tempHome }

  beforeAll(() => {
    runNoServer("plugins install ./plugins/docker --on-conflict replace --json", { env })
  })

  afterAll(() => {
    runNoServer("plugins remove docker --json", { env })
    fs.rmSync(fakeDir, { recursive: true, force: true })
    fs.rmSync(tempHome, { recursive: true, force: true })
  })

  test("routes docker container ls to docker ps", () => {
    const r = runNoServer("docker container ls --json", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.command).toBe("docker.container.ls")
    expect(data.data.args[0]).toBe("ps")
  })

  test("maps docker run args and flags", () => {
    const r = runNoServer("docker container run --image nginx:latest --detach --publish 8080:80 --volume /tmp:/tmp --env A=B --name demo --json", { env })
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.command).toBe("docker.container.run")
    expect(data.data.args[0]).toBe("run")
    expect(data.data.args).toContain("nginx:latest")
    expect(data.data.args).toContain("--detach")
    expect(data.data.args).toContain("--publish")
    expect(data.data.args).toContain("8080:80")
    expect(data.data.args).toContain("--env")
    expect(data.data.args).toContain("A=B")
  })

  test("rejects interactive flags in non-tty mode", () => {
    const r = runNoServer("docker container run --image nginx:latest --interactive --json", { env })
    expect(r.ok).toBe(false)
    expect(r.code).toBe(91)
    const payload = JSON.parse(r.stderr)
    expect(payload.error.type).toBe("safety_violation")
  })

  test("can call real docker system version if installed", () => {
    const whichDocker = spawnSync("which", ["docker"], { encoding: "utf-8", timeout: 3000 })
    if (whichDocker.status !== 0) return

    const r = runNoServer("docker system version --json")
    expect(r.ok).toBe(true)
    const data = JSON.parse(r.output)
    expect(data.command).toBe("docker.system.version")
  })
})
