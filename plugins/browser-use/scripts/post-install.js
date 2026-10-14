const path = require("path")
const { addProvider, syncCatalog } = require("../../../cli/skills-catalog")
const { setMcpServer, listMcpServers, upsertCommand } = require("../../../cli/config")
const { discoverMcpTools } = require("../../../cli/mcp-discovery")

const PLUGIN_NAME = "browser-use"
const MCP_SERVER_NAME = "browser-use"
const NAMESPACE = "browseruse"
const SKILLS_ROOT = path.resolve(__dirname, "..", "skills")

const DEFAULT_SERVER = {
  command: "npx",
  args: [
    "-y",
    "mcp-remote",
    "https://api.browser-use.com/mcp",
    "--header",
    "X-Browser-Use-API-Key: ${BROWSER_USE_API_KEY}"
  ],
  env: {
    BROWSER_USE_API_KEY: "${BROWSER_USE_API_KEY}"
  },
  timeout_ms: 180000
}

const KNOWN_TOOLS = [
  "browser_task",
  "list_browser_profiles",
  "monitor_task",
  "list_skills",
  "get_cookies",
  "execute_skill"
]

function uniqueStrings(values) {
  const seen = new Set()
  const out = []
  for (const value of values || []) {
    if (typeof value !== "string" || !value) continue
    if (seen.has(value)) continue
    seen.add(value)
    out.push(value)
  }
  return out
}

function actionFromToolName(toolName) {
  return String(toolName || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "tool"
}

function buildToolCommand(toolName) {
  return {
    namespace: NAMESPACE,
    resource: "tool",
    action: actionFromToolName(toolName),
    description: `Browser Use MCP tool '${toolName}'`,
    adapter: "mcp",
    adapterConfig: {
      server: MCP_SERVER_NAME,
      tool: toolName,
      timeout_ms: 180000
    },
    args: []
  }
}

async function ensureMcpServer() {
  const servers = await listMcpServers()
  const existing = (servers || []).find(s => s && s.name === MCP_SERVER_NAME)
  if (existing) return { server: existing, created: false }
  await setMcpServer(MCP_SERVER_NAME, DEFAULT_SERVER)
  return {
    server: { name: MCP_SERVER_NAME, ...DEFAULT_SERVER },
    created: true
  }
}

async function discoverToolNames(server) {
  const discovered = await discoverMcpTools(server)
  const names = discovered.map(t => t && t.name).filter(Boolean)
  return uniqueStrings(names)
}

async function run() {
  const warnings = []
  const { server, created } = await ensureMcpServer()

  let toolNames = []
  try {
    toolNames = await discoverToolNames(server)
  } catch (err) {
    warnings.push(`Tool discovery failed: ${err.message}`)
  }

  if (toolNames.length === 0) {
    toolNames = KNOWN_TOOLS.slice()
    warnings.push("Using fallback Browser Use tool bindings; run `supercli mcp tools --mcp-server browser-use` after setting BROWSER_USE_API_KEY")
  }

  const commands = uniqueStrings(toolNames).map(buildToolCommand)

  for (const cmd of commands) {
    await upsertCommand(cmd)
  }

  addProvider({
    name: PLUGIN_NAME,
    type: "local_fs",
    roots: [SKILLS_ROOT],
    enabled: true
  })

  const index = syncCatalog()
  return {
    plugin: PLUGIN_NAME,
    mcp_server: MCP_SERVER_NAME,
    server_created: created,
    discovered_tools: toolNames.length,
    bound_commands: commands.length,
    warnings,
    provider: PLUGIN_NAME,
    synced_skills: Array.isArray(index.skills) ? index.skills.length : 0
  }
}

if (require.main === module) {
  run()
    .then((result) => {
      process.stdout.write(JSON.stringify(result))
    })
    .catch((err) => {
      process.stderr.write(err.message)
      process.exit(1)
    })
}

module.exports = {
  run,
  actionFromToolName,
  buildToolCommand,
  DEFAULT_SERVER,
  KNOWN_TOOLS
}
