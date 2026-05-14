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
- `witr process explain systemd-journald` — Explain a specific process
- `witr _ _ --exact <name>` — Exact name match (passthrough)
- `witr _ _ --pid <n>` — Explain by PID
- `witr _ _ --port <n>` — Explain what's on a port
- `witr _ _ --json <name>` — JSON output
- `witr self version` — Print version

## Usage Examples

- "Why is nginx running on this server?"
- "What process is using port 3000?"
- "Show me the ancestry chain for PID 1234"
- "What started this postgres process?"
- "Check if there's a process listening on port 8080"

## Key Features

- Explains why a process exists, not just that it exists
- Traces: systemd, launchd, Docker, Podman, PM2, cron, tmux, SSH, and more
- Detects containers, git repos, working directory, environment variables
- Detects warnings: root process, public bindings, high memory, deleted binaries
- Cross-platform: Linux, macOS, Windows, FreeBSD
- JSON output for automation
