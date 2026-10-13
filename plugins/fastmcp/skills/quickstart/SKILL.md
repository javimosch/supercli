---
name: fastmcp
description: Use this skill when the user wants to build, run, inspect, or install MCP servers with FastMCP — the pythonic MCP framework.
---

# fastmcp Plugin

FastMCP is the dominant Python framework for MCP servers/clients. The `fastmcp` CLI runs servers over stdio/HTTP/SSE, opens the MCP Inspector for live tool testing, dumps a server's manifest, and installs servers into agent CLIs.

## Commands

### Server
- `fastmcp server run <server>` — Run a server (`--transport stdio|http|sse`, `--port`); also proxies remote servers (`fastmcp run https://...`)
- `fastmcp server dev <server>` — Dev mode with MCP Inspector UI (needs npx)
- `fastmcp server inspect <server>` — Print tools/resources/prompts (`--format fastmcp|json`)
- `fastmcp server install` — `fastmcp install <target> <server.py>` → claude-code, cursor, claude-desktop, gemini-cli, mcp-json

### Project
- `fastmcp project init` — Create `fastmcp.toml` in cwd
- `fastmcp _ _` — Passthrough (`list`, `copy`, `env`, `project prepare`, ...)

## Usage Examples

- "Run my MCP server over HTTP on port 8000"
- "Show me the tools this server exposes, as JSON"
- "Install server.py into Claude Code"

## Installation

```bash
pip install fastmcp      # or: uv tool install fastmcp; uvx fastmcp for one-offs
```

`fastmcp dev` needs Node.js for the MCP Inspector.

## Examples

```bash
# Minimal server (server.py)
# from fastmcp import FastMCP
# mcp = FastMCP("demo")
# @mcp.tool
# def add(a: int, b: int) -> int: return a + b

fastmcp run server.py                          # stdio transport
fastmcp run server.py --transport http --port 8000
fastmcp inspect server.py --format json
fastmcp install claude-code server.py
```

## Key Features

- Decorator API: `@mcp.tool`, `@mcp.resource`, `@mcp.prompt` → full MCP server in ~10 lines
- Transports: stdio (agents), HTTP/SSE (networked); can also **proxy** existing remote servers
- `inspect` dumps the manifest without launching — great for CI checks
- `install` wires servers into Claude Code, Cursor, Claude Desktop, Gemini CLI
