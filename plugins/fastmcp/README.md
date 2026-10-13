# fastmcp Plugin for SuperCLI

[FastMCP](https://github.com/jlowin/fastmcp) is the fast, pythonic way to build
MCP servers and clients — decorators for tools/resources/prompts, plus proxying
and composition. The `fastmcp` CLI runs servers over stdio/HTTP/SSE, launches
the MCP Inspector, and installs servers into agent CLIs.

## Installation

```bash
# Install fastmcp binary
pip install fastmcp            # or: uv tool install fastmcp / uvx fastmcp

# Install supercli plugin
supercli plugins install ./plugins/fastmcp
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli fastmcp self version` | Show FastMCP version |
| `supercli fastmcp server run <server>` | Run an MCP server |
| `supercli fastmcp server dev <server>` | Dev mode + MCP Inspector |
| `supercli fastmcp server inspect <server>` | Dump tools/resources/prompts |
| `supercli fastmcp server install` | Install into Claude Code/Cursor/Desktop |
| `supercli fastmcp project init` | Create fastmcp.toml |
| `supercli fastmcp <any>` | Passthrough to fastmcp CLI |

## Usage

```bash
# A 10-line server: server.py
# from fastmcp import FastMCP
# mcp = FastMCP("demo")
# @mcp.tool
# def add(a: int, b: int) -> int: return a + b

supercli fastmcp server run server.py                        # stdio
supercli fastmcp server run server.py --transport http --port 8000
supercli fastmcp server inspect server.py --format json
supercli fastmcp server install claude-code server.py
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
