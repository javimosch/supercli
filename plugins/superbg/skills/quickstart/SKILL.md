---
name: superbg
description: Use this skill when the user wants to run, manage, or monitor background processes on Linux using superbg.
---

# superbg Plugin

Super Background Process Manager -- a zero-config CLI to run, track, and manage background processes on Linux. Works with any language (not just Node.js).

## Commands

### Process Management
- `superbg run start <args>` -- Run a command in the background
- `superbg list show` -- List all tracked processes
- `superbg process stop <id>` -- Stop a process with graceful timeout
- `superbg process kill <id>` -- Kill a process (SIGKILL)
- `superbg process status <id>` -- Show detailed process info

### Logs
- `superbg logs show <id>` -- View process logs
- `superbg logs follow <id>` -- Follow logs in real-time

## Usage Examples

```bash
# Run a process in background
superbg run start python server.py

# Run with auto-restart on crash
superbg run start --watch --max-restarts 5 python server.py

# Run with environment file
superbg run start --env-file .env ./app

# Run with arguments
superbg run start node app.js --port 3000

# List all processes
superbg list show

# Check status
superbg process status 1

# View logs
superbg logs show 1

# Follow logs in real-time
superbg logs follow 1

# Graceful stop with timeout (SIGTERM, then SIGKILL after 15s)
superbg process stop --timeout 15 1

# Immediate kill
superbg process kill 1
```

## Installation

```bash
go install github.com/javimosch/superbg@latest
```

## Key Features
- Zero-config -- no unit files, no config, no daemon
- Auto-restart (--watch) with exponential backoff and --max-restarts
- Graceful stop with configurable SIGKILL timeout (--timeout N)
- Environment file support (--env-file FILE, supports # comments and export)
- Works with any language (Python, Node.js, Go, shell scripts, etc.)
- Persistent state across reboots (~/.superbg/state.json)
- Uses setsid to fully detach from terminal
- Captures stdout/stderr to log files (~/.superbg/logs/)
