---
name: filefrag
description: Use this skill when the user wants to use filefrag, cli tool: filefrag.
---

# filefrag Plugin

CLI tool: filefrag.

## Commands
- `filefrag <resource> <action>` — Execute filefrag commands
- `filefrag self version` — Print filefrag version
- `filefrag _ _` — Passthrough to filefrag CLI

## Usage Examples
- "filefrag --help"
- "filefrag self version"

## Installation
```bash
apt-get install filefrag 2>/dev/null || which filefrag
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
