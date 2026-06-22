---
name: fsck.cramfs
description: Use this skill when the user wants to use fsck.cramfs, cli tool: fsck.cramfs.
---

# fsck.cramfs Plugin

CLI tool: fsck.cramfs.

## Commands
- `fsck.cramfs <resource> <action>` — Execute fsck.cramfs commands
- `fsck.cramfs self version` — Print fsck.cramfs version
- `fsck.cramfs _ _` — Passthrough to fsck.cramfs CLI

## Usage Examples
- "fsck.cramfs --help"
- "fsck.cramfs self version"

## Installation
```bash
apt-get install fsck.cramfs 2>/dev/null || which fsck.cramfs
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
