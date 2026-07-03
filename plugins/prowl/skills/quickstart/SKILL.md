---
name: prowl
description: Use this skill when the user wants to use prowl — Single-binary CLI for tracking GitHub PRs — non-interactive list with --json for agents.
---

# prowl Plugin

Single-binary CLI for tracking GitHub PRs — non-interactive list with --json for agents

## Commands
- `prowl self version` — Print prowl version
- `prowl _ _` — Passthrough to prowl CLI

## Usage Examples
- `prowl self version` — Check installed version
- `prowl _ _ --help` — Show prowl help
- `prowl _ _ --json` — JSON output mode

## Installation
```bash
go install github.com/figarocorso/prowl@latest
```

## Key Features
- github, pull-requests, golang, cli
- Non-interactive CLI with JSON output support
- Pipeline-ready for automation
