const { removeProvider, syncCatalog } = require("../../../cli/skills-catalog")

function run() {
  const removed = removeProvider("superpowers")
  
  if (removed) {
    // Re-sync catalog to remove superpowers skills
    syncCatalog()
  }
  
  return {
    provider: "superpowers",
    removed: removed
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

