---
title: "SuperCLI Vision — The North Star"
subtitle: "From distribution monopoly to platform"
---

# SuperCLI — the north star

> The ROADMAP ([`ROADMAP.md`](./ROADMAP.md)) is the *plan* (phases, KPIs, the
> French Unicorn trajectory). This file is the *north star* — the bet, the
> direction, and the rule for deciding what to build next. Read this before
> opening the ROADMAP.

## The bet

SuperCLI has already won the **distribution** game: 6,000+ plugins, 8,000+
commands, the largest open-source CLI ecosystem in the world. Every tool an
agent needs is one `sc <namespace>` away.

The bet is turning that distribution monopoly into a **platform** — the
runtime layer between AI agents and the entire CLI ecosystem. Not a better
CLI (that's done), but the **agent execution layer**: the thing every agent
session calls first, the thing every MCP client connects to, the thing every
plugin author publishes to.

**One sentence:** *SuperCLI is the universal agent-CLI runtime — every agent
starts with `sc`, every tool is one call away, every MCP client gets all
6,000+ tools for free.*

## The direction (what "done" looks like)

1. **Every agent session starts with `sc --json`.** Not `sc` as one tool among
   many — `sc` as the bootstrap. The `alternatives` field (sc-zig, sc-machin,
   sc Node.js) means the agent picks the right runtime for the job without
   leaving the ecosystem.

2. **Every MCP client gets all 6,000+ tools.** `sc-machin mcp serve` exposes
   the full command surface as MCP tools. Claude Code, Claude Desktop, any MCP
   client — one config line, the whole ecosystem.

3. **Agents discover skills, not just commands.** `skills.match` is the
   semantic layer on top of the plugin catalog — agents find accumulated
   knowledge from 170+ skills before reinventing it.

4. **Plugin authors publish without PRs.** The `sc store` (ROADMAP Q4 2026)
   turns the curated registry into a marketplace. Third-party authors publish,
   version, and monetize. The distribution monopoly becomes a creator economy.

5. **The runtime is multi-implementation.** sc (Node.js, reference), sc-zig
   (fastest, single binary), sc-machin (MCP server, single binary). Same
   plugin state, same JSON envelope, same command surface. No lock-in to one
   language or runtime.

## The rule (how to decide what to build next)

> **Does this turn the distribution monopoly into platform lock-in?**

If yes — build it. If no — it's a feature, not a platform move. Examples:

| Decision | Platform move? | Why |
|---|---|---|
| `sc-machin mcp serve` | ✅ | Every MCP client gets all tools — network effect |
| `skills.match` built-in | ✅ | Semantic discovery layer — agents depend on it |
| `alternatives` in `--json` | ✅ | Cross-runtime — agents never leave the ecosystem |
| `sc ask` stuck suggestions | ✅ | Agent UX — reduces churn to non-sc tools |
| One more plugin in `plugins/` | ❌ | Distribution (already won) — diminishing returns |
| Faster `sc-zig` startup | ❌ | Polish, not platform |
| `sc store` (marketplace) | ✅ | Third-party economy — the monopoly becomes a market |
| `sc plan` / `sc act` / `sc review` | ✅ | Agents declare intent, not individual tools — lock-in |
| Plugin scoring & curation | ✅ | Quality signal — the platform curates, not just collects |

**Corollary:** when stuck between two features, pick the one that makes agents
depend on `sc` more. A feature an agent can bypass is distribution; a feature
an agent can't work without is platform.

## Capability matrix

| Capability | Status | Notes |
|---|---|---|
| **Distribution** — 6,000+ plugins, 8,000+ commands | ✅ | Won. The moat. |
| **Multi-runtime** — sc, sc-zig, sc-machin | ✅ | Same plugin state, same envelope. Cross-runtime `alternatives` in `--json`. |
| **MCP server** — `sc-machin mcp serve` | ✅ | All commands as MCP tools. JSON-RPC 2.0 over stdio. |
| **Semantic skill discovery** — `skills.match` | ✅ | Built into sc-machin. Searches 7 skill dirs. |
| **Token-reduced ops** — `rtk` passthrough | ✅ | 60-90% token savings on git/ls via MCP. |
| **Agent bootstrap** — `sc --json` | ✅ | Every session starts here. Alternatives field guides runtime choice. |
| **Plugin install/update** | ✅ | `sc plugins install` (Node.js sc). sc-zig/sc-machin delegate. |
| **Plugin registry** — `meta.json` convention | ✅ | Isolated plugin dirs, no shared-file conflicts. Auto-generated `catalog.json`. |
| **Agent SDK** — Node/Python/Rust | ❌ | ROADMAP Q3 2026. Agents embed `sc` calls natively. |
| **`sc plan` / `sc act` / `sc review`** | ❌ | ROADMAP Q4 2026. Intent-level workflows. |
| **`sc store`** — plugin marketplace | ❌ | ROADMAP Q4 2026. Third-party publishing. |
| **Plugin scoring & curation** | ❌ | ROADMAP Q3 2026. "Verified" plugins. |
| **Cloud execution** — remote runners | ❌ | ROADMAP Q1 2027. First paid product. |
| **Agent memory** — `sc remember` / `sc recall` | ❌ | ROADMAP Q2 2027. Persistent context. |
| **Policy engine** — `deny`, `require-approval`, `audit` | ❌ | ROADMAP Q3 2027. Enterprise wedge. |
| **`sc ai`** — unified LLM gateway | ❌ | ROADMAP Q4 2027. Smart mode for any command. |

## What we're not doing

- **Not building a better CLI.** The CLI is done. We're building the runtime
  layer on top of it.
- **Not competing with MCP.** We're the largest MCP server (6,000+ tools via
  `sc-machin mcp serve`). MCP is the protocol; SuperCLI is the content.
- **Not building a new plugin format.** The `plugin.json` + `meta.json`
  convention works. The `sc store` will use it, not replace it.
- **Not picking a runtime winner.** sc, sc-zig, and sc-machin co-exist. The
  `alternatives` field is the feature, not a migration path.

## The next move

The capability matrix shows the platform gaps: **Agent SDK**, **`sc plan/act/review`**,
and **`sc store`** are the next three platform moves (ROADMAP Q3-Q4 2026).
Everything we've shipped recently (MCP server, skills.match, alternatives,
stuck suggestions) was the foundation — making `sc` the thing agents can't
work without. The next moves turn that dependency into a marketplace.
