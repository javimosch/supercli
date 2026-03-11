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
    listMcpServers,
  } = options;
  const cliFlags = flags || {};

  const subcommand = positional[1];

  function parseJsonFlag(name, raw) {
    if (raw === undefined) return undefined;
    try {
      return JSON.parse(raw);
    } catch {
      outputError({
        code: 85,
        type: "invalid_argument",
        message: `Invalid JSON for --${name}`,
        recoverable: false,
      });
      return null;
    }
  }

  if (subcommand === "list") {
    const servers = await listMcpServers();
    if (humanMode) {
      console.log("\n  ⚡ Local MCP Servers\n");
      outputHumanTable(servers, [
        { key: "name", label: "Name" },
        { key: "url", label: "URL" },
      ]);
      console.log("");
    } else {
      output({ mcp_servers: servers });
    }
    return true;
  }

  if (subcommand === "add") {
    const name = positional[2];
    const url = cliFlags.url;
    const command = cliFlags.command;

    if (!name || (!url && !command)) {
      outputError({
        code: 85,
        type: "invalid_argument",
        message:
          "Usage: supercli mcp add <name> (--url <mcp_url> | --command <binary>) [--args-json '[]'] [--headers-json '{}'] [--env-json '{}'] [--timeout-ms <ms>]",
        recoverable: false,
      });
      return true;
    }

    const args = parseJsonFlag("args-json", cliFlags["args-json"]);
    if (args === null) return true;
    const headers = parseJsonFlag("headers-json", cliFlags["headers-json"]);
    if (headers === null) return true;
    const env = parseJsonFlag("env-json", cliFlags["env-json"]);
    if (env === null) return true;
    const timeoutMs =
      cliFlags["timeout-ms"] !== undefined ? Number(cliFlags["timeout-ms"]) : undefined;
    if (cliFlags["timeout-ms"] !== undefined && (!Number.isFinite(timeoutMs) || timeoutMs <= 0)) {
      outputError({
        code: 85,
        type: "invalid_argument",
        message: "--timeout-ms must be a positive number",
        recoverable: false,
      });
      return true;
    }

    await setMcpServer(name, {
      url,
      command,
      args,
      headers,
      env,
      timeout_ms: timeoutMs,
    });
    output({ ok: true, message: `MCP server '${name}' saved locally` });
    return true;
  }

  if (subcommand === "remove") {
    const name = positional[2];
    if (!name) {
      outputError({
        code: 85,
        type: "invalid_argument",
        message: "Usage: supercli mcp remove <name>",
        recoverable: false,
      });
      return true;
    }
    const removed = await removeMcpServer(name);
    output({ ok: true, removed });
    return true;
  }

  outputError({
    code: 85,
    type: "invalid_argument",
    message: "Unknown mcp subcommand. Use: list, add, remove",
    recoverable: false,
  });
  return true;
}

module.exports = { handleMcpRegistryCommand };
