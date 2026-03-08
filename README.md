# SuperACLI - SuperCLI - DCLI - Super Agentic CLI

Config-driven, AI-friendly CLI that dynamically generates commands from cloud configuration.

## BIN Aliases

- dcli (Original CLI)
- supercli (Brand)
- scli (Brand smaller)
- superacli (What was available) (Super Agent/ic CLI)

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
npx supercli help
npx supercli skills teach

# Install
npm install

# Configure (copy and edit)
cp .env.example .env

# Start server (defaults to local JSON files, no MongoDB required!)
npm start
# Or alternatively, start via CLI:
# supercli --server

# Open Web UI
open http://localhost:3000

# CLI usage
node cli/supercli.js help
node cli/supercli.js commands
node cli/supercli.js <namespace> <resource> <action> [--args]

# Optional: sync commands from a remote SuperCLI server
export SUPERCLI_SERVER=http://localhost:3000
node cli/supercli.js sync
```

## CLI Usage

```bash
# Discovery
supercli help                              # List namespaces
supercli <namespace>                       # List resources
supercli <namespace> <resource>            # List actions

# Inspection
supercli inspect <ns> <res> <act>          # Command details + schema
supercli <ns> <res> <act> --schema         # Input/output schema

# Execution
supercli <ns> <res> <act> --arg value      # Execute command
supercli <ns> <res> <act> --compact        # Token-optimized output

# Plans (DAG)
supercli plan <ns> <res> <act> [--args]    # Dry-run execution plan
supercli execute <plan_id>                 # Execute stored plan

# Skills (LLM bootstrap)
supercli skills list --json                # Minimal skill metadata (name, description)
supercli skills get <ns.res.act>           # Emit SKILL.md (default format)
supercli skills teach                      # Emit starter meta-skill (default format)
supercli skills get <ns.res.act> --show-dag

# Natural Language (AI)
export OPENAI_BASE_URL=https://api.openai.com/v1     # Enable local AI resolution
supercli ask "list the posts and summarize them"         # Execute natural language queries

# Config & Server
supercli sync                              # Sync local cache from SUPERCLI_SERVER (when set)
supercli config show                       # Show cache info
supercli --server                          # Start the SuperCLI backend server directly

# Local MCP registry (no server required)
supercli mcp list
supercli mcp add summarize-local --url http://127.0.0.1:8787
supercli mcp remove summarize-local

# Plugins
supercli plugins list
supercli plugins install beads
supercli plugins show beads
supercli beads install steps --json

# Stdio MCP demo (no server required)
node examples/mcp-stdio/install-demo.js
supercli ai text summarize --text "Hello world" --json

# Remote MCP SSE/HTTP demo
node examples/mcp-sse/server.js
node examples/mcp-sse/install-demo.js
supercli ai text summarize_remote --text "Hello world" --json

# Agent capability discovery
supercli --help-json                       # Machine-readable capabilities
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
