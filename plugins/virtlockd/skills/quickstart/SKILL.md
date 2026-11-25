---
name: virtlockd
description: Use this skill when the user wants to use virtlockd, Virtualization daemon.
---

# virtlockd Plugin

virtlockd — Virtualization daemon.

## Commands
- `virtlockd <resource> <action>` — Execute virtlockd commands
- `virtlockd self version` — Print virtlockd version
- `virtlockd _ _` — Passthrough to virtlockd CLI

## Usage Examples
- "virtlockd --help"
- "virtlockd self version"

## Installation
```bash
apt-get install libvirt-daemon 2>/dev/null || which virtlockd
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
