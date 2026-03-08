// MCP Adapter
// Calls an MCP server tool via HTTP POST

async function execute(cmd, flags, context) {
  const config = cmd.adapterConfig || {}
  const serverName = config.server
  const toolName = config.tool

  if (!serverName || !toolName) {
    throw new Error("MCP adapter requires 'server' and 'tool' in adapterConfig")
  }

  // Fetch MCP server URL from backend
  const r = await fetch(`${context.server}/api/mcp?format=json`)
  if (!r.ok) throw new Error(`Failed to fetch MCP servers list: ${r.status}`)
  const servers = await r.json()
  const srv = servers.find(s => s.name === serverName)
  if (!srv) throw new Error(`MCP server '${serverName}' not found`)

  // Build tool input from flags
  const input = {}
  for (const [k, v] of Object.entries(flags)) {
    if (!["human", "json", "compact"].includes(k)) {
      input[k] = v
    }
  }

  // Call MCP tool
  const toolUrl = srv.url.replace(/\/+$/, "")
  const tr = await fetch(`${toolUrl}/tool`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tool: toolName, input })
  })

  if (!tr.ok) {
    const text = await tr.text().catch(() => "")
    throw Object.assign(new Error(`MCP tool call failed: ${tr.status} ${text}`), {
      code: 105,
      type: "integration_error",
      recoverable: true
    })
  }

  return tr.json()
}

module.exports = { execute }
