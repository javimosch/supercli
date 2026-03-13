# cocoindex-code Plugin Harness

This plugin integrates `cocoindex-code` into supercli with automatic local MCP server registration and a bound semantic search capability.

## What You Get

- auto-registers local MCP server `cocoindex-code`
- bound capability: `supercli cocoindex code search`
- helper capability: `supercli cocoindex index build`
- learn content via `supercli plugins learn cocoindex-code`

## Prerequisites

Install `cocoindex-code` first (choose one):

```bash
pipx install cocoindex-code
# or
uv tool install --upgrade cocoindex-code --prerelease explicit --with "cocoindex>=1.0.0a24"
```

Verify binary availability:

```bash
cocoindex-code --help
```

## Install Plugin

```bash
supercli plugins learn cocoindex-code
supercli plugins install cocoindex-code --json
```

## Wrapped Capabilities

```bash
# Build/refresh index first (recommended for large repos)
supercli cocoindex index build --json

# Semantic code search
supercli cocoindex code search --query "where is auth middleware implemented" --limit 5 --json
supercli cocoindex code search --query "session handling" --offset 5 --json
```

## Notes

- `cocoindex code search` maps to MCP tool `search` on server `cocoindex-code`.
- For advanced MCP input fields such as `languages` or `paths`, use direct MCP call:

```bash
supercli mcp call --mcp-server cocoindex-code --tool search --input-json '{"query":"auth","languages":["python"],"paths":["src/*"],"limit":5}' --timeout-ms 180000 --json
```

- By default, cocoindex-code auto-discovers root from `.cocoindex_code/`, `.git/`, or current directory.
- Optional env vars: `COCOINDEX_CODE_ROOT_PATH`, `COCOINDEX_CODE_EMBEDDING_MODEL`, `COCOINDEX_CODE_EXCLUDED_PATTERNS`.
