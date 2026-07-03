---
name: delta-git
description: Use this skill when the user wants to use delta-git — Syntax-highlighting pager for git and diff output — JSON mode for structured diff data.
---

# delta-git Plugin

Syntax-highlighting pager for git and diff output — JSON mode for structured diff data

## Commands
- `delta-git self version` — Print delta-git version
- `delta-git _ _` — Passthrough to delta CLI

## Usage Examples
- `delta-git self version` — Check installed version
- `delta-git _ _ --help` — Show delta-git help
- `delta-git _ _ --json` — JSON output mode

## Installation
```bash
cargo install git-delta
```

## Key Features
- git, diff, rust, pager
- Non-interactive CLI with JSON output support
- Pipeline-ready for automation
