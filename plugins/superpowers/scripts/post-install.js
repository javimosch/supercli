const { spawnSync } = require("child_process")
const { addProvider, syncCatalog } = require("../../../cli/skills-catalog")

const OWNER = "obra"
const REPO = "superpowers"
const REF = "main"
const SOURCE_REPO = `https://github.com/${OWNER}/${REPO}`
const TREE_URL = `https://api.github.com/repos/${OWNER}/${REPO}/git/trees/${REF}?recursive=1`
const RAW_BASE_URL = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${REF}`

const SKILLS_PREFIX = "skills/"

function integrationError(message, suggestions = []) {
  return Object.assign(new Error(message), {
    code: 105,
    type: "integration_error",
    recoverable: true,
    suggestions
  })
}

function fetchJson(url) {
  const res = spawnSync("curl", ["-fsSL", url], { encoding: "utf-8", timeout: 15000 })
  if (res.error) {
    throw integrationError(`Failed to fetch superpowers metadata: ${res.error.message}`, ["Check internet connectivity", "Retry: supercli plugins install superpowers"])
  }
  if (res.status !== 0) {
    throw integrationError(`Failed to fetch superpowers metadata: ${(res.stderr || "").trim() || `exit ${res.status}`}`, ["Check internet connectivity", "Retry: supercli plugins install superpowers"])
  }
  try {
    return JSON.parse((res.stdout || "").trim() || "{}")
  } catch (err) {
    throw integrationError(`Invalid superpowers metadata response: ${err.message}`)
  }
}

function toSkillId(filePath) {
  // Convert skills/brainstorming/SKILL.md -> brainstorming
  return filePath
    .replace(/^skills\//, "")
    .replace(/\/SKILL\.md$/, "")
}

function toSkillName(filePath) {
  // Convert directory name to readable name
  // e.g., "test-driven-development" -> "Test Driven Development"
  const base = toSkillId(filePath)
  return base
    .split("-")
    .map(part => (part ? part[0].toUpperCase() + part.slice(1) : part))
    .join(" ")
}

function isSkillFile(filePath) {
  if (!filePath.endsWith(".md")) return false
  if (!filePath.startsWith(SKILLS_PREFIX)) return false
  if (filePath.endsWith("README.md")) return false
  // Only match skills/*/SKILL.md pattern
  const parts = filePath.split("/")
  return parts.length === 3 && parts[2] === "SKILL.md"
}

function buildRemoteEntriesFromTree(treeResponse) {
  const tree = Array.isArray(treeResponse.tree) ? treeResponse.tree : []
  const entries = []

  for (const node of tree) {
    if (!node || node.type !== "blob" || typeof node.path !== "string") continue
    if (!isSkillFile(node.path)) continue
    
    const id = toSkillId(node.path)
    entries.push({
      id: id,
      name: toSkillName(node.path),
      path: node.path,
      source_url: `${RAW_BASE_URL}/${node.path}`,
      description: `Superpowers skill: ${toSkillName(node.path)}`
    })
  }

  entries.sort((a, b) => a.id.localeCompare(b.id))
  return entries
}

function run() {
  const treeResponse = fetchJson(TREE_URL)
  const entries = buildRemoteEntriesFromTree(treeResponse)
  
  if (entries.length === 0) {
    throw integrationError("superpowers plugin found no remote skill files to index")
  }

  addProvider({
    name: "superpowers",
    type: "remote_static",
    enabled: true,
    source_repo: SOURCE_REPO,
    ref: REF,
    entries
  })

  const index = syncCatalog()
  return {
    provider: "superpowers",
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
  run,
  buildRemoteEntriesFromTree
}

