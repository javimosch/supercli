<p align="center">
  <a href="https://github.com/javimosch/supercli"><img src="https://img.shields.io/github/stars/javimosch/supercli?style=social&label=Stars" alt="Stars"></a>
  <img src="https://img.shields.io/npm/v/superacli" alt="npm">
  <img src="https://img.shields.io/badge/release-2026--06--08-blue" alt="Latest Release">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License">
  <img src="https://img.shields.io/badge/plugins-10k+-blueviolet" alt="Plugins">
</p>

<h1 align="center">supercli ⎯ 10,000+ CLI Tools, One Command — and growing daily</h1>

<p align="center"><i>The universal launcher for every CLI tool — no installs, JSON-first, one command.</i></p>

<p align="center">
  <b>Zero install.</b> Run any CLI tool with <code>npx supercli</code>.<br>
  <b>JSON-first by default.</b> Use <code>--human</code> for readable output.
</p>

<p align="center">
  ⭐ <b>Like supercli? <a href="https://github.com/javimosch/supercli">Star it on GitHub</a></b> — one click, makes a huge difference.
</p>

> **10,000 tools. One command. Zero friction.**

## ⚡ TL;DR

> Turn any CLI, API, or workflow into a discoverable, executable capability
> — with consistent inputs, outputs, and zero glue code.

```bash
# Discover what exists (JSON by default)
npx supercli skills search "deploy"

# Understand exactly how to use it
npx supercli skills get aws.cfn.deploy

# Execute with predictable output (JSON by default)
npx supercli aws cfn deploy --stack-name my-stack

# For human-readable output, add --human
npx supercli aws cfn deploy --stack-name my-stack --human
```

👉 Works the same across CLI tools, APIs, MCP servers, and workflows
👉 No glue code, no parsing, no guesswork

## Table of Contents

- [Quick Start](#-quick-start)
- [For Humans](#for-humans)
- [For AI Agents](#for-ai-agents)
- [What You Get](#what-you-get)
- [CLI Usage Examples](#️-cli-usage-examples)
- [Architecture](#️-architecture)
- [Capability Sources](#-capability-sources)
- [Output Envelope + Exit Codes](#-output-envelope--exit-codes)
- [Operating Modes](#️-operating-modes)
- [Install](#-install)
- [Troubleshooting](#️-troubleshooting)
- [Tech Stack](#️-tech-stack)
- [Community & Social](#️-community--social)

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

Without supercli, integrating a new tool means:
1. Finding and reading its documentation
2. Learning its flag syntax and output format
3. Writing glue code to parse and transform the output
4. Handling edge cases and error states manually
5. Repeating for every additional tool

**For agents**, the situation is worse — every tool responds differently, errors are unstructured, and there's no way to discover capabilities dynamically.

## The Solution

supercli turns everything into capabilities:
- Same structure → `supercli <namespace> <resource> <action>`
- Same output → deterministic JSON envelopes
- Same discovery → searchable skill graph
- Same execution → no custom integrations

With supercli:
1. **Discover** what's available via `supercli skills search "backup"` — no docs needed
2. **Inspect** the exact interface via `supercli inspect <ns> <res> <act>` — see every argument, type, and default
3. **Execute** with `--json` — get structured output every time
4. **Combine** via `supercli ask "do X and Y"` — no shell scripting required
5. **Extend** via plugins — add any CLI, API, or MCP server with one command

---

## ⚡ Quick Start

```bash
# Explore capabilities (JSON by default)
npx supercli help
npx supercli skills search "github"

# Run something real (JSON by default)
npx supercli beads issue list
npx supercli gh issue list

# For human-readable output, add --human
npx supercli beads issue list --human

# AI-driven execution
npx supercli ask "show my tasks and recent commits"

# Manage plugins
npx supercli plugins list
npx supercli plugins explore
npx supercli plugins install commiat

# Inspect a capability before using it
npx supercli inspect http check health
# → Shows: args, types, defaults, required/optional, description
```

> 💡 Install globally: `npm install -g superacli` for repeated use.<br>
> Server mode: See docs/features/server-plugins.md

---

## For Humans

| Instead of... | You do... |
|--------------|-----------|
| Installing 50 tools separately | One command: `npx supercli` |
| Reading man pages for flags | `supercli skills get <tool>.*` → structured metadata |
| Parsing inconsistent output | JSON by default, `--human` for readable output |
| Gluing tools with shell scripts | `supercli ask "do X and Y"` |

What this means day-to-day:
- **No install friction** — `npx supercli <tool>` works immediately, no `apt-get`, `brew`, or `npm i -g`
- **No syntax learning** — Every tool uses the same three-word command pattern, just change the namespace
- **No output parsing** — JSON by default for scripts/pipes, `--human` for terminal display
- **No context switching** — One terminal, one interface, 10,000+ tools available

> 💡 **Important**: supercli is JSON-first by default. Add `--human` for human-readable output in your terminal.

## For AI Agents

- 🔍 **Discoverable** — `supercli skills search "database"` returns machine-readable metadata (JSON by default)
- 📦 **Deterministic** — Every tool returns JSON by default, accepts `--human` for readable output, `--silent` (no interactive prompts)
- 🚨 **Predictable errors** — Standard error codes: `82` (validation), `105` (integration), `110` (internal)
- 🔗 **Composable** — `supercli ask "check status and send alert"` chains tools automatically
- 📋 **Auditable** — Every call logs namespace, resource, action, inputs, outputs, duration
- 🧠 **Self-describing** — `supercli inspect <ns> <res> <act>` exposes full argument schemas with types and defaults
- ♻️ **Idempotent** — Same inputs always produce same output shape, enabling retry and reconciliation

```bash
# Agent workflow: discover → inspect → execute — all machine-readable (JSON by default)
supercli skills search "deploy"
supercli skills get aws.cfn.deploy
supercli aws cfn deploy --stack my-stack
```

For agent developers: always start with `supercli` for self-documenting bootstrap — it returns the full capability graph schema (JSON by default). Then use `supercli skills search <query>` to narrow down, and `supercli inspect <ns> <res> <act>` before calling any command to validate argument expectations.

---

## What You Get

supercli turns any tool into a first-class capability with a consistent interface:

- 🔍 **Discover without docs** — `supercli skills search "database"` returns every matching capability with descriptions, tags, and argument schemas. No man pages, no README hunting.
- ⚡ **One command pattern** — Every tool follows `supercli <ns> <res> <action> [--flags]`. Learn one pattern, access 10,000+ tools.
- 🤖 **Built for agents** — Every capability returns structured JSON by default, accepts `--human` for readable output, and self-describes via `inspect`. No parsing, no guesswork.
- 🔗 **Chain without glue** — `supercli ask "check status and send alert"` composes multiple capabilities automatically. No shell scripts, no middleware.
- 📦 **Extend anything** — Add CLIs, APIs, or MCP servers as capabilities with one command via the plugin registry.
- 📋 **Full audit trail** — Every call logs namespace, resource, action, inputs, outputs, and duration. Know exactly what ran and how long it took.
- 🚨 **Predictable errors** — Standard exit codes (`82` validation, `105` integration, `110` internal) let scripts and agents handle failures deterministically.

---

## 🛠️ CLI Usage Examples

```bash
# Discovery (JSON by default)
npx supercli skills list
npx supercli skills search "database"

# Inspection (important for agents)
npx supercli inspect beads issue create
npx supercli skills get beads.issue.create

# Execution (JSON by default)
npx supercli beads issue create --title "Fix bug"
npx supercli beads issue list
npx supercli gwc drive files list

# For human-readable output, add --human
npx supercli beads issue list --human

# AI
npx supercli ask "do X and Y"

# Plugins
npx supercli plugins list
npx supercli plugins install commiat
npx supercli plugins show commiat
```

---

## 🏗️ Architecture

### Capability Graph

supercli models every tool, API, and workflow as a **capability** — a named, typed, executable unit with a consistent interface. Capabilities form a graph where each node represents a tool function and edges represent composition possibilities.

The capability graph is the core abstraction. Instead of learning N different tool interfaces, you interact with one graph that routes to the right underlying system. All 10,000+ tools are nodes in this graph, addressable by the same triple pattern.

### The Router

The router is the central brain that connects user commands to capabilities:

- **Discovers** capabilities from every adapter (bundled plugins, remote registry, MCP servers, HTTP APIs), caches metadata for sub-millisecond lookup
- **Routes** commands to the correct execution harness based on `<namespace> <resource> <action>` — the same triplet for every tool
- **Executes** with unified error handling, consistent JSON envelopes, and output formatting (`--json`, `--human`, `--compact`)
- **Surfaces** machine-readable descriptions so agents can inspect, plan, and chain capabilities without guesswork

The routing pipeline processes every command in four phases:

1. **Parse** — Extracts `<namespace> <resource> <action>` and separates flags from positional arguments. The same parser handles every command, regardless of the underlying tool.
2. **Resolve** — Looks up the capability in the metadata cache. For cached capabilities this takes <1ms. New capabilities are discovered from the appropriate adapter and cached for subsequent calls.
3. **Route** — Dispatches to the correct execution harness based on capability type: CLI wrapper, MCP bridge, HTTP adapter, or workflow engine. Each harness handles transport-specific concerns like timeouts, retries, and protocol negotiation.
4. **Execute** — Runs the underlying tool with unified error handling, timeout management, and structured output formatting. Returns a deterministic JSON envelope every time.

### Adapter Layer

**Four adapter types** bridge external systems into the capability graph:

| Adapter | What It Wraps | When To Use |
|---------|--------------|-------------|
| **CLI** | 10,000+ CLI binaries | Running shell commands with JSON output, timeout management, structured error handling |
| **MCP** | Model Context Protocol servers | Connecting MCP-compatible tools into the same routing graph |
| **HTTP** | REST endpoints | Turning any API into a callable capability with configurable methods, headers, and body schemas |
| **Workflow** | Multi-capability chains | Composing multiple tools via `supercli ask "do X and Y"`, auto-resolving dependencies |

Each adapter normalizes its target into the same internal representation: a capability record with name, description, argument schema, and execution handler. Every tool — whether a CLI binary, an MCP server, or a REST API — looks identical to the router.

### Plugin System

The plugin system keeps capabilities organized and discoverable:

- Each plugin bundles a manifest (`plugin.json`) with metadata, checksums, commands, and dependency requirements
- Installed plugins register in `~/.supercli/plugins/plugins.lock.json`
- The Zig binary (`sc-zig`), the machin binary (`sc-machin`), and the Node.js runtime (`sc`) all read the same plugin storage — they co-exist and share state
- The remote registry at `plugins/catalog.json` tracks 10,000+ community plugins with checksum-verified updates
- Every capability includes description, tags, argument schemas, and install guidance

### Summary

supercli replaces tool-specific syntax with a **queryable, executable capability graph** — one interface for every tool, discoverable by humans and agents alike.

---

## 📦 Capability Sources

supercli draws capabilities from four source types:

| Source | Count | How to Add | Description |
|--------|-------|------------|-------------|
| **Bundled plugins** | 10,000+ | Auto-discovered from `plugins/` | CLI binaries wrapped with metadata, args, and tags |
| **MCP servers** | Unlimited | `supercli mcp add <name> --url <url>` | Model Context Protocol servers (stdio or SSE) |
| **HTTP APIs** | Unlimited | `supercli http <method> <url>` | REST endpoints as callable capabilities |
| **Custom adapters** | Unlimited | Server UI or `supercli sync` | User-defined JS in sandboxed vm2 runtime |

Every capability includes description, tags, argument schemas, and checksum-verified metadata.

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

All tools return JSON by default. Add `--human` for readable output, `--silent` for machine-consumable output without prompts.

---

## ⚙️ Operating Modes

| Mode | Command | What It Does | When To Use |
|------|---------|-------------|-------------|
| **Direct** | `<ns> <res> <act> [--flags]` | Executes a specific capability with arguments | Running a known tool, scripting |
| **Ask** | `supercli ask "do X and Y"` | AI-driven composition chains multiple capabilities | One-shot tasks, complex workflows |
| **Inspect** | `supercli inspect <ns> <res> <act>` | Shows argument schema, types, descriptions, defaults | Before running an unfamiliar command |
| **Discover** | `supercli skills search <query>` | Searches all capabilities by name, description, tags | Finding what tools are available |
| **Server** | `supercli server` | Starts HTTP or MCP server exposing all capabilities | Remote access, IDE integration, API gateway |

All five modes return JSON by default. Add `--human` for readable display. Agents should always start with `supercli` for self-documenting bootstrap — it returns the full capability graph schema (JSON by default).

---

## 📦 Install

Three implementations, all co-exist and share plugin storage at `~/.supercli/plugins/plugins.lock.json`. Pick one (or more):

### Option 1: Zig Version (Fastest, Single Binary)

```bash
curl -sSL https://github.com/javimosch/supercli/releases/download/v0.1.0-zig/install.sh | bash
```

- ✅ Single static binary (~250KB), no Node.js required
- ✅ Fastest startup, native performance
- ✅ Reads same `~/.supercli/plugins/plugins.lock.json`

### Option 2: Machin Version (MCP Server, Single Binary)

```bash
curl -sSL https://github.com/javimosch/supercli/releases/download/v0.2.0-machin/install.sh | bash
```

- ✅ Single binary (~71KB), no Node.js required
- ✅ Built-in MCP server (`sc-machin mcp serve`) — expose all commands to AI agents
- ✅ `skills.match` built-in tool — semantic skill discovery across all skill dirs
- ✅ `rtk` passthrough — token-reduced git/ls ops via MCP
- ✅ Auto-detects OS/arch (linux-amd64, linux-arm64, darwin-arm64)

### Option 3: Node.js Version (npx/npm)

```bash
# Run immediately — no install needed
npx supercli skills list

# Install globally
npm install -g superacli
```

- ✅ Full feature parity (MCP client, HTTP adapter, plugin installs)
- ✅ Plugin installation from registry

**Which to choose?** `sc-zig` for daily use (fastest startup), `sc-machin` to expose SuperCLI to AI agents via MCP, `sc` (Node.js) for the reference implementation with full feature parity. All three share the same plugin state — install one, two, or all three.

---

## 🔧 Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| `command not found: supercli` | Not installed | Run `npx supercli` (no install needed) or `npm install -g superacli` |
| Plugin not found | Not in registry | Run `supercli plugins explore --name <query>` to find it |
| Output is not JSON | Tool may not support JSON output | Use `supercli inspect <ns> <res> <act>` to check if the command supports JSON |
| MCP server not connecting | Server not running or wrong URL | See MCP diagnosis steps below |
| Zig binary not found | Wrong platform binary | Use `npx supercli` (Node.js) as fallback — both share plugin state |
| `ask` not available | LLM env vars not set | Set `OPENAI_BASE_URL`, `OPENAI_MODEL`, `OPENAI_API_KEY` — see [ask docs](docs/features/ask.md) |
| Arguments rejected | Wrong arg names or types | Run `supercli inspect <ns> <res> <act>` to see the expected argument schema |

**Quick diagnosis flowchart:**

```
Problem?
  ├─ "command not found" → Run `npx supercli` (zero-install) or `npm install -g superacli`
  ├─ "plugin not found"  → `supercli plugins explore --name <query>` to search registry
  ├─ Output not JSON     → Verify tool supports JSON; use `supercli inspect` to check adapter config
  ├─ MCP not connecting  → Follow MCP diagnosis steps below
  ├─ "ask" not available → Set OPENAI_BASE_URL, OPENAI_MODEL, OPENAI_API_KEY env vars
  ├─ Zig binary missing  → Use `npx supercli` (Node.js fallback, shares plugin state)
  └─ Arguments rejected  → `supercli inspect <ns> <res> <act>` to see expected schema
```

### MCP Server Diagnosis

If an MCP adapter command fails to connect:

```bash
# 1. Check if the MCP server is registered
supercli mcp list

# 2. Verify the server URL is correct
#    For HTTP/SSE: ensure the URL is reachable
curl -s <server-url>  # Should return a response, not connection refused

# 3. For stdio servers, check the binary exists
which <command-from-adapterConfig>

# 4. Inspect the command to see the adapter config
supercli inspect <ns> <res> <act>

# 5. Run with verbose output for debugging
supercli <ns> <res> <act> --verbose
```

Common MCP issues:
- **Connection refused**: Server process not running. Start it first.
- **Timeout**: Server is slow. Increase `timeout_ms` in `adapterConfig`.
- **Tool not found**: The `tool` name in `adapterConfig` doesn't match the server's tool list. Check with `supercli inspect`.

For detailed debugging: `supercli` returns the full schema (JSON by default). Use `supercli inspect <ns> <res> <act>` to validate arguments before execution.

### Getting Help

- `supercli help` — list all commands
- `supercli help <namespace>` — commands in a namespace
- `supercli` — full capability graph schema (JSON by default)
- `supercli plugins show <name>` — plugin details including version, source, tags
- File an issue at [github.com/javimosch/supercli/issues](https://github.com/javimosch/supercli/issues)

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js (sc), Zig (sc-zig), machin/MFL (sc-machin) — co-exist, share plugin state |
| Router | Custom capability graph with sub-millisecond cache |
| Plugins | 10,000+ bundled — each `plugin.json` + `meta.json` |
| MCP | Built-in MCP server adapter (`supercli mcp add <name>`) |
| HTTP | HTTP adapter for REST endpoints as capabilities |
| Registry | `plugins/catalog.json` — checksum-verified updates |
| CLI | `supercli <ns> <res> <action> [--flags]` — universal triplet |
| Output | Deterministic JSON envelopes with exit codes |
| AI | `supercli ask "do X and Y"` — auto-resolves capability chains |
| Install | `npx supercli` (zero-install) or `npm install -g superacli` |

---

## 🌐 Community & Social

| Channel | Link |
|---------|------|
| GitHub | [github.com/javimosch/supercli](https://github.com/javimosch/supercli) |
| npm | [superacli on npm](https://www.npmjs.com/package/superacli) |
| Issues | [GitHub Issues](https://github.com/javimosch/supercli/issues) |
| Discussions | [GitHub Discussions](https://github.com/javimosch/supercli/discussions) |
| Changelog | [CHANGELOG](https://github.com/javimosch/supercli/releases) |

### Contributors

Contributions are welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

- **Plugin authors** — Add your tool via `plugins/<name>/`.
- **Core contributors** — Help with router, Zig binary, MCP adapter.
- **Documentation** — Improve docs, examples, quickstarts.

> ⭐ If supercli saved you time, [**star the repo**](https://github.com/javimosch/supercli). Takes one click, means the world to us.

---

## Support

If supercli saved you time, consider supporting the project:

<a href="https://ko-fi.com/javimosch"><img src="https://storage.ko-fi.com/cdn/brandasset/v2/support_me_on_kofi_badge_beige.png" alt="Support me on Ko-fi" height="30"></a>
<a href="https://www.patreon.com/cw/javi_to"><img src="https://img.shields.io/badge/Patreon-F96854?style=for-the-badge&logo=patreon&logoColor=white" alt="Support me on Patreon" height="30"></a>

---

## License

MIT — <a href="https://www.linkedin.com/in/arancibiajav/" target="_blank">Javier Leandro Arancibia</a>
