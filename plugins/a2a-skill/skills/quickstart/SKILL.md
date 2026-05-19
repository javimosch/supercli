---
name: a2a-skill
description: Use this skill when agents need to communicate peer-to-peer via the a2a shared SQLite bus. Register agents, send/receive messages, broadcast announcements, search conversation history, and monitor bus stats — all without a central orchestrator.
---

# a2a-skill Plugin — Quickstart Guide

The **a2a-skill** plugin wraps the [a2a](https://github.com/javier-arancibia/a2a-skill) agent-to-agent messaging system for SuperCLI. It lets any number of AI coding agents (Claude Code, OpenCode, pi, ...) share messages over a local SQLite bus.

## Architecture

```
Agent A (Claude) ──┐
                   ├──► ~/.a2a/{project}/database.db (WAL mode)
Agent B (OpenCode) ─┘      ▲
                            │
Agent C (pi) ──────────────┘
```

- **No central orchestrator** — agents write to and read from the same SQLite database
- **Per-agent read tracking** — each agent sees messages independently
- **Broadcast support** — send a message to `all` / `*` to reach every registered agent
- **Thread support** — group messages under a `--thread` ID for topic-based conversations
- **TTL support** — messages auto-expire after N seconds
- **WAL mode** — safe for concurrent writers from different processes

## Prerequisites

```bash
# 1. Install a2a
git clone https://github.com/javier-arancibia/a2a-skill.git
cd a2a-skill
chmod +x install.sh && ./install.sh

# 2. Verify
a2a init
a2a list

# 3. Install the SuperCLI plugin (if not already)
supercli plugins install ./plugins/a2a-skill --on-conflict replace --json
```

## Available Commands

All commands are invoked via `sc a2a-skill <resource> <action>`.

### Self
| Command | Description |
|---------|-------------|
| `sc a2a-skill self version` | Show a2a help/info |
| `sc a2a-skill self learn` | Teach the agent this quickstart guide |

### Project Management
| Command | Description |
|---------|-------------|
| `sc a2a-skill project init --project my-team` | Create a new project database |
| `sc a2a-skill project info --project my-team` | Show project info (path, exists) |

### Agent Management
| Command | Description |
|---------|-------------|
| `sc a2a-skill agent register alice --role researcher --cli claude` | Register an agent |
| `sc a2a-skill agent register bob --role critic --cli opencode --upsert` | Register or update |
| `sc a2a-skill agent list` | List all registered agents (JSON) |
| `sc a2a-skill agent status done --as alice` | Update agent state (active/idle/done/blocked) |
| `sc a2a-skill agent unregister bob` | Remove an agent from the bus |

### Messaging
| Command | Description |
|---------|-------------|
| `sc a2a-skill message send alice "hello" --from bob` | Send a direct message |
| `sc a2a-skill message send all "status check" --from alice` | Broadcast to all agents |
| `sc a2a-skill message recv --as alice` | Fetch unread messages |
| `sc a2a-skill message recv --as alice --wait 10` | Block 10s waiting for messages |
| `sc a2a-skill message peek --limit 10` | Peek at recent bus activity |
| `sc a2a-skill message thread T-42 --json` | Show all messages in a thread |
| `sc a2a-skill message search "bug AND critical" --json` | Full-text search |
| `sc a2a-skill message wait --as alice --count 3 --timeout 30` | Wait for N messages |

### Bus Management
| Command | Description |
|---------|-------------|
| `sc a2a-skill stats show` | Show bus statistics |
| `sc a2a-skill clear run --yes` | Delete the project database |

### Passthrough (any raw a2a command)
```
sc a2a-skill _ _ init
sc a2a-skill _ _ list --json
sc a2a-skill _ _ send all "hello world" --from alice --project my-team
```

## Quickstart Workflow

```bash
# 1. Initialize the project
sc a2a-skill project init --project my-sprint

# 2. Register agents
sc a2a-skill agent register alice --role researcher --cli claude
sc a2a-skill agent register bob --role critic --cli opencode

# 3. Alice sends a message to Bob
sc a2a-skill message send bob "Review this plan: ..." --from alice --thread PLANNING

# 4. Bob receives
sc a2a-skill message recv --as bob

# 5. Bob replies
sc a2a-skill message send alice "Looks good, one concern: ..." --from bob --thread PLANNING

# 6. Alice checks for replies (blocks 15s)
sc a2a-skill message recv --as alice --wait 15

# 7. Broadcast update to everyone
sc a2a-skill message send all "Sprint planning complete" --from alice --thread PLANNING

# 8. Check bus stats
sc a2a-skill stats show

# 9. Search conversation history
sc a2a-skill message search "planning" --json
```

## Agent-to-Agent Coordination Patterns

### Task Claim Protocol
Use broadcast messages for coordination:
```bash
# Agent claims a task
sc a2a-skill message send all "CLAIM: fix login bug — alice" --from alice

# Other agent backs off
sc a2a-skill message send all "ACK-CLAIM: alice backing off from login bug — bob" --from bob
```

### Status Updates
```bash
# Mark yourself done when finished
sc a2a-skill agent status done --as alice

# Check who's still active
sc a2a-skill agent list --json
```

### Role-Based Workflows
```bash
# Register with roles
sc a2a-skill agent register reviewer --role code-reviewer --cli claude --upsert
sc a2a-skill agent register tester --role qa-engineer --cli opencode --upsert

# Reviewer asks tester to verify
sc a2a-skill message send tester "PR #42 needs QA verification" --from reviewer --thread PR-42
```

## Best Practices

1. **Always register before sending** — `a2a send` and `a2a recv` verify the agent exists
2. **Use `--upsert` for re-registration** — avoids "already registered" errors
3. **Use `--wait` for blocking recv** — agents that poll in a loop will spin
4. **Use `--thread` for topic grouping** — makes `a2a thread <id>` and `a2a search` more useful
5. **Set `--ttl` for ephemeral messages** — CLAIM status updates can expire after 5 minutes
6. **Use `--json` for programmatic consumption** — all major commands support JSON output
7. **Use `--peek` to inspect without marking read** — useful for monitoring agents
8. **Use project-level isolation** — different teams/projects get different databases

## Key Concepts

- **The bus is the source of truth** — anything not on the bus didn't happen
- **Read-tracking is per-agent** — a broadcast is "seen" once by each agent, individually
- **No locking** — coordination is by convention (use the Task Claim protocol)
- **WAL mode** — safe for concurrent writers from different processes
- **Zero external dependencies** — only Python stdlib + sqlite3

## Further Reading

- [a2a-skill GitHub Repository](https://github.com/javier-arancibia/a2a-skill)
- `sc a2a-skill self version` — CLI reference
- `a2a --help` — all commands and flags

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `a2a: no python3 with sqlite3` | Set `A2A_PYTHON=/path/to/python3` or install sqlite3 module |
| `no a2a project at...` | Run `a2a init` or `sc a2a-skill project init` first |
| `unknown sender` | Register the agent first: `a2a register <id>` |
| `already registered` | Use `--upsert` flag when re-registering |
| Bus is empty | Make sure agents are registered and messages were sent with correct sender IDs |
| Concurrent writer issues | Check WAL mode: `a2a exec "PRAGMA journal_mode"` should return `wal` |
| Agents don't see each other's messages | Likely a project mismatch. All agents must use the same `--project` or `A2A_PROJECT`. See "Common pitfalls" below. |
| Empty log files from spawned agents | Normal — CLIs buffer stdout. Check `a2a peek` or `ps aux` instead. |
| `--project` flag doesn't work | The Go binary expects `--project` AFTER the subcommand (`a2a peek --project X`). The Python script expects it BEFORE (`a2a.py --project X peek`). Use `A2A_PROJECT` env var for safest results. |

## Common pitfalls

These were discovered while smoke-testing a2a with spawned agents. Future
agents should review this before using the CLI.

### `A2A_PROJECT` must be exported, not just set

When spawning background agents (Pattern 3), the spawned process inherits the
parent's environment. Writing `A2A_PROJECT=myproject` without `export` means
the spawned agent won't see it. It falls back to `basename($PWD)`, which may
resolve to the wrong project.

```bash
# WRONG — not exported, spawned agents won't see it
A2A_PROJECT=myteam
a2a-spawn --cli claude --id alice ...

# RIGHT — export before spawning
export A2A_PROJECT=myteam
a2a-spawn --cli claude --id alice ...

# ALSO RIGHT — use --project explicitly in every a2a command
a2a send bob "hello" --from alice --project myteam
```

### `--project` flag position: Go binary vs Python

The installed `a2a` at `~/.local/bin/a2a` may be a Go binary (check with
`file $(which a2a)`). The Go binary and the Python `a2a.py` expect `--project`
in different positions:

| Binary | Correct syntax | Wrong syntax |
|--------|---------------|--------------|
| **Go** (`~/.local/bin/a2a`) | `a2a peek --project X` | `a2a --project X peek` ✗ |
| **Python** (`a2a.py`) | `python3 a2a.py --project X peek` | `python3 a2a.py peek --project X` ✗ |

**Safest:** Use the `A2A_PROJECT` env var — it works identically for both.

```bash
export A2A_PROJECT=myteam
a2a peek --limit 10    # works for Go AND Python
```

### Empty agent logs ≠ stuck agent

When spawning via `a2a-spawn`, log files (`--log FILE`) may appear empty for
minutes. CLIs like `claude` buffer stdout and flush only on exit. Don't assume
the agent is stuck.

**Check progress via the bus instead:**

```bash
ps aux | grep claude              # verify process is running
sc a2a-skill agent list           # check agent status (active? done?)
sc a2a-skill message peek         # see if any messages were sent
```

### Cross-project contamination is invisible

If agents end up on different projects (each resolves `basename($PWD)` to a
different name), they silently write to different databases. No error, no
warning — they just never see each other.

**Fix:** Always verify:

```bash
sc a2a-skill project info    # check which project you're on
sc a2a-skill agent list      # verify all expected agents are visible
```

### Kit prompts must be project-aware

When writing kit prompts for spawned agents, never assume `A2A_PROJECT` is
set in the spawned environment. Either export it before spawning, or include
`--project $PROJECT` in every `a2a` command within the kit.

### Register PIDs with the right project

Running `a2a register alice --pid 1234 --upsert` uses the *current* project.
If `A2A_PROJECT` isn't set correctly, the PID is registered on the wrong bus.
Pass `--project` or verify `A2A_PROJECT` before running.
