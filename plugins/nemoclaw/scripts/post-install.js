const { spawnSync } = require("child_process")
const { addProvider, syncCatalog } = require("../../../cli/skills-catalog")

const DEFAULT_OWNER = "NVIDIA"
const DEFAULT_REPO = "NemoClaw"
const DEFAULT_REF = "main"

const CATALOG_FILES = [
  {
    id: "root.readme",
    name: "NemoClaw Overview",
    path: "README.md",
    description: "Project overview, architecture, quick start, and command surfaces.",
    tags: ["overview", "architecture", "quickstart"]
  },
  {
    id: "docs.index",
    name: "NemoClaw Docs Home",
    path: "docs/index.md",
    description: "Documentation entry point for NemoClaw concepts and workflows.",
    tags: ["docs", "overview"]
  },
  {
    id: "docs.get-started.quickstart",
    name: "NemoClaw Quickstart",
    path: "docs/get-started/quickstart.md",
    description: "Step-by-step quickstart for first sandbox setup.",
    tags: ["quickstart", "setup"]
  },
  {
    id: "docs.about.overview",
    name: "NemoClaw About Overview",
    path: "docs/about/overview.md",
    description: "High-level explanation of NemoClaw's goals and model.",
    tags: ["overview", "concepts"]
  },
  {
    id: "docs.about.how-it-works",
    name: "NemoClaw How It Works",
    path: "docs/about/how-it-works.md",
    description: "Lifecycle details for plugin, blueprint, and sandbox orchestration.",
    tags: ["architecture", "lifecycle"]
  },
  {
    id: "docs.reference.commands",
    name: "NemoClaw Commands",
    path: "docs/reference/commands.md",
    description: "Full command reference for host and OpenClaw plugin commands.",
    tags: ["commands", "cli", "reference"]
  },
  {
    id: "docs.reference.architecture",
    name: "NemoClaw Architecture Reference",
    path: "docs/reference/architecture.md",
    description: "Reference architecture for runtime and sandbox composition.",
    tags: ["architecture", "reference"]
  },
  {
    id: "docs.reference.inference-profiles",
    name: "NemoClaw Inference Profiles",
    path: "docs/reference/inference-profiles.md",
    description: "Inference provider profiles, tradeoffs, and usage guidance.",
    tags: ["inference", "models", "reference"]
  },
  {
    id: "docs.reference.network-policies",
    name: "NemoClaw Network Policies",
    path: "docs/reference/network-policies.md",
    description: "Network egress policy controls and preset guidance.",
    tags: ["network", "policy", "security"]
  },
  {
    id: "docs.monitoring.monitor-sandbox-activity",
    name: "NemoClaw Monitoring",
    path: "docs/monitoring/monitor-sandbox-activity.md",
    description: "Operational monitoring workflows for sandbox activity.",
    tags: ["monitoring", "operations"]
  },
  {
    id: "docs.network-policy.customize-network-policy",
    name: "NemoClaw Customize Network Policy",
    path: "docs/network-policy/customize-network-policy.md",
    description: "How to customize and extend NemoClaw network policies.",
    tags: ["network", "policy", "operations"]
  },
  {
    id: "docs.deployment.remote-gpu",
    name: "NemoClaw Deploy to Remote GPU",
    path: "docs/deployment/deploy-to-remote-gpu.md",
    description: "Deployment workflow for remote GPU instances.",
    tags: ["deployment", "gpu", "operations"]
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

function resolveRepoConfig(env = process.env) {
  const slug = String(env.NEMOCLAW_DOCS_REPO || `${DEFAULT_OWNER}/${DEFAULT_REPO}`).trim()
  const parts = slug.split("/").filter(Boolean)
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    throw integrationError(`Invalid NEMOCLAW_DOCS_REPO '${slug}'. Expected 'owner/repo'.`)
  }

  const owner = parts[0]
  const repo = parts[1]
  const ref = String(env.NEMOCLAW_DOCS_REF || DEFAULT_REF).trim() || DEFAULT_REF
  const sourceRepo = String(env.NEMOCLAW_SOURCE_REPO || `https://github.com/${owner}/${repo}`).trim()
  const treeUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${ref}?recursive=1`
  const rawBaseUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${ref}`

  return { owner, repo, ref, sourceRepo, treeUrl, rawBaseUrl }
}

function fetchJson(url) {
  const res = spawnSync("curl", ["-fsSL", url], { encoding: "utf-8", timeout: 15000 })
  if (res.error) {
    throw integrationError(`Failed to fetch nemoclaw metadata: ${res.error.message}`, [
      "Check internet connectivity",
      "Retry: supercli plugins install nemoclaw"
    ])
  }
  if (res.status !== 0) {
    throw integrationError(`Failed to fetch nemoclaw metadata: ${(res.stderr || "").trim() || `exit ${res.status}`}`, [
      "Check internet connectivity",
      "Retry: supercli plugins install nemoclaw"
    ])
  }
  try {
    return JSON.parse((res.stdout || "").trim() || "{}")
  } catch (err) {
    throw integrationError(`Invalid nemoclaw metadata response: ${err.message}`)
  }
}

function buildRemoteEntriesFromTree(treeResponse, rawBaseUrl = `https://raw.githubusercontent.com/${DEFAULT_OWNER}/${DEFAULT_REPO}/${DEFAULT_REF}`) {
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
      source_url: `${rawBaseUrl}/${file.path}`
    }))
}

function run() {
  const repo = resolveRepoConfig()
  const treeResponse = fetchJson(repo.treeUrl)
  const entries = buildRemoteEntriesFromTree(treeResponse, repo.rawBaseUrl)
  if (entries.length === 0) {
    throw integrationError("nemoclaw plugin found no remote documentation files to index")
  }

  addProvider({
    name: "nemoclaw",
    type: "remote_static",
    enabled: true,
    source_repo: repo.sourceRepo,
    ref: repo.ref,
    entries
  })

  const index = syncCatalog()
  return {
    provider: "nemoclaw",
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
  buildRemoteEntriesFromTree,
  resolveRepoConfig
}
