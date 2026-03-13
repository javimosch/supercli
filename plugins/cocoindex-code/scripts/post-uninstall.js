const { removeProvider, syncCatalog } = require("../../../cli/skills-catalog")

async function run() {
  const removedProvider = removeProvider("cocoindex-code")
  const index = syncCatalog()
  return {
    plugin: "cocoindex-code",
    removed_provider: removedProvider,
    synced_skills: Array.isArray(index.skills) ? index.skills.length : 0,
    note: "MCP server 'cocoindex-code' was not removed automatically. Run: supercli mcp remove cocoindex-code",
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
