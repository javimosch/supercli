---
name: context-mode
description: Use this skill when the user wants to optimize context window usage for AI coding agents, sandbox tool outputs, index files for knowledge base search, or manage context-mode installation and configuration.
---

# context-mode Plugin

Context window optimization for AI coding agents. Sandboxes tool output with up to 98% reduction across 12 platforms. Includes sandbox tools (ctx_search, ctx_index, ctx_execute) and meta-tools (ctx_stats, ctx_doctor, ctx_insight).

## Commands

### Context Management
- `context-mode ctx doctor` — Validate context-mode installation and runtimes
- `context-mode ctx stats` — Show context-mode statistics
- `context-mode ctx search` — Search the knowledge base
- `context-mode ctx index` — Index files or content into the knowledge base
- `context-mode ctx execute` — Execute a command within the sandbox

### Utility
- `context-mode self version` — Print context-mode version
- `context-mode _ _` — Passthrough to context-mode CLI

## Usage Examples
- "Check context-mode health"
- "Index this project for knowledge base search"
- "Search the knowledge base for how auth is implemented"
- "Run this command in the sandbox"
- "Show context-mode stats"

## Installation

```bash
npm install -g context-mode
```

### Platform-Specific Setup

**Claude Code:**
```
/plugin marketplace add mksglu/context-mode
/plugin install context-mode@context-mode
```
Restart Claude Code, then verify:
```
/context-mode:ctx-doctor
```

**Gemini CLI:**
Add to `~/.gemini/settings.json`:
```json
{
  "mcpServers": {
    "context-mode": { "command": "context-mode" }
  }
}
```

**Generic MCP:**
```bash
claude mcp add context-mode -- npx -y context-mode
```

## Examples

```bash
# Validate installation
context-mode ctx doctor

# Show statistics
context-mode ctx stats

# Index files into knowledge base
context-mode ctx index src/

# Search knowledge base
context-mode ctx search "authentication middleware"

# Execute a command in the sandbox
context-mode ctx execute "find src -name '*.ts' | head -10"

# Purge knowledge base
context-mode _ _ ctx_purge

# Show insights
context-mode _ _ ctx_insight
```

## Key Features
- **Context window optimization** — Reduces tool output by up to 98%
- **Knowledge base** — Indexed file search with FTS5, fuzzy correction, proximity reranking
- **Sandboxed execution** — Safe command execution with output reduction
- **Session continuity** — Persists context across sessions
- **12 platform support** — Claude Code, Gemini CLI, Copilot, Zed, Cursor, Kiro, OpenCode, Pi Agent, OpenClaw, Codex CLI, and more
- **Routing enforcement** — Automatic hook-based routing on supported platforms
- **Smart snippets** — Intelligent code snippet extraction
- **Progressive throttling** — Automatic throttling based on context usage

## Available Sandbox Tools
- **ctx_search** — Search indexed knowledge base
- **ctx_index** — Index files/directories into knowledge base
- **ctx_execute** — Execute commands in sandbox with reduced output
- **ctx_execute_file** — Execute file-based commands
- **ctx_batch_execute** — Batch command execution
- **ctx_fetch_and_index** — Fetch and index remote content

## Available Meta-Tools
- **ctx_stats** — Show context-mode statistics
- **ctx_doctor** — Validate installation
- **ctx_upgrade** — Upgrade context-mode
- **ctx_purge** — Purge knowledge base
- **ctx_insight** — Show context insights

## Notes
- Requires Node.js 18+
- Some platforms require manual routing file setup
- The knowledge base uses SQLite FTS5 for fast full-text search
- Reciprocal Rank Fusion and Proximity Reranking improve search relevance
- TTL cache ensures frequently accessed data stays available
- Debug mode available for troubleshooting
