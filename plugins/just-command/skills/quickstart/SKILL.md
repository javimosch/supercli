---
name: just-command
description: Use this skill when the user wants to use just-command — Just a command runner — save and run project-specific commands, JSON task listing.
---

# just-command Plugin

Just a command runner — save and run project-specific commands, JSON task listing

## Commands
- `just-command self version` — Print just-command version
- `just-command _ _` — Passthrough to just CLI

## Usage Examples
- `just-command self version` — Check installed version
- `just-command _ _ --help` — Show just-command help
- `just-command _ _ --json` — JSON output mode

## Installation
```bash
cargo install just
```

## Key Features
- task-runner, rust, cli, make
- Non-interactive CLI with JSON output support
- Pipeline-ready for automation
