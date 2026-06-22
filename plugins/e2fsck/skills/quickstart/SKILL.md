---
name: e2fsck
description: Use this skill when the user wants to use e2fsck, cli tool: e2fsck.
---

# e2fsck Plugin

CLI tool: e2fsck.

## Commands
- `e2fsck <resource> <action>` — Execute e2fsck commands
- `e2fsck self version` — Print e2fsck version
- `e2fsck _ _` — Passthrough to e2fsck CLI

## Usage Examples
- "e2fsck --help"
- "e2fsck self version"

## Installation
```bash
apt-get install e2fsck 2>/dev/null || which e2fsck
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
