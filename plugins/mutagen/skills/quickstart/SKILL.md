---
name: mutagen
description: Use this skill when the user wants continuous file sync between local and remote hosts/containers, or TCP forwarding sessions, with mutagen.
---

# mutagen Plugin

Mutagen keeps two endpoints in sync in real time — local dirs, SSH hosts, or `docker://` container paths — and also forwards TCP ports. Runs as a user daemon; remote endpoints need only SSH.

## Commands

### Daemon
- `mutagen daemon start` — Start the daemon (auto-starts on first use)

### Sync
- `mutagen sync create <alpha> <beta>` — Create a session; endpoints: `./path`, `user@host:path`, `docker://container/path`
- `mutagen sync list` — Sessions + status (`--long`, `--monitor`)
- `mutagen sync monitor` — Live status

### Forwarding
- `mutagen forward create <alpha> <beta>` — TCP forward, e.g. `tcp://localhost:8080` ↔ `user@host:tcp://localhost:80`

### Passthrough
- `mutagen _ _` — `sync pause|resume|flush|terminate|reset`, `forward list|pause|resume|terminate`, `project run`...

## Usage Examples

- "Keep ./src synced with my dev server continuously"
- "Sync my code into the running container and live-reload"
- "Forward the remote DB port to localhost"

## Installation

```bash
brew install mutagen-io/mutagen/mutagen
# or: tar xzf <(curl -sSfL https://github.com/mutagen-io/mutagen/releases/latest/download/mutagen_linux_amd64.tar.gz) -C ~/.local/bin
# or: go install github.com/mutagen-io/mutagen/cmd/mutagen@latest
```

## Examples

```bash
# Two-way sync local ↔ SSH host
mutagen sync create --name=mycode ./src user@devbox:~/src

# Local → container (one-way is fine too)
mutagen sync create --sync-mode=one-way-replica ./src docker://web/app/src

# With ignore rules and symlink mode
mutagen sync create ./proj user@host:~/proj --ignore=node_modules --symlink-mode=posix-raw

# Forward remote 5432 to local 5432
mutagen forward create tcp://localhost:5432 user@db:tcp://localhost:5432

# Pause / resume / destroy a session
mutagen sync pause mycode && mutagen sync resume mycode
mutagen sync terminate mycode
```

## Key Features

- Two-way and one-way sync modes (`--sync-mode`), staged conflict resolution
- Endpoints: filesystem, SSH (alpha/beta as `user@host:path`), Docker containers
- Ignore patterns, symlink/permission/owner modes, filesystem watching
- Same daemon also does TCP port forwarding (`mutagen forward`)
