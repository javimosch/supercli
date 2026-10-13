---
name: lazyjournal
description: Use this skill when the user wants to browse journald, auditd, file-system, Docker/Podman, or Kubernetes logs in a single TUI instead of juggling journalctl and kubectl commands.
---

# lazyjournal Plugin

lazyjournal is a TUI unifying log sources: systemd journal units, auditd, log files, Docker/Podman containers, Compose stacks, and Kubernetes pods — with highlighting and several filter modes.

## Commands

### TUI
- `lazyjournal tui run` — Launch the log browser
- `lazyjournal config show <path>` — Run with custom config file
- `lazyjournal self version` — Show version
- `lazyjournal _ _` — Passthrough to lazyjournal CLI

## Usage Examples

- "Browse nginx journald logs"
- "Watch a docker container's logs with filtering"
- "Tail a log file with highlighting"

## Installation

```bash
go install github.com/Lifailon/lazyjournal@latest
# or: brew install lazyjournal
```

## Examples

```bash
lazyjournal                    # open TUI on all sources
sudo lazyjournal               # full journald/auditd access
lazyjournal --config my.yaml   # custom config
```

## Key Features

- One TUI for journald, auditd, syslog files, Docker, Podman, Compose, k8s
- Fuzzy + regex filtering, keyword highlighting, timestamp controls
- Single static binary (Go/gocui) — runs over SSH, no deps
- Color-coded severities; mouse + keyboard navigation
