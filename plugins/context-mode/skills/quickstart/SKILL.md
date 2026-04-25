---
name: context-mode
description: Use context-mode when analyzing large codebases (50+ files), processing long command outputs, or when you need to search content multiple times. Reduces token usage by up to 98% by indexing content instead of showing it in conversation. NOT needed for simple one-off commands or small file sets.
---

# context-mode via supercli

context-mode is a **stateful MCP server** that maintains a SQLite knowledge base. Use it for large-scale analysis where you'd otherwise flood the context window with file contents or command output.

## When to Use context-mode

**USE context-mode when:**
- Analyzing 50+ files or directories
- Running commands that produce 1000+ lines of output
- You need to search the same content multiple times
- Exploring a new codebase structure
- Processing documentation or API specs

**DO NOT use context-mode when:**
- Simple one-off command (e.g., `ls -la`, `cat package.json`)
- Checking 1-10 files
- Quick duplicate checks (use direct bash + `uniq -c`)
- Simple grep/search operations
- The output is already small (< 500 lines)

## For Agents: What You Need to Know

**Daemon auto-starts** on first `sc mcp call` to context-mode. No manual management needed.

**Knowledge base persists** across shell sessions until daemon stops. Index once, search many times.

## Quick Start

```bash
# Verify installation (daemon auto-starts on first call)
sc mcp call --mcp-server context-mode --tool ctx_doctor --input-json '{}' --json

# Check daemon + active servers
sc mcp daemon status --json
```

## Agent Workflows

### Workflow 1: Explore new codebase (50+ files)

When you need to understand a large codebase structure:

```bash
sc mcp call --mcp-server context-mode --tool ctx_batch_execute --input-json '{
  "commands": [
    {"label": "Structure", "command": "find src -type f -name \"*.js\" | head -100"},
    {"label": "Package", "command": "cat package.json"},
    {"label": "Entry points", "command": "grep -r \"main\\|entry\\|app.listen\" src/ --include=\"*.js\" -l"}
  ],
  "queries": ["main entry point", "routes", "dependencies", "server setup"]
}' --json
```

**Result:** Only matching snippets, not full file contents.

### Workflow 2: Index once, search many times

When you'll search the same content repeatedly:

```bash
# Step 1: Index (call this once)
sc mcp call --mcp-server context-mode --tool ctx_index --input-json '{
  "content": "$(cat path/to/large-file.txt)",
  "source": "docs"
}' --json

# Step 2: Search (call this as many times as needed)
sc mcp call --mcp-server context-mode --tool ctx_search --input-json '{
  "queries": ["authentication", "API keys", "configuration"]
}' --json
```

### Workflow 3: Long command output reduction

For commands that produce massive output (npm test, build logs, etc.):

```bash
sc mcp call --mcp-server context-mode --tool ctx_execute --input-json '{
  "language": "shell",
  "code": "npm test 2>&1",
  "path": "/path/to/project"
}' --json
```

Only relevant test failures/errors shown, not full output.

### Workflow 4: Fetch and index documentation

For external docs or API specs:

```bash
sc mcp call --mcp-server context-mode --tool ctx_fetch_and_index --input-json '{
  "url": "https://docs.example.com/api",
  "source": "api-docs"
}' --json

# Then search
sc mcp call --mcp-server context-mode --tool ctx_search --input-json '{
  "queries": ["authentication", "endpoints", "rate limits"]
}' --json
```

## Tool Reference (for Agents)

| Tool | When to Use | Example |
|---|---|---|
| `ctx_batch_execute` | **Most common** - run commands + index + search in one call | Exploring codebase, analyzing logs |
| `ctx_execute` | Single command with output reduction | Running tests, builds |
| `ctx_index` | Index large text content for later search | Documentation, config files |
| `ctx_search` | Search previously indexed content | Finding specific info in docs |
| `ctx_fetch_and_index` | Fetch URL and index | API docs, external docs |
| `ctx_stats` | Check token savings | Verify context-mode is helping |
| `ctx_doctor` | Verify installation | Troubleshooting |
| `ctx_purge` | Clear knowledge base | Start fresh |

## Agent Best Practices

1. **Start with ctx_doctor** to verify context-mode is working
2. **Use ctx_batch_execute** for most exploration tasks - it's the most efficient
3. **Index first, search later** when you'll query the same content multiple times
4. **Check ctx_stats** occasionally to see token savings
5. **Purge knowledge base** between unrelated tasks to avoid search noise
6. **Use direct bash** for simple one-off commands (ls, cat small files, grep)

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
