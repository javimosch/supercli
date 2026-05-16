---
name: paseo
description: Use this skill when the user wants to orchestrate AI coding agents — start/stop daemon, run agents, send tasks, monitor progress across Claude Code, Codex, and OpenCode.
---

# Paseo — Agent Orchestration Platform

One interface for Claude Code, Codex, and OpenCode. Self-hosted daemon. CLI, mobile, desktop, web.

## Skills Indexed (7)

Auto-discovered via `remote_repo` from `getpaseo/paseo`:
```bash
sc skills search "handoff" --provider paseo
sc skills get paseo:paseo-handoff
sc skills get paseo:paseo-loop
sc skills get paseo:paseo-advisor
sc skills get paseo:paseo-committee
sc skills get paseo:paseo-epic
sc skills get paseo:paseo-orchestrate
```

## Quick Start

```bash
npm install -g @getpaseo/cli
sc paseo daemon start                # Start daemon
sc paseo daemon status               # Check health
sc paseo agent run --detach "fix login bug"   # Deploy agent
sc paseo agent list                  # List agents
sc paseo agent logs <id>             # View logs
```

## Commands

### Daemon
- `sc paseo daemon start [flags]` — start daemon (port, listen, home, foreground, relay, mcp)
- `sc paseo daemon stop` — stop daemon
- `sc paseo daemon status` — check daemon health
- `sc paseo self version` — print version
- `sc paseo self mcp` — register MCP server

### Agent
- `sc paseo agent run <prompt>` — run agent with task (detach, provider, model, thinking, mode, worktree, image, cwd, label, wait-timeout, output-schema)
- `sc paseo agent list [-a]` — list agents (include archived)
- `sc paseo agent send <id> [msg]` — send message (prompt, prompt-file, image, no-wait)
- `sc paseo agent logs <id>` — view logs (follow, tail, filter, since)

### Global Flags
- `--host <host>` — connect to remote daemon
- `--json` — JSON output
- `--quiet` — minimal output

## Requirements

- Node.js 18+
- `npm install -g @getpaseo/cli` (500+ deps, ~2 min install)
- At least one agent CLI: Claude Code, Codex, or OpenCode

## Tips

- Start daemon first, then run agents
- Use `--detach` to run agents in background
- Use `--provider codex/gpt-5.4` to specify provider and model
- `paseo run` in foreground (no `--detach`) waits for completion
- Combine with skills for multi-agent workflows (handoff, loop, committee)
