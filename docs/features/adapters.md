# Adapters Integration

SUPERCLI acts as a universal frontend proxy that translates semantic commands (e.g., `aws instances list`) into specific backend protocol requests via adapters.

## Key Features

- **HTTP Adapter**: Directly invokes external REST APIs with configured methods, headers, and interpolated path/query parameters.
- **OpenAPI Adapter**: Given a registered OpenAPI spec URL, maps a SUPERCLI command dynamically to an OpenAPI operation, handling auth and schema resolution on the fly.
- **MCP Adapter (Model Context Protocol)**: Connects to local or remote MCP servers to trigger their exposed tools. Supports HTTP endpoints and local `stdio` execution (`command` + `args`).
- **Local MCP Registry**: Decouples MCP tool integration from the backend server by maintaining MCP server entries in `~/.supercli/config.json`.

## Usage

```bash
# The adapter is chosen when commands are bound. For example MCP management:

# List offline/local MCP servers registered in the config
supercli mcp list

# Add an offline local MCP stdio server
supercli mcp add summarize-local --url http://127.0.0.1:8787

# Add a stdio bridge for remote SSE MCP servers (browser-use style)
supercli mcp add browser-use --command npx \
  --args-json '["mcp-remote","https://api.browser-use.com/mcp","--header","X-Browser-Use-API-Key: your-api-key"]'

# Execute an MCP tool via the bound alias
supercli ai text summarize --text "Hello world"
```
