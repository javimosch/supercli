---
name: virtlogd
description: Use this skill when the user wants to use virtlogd, Virtualization daemon.
---

# virtlogd Plugin

virtlogd — Virtualization daemon.

## Commands
- `virtlogd <resource> <action>` — Execute virtlogd commands
- `virtlogd self version` — Print virtlogd version
- `virtlogd _ _` — Passthrough to virtlogd CLI

## Usage Examples
- "virtlogd --help"
- "virtlogd self version"

## Installation
```bash
apt-get install libvirt-daemon 2>/dev/null || which virtlogd
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
