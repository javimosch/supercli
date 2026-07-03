---
name: buildko
description: Use this skill when the user wants to use buildko — Build Go containers without Docker — reproducible OCI images from source.
---

# buildko Plugin

Build Go containers without Docker — reproducible OCI images from source

## Commands
- `buildko self version` — Print buildko version
- `buildko _ _` — Passthrough to buildko CLI

## Usage Examples
- `buildko self version` — Check installed version
- `buildko _ _ --help` — Show buildko help
- `buildko _ _ --json` — JSON output mode

## Installation
```bash
go install github.com/buildko/buildko@latest
```

## Key Features
- containers, golang, oci, build
- Non-interactive CLI with JSON output support
- Pipeline-ready for automation
