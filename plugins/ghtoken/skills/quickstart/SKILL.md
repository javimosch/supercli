---
name: ghtoken
description: Use this skill when the user wants to use ghtoken — GitHub token manager CLI — generate, list, revoke tokens via GitHub API.
---

# ghtoken Plugin

GitHub token manager CLI — generate, list, revoke tokens via GitHub API

## Commands
- `ghtoken self version` — Print ghtoken version
- `ghtoken _ _` — Passthrough to ghtoken CLI

## Usage Examples
- `ghtoken self version` — Check installed version
- `ghtoken _ _ --help` — Show ghtoken help
- `ghtoken _ _ --json` — JSON output mode

## Installation
```bash
go install github.com/nobe4/ghtoken@latest
```

## Key Features
- github, token, golang, cli
- Non-interactive CLI with JSON output support
- Pipeline-ready for automation
