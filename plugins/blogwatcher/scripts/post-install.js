const { addProvider, syncCatalog } = require("../../../cli/skills-catalog")

const OWNER = "Hyaxia"
const REPO = "blogwatcher"
const REF = "main"
const SOURCE_REPO = `https://github.com/${OWNER}/${REPO}`
const RAW_BASE_URL = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${REF}`

const CATALOG_FILES = [
  {
    id: "root.skill",
    name: "BlogWatcher Agent Skill",
    path: "SKILL.md",
    description: "Agent-focused guidance for working with the BlogWatcher CLI, code layout, and testing flow.",
    tags: ["agents", "blogs", "workflow"]
  },
  {
    id: "root.readme",
    name: "BlogWatcher Overview",
    path: "README.md",
    description: "Project overview, installation steps, storage model, and end-user command examples.",
    tags: ["overview", "blogs", "rss"]
  }
]

function buildRemoteEntries() {
  return CATALOG_FILES.map(file => ({
    ...file,
    source_url: `${RAW_BASE_URL}/${file.path}`
  }))
}

function run() {
  const entries = buildRemoteEntries()
  addProvider({
    name: "blogwatcher",
    type: "remote_static",
    enabled: true,
    source_repo: SOURCE_REPO,
    ref: REF,
    entries
  })

  const index = syncCatalog()
  return {
    provider: "blogwatcher",
    entries: entries.length,
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
  CATALOG_FILES,
  buildRemoteEntries,
  run
}
