---
name: witr
description: Use this skill when the user needs to understand why a process, service, or port is running — tracing ancestry, supervisors, containers, and service managers.
---

# witr — Why Is This Running?

CLI tool that answers "Why is this running?" by tracing process ancestry chains, supervisor relationships (systemd, launchd, Docker, PM2, tmux, SSH), containers, and service managers.

## Installation

```bash
brew install witr
```

## Commands

- `witr process explain <name>` — Explain why a process is running
- `witr process explain --pid <n>` — Explain by PID
- `witr process explain --port <n>` — Explain what's on a port
- `witr process ancestry <name>` — Show just the ancestry chain
- `witr process tree <name>` — Show ancestry as a tree
- `witr process json <name>` — JSON output for scripting

## Usage Examples

- "Why is nginx running on this server?"
- "What process is using port 3000?"
- "Show me the ancestry chain for PID 1234"
- "What started this node process?"
- "Check if postgres is running and how it was started"

## Key Features

- Explains why a process exists, not just that it exists
- Traces: systemd, launchd, Docker, Podman, PM2, cron, tmux, SSH, and more
- Detects containers, git repos, working directory, environment variables
- Detects warnings: elevated permissions, public bindings, high memory, deleted binaries
- JSON output for automation
- Cross-platform: Linux, macOS, Windows, FreeBSD
