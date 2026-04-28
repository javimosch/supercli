---
name: supercli-mcp-dev
description: Use this skill when working on MCP (Model Context Protocol) features in supercli — implementing adapters, adding SSE support, working with mcp-proxy, or managing MCP server connections. Covers MCP adapter architecture, transport modes, JSON-RPC format, and server/client integration.
---

# Supercli MCP Development

Work on MCP (Model Context Protocol) features in supercli including adapter implementation, SSE streaming support, and server integration.

## MCP Adapter Architecture

The MCP adapter (`cli/adapters/mcp.js`) supports multiple transport modes:

### Transport Modes

1. **HTTP/SSE MCP**: HTTP-based MCP servers with SSE streaming
2. **Stdio MCP with Daemon**: Local stdio MCP servers routed through daemon
3. **Stdio MCP Direct**: Direct stdio calls (may have compatibility issues)

### Key Components

- **`execute()`**: Main entry point, routes to appropriate transport
- **`callHttpMcpTool()`**: HTTP/SSE MCP handler with JSON-RPC support
- **`parseSseResponse()`**: SSE event parser
- **`callStdioTool()`**: Direct stdio execution
- **`stdioCallToolJsonRpc()`**: Stdio JSON-RPC protocol handler
- **`callDaemonTool()`**: Daemon-routed stdio calls

## HTTP/SSE Implementation

### Request Format

Uses JSON-RPC 2.0 format for HTTP MCP calls:

```javascript
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": toolName,
    "arguments": input
  },
  "id": 1
}
```

### Headers

Must include both content types for SSE negotiation:

```javascript
{
  "Content-Type": "application/json",
  "Accept": "text/event-stream, application/json"
}
```

### SSE Response Parsing

Parses Server-Sent Events format:
- Lines starting with `event:` define event type
- Lines starting with `data:` contain event data
- Empty lines terminate events
- Accumulates chunks and returns final result

### Auto-detection

Automatically detects SSE responses via `Content-Type` header and falls back to JSON if not SSE.

## Stdio MCP with Daemon

### Configuration

```json
{
  "adapterConfig": {
    "server": "mcp-server-name",
    "tool": "tool-name",
    "stateful": true,
    "timeout_ms": 60000
  }
}
```

### Daemon Client

- File: `cli/mcp-daemon-client.js`
- Functions: `callDaemonTool()`, `listDaemonTools()`
- Maintains persistent sessions for stateful MCP servers
- **Daemon runs on CLI side** (not server) - starts on-demand when first command with `stateful: true` is executed via CLI
- Runs as detached background process with Unix socket at `~/.supercli/mcp-daemon.sock`
- Persists across command executions to maintain MCP server sessions
- Better for long-running stdio MCP servers

**Daemon Lifecycle:**
- Auto-starts on first CLI command execution (checks socket, spawns daemon if not running)
- Server UI only stores configuration; CLI syncs and executes
- Manual control: `supercli mcp daemon start/stop/status`
- Detached process (unref) - doesn't block CLI
- 5-second startup timeout with retry checks

## mcp-proxy Integration

### What is mcp-proxy?

Transforms stdio MCP servers into HTTP/SSE endpoints. Useful for:
- Exposing local stdio MCPs over HTTP
- Testing MCP tools via HTTP clients
- Bridging stdio to SSE transport

### Usage Pattern

```bash
# Start mcp-proxy
npx -y mcp-proxy --port 3002 -- npx -y @andredezzy/deep-directory-tree-mcp

# Add to supercli
supercli server mcp add '{"name":"deep-tree","url":"http://localhost:3002"}'

# Create command
supercli server commands add '{"namespace":"tree","resource":"deep","action":"list","adapter":"mcp","adapterConfig":{"url":"http://localhost:3002","tool":"get_deep_directory_tree"}}'

# Sync and use
supercli sync
supercli tree deep list --path /some/dir --depth 3
```

### mcp-proxy Options

- `--port`: Port to listen on (default: 8080)
- `--streamEndpoint`: HTTP endpoint path (default: /mcp)
- `--stateless`: Disable session management
- `--sseEndpoint`: SSE endpoint path (default: /sse)

## Server-Side MCP Management

### Server Routes

- `POST /api/mcp`: Add MCP server
- `GET /api/mcp`: List MCP servers
- `DELETE /api/mcp/:name`: Remove MCP server

### MCP Server Entry Format

```json
{
  "name": "server-name",
  "url": "http://localhost:3002",
  "command": "npx -y @package",
  "args": ["--arg1", "--arg2"],
  "stateful": true,
  "timeout_ms": 60000,
  "headers": {},
  "env": {}
}
```

### Server UI

- `/mcp`: MCP server management UI
- Add/remove servers
- View server status
- Test MCP tools

## Client-Side MCP Usage

### Command Configuration

```json
{
  "namespace": "mcp",
  "resource": "server",
  "action": "tool",
  "adapter": "mcp",
  "adapterConfig": {
    "server": "mcp-server-name",
    "tool": "tool-name",
    "stateful": true
  }
}
```

### Argument Passing

Use space syntax for CLI arguments:
- ✅ `supercli tree deep list --path /dir --depth 2`
- ❌ `supercli tree deep list --path=/dir --depth=2`

The supercli argument parser treats `--key=value` as a boolean flag with key=`key=value`, not as a key-value pair.

## Testing MCP Integration

### Test with mcp-proxy

```bash
# Start proxy
npx -y mcp-proxy --port 3002 -- npx -y @andredezzy/deep-directory-tree-mcp

# List tools
curl http://localhost:3002/tool -X POST \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream, application/json" \
  -d '{"jsonrpc":"2.0","method":"tools/list","id":1}'

# Call tool
curl http://localhost:3002/tool -X POST \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream, application/json" \
  -d '{"jsonrpc":"2.0","method":"tools/call","params":{"name":"tool-name","arguments":{}},"id":1}'
```

### Test with Daemon

```bash
# Test daemon connection
node cli/mcp-daemon-client.js

# List tools via daemon
# (daemon client handles this internally)
```

## Common Issues

### "Not Acceptable: Client must accept both application/json and text/event-stream"

**Cause**: mcp-proxy requires SSE Accept header.

**Fix**: Ensure MCP adapter sends `Accept: text/event-stream, application/json`.

### "Parse error: Invalid JSON-RPC message"

**Cause**: Wrong request format for HTTP MCP.

**Fix**: Use JSON-RPC 2.0 format with `jsonrpc`, `method`, `params`, and `id` fields.

### "Tool not found"

**Cause**: Incorrect tool name or tool not exposed by MCP server.

**Fix**: Use `tools/list` method to discover available tool names.

### "Input validation error"

**Cause**: Arguments not passed correctly or in wrong format.

**Fix**: Use space syntax (`--key value`) and verify argument schema matches tool expectations.

## File Locations

- **MCP Adapter**: `cli/adapters/mcp.js`
- **Daemon Client**: `cli/mcp-daemon-client.js`
- **Stdio JSON-RPC**: `cli/mcp-stdio-jsonrpc.js`
- **Server MCP Routes**: `server/routes/mcp.js`
- **Server MCP Service**: `server/services/mcpService.js`

## Development Workflow

1. Implement MCP adapter changes
2. Test with local stdio MCP or mcp-proxy
3. Update docs/server.md with new features
4. Update supercli-cli-admin-cheatsheet skill
5. Test via CLI commands
6. Verify server UI integration

## Future Enhancements

- **Streaming output**: Implement `--stream` flag for incremental SSE output
- **Session management**: Add automatic session ID handling for stateful HTTP MCP
- **Tool discovery**: Auto-discover tools from MCP servers
- **Schema validation**: Validate arguments against tool input schemas
