const { addProvider, syncCatalog } = require("../../../cli/skills-catalog")

const OWNER = "xdevplatform"
const REPO = "xurl"
const REF = "main"
const SOURCE_REPO = `https://github.com/${OWNER}/${REPO}`
const RAW_BASE_URL = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${REF}`

const CATALOG_FILES = [
  {
    id: "root.skill",
    name: "xurl Agent Skill",
    path: "SKILL.md",
    description: "Agent-oriented guidance for safe xurl usage, shortcut commands, and raw X API access.",
    tags: ["agents", "x", "api"]
  },
  {
    id: "root.readme",
    name: "xurl Overview",
    path: "README.md",
    description: "Project overview, auth model, installation, and command examples for xurl.",
    tags: ["overview", "x", "oauth"]
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
    name: "xurl",
    type: "remote_static",
    enabled: true,
    source_repo: SOURCE_REPO,
    ref: REF,
    entries
  })

  const index = syncCatalog()
  return {
    provider: "xurl",
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
