---
name: fsck.f2fs
description: Use this skill when the user wants to use fsck.f2fs, cli tool: fsck.f2fs.
---

# fsck.f2fs Plugin

CLI tool: fsck.f2fs.

## Commands
- `fsck.f2fs <resource> <action>` — Execute fsck.f2fs commands
- `fsck.f2fs self version` — Print fsck.f2fs version
- `fsck.f2fs _ _` — Passthrough to fsck.f2fs CLI

## Usage Examples
- "fsck.f2fs --help"
- "fsck.f2fs self version"

## Installation
```bash
apt-get install fsck.f2fs 2>/dev/null || which fsck.f2fs
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
