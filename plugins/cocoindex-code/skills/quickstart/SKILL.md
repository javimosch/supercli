---
name: cocoindex-code.quickstart
description: Install cocoindex-code, auto-register MCP via supercli plugin install, then prefer the fast direct search capability for repository search; keep MCP search for MCP-native flows.
tags: cocoindex,mcp,semantic-search,code,agents
---

# cocoindex-code Quickstart

Use this when you need semantic code search over a repository via SuperCLI.

Prefer `supercli cocoindex code search` for normal bot and human usage. It is the easiest and fastest path.

## 1) Install upstream binary

```bash
pipx install cocoindex-code
# or
uv tool install --upgrade cocoindex-code --prerelease explicit --with "cocoindex>=1.0.0a24"
```

## 2) Install plugin (auto MCP registration)

```bash
supercli plugins learn cocoindex-code
supercli plugins install cocoindex-code --json
```

This creates MCP server `cocoindex-code` (if missing) and binds capabilities `cocoindex.code.search` and `cocoindex.mcp.search`.

## 3) Build index once (recommended)

```bash
supercli cocoindex index build --json
```

For small repos this is optional; indexing can happen on first search.

## 4) Preferred search flow (humans and bots)

```bash
supercli cocoindex code search --query "how are sessions stored" --limit 5 --json
supercli cocoindex code search --query "error handling middleware" --offset 5 --json
supercli cocoindex code search --query "entrypoint reads process.argv rawArgs and parses flags" --paths "cli/*" --limit 5 --json
```

`cocoindex code search` runs directly against the installed `cocoindex-code` package, so it avoids MCP server startup overhead and targets the current repo by default.

## 5) MCP-native search (optional)

```bash
supercli cocoindex mcp search --query "how are sessions stored" --limit 5 --json
```

Use this only when you explicitly need MCP-native execution.

## 6) Advanced search with language/path filters

```bash
supercli mcp call --mcp-server cocoindex-code --tool search --input-json '{"query":"database connection","languages":["typescript"],"paths":["src/*"],"limit":10}' --timeout-ms 180000 --json
```

## Optional Configuration

```bash
export COCOINDEX_CODE_ROOT_PATH=/path/to/repo
export COCOINDEX_CODE_EMBEDDING_MODEL=sbert/nomic-ai/CodeRankEmbed
```

`COCOINDEX_CODE_EXCLUDED_PATTERNS` expects a JSON array string, for example:

```bash
export COCOINDEX_CODE_EXCLUDED_PATTERNS='["**/generated/**","**/*.snap"]'
```
