---
name: fsck.ext2
description: Use this skill when the user wants to use fsck.ext2, cli tool: fsck.ext2.
---

# fsck.ext2 Plugin

CLI tool: fsck.ext2.

## Commands
- `fsck.ext2 <resource> <action>` — Execute fsck.ext2 commands
- `fsck.ext2 self version` — Print fsck.ext2 version
- `fsck.ext2 _ _` — Passthrough to fsck.ext2 CLI

## Usage Examples
- "fsck.ext2 --help"
- "fsck.ext2 self version"

## Installation
```bash
apt-get install fsck.ext2 2>/dev/null || which fsck.ext2
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
