---
name: superbg
description: Use this skill when the user wants to run, manage, or monitor background processes on Linux using superbg.
---

# superbg Plugin

Super Background Process Manager -- a zero-config CLI to run, track, and manage background processes on Linux. Works with any language.

## Commands

- `superbg run start <args>` -- Run a command in the background
- `superbg list show` -- List all tracked processes
- `superbg process stop <id>` -- Stop a process with graceful timeout
- `superbg process kill <id>` -- Kill a process (SIGKILL)
- `superbg process status <id>` -- Show detailed process info
- `superbg process rm <id>` -- Remove a process from tracking
- `superbg clean run` -- Remove all completed processes
- `superbg logs show <id>` -- View process logs
- `superbg logs follow <id>` -- Follow logs in real-time
- `superbg completion generate <shell>` -- Generate shell completion
- `superbg self version` -- Print superbg help

## Usage Examples

Basic run:
```
superbg run start python server.py
```

Run with features (put boolean flags at end, use space for --name, --cwd):
```
superbg run start python server.py --watch
superbg run start --max-restarts 5 python server.py
superbg run start --env-file /path/to/.env python server.py
superbg run start --name myapp python server.py
superbg run start --cwd /app python server.py
superbg run start --env-file .env --name webapp node app.js --watch
```

List, status, logs with JSON:
```
superbg list show --json
superbg process status 1 --json
superbg logs show 1 --json
```

Process lifecycle:
```
superbg process stop --timeout 15 1
superbg process kill 1
superbg process rm 1
superbg clean run
```

Logs:
```
superbg logs show 1
superbg logs follow 1
```

Shell completions:
```
superbg completion generate bash
superbg completion generate zsh
superbg completion generate fish
```

## Installation

```
go install github.com/javimosch/superbg@latest
```

## Key Features
- Zero-config -- no unit files, no config, no daemon
- Auto-restart (--watch) with exponential backoff
- Graceful stop with configurable SIGKILL timeout (--timeout N)
- Environment file support (--env-file FILE)
- Custom process name (--name NAME)
- Custom working directory (--cwd DIR)
- JSON output for list, status, logs (--json)
- Crash-loop detection (warns after 3 fast crashes)
- Log rotation (auto-trims logs over 1MB / 2000 lines)
- Clean/rm commands to remove completed processes
- Shell completions for bash, zsh, fish
- Works with any language
- Persistent state across reboots
- Uses setsid to fully detach from terminal
