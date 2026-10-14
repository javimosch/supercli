const { spawnSync } = require("child_process")

const VALID_ACTIONS = new Set(["status", "logs", "connect"])

function fail(message) {
  process.stderr.write(`${message}\n`)
  process.exit(82)
}

function run() {
  const action = process.argv[2]
  const sandboxName = process.argv[3]
  const rest = process.argv.slice(4)

  if (!VALID_ACTIONS.has(action)) {
    fail(`Unsupported sandbox action '${action}'. Expected one of: status, logs, connect`)
  }
  if (!sandboxName) {
    fail(`Missing sandbox name. Usage: run-sandbox-action.js ${action} <sandbox-name> [args...]`)
  }

  const args = [sandboxName, action, ...rest]
  const interactive = action === "connect"
  const res = spawnSync("nemoclaw", args, {
    encoding: "utf-8",
    timeout: 180000,
    stdio: interactive ? "inherit" : "pipe"
  })

  if (res.error) {
    process.stderr.write(res.error.message)
    process.exit(1)
  }
  if (!interactive) {
    if (res.stdout) process.stdout.write(res.stdout)
    if (res.stderr) process.stderr.write(res.stderr)
  }
  process.exit(typeof res.status === "number" ? res.status : 1)
}

if (require.main === module) {
  run()
}

module.exports = {
  run,
  VALID_ACTIONS
}
