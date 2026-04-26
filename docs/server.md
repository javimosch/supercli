# Server

The supercli server provides a web UI for managing custom commands, OpenAPI specs, MCP servers, plugins, and viewing execution history.

## Commands

Create and manage custom commands through the server UI at `/commands`. Commands are indexed as `namespace.resource.action` and sync to the CLI via `sc sync`.

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

- Command: `sc system test foo --name Pedro`
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

## Plugins

Manage server plugins at `/plugins`. Upload plugin ZIP files, enable/disable plugins, and view plugin manifests. Server plugins extend CLI capabilities with custom commands and harnesses.

## Jobs

View command execution history at `/jobs`. Tracks all command executions with timestamps, duration, status, and output for debugging and observability.
