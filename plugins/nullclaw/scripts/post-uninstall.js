const { removeProvider, syncCatalog } = require("../../../cli/skills-catalog")

function run() {
  const removed = removeProvider("nullclaw")
  const index = syncCatalog()
  return {
    provider: "nullclaw",
    removed,
    synced_skills: Array.isArray(index.skills) ? index.skills.length : 0
  }
}

if (require.main === module) {
  try {
    const result = run()
    process.stdout.write(JSON.stringify(result))
  } catch (err) {
    process.stderr.write(err.message)
    process.exit(1)
  }
}

module.exports = {
  run
}
