# Server

The supercli server provides a web UI for managing custom commands, OpenAPI specs, MCP servers, plugins, and viewing execution history.

## Federation topology

The server is the hub of a multi-machine deployment: one central instance
holds the command/plugin/spec registry, and workers point at it.

| Machine | Runs | Role |
|---|---|---|
| Hub (e.g. cloud VM) | `sc --server` (`PORT` env, default 3000) | Central registry, `/api/jobs` ingest, dashboard |
| Worker | `SUPERCLI_SERVER=http://hub:3000` + `sc sync` | Pulls command/plugin config down |
| Worker | `sc daemon start` | Bookkeeper ships `~/.supercli/logs/*.jsonl` up to `POST /api/jobs` |

Data flow: config (commands, specs, MCP, adapters) flows **down** via
`sc sync`; execution history flows **up** via the daemon's job shipping.
Workers authenticate to the API with `SUPERCLI_API_KEY` (sent as the
`X-API-Key` header); mint keys on the hub at `/api-keys`. Without an API
key requirement (`admin_mode_enabled` or `public_access` in settings),
all API routes are open.

The dashboard at `/` is an operator convenience — browser navigation is
unauthenticated HTML, while the same operations are JSON routes under
`/api/*`, so agents can drive the hub without the UI.

Discovery surfaces on the hub: `GET /api` returns a JSON route index with
auth requirements, `GET /llms.txt` a plain-text summary for agents, and
`GET /api/dashboard?format=json` the aggregated stats (including the
`workers` list — every client that heartbeat or shipped a job). Workers
keep presence fresh via `POST /api/clients/heartbeat {client_id,
hostname, sc_version}`, sent automatically each sync cycle by `sc
daemon`. `sc server status` probes reachability, auth mode, and the
worker's own `client_id`.

Without `SUPERCLI_SERVER` set on a worker, `sc` works fully offline —
the daemon's sync loop simply has nowhere to ship, and the serve surface
still answers `/_health`/`/_shutdown` for lifecycle management.

## Commands

Create and manage custom commands through the server UI at `/commands`. Commands are indexed as `namespace.resource.action` and sync to the CLI via `supercli sync`.

### Shell Adapter

The shell adapter executes bash scripts with argument interpolation. Use `{{variable}}` syntax to reference command arguments:

```json
{
  "script": "echo 'Hello {{name}}'",
  "timeout_ms": 5000,
  "unsafe": true
}
```

Arguments defined in the command schema are interpolated before execution. For example, with an argument named `name`:

- Command: `supercli system test foo --name Pedro`
- Interpolated script: `echo 'Hello Pedro'`

**Important:** Shell adapter requires `adapterConfig.unsafe=true` for security policy reasons.

### Other Adapters

- **http**: Raw HTTP requests with customizable method, headers, and body
- **openapi**: Auto-generates commands from OpenAPI specifications
- **mcp**: Exposes MCP server tools as commands
- **process**: Spawns external processes with arguments
- **custom**: User-defined JavaScript functions

## OpenAPI

Manage OpenAPI specifications at `/specs`. Upload OpenAPI/Swagger JSON or YAML files to auto-generate command definitions for all endpoints.

## MCP

Manage Model Context Protocol server connections at `/mcp`. Connect to MCP servers via SSE or stdio to expose their tools as supercli commands.

### MCP Transport Modes

The supercli MCP adapter supports multiple transport modes:

#### HTTP/SSE MCP
- Use `adapterConfig.url` for HTTP-based MCP servers
- Supercli MCP adapter automatically supports SSE streaming
- Sends `Accept: text/event-stream, application/json` header
- Parses SSE responses and returns accumulated results
- Uses JSON-RPC 2.0 format for requests

Example configuration:
```json
{
  "adapterConfig": {
    "url": "http://localhost:3002",
    "tool": "get_deep_directory_tree"
  }
}
```

#### Stdio MCP with Daemon
- Use `adapterConfig.server` + `adapterConfig.stateful: true` for stdio MCPs
- Best for local stdio MCP servers
- Routes through MCP daemon for stateful stdio handling
- **Daemon runs on CLI side** (not server) - starts on-demand when first command is executed via CLI
- Daemon runs as detached background process with Unix socket at `~/.supercli/mcp-daemon.sock`
- Persists across command executions to maintain MCP server sessions
- Manual control: `supercli mcp daemon start/stop/status`

Example configuration:
```json
{
  "adapterConfig": {
    "server": "deep-directory-tree",
    "tool": "tool_name",
    "stateful": true,
    "timeout_ms": 60000
  }
}
```

#### Stdio MCP Direct
- Use `adapterConfig.command` for direct stdio calls
- May have compatibility issues with different MCP implementations

### Using mcp-proxy with Supercli

The mcp-proxy tool transforms stdio MCPs into HTTP/SSE. Here's how to use it:

1. Start mcp-proxy:
```bash
npx -y mcp-proxy --port 3002 -- npx -y @andredezzy/deep-directory-tree-mcp
```

2. Add MCP server to supercli:
```bash
supercli server mcp add '{"name":"deep-tree","url":"http://localhost:3002"}'
```

3. Create command:
```bash
supercli server commands add '{"namespace":"tree","resource":"deep","action":"list","adapter":"mcp","adapterConfig":{"url":"http://localhost:3002","tool":"get_deep_directory_tree"}}'
```

4. Sync and use:
```bash
supercli sync
supercli tree deep list --path /some/dir --depth 3
```

**Note:** Use space syntax for arguments: `--path /dir` not `--path=/dir`

### MCP Adapter Features

- **Auto-detection**: Automatically detects SSE responses and falls back to JSON
- **JSON-RPC Support**: Uses JSON-RPC 2.0 format for HTTP MCP calls
- **SSE Parsing**: Parses Server-Sent Events and accumulates results
- **Stream Flag**: Reserved for future streaming output support (`--stream`)

## Plugins

Manage server plugins at `/plugins`. Upload plugin ZIP files, enable/disable plugins, and view plugin manifests. Server plugins extend CLI capabilities with custom commands and harnesses.

## Jobs

View command execution history at `/jobs`. Tracks all command executions with timestamps, duration, status, and output for debugging and observability.
