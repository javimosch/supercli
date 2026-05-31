<p align="center">
  <img src="https://img.shields.io/npm/v/superacli" alt="npm">
  <img src="https://img.shields.io/badge/release-2026--05--14-blue" alt="Latest Release">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License">
  <img src="https://img.shields.io/github/stars/javimosch/supercli?style=social" alt="Stars">
</p>

<h1 align="center">supercli ⎯ 3,300+ CLI Tools, One Command — and growing every day</h1>

<p align="center">
  <b>Zero install.</b> Run any CLI tool with <code>npx supercli</code>.<br>
  Works for humans. Works for AI agents. Everything returns JSON.
</p>

> Think: "Stripe API for CLIs and tools"

## ⚡ TL;DR

> Turn any CLI, API, or workflow into a discoverable, executable capability
> — with consistent inputs, outputs, and zero glue code.

```bash
# Discover what exists
npx supercli skills search "deploy" --json

# Understand exactly how to use it
npx supercli skills get aws.cfn.deploy --json

# Execute with predictable output
npx supercli aws cfn deploy --stack-name my-stack --json
```

👉 Works the same across CLI tools, APIs, MCP servers, and workflows
👉 No glue code, no parsing, no guesswork

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

→ Combines multiple tools into one structured response.

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

---

## ⚡ Quick Start

```bash
# Run without installing anything
npx supercli uuid self generate
# → {"uuid":"550e8400-e29b-41d4-a716-446655440000"}

# Check if a website is up
npx supercli http check health --url https://example.com
# → {"status":"ok","ms":142,"code":200}

# Generate a password
npx supercli passgen
# → {"password":"xK9#mP2$vL7@nQ5%"}

# Convert CSV to JSON
echo "name,age\nAlice,30\nBob,25" | npx supercli csv json convert
# → [{"name":"Alice","age":"30"},{"name":"Bob","age":"25"}]

# Explore capabilities
npx supercli skills search "github" --json

# Run something real
npx supercli gh issue list --json

# AI-driven execution
npx supercli ask "generate a uuid and check if google.com is up"

# Manage plugins
npx supercli plugins list
npx supercli plugins explore
npx supercli plugins install commiat
```

> 💡 No install? Correct. `npx supercli` works immediately.<br>
> Want it global? `npm install -g superacli`<br>
> Server mode: See docs/features/server-plugins.md

---

## For Humans

| Instead of... | You do... |
|--------------|-----------|
| Installing 50 tools separately | One command: `npx supercli` |
| Reading man pages for flags | `supercli skills get <tool>.*` → structured metadata |
| Parsing inconsistent output | `--json` on every tool |
| Gluing tools with shell scripts | `supercli ask "do X and Y"` |

## For AI Agents

- 🔍 **Discoverable** — `supercli skills search "database"` returns machine-readable metadata
- 📦 **Deterministic** — Every tool accepts `--json`, `--silent` (no interactive prompts)
- 🚨 **Predictable errors** — Standard error codes: `82` (validation), `105` (integration), `110` (internal)
- 🔗 **Composable** — `supercli ask "check status and send alert"` chains tools automatically
- 📋 **Auditable** — Every call logs namespace, resource, action, inputs, outputs

```bash
# Agent workflow: discover → inspect → execute
supercli skills search "deploy" --json
supercli skills get aws.cfn.deploy --json
supercli aws cfn deploy --stack my-stack --json
```

---

## What You Get

- 🔍 Find any capability instantly — no docs hunting
- ⚡ Run tools with one consistent interface
- 🤖 Give agents predictable, structured execution
- 🔗 Combine multiple tools without glue code
- 📦 Extend anything via plugins

---

## 🛠️ CLI Usage Examples

```bash
# Discovery
npx supercli skills list
npx supercli skills search "database"

# Inspection (important for agents)
npx supercli inspect beads issue create
npx supercli skills get beads.issue.create --json

# Execution
npx supercli beads issue create --title "Fix bug"
npx supercli beads issue list --json
npx supercli gwc drive files list

# AI
npx supercli ask "do X and Y"

# Plugins
npx supercli plugins list
npx supercli plugins install commiat
npx supercli plugins show commiat

# Get weather for any city
npx supercli weather now "Tokyo"
# → {"temp_C":22,"condition":"Clear","humidity":65}

# Check SSL certificate details
npx supercli cert info --domain github.com
# → {"issuer":"GTS","expires":"2026-07-22","days_left":74}

# Scan for secrets in code
npx supercli secret scan ./src
# → [{"file":"config.js","line":42,"type":"AWS Access Key"}]
```

---

## 🏗️ Architecture

supercli routes every command through a universal capability framework:

**The router:**
- **Discovers** capabilities from every adapter, caches metadata for fast lookup
- **Routes** commands to the correct harness based on namespace
- **Executes** with unified error handling, envelopes, and output formatting
- **Surfaces** machine-readable descriptions so agents can plan against the capability graph

**Adapters:**
- **CLI tools** — Wraps 3,300+ CLI tools with JSON output, error handling, and timeout management
- **MCP servers** — Bridges Model Context Protocol servers into the same routing graph
- **HTTP APIs** — Turns REST endpoints into callable capabilities
- **Workflows** — Chains multiple capabilities via `supercli ask`

**Plugin system:**
- Each plugin bundles metadata (description, tags, checksums, commands)
- Plugins are registered in `~/.supercli/plugins/plugins.lock.json`
- Both Node and Zig versions read the same plugin storage

supercli replaces tool-specific syntax with a **queryable, executable capability graph**.

---

## 📦 Capability Sources

| Source | What It Provides | Access |
|--------|-----------------|--------|
| **Bundled plugins** | 200+ curated tools (sys, dev, db, cloud, security) | Included, zero config |
| **Plugin registry** | 3,100+ community tools, updated daily | `supercli plugins install <name>` |
| **MCP servers** | Any MCP-compatible server | `supercli mcp add <name>` |
| **HTTP APIs** | REST endpoints as capabilities | Configuration-based |

> Every capability includes: description, tags, source URL, install method, binary check, and commands.

> **Latest npm release:** v1.15.0 (2026-05-14) — new versions ship multiple times per week.

---

## 📤 Output Envelope + Exit Codes

Every command returns a consistent JSON envelope:

```json
{
  "version": "1.0",
  "command": "http.check.health",
  "duration_ms": 142,
  "data": { "status": "ok" }
}
```

| Exit Code | Meaning |
|-----------|---------|
| `0` | Success |
| `82` | Validation error |
| `105` | Integration error |
| `110` | Internal error |

All tools accept `--json` and `--silent` flags for machine-consumable output.

---

## ⚙️ Operating Modes

| Mode | Description | Use Case |
|------|-------------|----------|
| **Direct** | `<ns> <resource> <action> --flags` | Humans running specific tools |
| **Ask** | `supercli ask "do X"` | AI-driven composition |
| **Inspect** | `supercli inspect <command>` | Understand args before running |
| **Server** | `supercli server` | HTTP/MCP server mode (see docs) |

For agents: use `supercli --json` for self-documenting bootstrap.

---

## 📦 Install

### Option 1: Zig Version (Fast, Single Binary)

```bash
curl -sSL https://github.com/javimosch/supercli/releases/download/v0.1.0-zig/install.sh | bash
```

- ✅ Single static binary (~250KB), no Node.js required
- ✅ Faster startup, native performance
- ✅ Reads same `~/.supercli/plugins/plugins.lock.json`

### Option 2: Node.js Version (npx/npm)

```bash
# Run immediately
npx supercli uuid self generate

# Install globally
npm install -g superacli
```

- ✅ Full feature parity (MCP, server, HTTP adapter)
- ✅ Plugin installation from registry

Both versions co-exist and share plugin storage.

---

## 💬 What People Say

> *"Yooooooo, my agent nearly shit himself when I showed him this. TY! I'll keep an eye out for updates from you. This is a fantastic tool!"*
> — **zetsi77** ([@Hadu_Ken77](https://x.com/Hadu_Ken77))

<br>

> ## ⭐ If supercli saved you time, [**star the repo**](https://github.com/javimosch/supercli). Takes one click, means the world to us.

---

## License

MIT — [Javier Leandro Arancibia](https://github.com/javimosch)
