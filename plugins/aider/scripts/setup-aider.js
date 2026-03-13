const { spawnSync } = require("child_process")

function run(command, args) {
  return spawnSync(command, args, { stdio: "inherit", encoding: "utf-8" })
}

function fail(message, code = 1) {
  console.error(message)
  process.exit(code)
}

function main() {
  console.log("Installing aider-chat...")

  let result = run("python3", ["-m", "pip", "install", "--user", "aider-chat"])
  if (result.error) {
    fail(`Failed to start python3: ${result.error.message}`)
  }

  if (result.status !== 0) {
    console.log("pip install failed, trying pipx...")
    result = run("pipx", ["install", "aider-chat"])
    if (result.error) {
      fail(`Failed to install aider-chat via pip or pipx: ${result.error.message}`)
    }
    if (result.status !== 0) {
      fail(`Failed to install aider-chat. Exit code: ${result.status}`, result.status || 1)
    }
  }

  console.log("aider-chat installed.")
  console.log("Next step: ensure your provider API key is configured before using the plugin.")
}

if (require.main === module) {
  main()
}
