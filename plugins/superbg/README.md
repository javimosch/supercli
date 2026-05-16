# superbg Plugin

This plugin integrates [superbg](https://github.com/javimosch/superbg) into supercli.

**superbg** is a zero-config CLI to run, track, and manage background processes on Linux. No daemon, no config files, no learning curve. Works with any language.

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

# List all background processes
sc superbg list show

# Stop/Kill a process
sc superbg process stop 1
sc superbg process kill 1

# Check status
sc superbg process status 1

# View logs
sc superbg logs show 1
sc superbg logs show 1 --follow

# Follow logs in real-time
sc superbg logs follow 1

# Raw passthrough
sc superbg -- run python server.py
sc superbg -- list
```

## How it works

1. `superbg run` spawns the command in a **new session** (`setsid`), fully detached from the terminal.
2. Stdout/stderr are captured to `~/.superbg/logs/<id>.log`.
3. Process metadata is saved to `~/.superbg/state.json` (survives reboots).
