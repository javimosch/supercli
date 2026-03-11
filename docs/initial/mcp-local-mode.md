# MCP Local Mode

SUPERCLI supports MCP command execution in CLI-local mode without a running SUPERCLI server.

## Local MCP Resolution Order

For `adapter: mcp`, SUPERCLI resolves the tool endpoint in this order:

1. `adapterConfig.command` (stdio command)
2. `adapterConfig.url` (direct HTTP MCP endpoint)
3. Local cache entry in `mcp_servers` by `adapterConfig.server`
4. Remote `/api/mcp` lookup only when `SUPERCLI_SERVER` is set

## Manage Local MCP Registry

```bash
supercli mcp list
supercli mcp add summarize-local --url http://127.0.0.1:8787
supercli mcp add browser-use --command npx --args-json '["mcp-remote","https://api.browser-use.com/mcp","--header","X-Browser-Use-API-Key: your-api-key"]'
supercli mcp remove summarize-local
```

These commands only update local cache (`~/.supercli/config.json`).

Local config also accepts a Claude-style `mcpServers` object and normalizes it to `mcp_servers` internally.

## Demo: `ai text summarize` with stdio MCP (no server)

From the repository root:

```bash
node examples/mcp-stdio/install-demo.js
supercli ai text summarize --text "Hello world from local stdio mcp" --json
```

Expected output shape:

```json
{
  "version": "1.0",
  "command": "ai.text.summarize",
  "duration_ms": 12,
  "data": {
    "tool": "summarize",
    "mode": "stdio",
    "result": "Hello world from local stdio mcp"
  }
}
```

## Demo Files

- `examples/mcp-stdio/server.js` — mock stdio MCP server implementing tool `summarize`
- `examples/mcp-stdio/install-demo.js` — installs local demo command `ai.text.summarize`

For remote MCP over HTTP + SSE, see `docs/mcp-sse-mode.md`.
