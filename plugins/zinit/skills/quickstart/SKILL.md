---
name: zinit
description: Use this skill when the user wants to use zinit — Flexible Zsh plugin manager CLI — install, update, and list plugins with JSON output.
---

# zinit Plugin

Flexible Zsh plugin manager CLI — install, update, and list plugins with JSON output

## Commands
- `zinit self version` — Print zinit version
- `zinit _ _` — Passthrough to zinit CLI

## Usage Examples
- `zinit self version` — Check installed version
- `zinit _ _ --help` — Show zinit help
- `zinit _ _ --json` — JSON output mode

## Installation
```bash
bash -c "$(curl -fsSL https://raw.githubusercontent.com/zdharma-continuum/zinit/main/scripts/install.sh)"
```

## Key Features
- zsh, plugin-manager, shell
- Non-interactive CLI with JSON output support
- Pipeline-ready for automation
