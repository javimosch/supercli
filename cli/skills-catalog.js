const fs = require("fs")
const os = require("os")
const path = require("path")
const { spawnSync } = require("child_process")

function dcliDir() {
  return process.env.SUPERCLI_HOME || path.join(os.homedir(), ".dcli")
}

function providersFile() {
  return path.join(dcliDir(), "skills-providers.json")
}

function indexFile() {
  return path.join(dcliDir(), "skills-index.json")
}

function ensureDir() {
  const dir = dcliDir()
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

function defaultProviders() {
  const home = os.homedir()
  const cwd = process.cwd()
  return [
    { name: "opencode", type: "local_fs", roots: [path.join(home, ".config", "opencode", "skills")], enabled: true },
    { name: "codex", type: "local_fs", roots: [path.join(home, ".config", "codex", "skills")], enabled: true },
    { name: "windsurf", type: "local_fs", roots: [path.join(home, ".config", "windsurf", "skills")], enabled: true },
    { name: "cursor", type: "local_fs", roots: [path.join(home, ".config", "cursor", "skills")], enabled: true },
    { name: "repo", type: "repo_fs", roots: [path.join(cwd, ".agents", "skills"), path.join(cwd, "docs", "skills")], enabled: true }
  ]
}

function readJson(file, fallback) {
  try {
    if (!fs.existsSync(file)) return fallback
    return JSON.parse(fs.readFileSync(file, "utf-8"))
  } catch {
    return fallback
  }
}

function writeJson(file, value) {
  ensureDir()
  fs.writeFileSync(file, JSON.stringify(value, null, 2))
  return value
}

function listProviders() {
  const providers = readJson(providersFile(), defaultProviders())
  return Array.isArray(providers) ? providers : defaultProviders()
}

function setProviders(providers) {
  return writeJson(providersFile(), providers)
}

function addProvider(entry) {
  const providers = listProviders()
  const idx = providers.findIndex(p => p.name === entry.name)
  if (idx >= 0) providers[idx] = entry
  else providers.push(entry)
  setProviders(providers)
  return entry
}

function removeProvider(name) {
  const providers = listProviders()
  const next = providers.filter(p => p.name !== name)
  const removed = next.length !== providers.length
  setProviders(next)
  return removed
}

function getProvider(name) {
  return listProviders().find(p => p.name === name) || null
}

function readIndex() {
  const empty = { version: 1, updated_at: null, skills: [] }
  const idx = readJson(indexFile(), empty)
  if (!idx || typeof idx !== "object") return empty
  if (!Array.isArray(idx.skills)) idx.skills = []
  return idx
}

function walkDir(dir) {
  const files = []
  if (!fs.existsSync(dir)) return files
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...walkDir(full))
      continue
    }
    if (entry.isFile() && entry.name === "SKILL.md") files.push(full)
  }
  return files
}

function parseFrontmatter(markdown) {
  if (!markdown.startsWith("---\n")) return { frontmatter: {}, body: markdown }
  const end = markdown.indexOf("\n---\n", 4)
  if (end < 0) return { frontmatter: {}, body: markdown }
  const raw = markdown.slice(4, end)
  const body = markdown.slice(end + 5)
  const frontmatter = {}
  for (const line of raw.split("\n")) {
    const idx = line.indexOf(":")
    if (idx < 0) continue
    const key = line.slice(0, idx).trim()
    const value = line.slice(idx + 1).trim().replace(/^"|"$/g, "")
    if (key) frontmatter[key] = value
  }
  return { frontmatter, body }
}

function baseSkillId(filePath, frontmatter, root) {
  if (frontmatter.skill_name) return frontmatter.skill_name
  const rel = path.relative(root, filePath)
  return rel.replace(/\\/g, "/").replace(/\/SKILL\.md$/, "").replace(/\//g, ".")
}

function syncCatalog() {
  const providers = listProviders()
  const skills = []

  for (const provider of providers) {
    if (!provider.enabled) continue

    if (provider.type === "remote_static") {
      const entries = Array.isArray(provider.entries) ? provider.entries : []
      for (const entry of entries) {
        if (!entry || !entry.id || !entry.source_url) continue
        skills.push({
          id: `${provider.name}:${entry.id}`,
          provider: provider.name,
          name: entry.name || entry.id,
          description: entry.description || "",
          source_url: entry.source_url,
          tags: Array.isArray(entry.tags) ? entry.tags : [],
          updated_at: new Date().toISOString()
        })
      }
      continue
    }

    const roots = Array.isArray(provider.roots) ? provider.roots : []
    for (const root of roots) {
      const files = walkDir(root)
      for (const filePath of files) {
        const markdown = fs.readFileSync(filePath, "utf-8")
        const { frontmatter, body } = parseFrontmatter(markdown)
        const baseId = baseSkillId(filePath, frontmatter, root)
        const heading = body.split("\n").find(l => l.startsWith("# "))
        const name = frontmatter.skill_name || (heading ? heading.slice(2).trim() : baseId)
        const description = frontmatter.description || ""
        const tags = typeof frontmatter.tags === "string" ? frontmatter.tags.split(",").map(t => t.trim()).filter(Boolean) : []

        skills.push({
          id: `${provider.name}:${baseId}`,
          provider: provider.name,
          name,
          description,
          source_path: filePath,
          tags,
          updated_at: new Date().toISOString()
        })
      }
    }
  }

  skills.sort((a, b) => a.id.localeCompare(b.id))
  const next = {
    version: 1,
    updated_at: new Date().toISOString(),
    providers: providers.map(p => p.name),
    skills
  }
  writeJson(indexFile(), next)
  return next
}

function listCatalogSkills(options = {}) {
  const idx = readIndex()
  let items = idx.skills || []
  if (options.provider) items = items.filter(s => s.provider === options.provider)
  return items.map(s => ({ id: s.id, name: s.name, description: s.description, provider: s.provider }))
}

function searchCatalog(query, options = {}) {
  const q = String(query || "").trim().toLowerCase()
  if (!q) return []
  const items = listCatalogSkills(options)
  return items.filter(s =>
    s.id.toLowerCase().includes(q) ||
    s.name.toLowerCase().includes(q) ||
    String(s.description || "").toLowerCase().includes(q)
  )
}

function getCatalogSkill(providerId) {
  const idx = readIndex()
  const hit = (idx.skills || []).find(s => s.id === providerId)
  if (!hit) return null
  let markdown = null

  if (hit.source_path) {
    if (!fs.existsSync(hit.source_path)) return null
    markdown = fs.readFileSync(hit.source_path, "utf-8")
  } else if (hit.source_url) {
    const res = spawnSync("curl", ["-fsSL", hit.source_url], { encoding: "utf-8", timeout: 15000 })
    if (res.error || res.status !== 0) return null
    markdown = (res.stdout || "").trim()
  }

  if (!markdown) return null

  return {
    ...hit,
    markdown
  }
}

module.exports = {
  listProviders,
  addProvider,
  removeProvider,
  getProvider,
  readIndex,
  syncCatalog,
  listCatalogSkills,
  searchCatalog,
  getCatalogSkill
}
