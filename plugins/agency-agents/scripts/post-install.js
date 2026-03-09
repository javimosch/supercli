const { spawnSync } = require("child_process")
const { addProvider, syncCatalog } = require("../../../cli/skills-catalog")

const OWNER = "msitarzewski"
const REPO = "agency-agents"
const REF = "main"
const SOURCE_REPO = `https://github.com/${OWNER}/${REPO}`
const TREE_URL = `https://api.github.com/repos/${OWNER}/${REPO}/git/trees/${REF}?recursive=1`
const RAW_BASE_URL = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${REF}`

const CATEGORY_PREFIXES = [
  "design/",
  "engineering/",
  "marketing/",
  "product/",
  "project-management/",
  "testing/",
  "support/",
  "spatial-computing/",
  "specialized/"
]

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
    throw integrationError(`Failed to fetch agency-agents metadata: ${res.error.message}`, ["Check internet connectivity", "Retry: supercli plugins install agency-agents"])
  }
  if (res.status !== 0) {
    throw integrationError(`Failed to fetch agency-agents metadata: ${(res.stderr || "").trim() || `exit ${res.status}`}`, ["Check internet connectivity", "Retry: supercli plugins install agency-agents"])
  }
  try {
    return JSON.parse((res.stdout || "").trim() || "{}")
  } catch (err) {
    throw integrationError(`Invalid agency-agents metadata response: ${err.message}`)
  }
}

function toSkillId(filePath) {
  return filePath.replace(/\.md$/, "").replace(/\//g, ".")
}

function toSkillName(filePath) {
  const base = filePath.split("/").pop() || filePath
  return base
    .replace(/\.md$/, "")
    .split("-")
    .map(part => (part ? part[0].toUpperCase() + part.slice(1) : part))
    .join(" ")
}

function isAgentFile(filePath) {
  if (!filePath.endsWith(".md")) return false
  if (filePath.endsWith("README.md")) return false
  return CATEGORY_PREFIXES.some(prefix => filePath.startsWith(prefix))
}

function buildRemoteEntriesFromTree(treeResponse) {
  const tree = Array.isArray(treeResponse.tree) ? treeResponse.tree : []
  const entries = []

  for (const node of tree) {
    if (!node || node.type !== "blob" || typeof node.path !== "string") continue
    if (!isAgentFile(node.path)) continue
    entries.push({
      id: toSkillId(node.path),
      name: toSkillName(node.path),
      path: node.path,
      source_url: `${RAW_BASE_URL}/${node.path}`
    })
  }

  entries.sort((a, b) => a.id.localeCompare(b.id))
  return entries
}

function run() {
  const treeResponse = fetchJson(TREE_URL)
  const entries = buildRemoteEntriesFromTree(treeResponse)
  if (entries.length === 0) {
    throw integrationError("agency-agents plugin found no remote skill files to index")
  }

  addProvider({
    name: "agency-agents",
    type: "remote_static",
    enabled: true,
    source_repo: SOURCE_REPO,
    ref: REF,
    entries
  })

  const index = syncCatalog()
  return {
    provider: "agency-agents",
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
