#!/usr/bin/env node

const { execSync } = require("child_process")
const fs = require("fs")
const os = require("os")
const path = require("path")

const CLI = path.join(__dirname, "..", "cli", "supercli.js")

function runNoServer(args, opts = {}) {
  try {
    const env = { ...process.env }
    delete env.SUPERCLI_SERVER
    const output = execSync(`node ${CLI} ${args}`, {
      encoding: "utf-8",
      timeout: 15000,
      env,
      ...opts
    })
    return { ok: true, output: output.trim() }
  } catch (err) {
    return {
      ok: false,
      output: (err.stdout || "").trim(),
      stderr: (err.stderr || "").trim(),
      code: err.status
    }
  }
}

function assert(cond, message) {
  if (!cond) throw new Error(message || "Assertion failed")
}

function makeRemotePluginRepo() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dcli-remote-plugin-"))
  const manifestDir = path.join(root, "plugins", "supercli")
  fs.mkdirSync(manifestDir, { recursive: true })
  fs.writeFileSync(path.join(manifestDir, "plugin.json"), JSON.stringify({
    name: "remote-demo",
    version: "0.0.1",
    description: "Remote fixture plugin",
    source: "https://example.local/remote-demo",
    checks: [{ type: "binary", name: "node" }],
    commands: [
      {
        namespace: "remote",
        resource: "install",
        action: "steps",
        description: "Returns install guidance",
        adapter: "builtin",
        adapterConfig: { builtin: "beads_install_steps" },
        args: []
      }
    ]
  }, null, 2))

  execSync("git init -b main", { cwd: root, stdio: "ignore" })
  execSync("git add .", { cwd: root, stdio: "ignore" })
  execSync("git -c user.name='dcli-test' -c user.email='test@example.com' commit -m 'add plugin'", {
    cwd: root,
    stdio: "ignore"
  })

  return root
}

console.log("\n⚡ Plugin Registry Tests\n")

const explore = runNoServer("plugins explore --name COMMI --tags ai,missing --json")
assert(explore.ok, "plugins explore should succeed")
const exploreData = JSON.parse(explore.output)
assert(Array.isArray(exploreData.plugins), "plugins explore should return plugins")
assert(exploreData.plugins.some(p => p.name === "commiat"), "explore filters should find commiat")

const repoPath = makeRemotePluginRepo()
const install = runNoServer(`plugins install --git ${repoPath} --manifest-path plugins/supercli/plugin.json --ref main --json`)
assert(install.ok, "remote git install should succeed")
const installData = JSON.parse(install.output)
assert(installData.plugin === "remote-demo", "installed plugin should match remote manifest")

const show = runNoServer("plugins show remote-demo --json")
assert(show.ok, "plugins show for remote plugin should succeed")
const showData = JSON.parse(show.output)
assert(showData.plugin.resolved_from && showData.plugin.resolved_from.type === "git", "remote plugin should track git source")

const doctor = runNoServer("plugins doctor remote-demo --json")
assert(doctor.ok, "doctor remote plugin should succeed")
const doctorData = JSON.parse(doctor.output)
assert(doctorData.ok === true, "remote plugin doctor should pass")

const remove = runNoServer("plugins remove remote-demo --json")
assert(remove.ok, "remote plugin remove should succeed")

fs.rmSync(repoPath, { recursive: true, force: true })

console.log("✅ Plugin registry tests passed\n")
