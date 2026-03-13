---
skill_name: cocoindex-code.quickstart
description: Install cocoindex-code, auto-register MCP via supercli plugin install, then run semantic code search through bound capabilities.
tags: cocoindex,mcp,semantic-search,code,agents
---

# cocoindex-code Quickstart

Use this when you need semantic code search over a repository via SuperCLI.

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

This creates MCP server `cocoindex-code` (if missing) and binds capability `cocoindex.code.search`.

## 3) Build index once (recommended)

```bash
supercli cocoindex index build --json
```

For small repos this is optional; indexing can happen on first search.

## 4) Run semantic search capability

```bash
supercli cocoindex code search --query "how are sessions stored" --limit 5 --json
supercli cocoindex code search --query "error handling middleware" --offset 5 --json
```

## 5) Advanced search with language/path filters

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
