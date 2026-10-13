---
name: oxker
description: Use this skill when the user wants a lightweight TUI to view and control Docker containers — stats, logs, exec shells, lifecycle actions, local or remote hosts.
---

# oxker Plugin

oxker is a single-binary Docker TUI: container list with live CPU/mem stats, one-key lifecycle actions, log tailing, and exec-into-shell — locally or on remote Docker hosts.

## Commands

### TUI
- `oxker tui run` — Launch the containers TUI
- `oxker docker host <host>` — Target remote Docker (ssh:// or tcp://)
- `oxker self version` — Show version
- `oxker _ _` — Passthrough (`--use-stdout`, `--show-all`, etc.)

## Usage Examples

- "Show running containers and their CPU usage"
- "Exec a shell into the api container"
- "Manage docker on a remote server"

## Installation

```bash
cargo install oxker
# or: cargo binstall oxker
# or: docker run -v /var/run/docker.sock:/var/run/docker.sock:ro mrjackwills/oxker
```

## Examples

```bash
oxker                          # local docker
oxker --show-all               # include stopped containers
oxker --host ssh://me@server   # remote docker over SSH
```

## Key Features

- Live CPU/memory/network stats per container
- Start/stop/restart/remove/pause with single keys
- Built-in log viewer and exec-shell support
- Remote Docker hosts via `--host ssh://` or `tcp://`
