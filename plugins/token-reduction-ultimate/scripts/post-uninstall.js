const path = require("path")

function run() {
  const supercliRoot = path.resolve(__dirname, "../../..")
  const { removeProvider, syncCatalog } = require(path.join(supercliRoot, "cli", "skills-catalog"))
  
  removeProvider("token-reduction-ultimate")
  const index = syncCatalog()
  
  return {
    provider: "token-reduction-ultimate",
    action: "removed",
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

module.exports = { run }
