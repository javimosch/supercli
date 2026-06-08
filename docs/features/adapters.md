# Adapters Integration

supercli acts as a universal frontend proxy that translates semantic commands (e.g., `aws instances list`) into specific backend protocol requests via adapters. Each adapter bridges a different external system into supercli's unified capability graph.

## Adapter Types

| Adapter | Protocol | Best For | Notes |
|---------|----------|----------|-------|
| **HTTP** | REST APIs | Direct API calls with custom auth | Supports all HTTP methods, headers, body templates |
| **OpenAPI** | OpenAPI/Swagger specs | Auto-generating commands from API specs | Dynamic command generation from spec URLs |
| **MCP** | Model Context Protocol | AI tool integration | Supports HTTP/SSE and stdio transports |
| **Process** | CLI binaries | Wrapping external CLI tools | Most common adapter (~90% of plugins) |
| **Shell** | Bash scripts | Quick script execution | Requires `unsafe: true` for security policy |
| **Custom** | JavaScript (vm2) | User-defined execution logic | Sandboxed, supports npm packages |

## HTTP Adapter

The HTTP adapter directly invokes external REST APIs with configurable methods, headers, and parameter interpolation.

### Configuration

```json
{
  "adapter": "http",
  "adapterConfig": {
    "url": "https://api.example.com/v1/users",
    "method": "GET",
    "headers": {
      "Authorization": "Bearer {{token}}",
      "Content-Type": "application/json"
    },
    "queryParams": {
      "page": "{{page}}",
      "limit": "{{limit}}"
    },
    "body": {
      "name": "{{name}}"
    },
    "timeout_ms": 10000
  }
}
```

### Supported Methods

- `GET` — Retrieve resources
- `POST` — Create resources
- `PUT` — Update resources (full replacement)
- `PATCH` — Partial updates
- `DELETE` — Remove resources

### Parameter Interpolation

Use `{{variable}}` syntax to reference command arguments:

```bash
# Command
supercli myapi users get --user-id 123

# Interpolated URL
https://api.example.com/v1/users/123
```

## OpenAPI Adapter

The OpenAPI adapter dynamically generates commands from registered OpenAPI/Swagger specifications. Upload a spec and supercli auto-generates commands for all endpoints.

### Usage

```bash
# Upload an OpenAPI spec
supercli openapi add https://petstore3.swagger.io/api/v3/openapi.json

# List generated commands
supercli openapi list

# Execute a generated command
supercli openapi pet listPets --limit 10
```

### Features

- **Auto-generation**: Commands created from spec endpoints
- **Schema validation**: Arguments validated against spec schemas
- **Auth handling**: Supports OAuth, API keys, and bearer tokens
- **Path interpolation**: Path parameters mapped from command args

## MCP Adapter (Model Context Protocol)

The MCP adapter connects to local or remote MCP servers to expose their tools as supercli commands. Supports both HTTP/SSE and stdio transports.

### Transport Modes

#### HTTP/SSE Transport
For remote MCP servers accessible via HTTP:

```json
{
  "adapter": "mcp",
  "adapterConfig": {
    "url": "http://localhost:3002",
    "tool": "get_deep_directory_tree",
    "timeout_ms": 30000
  }
}
```

#### Stdio Transport
For local MCP servers using standard I/O:

```json
{
  "adapter": "mcp",
  "adapterConfig": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-filesystem"],
    "tool": "read_file",
    "timeout_ms": 30000
  }
}
```

### MCP Server Management

```bash
# List registered MCP servers
supercli mcp list

# Add HTTP/SSE MCP server
supercli mcp add my-server --url http://localhost:3002

# Add stdio MCP server
supercli mcp add local-server --command npx --args-json '["-y", "@modelcontextprotocol/server-filesystem"]'

# Remove MCP server
supercli mcp remove my-server
```

## Process Adapter

The process adapter is the most common, wrapping external CLI binaries. Used by ~90% of plugins.

### Configuration

```json
{
  "adapter": "process",
  "adapterConfig": {
    "command": "git",
    "baseArgs": ["status"],
    "positionalArgs": ["path"],
    "optionalArgs": {
      "branch": "--branch"
    },
    "jsonFlag": "--json",
    "parseJson": true,
    "timeout_ms": 5000
  }
}
```

### Options

| Key | Type | Description |
|-----|------|-------------|
| `command` | string | Binary name to execute |
| `baseArgs` | string[] | Default arguments |
| `positionalArgs` | string[] | Map args to CLI positional args |
| `optionalArgs` | object | Map args to CLI flags |
| `jsonFlag` | string | Flag for JSON output |
| `parseJson` | boolean | Parse CLI output as JSON |
| `passthrough` | boolean | Pass all args directly to CLI |
| `timeout_ms` | number | Execution timeout |

## Shell Adapter

The shell adapter executes bash scripts with argument interpolation. Requires `unsafe: true` for security policy.

### Configuration

```json
{
  "adapter": "shell",
  "adapterConfig": {
    "script": "echo 'Hello {{name}}' && ls -la {{path}}",
    "unsafe": true,
    "timeout_ms": 5000
  }
}
```

### Security Note

Shell adapter requires `adapterConfig.unsafe=true` because it executes arbitrary bash scripts. Only use with trusted scripts.

## Custom Adapters

User-defined JavaScript functions running in a sandboxed vm2 environment. Supports npm packages and two execution contexts.

### Server Context

Runs on the supercli server:

```javascript
async function execute(cmd, flags, context) {
  const result = await fetch('https://api.example.com/data');
  return { success: true, data: await result.json() };
}
module.exports = { execute };
```

### CLI Context

Syncs to local CLI via `supercli sync`, executes locally:

```javascript
async function execute(cmd, flags, context) {
  const fs = require('fs');
  const data = fs.readFileSync('/local/file.json', 'utf8');
  return { success: true, data: JSON.parse(data) };
}
module.exports = { execute };
```

### Security

Custom adapters run in vm2 sandbox with:
- Configurable timeout (prevents infinite loops)
- Memory limits (prevents exhaustion)
- Optional network access
- Console output suppression

## Adapter Selection Guide

| Use Case | Recommended Adapter | Example |
|----------|---------------------|---------|
| Wrapping a CLI tool | Process | `git`, `docker`, `kubectl` |
| Calling a REST API | HTTP | GitHub API, Stripe API |
| Auto-generating from API spec | OpenAPI | Swagger, OpenAPI 3.0 |
| Integrating AI tools | MCP | Claude tools, GPT plugins |
| Quick script execution | Shell | Build scripts, utilities |
| Complex custom logic | Custom | Database queries, file processing |

## Examples

### GitHub API via HTTP

```json
{
  "namespace": "github",
  "resource": "repos",
  "action": "list",
  "adapter": "http",
  "adapterConfig": {
    "url": "https://api.github.com/user/repos",
    "method": "GET",
    "headers": {
      "Authorization": "Bearer {{token}}",
      "Accept": "application/vnd.github.v3+json"
    },
    "queryParams": {
      "per_page": "{{limit}}",
      "sort": "updated"
    },
    "parseJson": true
  }
}
```

### MCP Tool via Stdio

```json
{
  "namespace": "filesystem",
  "resource": "read",
  "action": "file",
  "adapter": "mcp",
  "adapterConfig": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-filesystem"],
    "tool": "read_file",
    "parseJson": true
  }
}
```

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| Adapter not found | Invalid adapter name | Check adapter type in command config |
| Timeout errors | Operation too slow | Increase `timeout_ms` in adapterConfig |
| JSON parse errors | Output not valid JSON | Verify `parseJson: true` and CLI output format |
| MCP connection refused | Server not running | Ensure MCP server is accessible |
| Shell script fails | Missing `unsafe: true` | Add `adapterConfig.unsafe: true` |
