const { removeProvider, syncCatalog } = require("../../../cli/skills-catalog")
const { removeCommandsByNamespace } = require("../../../cli/config")

async function run() {
  const removedCommands = await removeCommandsByNamespace("browseruse")
  const removedProvider = removeProvider("browser-use")
  const index = syncCatalog()
  return {
    plugin: "browser-use",
    removed_provider: removedProvider,
    removed_commands: removedCommands,
    synced_skills: Array.isArray(index.skills) ? index.skills.length : 0,
    note: "MCP server 'browser-use' was not removed automatically. Run: supercli mcp remove browser-use"
  }
}

if (require.main === module) {
  run()
    .then((result) => {
      process.stdout.write(JSON.stringify(result))
    })
    .catch((err) => {
      process.stderr.write(err.message)
      process.exit(1)
    })
}

module.exports = { run }
