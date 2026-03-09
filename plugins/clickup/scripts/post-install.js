const { spawnSync } = require("child_process")
const { addProvider, syncCatalog } = require("../../../cli/skills-catalog")

const OWNER = "krodak"
const REPO = "clickup-cli"
const REF = "main"
const SOURCE_REPO = `https://github.com/${OWNER}/${REPO}`
const TREE_URL = `https://api.github.com/repos/${OWNER}/${REPO}/git/trees/${REF}?recursive=1`
const RAW_BASE_URL = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${REF}`

const SKILLS_PATH = "skills/clickup-cli/SKILL.md"

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
    throw integrationError(`Failed to fetch clickup-cli skill: ${res.error.message}`, ["Check internet connectivity", "Retry: supercli plugins install clickup"])
  }
  if (res.status !== 0) {
    throw integrationError(`Failed to fetch clickup-cli skill: ${(res.stderr || "").trim() || `exit ${res.status}`}`, ["Check internet connectivity", "Retry: supercli plugins install clickup"])
  }
  try {
    return JSON.parse((res.stdout || "").trim() || "{}")
  } catch (err) {
    throw integrationError(`Invalid clickup-cli skill response: ${err.message}`)
  }
}

function run() {
  // Fetch the skill file directly
  const skillUrl = `${RAW_BASE_URL}/${SKILLS_PATH}`
  const res = spawnSync("curl", ["-fsSL", skillUrl], { encoding: "utf-8", timeout: 15000 })
  
  if (res.error || res.status !== 0) {
    throw integrationError(`Failed to fetch clickup-cli SKILL.md: ${res.error?.message || `exit ${res.status}`}`, ["Check internet connectivity", "Retry: supercli plugins install clickup"])
  }

  const markdown = (res.stdout || "").trim()
  
  // Parse frontmatter for name and description
  let name = "ClickUp CLI"
  let description = "Use when managing ClickUp tasks, sprints, or comments via the cu CLI tool"
  
  if (markdown.startsWith("---\n")) {
    const end = markdown.indexOf("\n---\n", 4)
    if (end > 0) {
      const frontmatter = markdown.slice(4, end)
      for (const line of frontmatter.split("\n")) {
        const idx = line.indexOf(":")
        if (idx > 0) {
          const key = line.slice(0, idx).trim()
          const value = line.slice(idx + 1).trim().replace(/^"|"$/g, "")
          if (key === "name") name = value
          if (key === "description") description = value
        }
      }
    }
  }

  // Add as a remote static provider with a single skill entry
  addProvider({
    name: "clickup",
    type: "remote_static",
    enabled: true,
    source_repo: SOURCE_REPO,
    ref: REF,
    entries: [
      {
        id: "clickup",
        name: name,
        description: description,
        path: SKILLS_PATH,
        source_url: skillUrl
      }
    ]
  })

  const index = syncCatalog()
  return {
    provider: "clickup",
    entries: 1,
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
  run
}

