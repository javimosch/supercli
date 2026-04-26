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
        adapter: "shell",
        adapterConfig: { script: "cat install-guidance.json", unsafe: true },
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

const stripeExplore = runNoServer("plugins explore --name stripe --tags payments --json")
assert(stripeExplore.ok, "stripe explore should succeed")
const stripeExploreData = JSON.parse(stripeExplore.output)
assert(stripeExploreData.plugins.some(p => p.name === "stripe"), "explore filters should find stripe")

const vercelExplore = runNoServer("plugins explore --name vercel --tags hosting --json")
assert(vercelExplore.ok, "vercel explore should succeed")
const vercelExploreData = JSON.parse(vercelExplore.output)
assert(vercelExploreData.plugins.some(p => p.name === "vercel"), "explore filters should find vercel")

const linearExplore = runNoServer("plugins explore --name linear --tags issues --json")
assert(linearExplore.ok, "linear explore should succeed")
const linearExploreData = JSON.parse(linearExplore.output)
assert(linearExploreData.plugins.some(p => p.name === "linear"), "explore filters should find linear")

const railwayExplore = runNoServer("plugins explore --name railway --tags infrastructure --json")
assert(railwayExplore.ok, "railway explore should succeed")
const railwayExploreData = JSON.parse(railwayExplore.output)
assert(railwayExploreData.plugins.some(p => p.name === "railway"), "explore filters should find railway")

const supabaseExplore = runNoServer("plugins explore --name supabase --tags database --json")
assert(supabaseExplore.ok, "supabase explore should succeed")
const supabaseExploreData = JSON.parse(supabaseExplore.output)
assert(supabaseExploreData.plugins.some(p => p.name === "supabase"), "explore filters should find supabase")

const ghExplore = runNoServer("plugins explore --name gh --tags github --json")
assert(ghExplore.ok, "gh explore should succeed")
const ghExploreData = JSON.parse(ghExplore.output)
assert(ghExploreData.plugins.some(p => p.name === "gh"), "explore filters should find gh")

const kubectlExplore = runNoServer("plugins explore --name kubectl --tags kubernetes --json")
assert(kubectlExplore.ok, "kubectl explore should succeed")
const kubectlExploreData = JSON.parse(kubectlExplore.output)
assert(kubectlExploreData.plugins.some(p => p.name === "kubectl"), "explore filters should find kubectl")

const terraformExplore = runNoServer("plugins explore --name terraform --tags iac --json")
assert(terraformExplore.ok, "terraform explore should succeed")
const terraformExploreData = JSON.parse(terraformExplore.output)
assert(terraformExploreData.plugins.some(p => p.name === "terraform"), "explore filters should find terraform")

const awsExplore = runNoServer("plugins explore --name aws --tags cloud --json")
assert(awsExplore.ok, "aws explore should succeed")
const awsExploreData = JSON.parse(awsExplore.output)
assert(awsExploreData.plugins.some(p => p.name === "aws"), "explore filters should find aws")

const gcloudExplore = runNoServer("plugins explore --name gcloud --tags google-cloud --json")
assert(gcloudExplore.ok, "gcloud explore should succeed")
const gcloudExploreData = JSON.parse(gcloudExplore.output)
assert(gcloudExploreData.plugins.some(p => p.name === "gcloud"), "explore filters should find gcloud")

const azExplore = runNoServer("plugins explore --name az --tags azure --json")
assert(azExplore.ok, "az explore should succeed")
const azExploreData = JSON.parse(azExplore.output)
assert(azExploreData.plugins.some(p => p.name === "az"), "explore filters should find az")

const helmExplore = runNoServer("plugins explore --name helm --tags kubernetes --json")
assert(helmExplore.ok, "helm explore should succeed")
const helmExploreData = JSON.parse(helmExplore.output)
assert(helmExploreData.plugins.some(p => p.name === "helm"), "explore filters should find helm")

const npmExplore = runNoServer("plugins explore --name npm --tags javascript --json")
assert(npmExplore.ok, "npm explore should succeed")
const npmExploreData = JSON.parse(npmExplore.output)
assert(npmExploreData.plugins.some(p => p.name === "npm"), "explore filters should find npm")

const pulumiExplore = runNoServer("plugins explore --name pulumi --tags iac --json")
assert(pulumiExplore.ok, "pulumi explore should succeed")
const pulumiExploreData = JSON.parse(pulumiExplore.output)
assert(pulumiExploreData.plugins.some(p => p.name === "pulumi"), "explore filters should find pulumi")

const pnpmExplore = runNoServer("plugins explore --name pnpm --tags javascript --json")
assert(pnpmExplore.ok, "pnpm explore should succeed")
const pnpmExploreData = JSON.parse(pnpmExplore.output)
assert(pnpmExploreData.plugins.some(p => p.name === "pnpm"), "explore filters should find pnpm")

const uvExplore = runNoServer("plugins explore --name uv --tags python --json")
assert(uvExplore.ok, "uv explore should succeed")
const uvExploreData = JSON.parse(uvExplore.output)
assert(uvExploreData.plugins.some(p => p.name === "uv"), "explore filters should find uv")

const poetryExplore = runNoServer("plugins explore --name poetry --tags python --json")
assert(poetryExplore.ok, "poetry explore should succeed")
const poetryExploreData = JSON.parse(poetryExplore.output)
assert(poetryExploreData.plugins.some(p => p.name === "poetry"), "explore filters should find poetry")

const ezaExplore = runNoServer("plugins explore --name eza --tags rust --json")
assert(ezaExplore.ok, "eza explore should succeed")
const ezaExploreData = JSON.parse(ezaExplore.output)
assert(ezaExploreData.plugins.some(p => p.name === "eza"), "explore filters should find eza")

const justExplore = runNoServer("plugins explore --name just --tags task-runner --json")
assert(justExplore.ok, "just explore should succeed")
const justExploreData = JSON.parse(justExplore.output)
assert(justExploreData.plugins.some(p => p.name === "just"), "explore filters should find just")

const watchexecExplore = runNoServer("plugins explore --name watchexec --tags file-watchers --json")
assert(watchexecExplore.ok, "watchexec explore should succeed")
const watchexecExploreData = JSON.parse(watchexecExplore.output)
assert(watchexecExploreData.plugins.some(p => p.name === "watchexec"), "explore filters should find watchexec")

const nextestExplore = runNoServer("plugins explore --name nextest --tags testing --json")
assert(nextestExplore.ok, "nextest explore should succeed")
const nextestExploreData = JSON.parse(nextestExplore.output)
assert(nextestExploreData.plugins.some(p => p.name === "nextest"), "explore filters should find nextest")

const mysqlExplore = runNoServer("plugins explore --name mysql --tags sql --json")
assert(mysqlExplore.ok, "mysql explore should succeed")
const mysqlExploreData = JSON.parse(mysqlExplore.output)
assert(mysqlExploreData.plugins.some(p => p.name === "mysql"), "explore filters should find mysql")

const mongoshExplore = runNoServer("plugins explore --name mongosh --tags mongodb --json")
assert(mongoshExplore.ok, "mongosh explore should succeed")
const mongoshExploreData = JSON.parse(mongoshExplore.output)
assert(mongoshExploreData.plugins.some(p => p.name === "mongosh"), "explore filters should find mongosh")

const blogwatcherExplore = runNoServer("plugins explore --name blogwatcher --tags rss --json")
assert(blogwatcherExplore.ok, "blogwatcher explore should succeed")
const blogwatcherExploreData = JSON.parse(blogwatcherExplore.output)
assert(blogwatcherExploreData.plugins.some(p => p.name === "blogwatcher"), "explore filters should find blogwatcher")

const himalayaExplore = runNoServer("plugins explore --name himalaya --tags email --json")
assert(himalayaExplore.ok, "himalaya explore should succeed")
const himalayaExploreData = JSON.parse(himalayaExplore.output)
assert(himalayaExploreData.plugins.some(p => p.name === "himalaya"), "explore filters should find himalaya")

const wacliExplore = runNoServer("plugins explore --name wacli --tags whatsapp --json")
assert(wacliExplore.ok, "wacli explore should succeed")
const wacliExploreData = JSON.parse(wacliExplore.output)
assert(wacliExploreData.plugins.some(p => p.name === "wacli"), "explore filters should find wacli")

const xurlExplore = runNoServer("plugins explore --name xurl --tags twitter --json")
assert(xurlExplore.ok, "xurl explore should succeed")
const xurlExploreData = JSON.parse(xurlExplore.output)
assert(xurlExploreData.plugins.some(p => p.name === "xurl"), "explore filters should find xurl")

const clixExplore = runNoServer("plugins explore --name clix --tags agents --json")
assert(clixExplore.ok, "clix explore should succeed")
const clixExploreData = JSON.parse(clixExplore.output)
assert(clixExploreData.plugins.some(p => p.name === "clix"), "explore filters should find clix")

const clineExplore = runNoServer("plugins explore --name cline --tags streaming --json")
assert(clineExplore.ok, "cline explore should succeed")
const clineExploreData = JSON.parse(clineExplore.output)
assert(clineExploreData.plugins.some(p => p.name === "cline"), "explore filters should find cline")

const nullclawExplore = runNoServer("plugins explore --name nullclaw --tags skills --json")
assert(nullclawExplore.ok, "nullclaw explore should succeed")
const nullclawExploreData = JSON.parse(nullclawExplore.output)
assert(nullclawExploreData.plugins.some(p => p.name === "nullclaw"), "explore filters should find nullclaw")

const agentBrowserExplore = runNoServer("plugins explore --name agent-browser --tags browser,automation --has-learn true --json")
assert(agentBrowserExplore.ok, "agent-browser explore should succeed")
const agentBrowserExploreData = JSON.parse(agentBrowserExplore.output)
assert(agentBrowserExploreData.plugins.some(p => p.name === "agent-browser"), "explore filters should find agent-browser")

const jsonServerExplore = runNoServer("plugins explore --name json-server --tags mock-api,agent-friendly --has-learn true --json")
assert(jsonServerExplore.ok, "json-server explore should succeed")
const jsonServerExploreData = JSON.parse(jsonServerExplore.output)
assert(jsonServerExploreData.plugins.some(p => p.name === "json-server"), "explore filters should find json-server")

const geminiExplore = runNoServer("plugins explore --name gemini --tags ai,headless --has-learn true --json")
assert(geminiExplore.ok, "gemini explore should succeed")
const geminiExploreData = JSON.parse(geminiExplore.output)
assert(geminiExploreData.plugins.some(p => p.name === "gemini"), "explore filters should find gemini")

const copilotExplore = runNoServer("plugins explore --name copilot --tags github,headless --has-learn true --json")
assert(copilotExplore.ok, "copilot explore should succeed")
const copilotExploreData = JSON.parse(copilotExplore.output)
assert(copilotExploreData.plugins.some(p => p.name === "copilot"), "explore filters should find copilot")

const openhandsExplore = runNoServer("plugins explore --name openhands --tags agents,headless --has-learn true --json")
assert(openhandsExplore.ok, "openhands explore should succeed")
const openhandsExploreData = JSON.parse(openhandsExplore.output)
assert(openhandsExploreData.plugins.some(p => p.name === "openhands"), "explore filters should find openhands")

const uipathcliExplore = runNoServer("plugins explore --name uipathcli --tags rpa,cicd --has-learn true --json")
assert(uipathcliExplore.ok, "uipathcli explore should succeed")
const uipathcliExploreData = JSON.parse(uipathcliExplore.output)
assert(uipathcliExploreData.plugins.some(p => p.name === "uipathcli"), "explore filters should find uipathcli")

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
