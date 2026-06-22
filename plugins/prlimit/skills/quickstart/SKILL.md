---
name: prlimit
description: Use this skill when the user wants to use prlimit, cli tool: prlimit.
---

# prlimit Plugin

CLI tool: prlimit.

## Commands
- `prlimit <resource> <action>` — Execute prlimit commands
- `prlimit self version` — Print prlimit version
- `prlimit _ _` — Passthrough to prlimit CLI

## Usage Examples
- "prlimit --help"
- "prlimit self version"

## Installation
```bash
apt-get install prlimit 2>/dev/null || which prlimit
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
