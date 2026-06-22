---
name: fsck.ext3
description: Use this skill when the user wants to use fsck.ext3, cli tool: fsck.ext3.
---

# fsck.ext3 Plugin

CLI tool: fsck.ext3.

## Commands
- `fsck.ext3 <resource> <action>` — Execute fsck.ext3 commands
- `fsck.ext3 self version` — Print fsck.ext3 version
- `fsck.ext3 _ _` — Passthrough to fsck.ext3 CLI

## Usage Examples
- "fsck.ext3 --help"
- "fsck.ext3 self version"

## Installation
```bash
apt-get install fsck.ext3 2>/dev/null || which fsck.ext3
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
