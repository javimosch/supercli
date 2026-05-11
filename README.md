# supercli — 3,000+ CLI Tools + Standardized Execution Layer

[![npm version](https://img.shields.io/npm/v/superacli.svg)](https://www.npmjs.com/package/superacli)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

> **3,000 curated CLI tools** (shells, DevOps, data, web, cloud, security, AI) + a unified capability interface
> — consistent inputs, outputs, and execution for everything.

**The complete developer toolkit:** bash, rust, python, go, docker, kubernetes, aws, postgres, terraform, and 2,990+ more — all discoverable, quality-checked, and ready to install.

## ⚡ TL;DR

> 3,000 CLI tools. One consistent interface. JSON envelopes. Zero glue code.

```bash
# 1. Discover capabilities
npx supercli skills search "deploy" --json

# 2. Inspect it
npx supercli skills get aws.cfn.deploy --json

# 3. Execute with predictable output
npx supercli aws cfn deploy --stack-name my-stack --json
```

👉 Works the same across CLI tools, APIs, MCP servers, and workflows
👉 No glue code, no parsing, no guesswork
👉 Every command returns deterministic JSON envelopes

## ⚡ Example

```bash
npx supercli ask "list my tasks and recent commits"
```

```json
{
  "tasks": [...],
  "commits": [...]
}
```

→ Combines multiple tools into one structured response (multi-tool execution).

## The Problem

Every tool speaks a different language:

- CLIs → flags & inconsistent output
- APIs → schemas & auth
- MCP/tools → custom protocols
- Workflows → glue code everywhere

Humans waste time learning syntax. Agents fail because nothing is predictable.

## The Solution

supercli turns everything into capabilities:

- Same structure → `supercli <namespace> <resource> <action>`
- Same output → deterministic JSON envelopes
- Same discovery → searchable skill graph
- Same execution → no custom integrations

## 🚀 Quick Start

```bash
# Explore capabilities
npx supercli skills list
npx supercli skills search "database"

# Run real commands
npx supercli uuid self generate
npx supercli http check health --url https://example.com
npx supercli beads issue list --json

# AI-driven execution
npx supercli ask "show my tasks and recent commits"

# Manage plugins
npx supercli plugins list
npx supercli plugins explore
npx supercli plugins install ./plugins/uuid-cli

# Agent mode
npx supercli --help-json
npx supercli skills get <capability> --json
```

Install globally: `npm install -g superacli` for repeated use.
Server mode: See [docs/features/server-plugins.md](docs/features/server-plugins.md)


## 1000+ CLI Tools, Discoverable & Ready

Every tool includes complete metadata (description, tags, source URL, install methods). Browse by category, search by tag, install what you need:

```bash
# Discover
supercli plugins list
supercli plugins search --tag rust
supercli plugins search --tag devops

# Install
supercli plugins install ./plugins/cargo ./plugins/tokio
supercli plugins install ./plugins/docker ./plugins/kubernetes
```

Complete toolkit: Shells, DevOps, cloud providers (AWS, Azure, GCP), databases, data tools, development frameworks, testing, security, and more.

## For Humans & Agents

### For Humans

Stop juggling CLI tools with different syntax and outputs. supercli gives you one consistent interface to 1000+ quality-checked tools—so you stop learning syntax and start executing faster.

| Instead of | You do |
| ---------- | ------ |
| Hunting for tools | `supercli plugins search "deploy"` or `supercli plugins list` |
| Reading 50-page docs | `supercli skills get <tool>.*` |
| Guessing flags | `supercli inspect ...` |
| Parsing output | `--json` everywhere |
| Gluing tools together | `supercli ask "do X and Y"` |

### For AI Agents

**Agents don't guess—they query, inspect, and execute.** Access a standardized skill graph where every capability follows predictable input/output envelopes. Discover, compose, and execute workflows with machine-readable metadata that enables reliable automation.

- **Explicit Boundaries:** Each skill declares capabilities, inputs, outputs—nothing hidden
- **Consistent Wrappers:** `--json`, `--silent` modes prevent interactive prompts
- **Audit Trail:** Every invocation logs plugin, action, inputs, and outputs
- **Opt-In Power:** Full CLI access requires explicit passthrough
- **Predictable Errors:** Standardized error envelopes with machine-readable codes

## What You Get

- 🔍 **3,000 curated CLI tools** — system utilities, compilers, databases, cloud, security, monitoring, and more
- ⚡ Run any tool with one consistent interface — no syntax juggling
- 🤖 Give agents predictable, structured execution
- 🔗 Combine multiple tools without glue code
- 📦 Extend anything via plugins
- 🛠️ **25 custom Go CLI tools** published at [github.com/javimosch](https://github.com/javimosch?tab=repositories)

## CLI Usage Examples

```bash
# --- Discovery ---
npx supercli skills list
npx supercli skills search "database"

# --- Inspection (for agents) ---
npx supercli inspect beads issue create
npx supercli skills get beads.issue.create --json

# --- Execution ---
npx supercli beads issue create --title "Fix bug"
npx supercli beads issue list --json
npx supercli gwc drive files list

# --- AI ---
npx supercli ask "do X and Y"

# --- Plugins ---
npx supercli plugins list
npx supercli plugins install commiat
npx supercli plugins show commiat
```

See [docs/plugin-harness-guide.md](docs/plugin-harness-guide.md) for creating your own harnesses.

## Architecture

The supercli router:

- **Discovers** capabilities from every adapter, caches metadata for instant lookup
- **Routes** commands to correct harness based on namespace
- **Executes** with unified error handling, envelopes, and output formatting
- **Surfaces** machine-readable descriptions so agents can plan against the capability graph

supercli replaces tool-specific syntax with a **queryable, executable capability graph**.

## Capability Sources

supercli generates capabilities from multiple sources:

- **Bundled Harnesses** – beads, gwc (Google Workspace), commiat
- **Built-in Adapters** – OpenAPI specs, HTTP, MCP servers
- **Plugin Harnesses** – CLIs installed via `supercli plugins install`
- **AI & Plans** – natural-language `ask` commands create execution DAGs

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

| Code | Type | Action |
| ---- | ---- | ------ |
| 0 | success | Proceed |
| 82 | validation_error | Fix input |
| 85 | invalid_argument | Fix argument |
| 92 | resource_not_found | Try different resource |
| 105 | integration_error | Retry with backoff |
| 110 | internal_error | Report bug |

## Operating Modes

| Mode | What it means | Best for |
| ---- | ------------- | -------- |
| Local-only (default) | CLI runs directly from local config/cache and plugins | Personal workflows, offline, quick setup |
| Server mode | Supercli server hosts shared config/plugins via API | Team-shared capabilities, centralized governance |

`supercli sync` only relevant when `SUPERCLI_SERVER` is configured. See [docs/features/server-plugins.md](docs/features/server-plugins.md).

## Tech Stack

- NodeJS + Express
- Pluggable KV Storage (Local JSON files by default, MongoDB optional)
- Vue3 + Tailwind + DaisyUI
- Zero build tools
- Plugin system for registering new harnesses

## What People Are Saying

Early users (including agent builders):

![Testimonial zetsi77](docs/images/testimonial-zetsi77.png)

> "Yooooooo, my agent nearly shit himself when I showed him this. TY! I'll keep an eye out for updates from you. This is a fantastic tool!"
> — **zetsi77** ([@Hadu_Ken77](https://x.com/Hadu_Ken77))

## Contributors

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=javimosch/supercli&type=date&legend=top-left)](https://www.star-history.com/#javimosch/supercli&type=date&legend=top-left)

## License

MIT License - Copyright (c) 2026 Javier Leandro Arancibia

See [LICENSE](LICENSE) file for details.
