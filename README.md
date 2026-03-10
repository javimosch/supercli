# supercli — Universal Skill Router for AI Agents

Discover and execute skills across CLIs, APIs, MCP servers, workflows, and custom automations through a single agent-friendly interface.

## BIN Aliases

- dcli (Original CLI)
- supercli (Brand)
- scli (Brand smaller)
- superacli (What was available) (Super Agent/ic CLI)
- sc (For lazy people)

## What Is a Skill Layer?

Everything the system exposes becomes a **skill**:

| Source | Turns into |
| --- | --- |
| CLI command | Skill |
| OpenAPI endpoint | Skill |
| MCP tool | Skill |
| HTTP request | Skill |
| Workflow / plan step | Skill |

Agents query the skill layer once, and supercli handles discovery, routing, and execution across every connected ecosystem. Skills are addressable (e.g., `beads.issue.list` or `docker.container.ps`), searchable, and consistently described so agents never need bespoke integrations per tool.

### Core Responsibilities

1. **Discovery** – build a real-time catalog of skills across bundled harnesses, adapters, and plugins.
2. **Routing** – resolve the right execution adapter (CLI, HTTP, MCP, custom runtime) from an incoming skill ID.
3. **Execution** – normalize inputs/outputs, enforce envelopes, and surface deterministic status codes.
4. **Extension** – let teams add new skills by dropping in manifests, OpenAPI specs, or plugin harnesses.

Example skill executions:

```bash
supercli beads issue list              # Calls beads skill adapter
supercli gwc drive files list          # Calls Google Workspace adapter
supercli docker container ps           # Calls Docker plugin (when installed)
```

## Skill Sources

supercli generates skills from six primary channels:

- **Bundled Harnesses** – beads (tasks/issues), gwc (Google Workspace), commiat (commit automation)
- **Built-in Adapters** – OpenAPI specs, raw HTTP integrations, MCP (Model Context Protocol) servers
- **Plugin Harnesses** – community or internal CLIs installed via `supercli plugins install`
- **AI & Plans** – natural-language `ask` commands create execution DAGs composed of skills
- **Workflows** – repeatable plans and stored executions referenced as skills
- **Future Extensions** – popular CLIs such as gh, aws, docker, kubectl, terraform, etc.

## Architecture

```
           Agents / Humans
                  │
            supercli runtime
                  │
            Skill Discovery Layer
                  │
             Skill Router Core
                  │
   ┌──────────────┼──────────────┬───────────────┐
   │              │              │               │
 CLI Harnesses  OpenAPI / HTTP  MCP Servers   Workflows / Plugins
```

The router intelligently:
- **Discovers** available skills from every adapter and caches metadata for fast lookup
- **Routes** commands to the correct harness based on namespace and capability metadata
- **Executes** with unified error handling, envelopes, and output formatting
- **Surfaces** machine-readable descriptions so agents can plan against the skill graph

## Why Skills Matter

Traditional CLIs force agents to learn tool-specific syntax. supercli replaces that effort with a discoverable skill graph so agents can:

- Search (`supercli skills search "database"`) to find relevant capabilities instantly
- Inspect (`supercli skills get beads.issue.create`) to pull schema-rich metadata
- Compose (`supercli plan …`) to build DAGs out of skills without writing glue code
- Delegate execution to the same router regardless of whether the source is a CLI, API, or MCP tool

## Skill Mesh Vision

supercli is steadily evolving toward a broader **skill mesh** that provides discovery, routing, execution, composition, and governance across every tool in the stack. Near-term focus areas include:

- **Deeper skill registry** with richer metadata, tagging, and policy controls
- **Graph-native discovery** so agents can traverse related skills and capability clusters
- **Execution DAG observability** for multi-skill plans with retries and status streaming
- **Agent endpoints** that expose the router over HTTP/webhooks for direct agent access beyond the CLI

These directional goals keep the README aligned with the system’s trajectory without overpromising unshipped features.

## Quick Start

```bash
# Quick usage (no install, local-only by default)
npx supercli help                      # List available harnesses
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

# CLI usage - Multi-harness routing
supercli help                          # List all harnesses
supercli beads                         # List beads skills
supercli gwc                           # List Google Workspace skills
supercli beads issue list              # Execute beads command
supercli gwc drive files list          # Execute Google Workspace command

# Skills discovery across harnesses
supercli skills list                   # All skills from all harnesses
supercli skills search "database"      # Full-text search across harnesses

# AI-driven multi-harness execution
supercli ask "show my tasks and recent commits"

# Manage plugin harnesses
supercli plugins list
supercli plugins explore               # Browse available plugins
supercli plugins install commiat       # Install community plugin
```

## CLI Usage

### Multi-Harness Routing

```bash
# Basic harness routing
supercli <harness>                          # List skills in harness
supercli <harness> <skill-group> <action>   # Execute skill

# Examples across different harnesses
supercli beads issue create --title "Fix bug"
supercli beads issue list --status open
supercli gwc drive files list --limit 10
supercli commiat validate --commit-msg "my message"

# Discovery
supercli help                              # List all harnesses
supercli skills list                       # List all skills from all harnesses
supercli skills search --harness beads     # Search within harness
supercli skills search "database"          # Full-text search across harnesses

# Inspection
supercli inspect beads issue create        # Command details + schema
supercli skills get beads.issue.create     # Get skill metadata

# Execution
supercli beads issue create --title "New task"      # Standard execution
supercli beads issue list --json                    # JSON output
supercli beads issue list --compact                 # Token-optimized output

# Plans (DAG execution)
supercli plan beads issue create --title "Task"     # Dry-run execution plan
supercli execute <plan_id>                         # Execute stored plan

# Natural Language (AI)
export OPENAI_BASE_URL=https://api.openai.com/v1   # Enable AI resolution
supercli ask "list my tasks and summarize them"     # Execute across harnesses

# Config & Server
supercli sync                              # Sync local cache from server
supercli config show                       # Show cache info
supercli --server                          # Start backend server

# Plugin Harness Management
supercli plugins list                      # List installed harnesses
supercli plugins explore                   # Browse plugin registry
supercli plugins explore --tags git,ai     # Search registry by tags
supercli plugins install commiat           # Install from registry
supercli plugins install --git https://github.com/org/repo.git --ref main
supercli plugins show commiat              # Show harness details
supercli plugins doctor commiat            # Check harness health
```

### Built-in Adapters

```bash
# Local MCP registry (no server required)
supercli mcp list
supercli mcp add summarize-local --url http://127.0.0.1:8787
supercli mcp remove summarize-local

# Stdio MCP demo
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

## Plugins as Harnesses

A **plugin harness** bridges dcli to an external CLI tool. Each plugin:
- Defines a manifest (`plugin.json`) with available commands
- Maps CLI arguments to dcli's command structure
- Supports command wrapping, passthrough, remote skills catalogs, or any combination of those patterns
- Includes dependency checks and installation guidance

### Currently Supported Harnesses

**Bundled with dcli:**
- **beads** (`br`) — Task/issue management via beads_rust
- **gwc** (`gws`) — Google Workspace CLI with full passthrough
- **commiat** — Commit automation with full passthrough

**Built-in Adapters:**
- **OpenAPI** — Generic OpenAPI spec resolution
- **HTTP** — Raw HTTP requests
- **MCP** — Model Context Protocol tools (stdio and SSE/HTTP)

**Popular Community Harnesses** (via plugins):
- GitHub CLI (`gh`)
- AWS CLI (`aws`)
- Google Cloud CLI (`gcloud`)
- Azure CLI (`az`)
- Docker (`docker`)
- Kubernetes (`kubectl`)
- Terraform (`terraform`)
- MySQL (`mysql`)
- MongoDB Shell (`mongosh`)
- npm, pip, cargo (package managers)
- git, git-cliff (version control)
- And many more...

See [docs/supported-harnesses.md](docs/supported-harnesses.md) for the complete list.

### Installing Plugin Harnesses

```bash
# From built-in registry
supercli plugins install commiat

# From GitHub repository
supercli plugins install --git https://github.com/org/plugin-harness.git --ref main

# Local directory (development)
supercli plugins install ./path/to/plugin

# Browse registry
supercli plugins explore
supercli plugins explore --tags "github,ai"
```

### Creating Your Own Harness

Turn any CLI into a dcli harness:

1. Create a `plugin.json` manifest defining commands
2. Specify wrapping or passthrough behavior
3. Include dependency checks and help guidance
4. Test with `supercli plugins install ./path`
5. Publish to registry with `supercli plugins publish`

See [docs/plugin-harness-guide.md](docs/plugin-harness-guide.md) for detailed instructions and examples.

### Planned Harnesses

The dcli community is actively developing plugins for popular CLIs:

- **GitHub Ecosystem**: gh (GitHub CLI), GitHub Actions workflows
- **Cloud Platforms**: aws, gcloud, az CLI tools
- **Container & DevOps**: docker, docker-compose, kubectl, helm, terraform
- **Version Control**: git, git-cliff, commitizen
- **Package Managers**: npm, pip, cargo, pnpm, yarn
- **AI/ML Tools**: huggingface, langchain, LLM CLIs
- **Infrastructure**: ansible, pulumi
- **Monitoring**: datadog, prometheus CLIs
- Many others based on community requests

Want to contribute a plugin harness? [See plugin guide](docs/plugin-harness-guide.md) and submit to the registry!

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

## Built-in Harnesses & Adapters

The following are built-in to dcli (no plugins required):

- **http** — Raw HTTP requests (method, url, headers)
- **openapi** — Resolves operation from OpenAPI spec
- **mcp** — Calls MCP server tools (supports both HTTP endpoints and local Stdio processes)
- **beads** — Task/issue management (if br is installed)
- **gwc** — Google Workspace (if gws is installed)
- **commiat** — Commit automation (if commiat is installed)

## Tech Stack

- NodeJS + Express
- Pluggable KV Storage (Local JSON files by default, MongoDB optional)
- EJS + Vue3 CDN + Tailwind CDN + DaisyUI CDN
- Zero build tools
- Extensible plugin system for registering new harnesses
- Support for OpenAPI, HTTP, MCP, and custom CLI adapters

## Contributors

Contributions are welcome! If you have ideas for improvements, new adapters, or bug fixes, just send a Pull Request (PR) and I will review it.

## License

MIT License - Copyright (c) 2026 Javier Leandro Arancibia

See [LICENSE](LICENSE) file for details.
