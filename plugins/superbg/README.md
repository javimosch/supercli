# superbg Plugin

This plugin integrates superbg into supercli.

superbg is a zero-config CLI to run, track, and manage background processes on Linux. No daemon, no config files, no learning curve. Works with any language.

## Prerequisites

```
go install github.com/javimosch/superbg@latest
superbg help
```

## Commands

Run processes:
```
sc superbg run start python server.py
sc superbg run start python server.py --watch
sc superbg run start --max-restarts 5 python server.py
sc superbg run start --env-file .env ./app
sc superbg run start --name myapp python server.py
sc superbg run start --cwd /app python server.py
```

List, status, logs:
```
sc superbg list show
sc superbg list show --json
sc superbg process status 1
sc superbg process status 1 --json
sc superbg logs show 1
sc superbg logs show 1 --json
sc superbg logs follow 1
```

Process lifecycle:
```
sc superbg process stop --timeout 15 1
sc superbg process kill 1
sc superbg process rm 1
sc superbg clean run
```

Shell completions:
```
sc superbg completion generate bash
sc superbg completion generate zsh
sc superbg completion generate fish
```

Namespace passthrough:
```
sc superbg -- help
sc superbg -- list
```

## How it works

superbg run spawns the command in a new session (setsid), fully detached from the terminal. Stdout/stderr are captured to ~/.superbg/logs/<id>.log. Process metadata is saved to ~/.superbg/state.json (survives reboots). With --watch, superbg stays alive as a monitor with crash-loop detection and exponential backoff.
