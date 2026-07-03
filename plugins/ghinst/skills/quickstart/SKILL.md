---
name: ghinst
description: Use this skill when the user wants to use ghinst — Install binaries from GitHub releases to ~/.local/bin with checksum verification.
---

# ghinst Plugin

Install binaries from GitHub releases to ~/.local/bin with checksum verification

## Commands
- `ghinst self version` — Print ghinst version
- `ghinst _ _` — Passthrough to ghinst CLI

## Usage Examples
- `ghinst self version` — Check installed version
- `ghinst _ _ --help` — Show ghinst help
- `ghinst _ _ --json` — JSON output mode

## Installation
```bash
go install github.com/tebeka/ghinst@latest
```

## Key Features
- github, installer, golang, binary
- Non-interactive CLI with JSON output support
- Pipeline-ready for automation
