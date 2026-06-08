# supercli Feature Documentation

Detailed documentation for supercli's core features and capabilities.

## Feature Index

| Feature | Description | Link |
|---------|-------------|------|
| [Adapters](adapters.md) | HTTP, OpenAPI, MCP, and process adapter integration | [Read →](adapters.md) |
| [Agent-Friendly Tooling](agent-friendly.md) | Machine-readable discovery, schemas, and token optimization for AI agents | [Read →](agent-friendly.md) |
| [Natural Language Execution](ask.md) | Translate natural language intents into execution workflows | [Read →](ask.md) |
| [Observability](observability.md) | Job tracing, historical analysis, and dashboard interface | [Read →](observability.md) |
| [Server Plugins](server-plugins.md) | Server-distributed plugin capabilities and sync model | [Read →](server-plugins.md) |
| [Skill Documents](skills.md) | SKILL.md teaching/catalog system for LLMs and agents | [Read →](skills.md) |
| [Storage](storage.md) | Storage abstraction and persistence layer | [Read →](storage.md) |
| [Workflows](workflows.md) | Multi-step workflow execution with data piping | [Read →](workflows.md) |
| [Config Sync](config-sync.md) | Configuration synchronization between client and server | [Read →](config-sync.md) |
| [Execution Plans](execution-plans.md) | Planning and execution of command sequences | [Read →](execution-plans.md) |
| [Azure DevOps & UiPath Plugins](azd-uipath-plugins.md) | Azure Developer CLI and UiPath automation harnesses | [Read →](azd-uipath-plugins.md) |
| [Server Plugins Usage Guide](../server-plugins-usage-guide.md) | Manual testing of server plugins including JSON and ZIP flows | [Read →](../server-plugins-usage-guide.md) |

## By Category

### Core Engine
Features that power the routing and execution backbone:

- **[Adapters](adapters.md)** — The four adapter types (CLI, MCP, HTTP, Workflow) that bridge external tools into the capability graph.
- **[Storage](storage.md)** — Persistence layer for plugin state, lockfiles, and installed capabilities.
- **[Config Sync](config-sync.md)** — Keeps client plugin state synchronized with remote server registries.

### AI & Agent Integration
Features designed for programmatic and AI-agent consumption:

- **[Agent-Friendly Tooling](agent-friendly.md)** — Design principles: semantic exit codes, structured output, deterministic schemas.
- **[Skill Documents](skills.md)** — SKILL.md catalog system that teaches agents how to use specific tools.
- **[Natural Language Execution](ask.md)** — Translates `supercli ask "do X and Y"` into multi-capability execution workflows.
- **[Execution Plans](execution-plans.md)** — Step-by-step planning and execution of complex command sequences.

### Server & Distribution
Features for running supercli as a service or distributing plugins:

- **[Server Plugins](server-plugins.md)** — Server-side plugin distribution via JSON and ZIP flows.
- **[Server Plugins Usage Guide](../server-plugins-usage-guide.md)** — Hands-on testing guide for server plugin endpoints.
- **[Observability](observability.md)** — Job tracing, execution history, and performance metrics.

### Domain Integrations
Specialized plugin harnesses:

- **[Azure DevOps & UiPath Plugins](azd-uipath-plugins.md)** — Azure Developer CLI and UiPath RPA automation harnesses.

### Multi-Step Automation
Composing multiple capabilities into workflows:

- **[Workflows](workflows.md)** — Multi-step execution with data piping between capabilities.

## Quick Navigation

- **New to supercli?** Start with [README.md](../../README.md)
- **Plugin development?** See [plugins-how-to.md](../plugins-how-to.md)
- **Contributing?** See [CONTRIBUTING.md](../../CONTRIBUTING.md)
- **Architecture details?** See [ROADMAP.md](../ROADMAP.md)

## Choosing a Feature

| If you need to... | Start with... |
|---|---|
| Add a new CLI tool to supercli | [plugins-how-to.md](../plugins-how-to.md) (not here — that's the plugin guide) |
| Understand how adapters work | [Adapters](adapters.md) |
| Design an agent-friendly CLI | [Agent-Friendly Tooling](agent-friendly.md) |
| Chain multiple commands together | [Workflows](workflows.md) or [Natural Language Execution](ask.md) |
| Deploy supercli as a server | [Server Plugins](server-plugins.md) + [Usage Guide](../server-plugins-usage-guide.md) |
| Add a skill document for agents | [Skill Documents](skills.md) |
| Debug execution failures | [Observability](observability.md) |
