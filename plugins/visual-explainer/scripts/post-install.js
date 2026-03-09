const { spawnSync } = require("child_process")
const { addProvider, syncCatalog } = require("../../../cli/skills-catalog")

const OWNER = "javimosch"
const REPO = "visual-explainer"
const REF = "main"
const SOURCE_REPO = `https://github.com/${OWNER}/${REPO}`
const TREE_URL = `https://api.github.com/repos/${OWNER}/${REPO}/git/trees/${REF}?recursive=1`
const RAW_BASE_URL = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${REF}`
const NORMALIZED_PREFIX = "plugins/visual-explainer-normalized/"

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
    throw integrationError(`Failed to fetch visual-explainer metadata: ${res.error.message}`, ["Check internet connectivity", "Retry: supercli plugins install visual-explainer"])
  }
  if (res.status !== 0) {
    throw integrationError(`Failed to fetch visual-explainer metadata: ${(res.stderr || "").trim() || `exit ${res.status}`}`, ["Check internet connectivity", "Retry: supercli plugins install visual-explainer"])
  }
  try {
    return JSON.parse((res.stdout || "").trim() || "{}")
  } catch (err) {
    throw integrationError(`Invalid visual-explainer metadata response: ${err.message}`)
  }
}

function isNormalizedSkillFile(filePath) {
  return filePath.startsWith(NORMALIZED_PREFIX) && filePath.endsWith(".md")
}

function toSkillId(relativePath) {
  if (relativePath === "SKILL.md") return "visual-explainer.skill"
  return `visual-explainer.${relativePath.replace(/\.md$/, "").replace(/\//g, ".")}`
}

function toSkillName(relativePath) {
  const base = relativePath.split("/").pop() || relativePath
  return base
    .replace(/\.md$/, "")
    .split("-")
    .map(part => (part ? part[0].toUpperCase() + part.slice(1) : part))
    .join(" ")
}

function buildRemoteEntriesFromTree(treeResponse) {
  const tree = Array.isArray(treeResponse.tree) ? treeResponse.tree : []
  const entries = []

  for (const node of tree) {
    if (!node || node.type !== "blob" || typeof node.path !== "string") continue
    if (!isNormalizedSkillFile(node.path)) continue
    const relativePath = node.path.slice(NORMALIZED_PREFIX.length)
    entries.push({
      id: toSkillId(relativePath),
      name: toSkillName(relativePath),
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
    throw integrationError("visual-explainer plugin found no normalized remote skill files to index")
  }

  addProvider({
    name: "visual-explainer",
    type: "remote_static",
    enabled: true,
    source_repo: SOURCE_REPO,
    ref: REF,
    entries
  })

  const index = syncCatalog()
  return {
    provider: "visual-explainer",
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
