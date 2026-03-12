const { addProvider, syncCatalog } = require("../../../cli/skills-catalog")

const OWNER = "intranefr"
const REPO = "monty"
const REF = "main"
const SOURCE_REPO = `https://github.com/${OWNER}/${REPO}`
const RAW_BASE_URL = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${REF}`

const CATALOG_FILES = [
  {
    id: "root.skill",
    name: "Monty Agent Skill",
    path: "CLAUDE.md",
    description: "Core guidance for working with the Monty sandboxed Python interpreter, including VM architecture, security mandates, and SuperCLI agentic patterns.",
    tags: ["agents", "python", "sandbox", "security", "supercli"]
  },
  {
    id: "root.usage",
    name: "Monty Usage Guide",
    path: "docs/usage-guide.md",
    description: "Comprehensive guide for developers on installing, configuring, and using Monty in Python and JavaScript environments.",
    tags: ["usage", "guide", "python", "javascript", "examples"]
  },
  {
    id: "root.readme",
    name: "Monty Overview",
    path: "README.md",
    description: "General overview of Monty's goals, performance, and language support.",
    tags: ["overview", "python", "interpreter"]
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
    name: "monty",
    type: "remote_static",
    enabled: true,
    source_repo: SOURCE_REPO,
    ref: REF,
    entries
  })

  const index = syncCatalog()
  return {
    provider: "monty",
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
