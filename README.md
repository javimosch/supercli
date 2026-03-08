# DCLI — Dynamic CLI - SuperCLI - SCLI

Config-driven, AI-friendly CLI that dynamically generates commands from cloud configuration.

## Architecture

```
         Web UI (EJS + Vue3 + DaisyUI)
                    │
                REST API
                    │
           NodeJS + MongoDB
                    │
              CLI Runtime
                    │
          ┌────────┼────────┐
       OpenAPI    HTTP     MCP
       Adapter   Adapter  Adapter
```

## Quick Start

```bash
# Quick usage (no install, local-only by default)
npx dcli help
npx dcli skills teach

# Install
npm install

# Configure (copy and edit)
cp .env.example .env

# Start server (defaults to local JSON files, no MongoDB required!)
npm start
# Or alternatively, start via CLI:
# dcli --server

# Open Web UI
open http://localhost:3000

# CLI usage
node cli/dcli.js help
node cli/dcli.js commands
node cli/dcli.js <namespace> <resource> <action> [--args]

# Optional: sync commands from a remote DCLI server
export DCLI_SERVER=http://localhost:3000
node cli/dcli.js sync
```

## CLI Usage

```bash
# Discovery
dcli help                              # List namespaces
dcli <namespace>                       # List resources
dcli <namespace> <resource>            # List actions

# Inspection
dcli inspect <ns> <res> <act>          # Command details + schema
dcli <ns> <res> <act> --schema         # Input/output schema

# Execution
dcli <ns> <res> <act> --arg value      # Execute command
dcli <ns> <res> <act> --compact        # Token-optimized output

# Plans (DAG)
dcli plan <ns> <res> <act> [--args]    # Dry-run execution plan
dcli execute <plan_id>                 # Execute stored plan

# Skills (LLM bootstrap)
dcli skills list --json                # Minimal skill metadata (name, description)
dcli skills get <ns.res.act>           # Emit SKILL.md (default format)
dcli skills teach                      # Emit starter meta-skill (default format)
dcli skills get <ns.res.act> --show-dag

# Natural Language (AI)
export OPENAI_BASE_URL=https://api.openai.com/v1     # Enable local AI resolution
dcli ask "list the posts and summarize them"         # Execute natural language queries

# Config & Server
dcli sync                              # Sync local cache from DCLI_SERVER (when set)
dcli config show                       # Show cache info
dcli --server                          # Start the DCLI backend server directly

# Local MCP registry (no server required)
dcli mcp list
dcli mcp add summarize-local --url http://127.0.0.1:8787
dcli mcp remove summarize-local

# Stdio MCP demo (no server required)
node examples/mcp-stdio/install-demo.js
dcli ai text summarize --text "Hello world" --json

# Remote MCP SSE/HTTP demo
node examples/mcp-sse/server.js
node examples/mcp-sse/install-demo.js
dcli ai text summarize_remote --text "Hello world" --json

# Agent capability discovery
dcli --help-json                       # Machine-readable capabilities
```

## Output Modes

| Flag        | Output                                    |
|-------------|-------------------------------------------|
| (default)   | JSON if piped, human-readable if TTY      |
| `--json`    | Structured JSON envelope                  |
| `--human`   | Formatted tables and key-value output     |
| `--compact` | Compressed JSON (shortened keys)          |

## Output Envelope

Every command returns a deterministic envelope:

```json
{
  "version": "1.0",
  "command": "namespace.resource.action",
  "duration_ms": 42,
  "data": { ... }
}
```

## Exit Codes

| Code    | Type                | Action                     |
|---------|---------------------|----------------------------|
| 0       | success             | Proceed                    |
| 82      | validation_error    | Fix input                  |
| 85      | invalid_argument    | Fix argument               |
| 92      | resource_not_found  | Try different resource     |
| 105     | integration_error   | Retry with backoff         |
| 110     | internal_error      | Report bug                 |

## API Endpoints

| Method | Endpoint                      | Description              |
|--------|-------------------------------|--------------------------|
| GET    | `/api/config`                 | Full CLI config          |
| GET    | `/api/tree`                   | List namespaces          |
| GET    | `/api/tree/:ns`               | List resources           |
| GET    | `/api/tree/:ns/:res`          | List actions             |
| GET    | `/api/command/:ns/:res/:act`  | Full command spec        |
| CRUD   | `/api/commands`               | Manage commands          |
| CRUD   | `/api/specs`                  | Manage OpenAPI specs     |
| CRUD   | `/api/mcp`                    | Manage MCP servers       |
| CRUD   | `/api/plans`                  | Execution plans          |
| GET    | `/api/jobs`                   | Execution history        |
| GET    | `/api/jobs/stats`             | Aggregate stats          |

## Adapters

- **http** — Raw HTTP requests (method, url, headers)
- **openapi** — Resolves operation from OpenAPI spec
- **mcp** — Calls MCP server tools (supports both HTTP endpoints and local Stdio processes)

## Tech Stack

- NodeJS + Express
- Pluggable KV Storage (Local JSON files by default, MongoDB optional)
- EJS + Vue3 CDN + Tailwind CDN + DaisyUI CDN
- Zero build tools

## Contributors

Contributions are welcome! If you have ideas for improvements, new adapters, or bug fixes, just send a Pull Request (PR) and I will review it.

## License

MIT
