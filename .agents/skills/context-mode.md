---
name: context-mode
description: Use context-mode (via supercli MCP) for large codebase analysis (50+ files), long command outputs, or repeated searches. Reduces token usage by up to 98%. NOT for simple commands or small file sets.
---

# context-mode Decision Guide

context-mode is an MCP server accessed via supercli. It maintains a persistent knowledge base across sessions.

## Quick Decision Tree

**Task size?**
- Small (1-10 files, < 500 lines output) → Use direct bash/read_file
- Large (50+ files, 1000+ lines output) → Use context-mode via supercli

**Will you search the same content multiple times?**
- Yes → Use context-mode (index once, search many times)
- No → Use direct tools

## Most Common Workflow (via supercli)

```bash
# 1. Verify context-mode is available
sc mcp list --json

# 2. Verify installation (daemon auto-starts)
sc mcp call --mcp-server context-mode --tool ctx_doctor --input-json '{}' --json

# 3. Explore codebase
sc mcp call --mcp-server context-mode --tool ctx_batch_execute --input-json '{
  "commands": [
    {"label": "Structure", "command": "find . -type f -name \"*.js\" | head -100"},
    {"label": "Package", "command": "cat package.json"}
  ],
  "queries": ["entry point", "dependencies", "routes"]
}' --json

# 4. Search indexed content (if needed)
sc mcp call --mcp-server context-mode --tool ctx_search --input-json '{
  "queries": ["search terms"]
}' --json
```

## Tool Selection Guide

- **ctx_batch_execute**: Default for exploration - runs commands, indexes, searches in one call
- **ctx_index + ctx_search**: When you'll search the same content repeatedly
- **ctx_execute**: Single long-running command (npm test, build)
- **ctx_fetch_and_index**: External documentation or API specs
- **ctx_purge**: Clear knowledge base between unrelated tasks
- **ctx_stats**: Check token savings

## When NOT to Use

- `ls -la`, `cat package.json` → Direct bash
- Checking 1-10 files → read_file
- Quick duplicate check → bash + uniq -c
- Simple grep → Direct grep or Grep tool
- Output < 500 lines → Direct tools

## Installation (if not available)

```bash
npm install -g context-mode
```

Then add to your harness's MCP server configuration with command: `context-mode`
