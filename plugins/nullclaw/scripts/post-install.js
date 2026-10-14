const { spawnSync } = require("child_process")
const { addProvider, syncCatalog } = require("../../../cli/skills-catalog")

const OWNER = "nullclaw"
const REPO = "nullclaw"
const REF = "main"
const SOURCE_REPO = `https://github.com/${OWNER}/${REPO}`
const TREE_URL = `https://api.github.com/repos/${OWNER}/${REPO}/git/trees/${REF}?recursive=1`
const RAW_BASE_URL = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${REF}`

const CATALOG_FILES = [
  {
    id: "root.readme",
    name: "NullClaw Overview",
    path: "README.md",
    description: "Project overview, quick start, common commands, and platform capabilities.",
    tags: ["overview", "runtime", "agents"]
  },
  {
    id: "root.agents",
    name: "NullClaw Agent Protocol",
    path: "AGENTS.md",
    description: "Repository-specific engineering protocol for coding agents implementing NullClaw features.",
    tags: ["agents", "engineering", "implementation"]
  },
  {
    id: "root.claude",
    name: "NullClaw Claude Guidance",
    path: "CLAUDE.md",
    description: "Additional repository instructions for LLM-assisted development workflows.",
    tags: ["agents", "llms", "implementation"]
  },
  {
    id: "root.contributing",
    name: "NullClaw Contributing",
    path: "CONTRIBUTING.md",
    description: "Contribution workflow, validation expectations, and repository conventions.",
    tags: ["contributing", "development", "workflow"]
  },
  {
    id: "docs.en.readme",
    name: "NullClaw Docs Overview",
    path: "docs/en/README.md",
    description: "Guided docs entry point for users and contributors.",
    tags: ["docs", "overview", "onboarding"]
  },
  {
    id: "docs.en.installation",
    name: "NullClaw Installation",
    path: "docs/en/installation.md",
    description: "Install and first-run setup guidance for the NullClaw binary.",
    tags: ["installation", "setup", "operations"]
  },
  {
    id: "docs.en.configuration",
    name: "NullClaw Configuration",
    path: "docs/en/configuration.md",
    description: "Config schema guidance for models, channels, memory, gateway, autonomy, and security.",
    tags: ["configuration", "operations", "security"]
  },
  {
    id: "docs.en.commands",
    name: "NullClaw Commands",
    path: "docs/en/commands.md",
    description: "Task-oriented CLI reference covering onboarding, agent, service, channel, skills, and data commands.",
    tags: ["commands", "cli", "operations"]
  },
  {
    id: "docs.en.usage",
    name: "NullClaw Usage",
    path: "docs/en/usage.md",
    description: "Operational workflows for day-to-day use, health checks, troubleshooting, and service mode.",
    tags: ["usage", "operations", "troubleshooting"]
  },
  {
    id: "docs.en.architecture",
    name: "NullClaw Architecture",
    path: "docs/en/architecture.md",
    description: "Subsystem design and extension points for providers, channels, tools, runtime, memory, and security.",
    tags: ["architecture", "engineering", "implementation"]
  },
  {
    id: "docs.en.security",
    name: "NullClaw Security",
    path: "docs/en/security.md",
    description: "Security model for pairing, sandboxing, allowlists, secrets, and runtime boundaries.",
    tags: ["security", "operations", "implementation"]
  },
  {
    id: "docs.en.gateway-api",
    name: "NullClaw Gateway API",
    path: "docs/en/gateway-api.md",
    description: "Gateway endpoints, pairing flow, auth expectations, and integration details.",
    tags: ["api", "gateway", "integrations"]
  },
  {
    id: "docs.en.development",
    name: "NullClaw Development",
    path: "docs/en/development.md",
    description: "Build, test, source layout, and development workflow for contributors.",
    tags: ["development", "engineering", "zig"]
  }
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
    throw integrationError(`Failed to fetch nullclaw metadata: ${res.error.message}`, [
      "Check internet connectivity",
      "Retry: supercli plugins install nullclaw"
    ])
  }
  if (res.status !== 0) {
    throw integrationError(`Failed to fetch nullclaw metadata: ${(res.stderr || "").trim() || `exit ${res.status}`}`, [
      "Check internet connectivity",
      "Retry: supercli plugins install nullclaw"
    ])
  }
  try {
    return JSON.parse((res.stdout || "").trim() || "{}")
  } catch (err) {
    throw integrationError(`Invalid nullclaw metadata response: ${err.message}`)
  }
}

function buildRemoteEntriesFromTree(treeResponse) {
  const tree = Array.isArray(treeResponse.tree) ? treeResponse.tree : []
  const availablePaths = new Set(
    tree
      .filter(node => node && node.type === "blob" && typeof node.path === "string")
      .map(node => node.path)
  )

  return CATALOG_FILES
    .filter(file => availablePaths.has(file.path))
    .map(file => ({
      ...file,
      source_url: `${RAW_BASE_URL}/${file.path}`
    }))
}

function run() {
  const treeResponse = fetchJson(TREE_URL)
  const entries = buildRemoteEntriesFromTree(treeResponse)
  if (entries.length === 0) {
    throw integrationError("nullclaw plugin found no remote documentation files to index")
  }

  addProvider({
    name: "nullclaw",
    type: "remote_static",
    enabled: true,
    source_repo: SOURCE_REPO,
    ref: REF,
    entries
  })

  const index = syncCatalog()
  return {
    provider: "nullclaw",
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
  run,
  buildRemoteEntriesFromTree
}
