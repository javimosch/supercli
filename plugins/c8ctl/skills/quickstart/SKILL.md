---
name: c8ctl
description: Use this skill for Camunda 8 workflow automation and management from the CLI.
---
# c8ctl Plugin
Scriptable CLI for Camunda 8 operations.
## Commands
- `c8ctl self version` — Print version
- `c8ctl _ _` — Passthrough to CLI
## Installation
```bash
npm install -g @camunda8/cli
```
## Examples
```bash
c8ctl deploy --dry-run
c8ctl list --json
```
## Key Features
- **Dry-run mode** — Safe pipeline automation
- **JSON output** — Structured data for CI/CD
- **c8ignore** — File ignore patterns
- **Pipeline-ready** — Non-interactive operation
