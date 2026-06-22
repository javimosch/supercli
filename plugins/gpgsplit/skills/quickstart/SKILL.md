---
name: gpgsplit
description: Use this skill when the user wants to use gpgsplit, cli tool: gpgsplit.
---

# gpgsplit Plugin

CLI tool: gpgsplit.

## Commands
- `gpgsplit <resource> <action>` — Execute gpgsplit commands
- `gpgsplit self version` — Print gpgsplit version
- `gpgsplit _ _` — Passthrough to gpgsplit CLI

## Usage Examples
- "gpgsplit --help"
- "gpgsplit self version"

## Installation
```bash
apt-get install gpgsplit 2>/dev/null || which gpgsplit
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
