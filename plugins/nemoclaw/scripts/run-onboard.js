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
    if (token === "--non-interactive") {
      out.nonInteractive = true
    } else if (token === "--recreate") {
      out.recreate = true
    } else if (token === "--provider" && i + 1 < argv.length) {
      out.provider = argv[i + 1]
      i += 1 // Skip the value
    } else if (token === "--model" && i + 1 < argv.length) {
      out.model = argv[i + 1]
      i += 1 // Skip the value
    } else if (token === "--sandbox-name" && i + 1 < argv.length) {
      out.sandboxName = argv[i + 1]
      i += 1 // Skip the value
    } else if (token === "--policy-mode" && i + 1 < argv.length) {
      out.policyMode = argv[i + 1]
      i += 1 // Skip the value
    } else if (token === "--policy-presets" && i + 1 < argv.length) {
      out.policyPresets = argv[i + 1]
      i += 1 // Skip the value
    } else if (token === "--api-key" && i + 1 < argv.length) {
      out.apiKey = argv[i + 1]
      i += 1 // Skip the value
    }
  }

  return out
}

function run() {
  // Debug: log the arguments we received
  console.error("DEBUG: run-onboard.js received args:", process.argv.slice(2))
  const parsed = parseArgs(process.argv.slice(2))
  console.error("DEBUG: parsed args:", parsed)
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
