---
name: context-mode
description: Use this skill when you want to optimize context window usage, sandbox tool outputs, index files/URLs into a searchable knowledge base, or run commands with reduced output. context-mode reduces token usage by up to 98% by keeping raw output out of the conversation.
---

# context-mode via supercli

context-mode is a **stateful MCP server** that maintains a SQLite knowledge base and session history. In supercli, it runs via the **MCP daemon** — a persistent background process that keeps context-mode alive so its knowledge base survives between your one-shot `sc` CLI calls.

## For Agents: What You Need to Know

**You do not need to start or manage the daemon.** The daemon auto-starts on your first `sc mcp call` to context-mode. Every subsequent call in any shell reuses the same daemon process and the same knowledge base.

**The knowledge base is global and persistent** across shell sessions until the daemon is stopped. This means:
- You can index content in one call, search it in the next
- `ctx_stats` shows accumulated session history
- Restarting the daemon clears in-memory session state but not the SQLite KB

**Zero setup required** — just call the tools directly.

## Quick Start

```bash
# Verify installation (daemon auto-starts on first call)
sc mcp call --mcp-server context-mode --tool ctx_doctor --input-json '{}' --json

# Check daemon + active servers
sc mcp daemon status --json
```

## Core Agent Workflow

### Pattern: Explore codebase with 98% context reduction

Instead of reading dozens of files and flooding your context window, use `ctx_batch_execute` to run commands, auto-index results, and search — all in one call:

```bash
sc mcp call --mcp-server context-mode --tool ctx_batch_execute --input-json '{
  "commands": [
    {"label": "Package", "command": "cat package.json"},
    {"label": "Source tree", "command": "find src -name \"*.js\" | head -40"},
    {"label": "Routes", "command": "grep -r \"router\\|app.get\\|app.post\" src/ --include=\"*.js\" -l"}
  ],
  "queries": ["entry point", "routes", "dependencies"]
}' --json
```

The result contains only the matched snippets, not the full raw output.

### Pattern: Index once, search many times

```bash
# Call 1 — index your docs or a large file
sc mcp call --mcp-server context-mode --tool ctx_index --input-json '{
  "content": "... large content ...",
  "source": "my-docs"
}' --json

# Call 2 (new shell, new process — knowledge persists in daemon)
sc mcp call --mcp-server context-mode --tool ctx_search --input-json '{
  "queries": ["authentication", "token expiry"]
}' --json
```

### Pattern: Execute a command with reduced output

```bash
sc mcp call --mcp-server context-mode --tool ctx_execute --input-json '{
  "language": "shell",
  "code": "npm test 2>&1 | tail -50",
  "path": "/path/to/project"
}' --json
```

### Pattern: Fetch and index a URL

```bash
sc mcp call --mcp-server context-mode --tool ctx_fetch_and_index --input-json '{
  "url": "https://docs.example.com/api",
  "source": "api-docs"
}' --json
```

## All Available Tools

| Tool | Purpose |
|---|---|
| `ctx_batch_execute` | Run commands + auto-index + search in one call. **Use this most.** |
| `ctx_execute` | Run a single command in sandbox with reduced output |
| `ctx_index` | Manually index text content into knowledge base |
| `ctx_search` | Search previously indexed content |
| `ctx_fetch_and_index` | Fetch a URL, index it, then search |
| `ctx_stats` | Session statistics and accumulated savings |
| `ctx_doctor` | Verify installation and runtimes |
| `ctx_purge` | Clear the knowledge base |
| `ctx_upgrade` | Upgrade context-mode binary |
| `ctx_insight` | Context insights and recommendations |

## Daemon Commands (for humans)

```bash
sc mcp daemon start          # Start daemon manually
sc mcp daemon stop           # Stop daemon (clears session state)
sc mcp daemon restart        # Restart daemon
sc mcp daemon status         # Show status + active MCP servers
sc mcp daemon stop-server context-mode  # Kill just the context-mode process
```

## Installation

```bash
npm install -g context-mode
sc plugins install ./plugins/context-mode --on-conflict replace --json
# post-install: registers as stateful MCP server + starts daemon automatically
```

Verify after install:
```bash
sc mcp list --json        # should show context-mode with stateful:true
sc mcp daemon status      # should show daemon running
sc mcp call --mcp-server context-mode --tool ctx_doctor --input-json '{}' --json
```

## Other Platforms

**Claude Code:**
```
/plugin marketplace add mksglu/context-mode
/plugin install context-mode@context-mode
```

**Gemini CLI** — add to `~/.gemini/settings.json`:
```json
{
  "mcpServers": { "context-mode": { "command": "context-mode" } },
  "hooks": {
    "BeforeTool": [{"matcher": "run_shell_command|read_file", "hooks": [{"type": "command", "command": "context-mode hook gemini-cli beforetool"}]}],
    "AfterTool": [{"matcher": "", "hooks": [{"type": "command", "command": "context-mode hook gemini-cli aftertool"}]}],
    "PreCompress": [{"matcher": "", "hooks": [{"type": "command", "command": "context-mode hook gemini-cli precompress"}]}],
    "SessionStart": [{"matcher": "", "hooks": [{"type": "command", "command": "context-mode hook gemini-cli sessionstart"}]}]
  }
}
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
