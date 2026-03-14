# supercli — Universal Capability Router for AI Agents

Discover and execute capabilities across CLIs, APIs, MCP servers, workflows, and custom automations through a single agent-friendly interface.

## Why Supercli?

### For Humans
Stop context-switching between CLI tools. supercli gives you one consistent interface to AWS, GitHub, Docker, Kubernetes, and 50+ other platforms—so you spend less time learning syntax and more time solving problems.

### For AI Agents
Access a standardized skill graph where every capability follows predictable input/output envelopes. Discover, compose, and execute workflows with machine-readable metadata that enables reliable automation.

### For Supervisors
Trust that your AI agents have explicit boundaries. Every skill declares its capabilities, inputs, outputs, and safety profile—no hidden behavior. Agents must explicitly opt-in to raw CLI power via passthrough, and every invocation follows predictable error patterns.

### Shared Value

| Scenario | Direct CLI Approach | Supercli Approach |
|----------|-------------------|-------------------|
| Learning a new tool | Read 50-page docs, memorize flags | `supercli skills get <tool>.*` with examples |
| Cross-tool workflows | Manual context passing between commands | Automatic context propagation |
| Finding capabilities | Google/search multiple docs sites | `supercli skills search <query>` |
| Safe automation | Risk of accidental destructive commands | Agent-friendly wrappers with safeguards |
| Writing scripts | Parse inconsistent text output | Consistent JSON envelopes |

**Same command structure everywhere:** `supercli <plugin> <action> ...`

Whether you're human or agent, supercli reduces cognitive load through consistent skill invocation patterns while maintaining access to full CLI power via passthrough (`supercli <plugin> -- <raw-args>`).

## Terminology

- **Capability**: Any executable unit exposed by Supercli (command, OpenAPI operation, MCP tool binding, HTTP integration, workflow step).
- **Skill document**: Agent-facing guidance in `SKILL.md` format, indexed by the `skills` catalog commands.

## BIN Aliases

- dcli (Original CLI)
- supercli (Brand)
- scli (Brand smaller)
- superacli (What was available) (Super Agent/ic CLI)
- sc (For lazy people)

## What Is a Capability Layer?

Everything the system exposes becomes a **capability**:

| Source | Turns into |
| --- | --- |
| CLI command | Capability |
| OpenAPI endpoint | Capability |
| MCP tool | Capability |
| HTTP request | Capability |
| Workflow / plan step | Capability |

Agents query the capability layer once, and supercli handles discovery, routing, and execution across every connected ecosystem. Capabilities are addressable (e.g., `beads.issue.list` or `docker.container.ps`), searchable, and consistently described so agents never need bespoke integrations per tool.

### Core Responsibilities

1. **Discovery** – build a real-time catalog of capabilities across bundled harnesses, adapters, and plugins.
2. **Routing** – resolve the right execution adapter (CLI, HTTP, MCP, custom runtime) from an incoming capability ID.
3. **Execution** – normalize inputs/outputs, enforce envelopes, and surface deterministic status codes.
4. **Extension** – let teams add new capabilities by dropping in manifests, OpenAPI specs, or plugin harnesses.

Example capability executions:

```bash
supercli beads issue list              # Calls beads capability adapter
supercli gwc drive files list          # Calls Google Workspace adapter
supercli docker container ps           # Calls Docker plugin (when installed)
```

## Capability Sources

supercli generates capabilities from six primary channels:

- **Bundled Harnesses** – beads (tasks/issues), gwc (Google Workspace), commiat (commit automation)
- **Built-in Adapters** – OpenAPI specs, raw HTTP integrations, MCP (Model Context Protocol) servers
- **Plugin Harnesses** – community or internal CLIs installed via `supercli plugins install`
- **AI & Plans** – natural-language `ask` commands create execution DAGs composed of capabilities
- **Workflows** – repeatable plans and stored executions referenced as capabilities
- **Future Extensions** – popular CLIs such as gh, aws, docker, kubectl, terraform, etc.

## Architecture

```
           Agents / Humans
                  │
            supercli runtime
                  │
          Capability Discovery Layer
                  │
           Capability Router Core
                  │
   ┌──────────────┼──────────────┬───────────────┐
   │              │              │               │
 CLI Harnesses  OpenAPI / HTTP  MCP Servers   Workflows / Plugins
```

The router intelligently:
- **Discovers** available capabilities from every adapter and caches metadata for fast lookup
- **Routes** commands to the correct harness based on namespace and capability metadata
- **Executes** with unified error handling, envelopes, and output formatting
- **Surfaces** machine-readable descriptions so agents can plan against the capability graph

## Why Capabilities Matter

Traditional CLIs force agents to learn tool-specific syntax. supercli replaces that effort with a discoverable capability graph so agents can:

- Search (`supercli skills search "database"`) to find relevant capabilities instantly
- Inspect (`supercli skills get beads.issue.create`) to pull schema-rich metadata
- Compose (`supercli plan …`) to build DAGs out of capabilities without writing glue code
- Delegate execution to the same router regardless of whether the source is a CLI, API, or MCP tool

### Safety & Trust for Agents

**Why supervisors can trust supercli with AI agents:**

- **Explicit Boundaries:** Each skill declares its capabilities, inputs, and outputs—nothing hidden
- **Consistent Wrappers:** Agent-friendly modes (`--json`, `--silent`) prevent interactive prompts
- **Audit Trail:** Every invocation logs plugin, action, inputs, and outputs
- **Opt-In Power:** Full CLI access requires explicit passthrough (`supercli <plugin> -- <raw-args>`)
- **Predictable Errors:** Standardized error envelopes with machine-readable codes
- **No Side Effects:** Skills declare whether they're read-only or state-modifying

**Agent workflow example:**

```bash
# 1. Find relevant capabilities
supercli skills search "deployment" --json

# 2. Inspect exact requirements
supercli skills get aws.cfn.deploy --json

# 3. Execute with predictable output
supercli aws cfn deploy --stack-name my-stack --template-file template.yaml --json
```

## Capability Mesh Vision

supercli is steadily evolving toward a broader **capability mesh** that provides discovery, routing, execution, composition, and governance across every tool in the stack. Near-term focus areas include:

- **Deeper capability registry** with richer metadata, tagging, and policy controls
- **Graph-native discovery** so agents can traverse related capabilities and capability clusters
- **Execution DAG observability** for multi-capability plans with retries and status streaming
- **Agent endpoints** that expose the router over HTTP/webhooks for direct agent access beyond the CLI

These directional goals keep the README aligned with the system’s trajectory without overpromising unshipped features.

## Operating Modes

Supercli supports two runtime modes:

| Mode | What it means | Best for |
| --- | --- | --- |
| Local-only (default) | CLI runs directly from local config/cache and installed plugins. No Supercli server required. | Personal workflows, offline/local development, quick setup |
| Server mode | A Supercli server hosts shared config/plugins via API; clients connect with `SUPERCLI_SERVER` and run `supercli sync`. | Team-shared capabilities/plugins, centralized governance, multi-client consistency |

Notes:
- `supercli sync` is only relevant when `SUPERCLI_SERVER` is configured.
- Local plugins still take precedence over server-synced plugins when names collide.
- Server plugin behavior and policies are documented in [docs/features/server-plugins.md](docs/features/server-plugins.md).

## Quick Start

```bash
# Path A: Local-only mode (default, no server required)
npx supercli help                      # List available harnesses
npx supercli skills teach

# Install
npm install

# Optional local config
cp .env.example .env

# === Human Perspective ===
# Local CLI usage - Multi-harness routing
supercli help                          # List all harnesses
supercli beads                         # List beads capabilities
supercli gwc                           # List Google Workspace capabilities
supercli beads issue list              # Execute beads command
supercli gwc drive files list          # Execute Google Workspace command

# Capabilities discovery across harnesses
supercli skills list                   # Capability docs from all harnesses
supercli skills search "database"      # Full-text search across harnesses

# AI-driven multi-harness execution
supercli ask "show my tasks and recent commits"

# Manage plugin harnesses
supercli plugins list
supercli plugins explore               # Browse available plugins
supercli plugins install commiat       # Install community plugin

# === Agent Perspective ===
# Programmatic capability discovery (machine-readable)
supercli --help-json                   # Full capability manifest in JSON
supercli skills list --json           # All skills with metadata
supercli skills search "deployment" --json  # Filtered capabilities

# Predictable execution with JSON output
supercli aws sts get-caller-identity --json
supercli gh issue list --json

# Inspect specific capabilities before execution
supercli skills get aws.cfn.deploy --json

# Path B: Server mode (optional, shared backend)
# Start server (local JSON storage by default; MongoDB optional)
npm start
# Or alternatively, start via CLI:
# supercli --server

# Point CLI clients to the server, then sync shared config/plugins
export SUPERCLI_SERVER=http://localhost:3000
supercli sync

# Open Web UI
open http://localhost:3000
```

## CLI Usage

### Multi-Harness Routing

```bash
# Basic harness routing
supercli <harness>                          # List capabilities in harness
supercli <harness> <capability-group> <action>   # Execute capability

# Examples across different harnesses
supercli beads issue create --title "Fix bug"
supercli beads issue list --status open
supercli gwc drive files list --limit 10
supercli commiat validate --commit-msg "my message"

# Discovery
supercli help                              # List all harnesses
supercli skills list                       # List capability docs from all harnesses
supercli skills search --harness beads     # Search within harness
supercli skills search "database"          # Full-text search across harnesses

# Inspection
supercli inspect beads issue create        # Command details + schema
supercli skills get beads.issue.create     # Get capability documentation

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
supercli sync                              # Server mode only: sync cache from SUPERCLI_SERVER
supercli config show                       # Show cache info
supercli --server                          # Start backend server (server mode)

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
- Supports command wrapping, passthrough, remote skill-document catalogs, or any combination of those patterns
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
- Himalaya Email CLI (`himalaya`)
- WhatsApp CLI (`wacli`)
- X API CLI (`xurl`)
- X Cookie CLI (`clix`)
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
