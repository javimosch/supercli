const path = require("path")
const { addProvider, syncCatalog } = require("../../../cli/skills-catalog")
const { setMcpServer, listMcpServers } = require("../../../cli/config")

const PLUGIN_NAME = "cocoindex-code"
const MCP_SERVER_NAME = "cocoindex-code"
const SKILLS_ROOT = path.resolve(__dirname, "..", "skills")

const DEFAULT_SERVER = {
  command: "cocoindex-code",
  args: [],
  timeout_ms: 180000,
}

async function ensureMcpServer() {
  const servers = await listMcpServers()
  const existing = (servers || []).find((s) => s && s.name === MCP_SERVER_NAME)
  if (existing) return { server: existing, created: false }
  await setMcpServer(MCP_SERVER_NAME, DEFAULT_SERVER)
  return {
    server: { name: MCP_SERVER_NAME, ...DEFAULT_SERVER },
    created: true,
  }
}

async function run() {
  const { created } = await ensureMcpServer()

  addProvider({
    name: PLUGIN_NAME,
    type: "local_fs",
    roots: [SKILLS_ROOT],
    enabled: true,
  })

  const index = syncCatalog()
  return {
    plugin: PLUGIN_NAME,
    mcp_server: MCP_SERVER_NAME,
    server_created: created,
    bound_capabilities: ["cocoindex.code.search", "cocoindex.index.build"],
    provider: PLUGIN_NAME,
    synced_skills: Array.isArray(index.skills) ? index.skills.length : 0,
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
  DEFAULT_SERVER,
}
