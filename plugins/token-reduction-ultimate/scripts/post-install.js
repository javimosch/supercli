const { spawnSync } = require("child_process")
const path = require("path")

const OWNER = "javimosch"
const REPO = "token-reduction-ultimate"
const REF = "main"
const SOURCE_REPO = `https://github.com/${OWNER}/${REPO}`
const TREE_URL = `https://api.github.com/repos/${OWNER}/${REPO}/git/trees/${REF}?recursive=1`
const RAW_BASE_URL = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${REF}`

function fetchJson(url) {
  const res = spawnSync("curl", ["-fsSL", url], { encoding: "utf-8", timeout: 15000 })
  if (res.error || res.status !== 0) {
    throw new Error(`Failed to fetch: ${(res.stderr || res.error?.message || `exit ${res.status}`).trim()}`)
  }
  return JSON.parse((res.stdout || "").trim() || "{}")
}

function isSkillFile(filePath) {
  return filePath.endsWith(".md") && 
    !filePath.startsWith("plugins/") && 
    !filePath.startsWith("scripts/") && 
    !filePath.startsWith("node_modules/") && 
    !filePath.startsWith(".git/") &&
    !filePath.startsWith(".github/")
}

function toSkillId(relativePath) {
  if (relativePath === "SKILL.md") return "main.skill"
  return relativePath.replace(/\.md$/, "").replace(/\//g, ".")
}

function toSkillName(relativePath) {
  const base = relativePath.split("/").pop() || relativePath
  return base.replace(/\.md$/, "").split("-").map(p => p ? p[0].toUpperCase() + p.slice(1) : p).join(" ")
}

function run() {
  const supercliRoot = path.resolve(__dirname, "../../..")
  const catalogPath = path.join(supercliRoot, "cli", "skills-catalog")
  const { addProvider, syncCatalog } = require(catalogPath)

  const treeResponse = fetchJson(TREE_URL)
  const tree = Array.isArray(treeResponse.tree) ? treeResponse.tree : []
  const entries = []

  for (const node of tree) {
    if (!node || node.type !== "blob" || typeof node.path !== "string") continue
    if (!isSkillFile(node.path)) continue
    entries.push({
      id: toSkillId(node.path),
      name: toSkillName(node.path),
      path: node.path,
      source_url: `${RAW_BASE_URL}/${node.path}`
    })
  }

  entries.sort((a, b) => a.id.localeCompare(b.id))

  if (entries.length === 0) {
    throw new Error("No skill files found in token-reduction-ultimate repo")
  }

  addProvider({
    name: "token-reduction-ultimate",
    type: "remote_static",
    enabled: true,
    source_repo: SOURCE_REPO,
    ref: REF,
    entries
  })

  const index = syncCatalog()
  return {
    provider: "token-reduction-ultimate",
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

module.exports = { run }
