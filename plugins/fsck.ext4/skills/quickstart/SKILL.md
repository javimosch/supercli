---
name: fsck.ext4
description: Use this skill when the user wants to use fsck.ext4, cli tool: fsck.ext4.
---

# fsck.ext4 Plugin

CLI tool: fsck.ext4.

## Commands
- `fsck.ext4 <resource> <action>` — Execute fsck.ext4 commands
- `fsck.ext4 self version` — Print fsck.ext4 version
- `fsck.ext4 _ _` — Passthrough to fsck.ext4 CLI

## Usage Examples
- "fsck.ext4 --help"
- "fsck.ext4 self version"

## Installation
```bash
apt-get install fsck.ext4 2>/dev/null || which fsck.ext4
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
