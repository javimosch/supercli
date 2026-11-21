---
name: simpdftex
description: Use this skill when the user wants to use simpdftex, TeX Live: Essential programs and files.
---

# simpdftex Plugin

simpdftex — TeX Live: Essential programs and files.

## Commands
- `simpdftex <resource> <action>` — Execute simpdftex commands
- `simpdftex self version` — Print simpdftex version
- `simpdftex _ _` — Passthrough to simpdftex CLI

## Usage Examples
- "simpdftex --help"
- "simpdftex self version"

## Installation
```bash
apt-get install texlive-base 2>/dev/null || which simpdftex
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
