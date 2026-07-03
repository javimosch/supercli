---
name: cli-agent-lint
description: Use this skill when the user wants to use cli-agent-lint — Lint CLI tools for AI agent compatibility — non-interactive auth, JSON output, exit codes.
---

# cli-agent-lint Plugin

Lint CLI tools for AI agent compatibility — non-interactive auth, JSON output, exit codes

## Commands
- `cli-agent-lint self version` — Print cli-agent-lint version
- `cli-agent-lint _ _` — Passthrough to cli-agent-lint CLI

## Usage Examples
- `cli-agent-lint self version` — Check installed version
- `cli-agent-lint _ _ --help` — Show cli-agent-lint help
- `cli-agent-lint _ _ --json` — JSON output mode

## Installation
```bash
go install github.com/Camil-H/cli-agent-lint@latest
```

## Key Features
- cli, linter, ai-agents, golang
- Non-interactive CLI with JSON output support
- Pipeline-ready for automation
