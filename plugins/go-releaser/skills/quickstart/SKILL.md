---
name: go-releaser
description: Use this skill when the user wants to use go-releaser — Go project release automation CLI — build, package, and publish with JSON output.
---

# go-releaser Plugin

Go project release automation CLI — build, package, and publish with JSON output

## Commands
- `go-releaser self version` — Print go-releaser version
- `go-releaser _ _` — Passthrough to go-releaser CLI

## Usage Examples
- `go-releaser self version` — Check installed version
- `go-releaser _ _ --help` — Show go-releaser help
- `go-releaser _ _ --json` — JSON output mode

## Installation
```bash
go install github.com/go-releaser/go-releaser@latest
```

## Key Features
- golang, release, ci, cli
- Non-interactive CLI with JSON output support
- Pipeline-ready for automation
