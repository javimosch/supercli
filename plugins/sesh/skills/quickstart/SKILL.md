---
name: sesh
description: Use this skill when the user wants to list, switch, or create terminal multiplexer sessions (tmux/zellij) by name, path, or git repo with sesh.
---

# sesh Plugin

sesh unifies tmux sessions, tmuxinator projects, sesh config entries, and zoxide-ranked directories into one list, then `sesh connect` attaches/creates the right session. `--json` on `sesh list` is designed for scripting.

## Commands

### Sessions
- `sesh session list` — Sessions, configs, and zoxide dirs (`--json`, `--icons`, `--format`)
- `sesh session connect` — Attach or create a session by name/path
- `sesh session last` — Jump to the previously active session
- `sesh session clone` — `git clone` a repo and connect to it
- `sesh session preview` — Peek at a session's directory
- `sesh session root` — Print the project root used for session naming
- `sesh _ _` — Passthrough (`sesh cn`, `sesh icon`, `sesh list -h`, ...)

## Usage Examples

- "List all my tmux sessions and project dirs as JSON"
- "Connect to a session for ~/ai/supercli"
- "Clone this repo and drop me into a session for it"
- "Switch back to the session I was just in"

## Installation

```bash
go install github.com/joshmedeski/sesh/v2@latest
```

## Examples

```bash
sesh list                       # human-readable list
sesh list --json                # machine-readable (agents/scripts)
sesh connect supercli           # attach/create by name
sesh connect ~/ai/supercli      # attach by path (root-resolved)
sesh clone https://github.com/arp242/uni
sesh last                       # previous session
```

## Key Features

- Multiplexer-agnostic: tmux, zellij, wezterm, psmux
- zoxide frecency ranking surfaces your real working dirs first
- `sesh connect` is idempotent — attaches if the session exists, creates if not
- `--json`/`--icons`/`--format` output modes for pickers and agents
