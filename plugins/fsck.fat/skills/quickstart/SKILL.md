---
name: fsck.fat
description: Use this skill when the user wants to use fsck.fat, cli tool: fsck.fat.
---

# fsck.fat Plugin

CLI tool: fsck.fat.

## Commands
- `fsck.fat <resource> <action>` — Execute fsck.fat commands
- `fsck.fat self version` — Print fsck.fat version
- `fsck.fat _ _` — Passthrough to fsck.fat CLI

## Usage Examples
- "fsck.fat --help"
- "fsck.fat self version"

## Installation
```bash
apt-get install fsck.fat 2>/dev/null || which fsck.fat
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
