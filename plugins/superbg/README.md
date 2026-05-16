# superbg Plugin

This plugin integrates superbg into supercli.

superbg is a zero-config CLI to run, track, and manage background processes on Linux. No daemon, no config files, no learning curve. Works with any language.

## Prerequisites

```bash
superbg help
```

If not installed:

```bash
go install github.com/javimosch/superbg@latest
```

## Commands

```bash
# Version info
sc superbg self version

# Run a command in the background
sc superbg run start python server.py

# Run with auto-restart on crash
sc superbg run start --watch python server.py

# Run with auto-restart, limit restarts
sc superbg run start --watch --max-restarts 5 python server.py

# Run with environment file
sc superbg run start --env-file .env ./app

# List all background processes
sc superbg list show

# Graceful stop with timeout (SIGTERM, then SIGKILL after N seconds)
sc superbg process stop --timeout 15 1

# Immediate kill
sc superbg process kill 1

# Check status
sc superbg process status 1

# View logs
sc superbg logs show 1

# Follow logs in real-time
sc superbg logs follow 1

# Raw passthrough
sc superbg -- run python server.py
sc superbg -- list
```

## How it works

1. superbg run spawns the command in a new session (setsid), fully detached from the terminal.
2. Stdout/stderr are captured to ~/.superbg/logs/<id>.log.
3. Process metadata is saved to ~/.superbg/state.json (survives reboots).
4. With --watch, superbg stays alive as a monitor, re-spawning the child on exit with exponential backoff.
