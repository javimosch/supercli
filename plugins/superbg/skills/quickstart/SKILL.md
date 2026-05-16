---
name: superbg
description: Use this skill when the user wants to run, manage, or monitor background processes on Linux using superbg.
---

# superbg Plugin

Super Background Process Manager — a zero-config CLI to run, track, and manage background processes on Linux. Works with any language (not just Node.js).

## Commands

### Process Management
- `superbg run start <args>` — Run a command in the background
- `superbg list show` — List all tracked processes
- `superbg process stop <id>` — Stop a process (SIGTERM)
- `superbg process kill <id>` — Kill a process (SIGKILL)
- `superbg process status <id>` — Show detailed process info

### Logs
- `superbg logs show <id> [--follow]` — View process logs
- `superbg logs follow <id>` — Follow logs in real-time

## Usage Examples

```bash
# Run a process in background
superbg run start python server.py

# Run with arguments
superbg run start -- node app.js --port 3000

# List all processes
superbg list show

# Check status
superbg process status 1

# View logs
superbg logs show 1

# Follow logs in real-time
superbg logs follow 1

# Stop/Kill
superbg process stop 1
superbg process kill 1
```

## Installation

```bash
go install github.com/javimosch/superbg@latest
```

## Key Features
- Zero-config — no unit files, no config, no daemon
- Works with any language (Python, Node.js, Go, shell scripts, etc.)
- Persistent state across reboots (~/.superbg/state.json)
- Uses `setsid` to fully detach from terminal
- Captures stdout/stderr to log files (~/.superbg/logs/)
- Commands: run, list, stop, kill, status, logs, attach

## Comparison
| Instead of... | Use superbg because... |
|---|---|
| `nohup cmd &` | Tracks PIDs, saves logs, lets you list/stop/status later |
| `tmux` / `screen` | One-shot `superbg run` — no terminal multiplexer needed |
| `systemd --user` | Zero config, no unit files |
| `pm2` | Works with any language, not just Node.js |
| `supervisor` / `s6` | No daemon, no config files, no learning curve |
