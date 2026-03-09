const { removeProvider, syncCatalog } = require("../../../cli/skills-catalog")

function run() {
  const removed = removeProvider("clickup")
  
  if (removed) {
    // Re-sync catalog to remove clickup skills
    syncCatalog()
  }
  
  return {
    provider: "clickup",
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

