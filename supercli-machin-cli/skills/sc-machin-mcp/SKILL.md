---
name: sc-machin-mcp
description: Install and configure sc-machin as an MCP server in Claude Code, Claude Desktop, or any MCP-compatible client. Exposes all SuperCLI commands plus built-in tools (skills.match, rtk passthrough) as MCP tools over JSON-RPC 2.0 stdio. Triggers: mcp server setup, sc-machin mcp serve, claude mcp add, MCP configuration, skills.match, rtk via mcp.
---

# sc-machin MCP Server Setup

`sc-machin mcp serve` exposes all installed SuperCLI commands (800+) plus built-in tools as MCP tools over JSON-RPC 2.0 (JSONL stdio transport). Any MCP client that spawns it gets the full SuperCLI tool graph.

## Quick Install (Claude Code)

```bash
# 1. Build sc-machin (if not already built)
cd ~/ai/supercli/supercli-machin-cli && bash build.sh

# 2. Register at user scope (available in all projects)
claude mcp add supercli -s user -- "$(pwd)/sc-machin" mcp serve

# 3. Verify connection
claude mcp get supercli
# Should show: Status: ✔ Connected
```

## Quick Install (Claude Desktop)

Add to `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "supercli": {
      "command": "/home/user/path/to/sc-machin",
      "args": ["mcp", "serve"]
    }
  }
}
```

## Built-in MCP Tools

Beyond lockfile commands, sc-machin exposes two built-in tools:

### skills.match
Searches all skill directories for SKILL.md files matching a task description. Returns top 5 matches with paths and descriptions.

```
Tool: mcp__supercli__skills_match
Arguments: { "task": "generate a changelog from git history" }
```

Directories scanned: `~/.agents/skills`, `~/.claude/skills`, `~/.config/devin/skills`, `~/.codeium/windsurf/skills`, `.agents/skills`, `.claude/skills`

### rtk passthrough
Run rtk subcommands through MCP to filter output and save 60-90% tokens.

```
Tool: mcp__supercli__rtk____
Arguments: { "_args": "git status" }
```

## Pre-allow Tools (optional)

Add to `~/.claude/settings.json` to skip per-call permission prompts:

```json
{
  "permissions": {
    "allow": [
      "mcp__supercli__skills_match",
      "mcp__supercli__rtk____",
      "mcp__supercli__rtk_analytics_gain",
      "mcp__supercli__yek_serialize_run",
      "mcp__supercli__yek_tree_show",
      "mcp__supercli__yek____",
      "mcp__supercli__agentmemory-cli_memory_save",
      "mcp__supercli__agentmemory-cli_memory_search",
      "mcp__supercli__agentmemory-cli_memory_list",
      "mcp__supercli__agentmemory-cli____"
    ]
  }
}
```

## Tool Naming Convention

- Lockfile commands: `mcp__supercli__<ns>_<res>_<act>` (dots → underscores)
  - e.g. `rtk._._` → `mcp__supercli__rtk____`
  - e.g. `agentmemory-cli.memory.search` → `mcp__supercli__agentmemory-cli_memory_search`
- Built-in tools: `mcp__supercli__<name>` (dots → underscores)
  - e.g. `skills.match` → `mcp__supercli__skills_match`

## How It Works

1. MCP client spawns `sc-machin mcp serve` as a subprocess
2. Client sends `initialize` → server responds with protocol version + capabilities
3. Client sends `tools/list` → server returns all lockfile commands + built-in tools
4. Client sends `tools/call` → server executes and returns result

The server auto-prepends `~/.local/bin` to PATH (MCP clients pass sanitized environments that omit user-level bin dirs).

## Troubleshooting

- **"rtk: not found"** — already handled by PATH fix; if it persists, ensure rtk is in `~/.local/bin/`
- **Tool not in list** — run `sc-machin commands --json` to verify the command is in the lockfile
- **Permission denied** — add the tool to `permissions.allow` in settings.json
- **Connection failed** — verify the binary path is absolute and executable
