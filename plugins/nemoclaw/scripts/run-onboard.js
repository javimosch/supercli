const { spawnSync } = require("child_process")

function parseArgs(argv) {
  const out = {
    nonInteractive: false,
    provider: "",
    model: "",
    sandboxName: "",
    policyMode: "",
    policyPresets: "",
    recreate: false,
    apiKey: ""
  }

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i]
    if (token === "--non-interactive") out.nonInteractive = true
    else if (token === "--recreate") out.recreate = true
    else if (token === "--provider") out.provider = argv[i + 1] || ""
    else if (token === "--model") out.model = argv[i + 1] || ""
    else if (token === "--sandbox-name") out.sandboxName = argv[i + 1] || ""
    else if (token === "--policy-mode") out.policyMode = argv[i + 1] || ""
    else if (token === "--policy-presets") out.policyPresets = argv[i + 1] || ""
    else if (token === "--api-key") out.apiKey = argv[i + 1] || ""

    if (["--provider", "--model", "--sandbox-name", "--policy-mode", "--policy-presets", "--api-key"].includes(token)) {
      i += 1
    }
  }

  return out
}

function run() {
  const parsed = parseArgs(process.argv.slice(2))
  const env = { ...process.env }

  if (parsed.nonInteractive) env.NEMOCLAW_NON_INTERACTIVE = "1"
  if (parsed.provider) env.NEMOCLAW_PROVIDER = parsed.provider
  if (parsed.model) env.NEMOCLAW_MODEL = parsed.model
  if (parsed.sandboxName) env.NEMOCLAW_SANDBOX_NAME = parsed.sandboxName
  if (parsed.policyMode) env.NEMOCLAW_POLICY_MODE = parsed.policyMode
  if (parsed.policyPresets) env.NEMOCLAW_POLICY_PRESETS = parsed.policyPresets
  if (parsed.recreate) env.NEMOCLAW_RECREATE_SANDBOX = "1"
  if (parsed.apiKey) {
    if ((parsed.provider || "").toLowerCase() === "openrouter") {
      env.OPENROUTER_API_KEY = parsed.apiKey
      env.OPENAI_API_KEY = parsed.apiKey
    } else {
      env.NVIDIA_API_KEY = parsed.apiKey
    }
  }

  const result = spawnSync("nemoclaw", ["onboard"], {
    encoding: "utf-8",
    stdio: ["ignore", "pipe", "pipe"],
    env,
    timeout: 900000
  })

  if (result.error) {
    process.stderr.write(`${result.error.message}\n`)
    process.exit(1)
  }

  if (result.stdout) process.stdout.write(result.stdout)
  if (result.stderr) process.stderr.write(result.stderr)

  process.exit(typeof result.status === "number" ? result.status : 1)
}

if (require.main === module) {
  run()
}

module.exports = {
  run,
  parseArgs
}
