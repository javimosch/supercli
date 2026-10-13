---
name: process-compose
description: Use this skill when the user wants to orchestrate local processes with dependencies, health checks, and restarts — a docker-compose for plain binaries — via process-compose.
---

# Process Compose Plugin

process-compose orchestrates non-containerized processes from a `process-compose.yaml` file: dependency ordering (`depends_on`), readiness/liveness probes, restart policies, namespaced env vars, and aggregated logs — with an interactive TUI or a headless REST API.

## Commands

### Project lifecycle
- `process-compose project up` — Start the project (`-f <file>`, `--tui=false` headless, `-D` daemon)
- `process-compose project down` — Stop all processes
- `process-compose project info` — Project metadata (`-o json`)

### Processes
- `process-compose process list` — States, exit codes, health (`-o json`)
- `process-compose process restart <name>` — Restart one process
- `process-compose process logs` — `process logs <name> --lines N`

## Usage Examples

- "Start the dev stack in the background, no TUI"
- "List which processes are running and their exit codes"
- "Restart the api process and tail its logs"
- "Shut the whole project down"

## Installation

```bash
sh -c "$(curl --location https://raw.githubusercontent.com/F1bonacc1/process-compose/main/scripts/get-pc.sh)" -- -d -b ~/.local/bin
# or: brew install f1bonacc1/tap/process-compose
# or: go install github.com/f1bonacc1/process-compose@latest
```

## Examples

```bash
process-compose up -f process-compose.yaml --tui=false &
process-compose process list -o json
process-compose process logs api --lines 100
process-compose process restart worker
process-compose down
```

## Key Features

- `-o json` on list/info/logs — agent-friendly machine output
- `--tui=false` + `-D` daemon mode for headless/agent operation
- Health checks gate `depends_on` conditions (started/healthy/completed)
- `process-compose run <name>` executes one-shot tasks
- PC_INSTANCE_ADDRESS / --address for multiple concurrent projects
