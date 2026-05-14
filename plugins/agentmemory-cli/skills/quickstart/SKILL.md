---
name: agentmemory-cli
description: Use this skill when the user needs to save, search, or recall persistent context across AI coding sessions — remembering decisions, patterns, and project knowledge.
---

# agentmemory-cli — Persistent Memory for AI Coding Agents

Save and recall context across sessions from the command line. Zero dependencies, SQLite-backed.

## Installation

```bash
curl -LO https://github.com/javimosch/agentmemory-cli/releases/latest/download/agentmemory-cli-linux-amd64
chmod +x agentmemory-cli-linux-amd64
mv agentmemory-cli-linux-amd64 ~/.local/bin/agentmemory-cli
```

## Commands

- `agentmemory-cli memory save <text> --project <name> --tags <a,b,c>` — Save a memory
- `agentmemory-cli memory search <query> --project <name>` — Search memories
- `agentmemory-cli memory list --limit <n>` — List recent memories
- `agentmemory-cli memory forget <id>` — Delete by ID
- `agentmemory-cli memory stats` — Show memory statistics
- `agentmemory-cli _ _ demo` — Seed demo data

## Usage Examples

- "Save this: JWT auth uses jose middleware in src/middleware/auth.ts with project myapp and tags auth,jwt"
- "Search for database optimization patterns"
- "What did we decide about the API structure?"
- "Show me all memories related to deployment"

## Key Features
- Full-text search with LIKE fallback
- Projects and tags for organization
- JSON output (--json) for scripting
- Zero external dependencies (compiled binary)
- Data stored in ~/.agentmemory/memory.db
