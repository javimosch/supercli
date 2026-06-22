---
name: mount.sshfs
description: Use this skill when the user wants to use mount.sshfs, cli tool: mount.sshfs.
---

# mount.sshfs Plugin

CLI tool: mount.sshfs.

## Commands
- `mount.sshfs <resource> <action>` — Execute mount.sshfs commands
- `mount.sshfs self version` — Print mount.sshfs version
- `mount.sshfs _ _` — Passthrough to mount.sshfs CLI

## Usage Examples
- "mount.sshfs --help"
- "mount.sshfs self version"

## Installation
```bash
apt-get install mount.sshfs 2>/dev/null || which mount.sshfs
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
