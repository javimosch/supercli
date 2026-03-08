async function handleMcpRegistryCommand(options) {
  const {
    positional,
    flags,
    humanMode,
    output,
    outputHumanTable,
    outputError,
    setMcpServer,
    removeMcpServer,
    listMcpServers
  } = options

  const subcommand = positional[1]
  if (subcommand === "list") {
    const servers = await listMcpServers()
    if (humanMode) {
      console.log("\n  ⚡ Local MCP Servers\n")
      outputHumanTable(servers, [
        { key: "name", label: "Name" },
        { key: "url", label: "URL" }
      ])
      console.log("")
    } else {
      output({ mcp_servers: servers })
    }
    return true
  }

  if (subcommand === "add") {
    const name = positional[2]
    const url = flags.url
    if (!name || !url) {
      outputError({ code: 85, type: "invalid_argument", message: "Usage: dcli mcp add <name> --url <mcp_url>", recoverable: false })
      return true
    }
    await setMcpServer(name, url)
    output({ ok: true, message: `MCP server '${name}' saved locally` })
    return true
  }

  if (subcommand === "remove") {
    const name = positional[2]
    if (!name) {
      outputError({ code: 85, type: "invalid_argument", message: "Usage: dcli mcp remove <name>", recoverable: false })
      return true
    }
    const removed = await removeMcpServer(name)
    output({ ok: true, removed })
    return true
  }

  outputError({ code: 85, type: "invalid_argument", message: "Unknown mcp subcommand. Use: list, add, remove", recoverable: false })
  return true
}

module.exports = { handleMcpRegistryCommand }
