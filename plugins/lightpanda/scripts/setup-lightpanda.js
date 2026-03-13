const { spawnSync } = require("child_process")
const fs = require("fs")
const path = require("path")

const pluginRoot = path.resolve(__dirname, "..")
const packageJsonPath = path.join(pluginRoot, "package.json")

function fail(message, code) {
  console.error(message)
  process.exit(code)
}

function run() {
  if (!fs.existsSync(packageJsonPath)) {
    fail(`Missing package.json at ${packageJsonPath}`, 1)
  }

  console.log("Installing Lightpanda plugin dependencies...")
  const result = spawnSync("npm", ["install", "--no-fund", "--no-audit"], {
    cwd: pluginRoot,
    encoding: "utf-8",
    stdio: "inherit"
  })

  if (result.error) {
    fail(`Failed to start npm: ${result.error.message}`, 1)
  }

  if (result.status !== 0) {
    fail(`npm install failed with exit code ${result.status}`, result.status || 1)
  }

  console.log("Lightpanda runtime dependencies are installed.")
  console.log("Next step: dcli lightpanda script run --url https://example.com --code \"return await page.title()\"")
}

if (require.main === module) {
  run()
}
