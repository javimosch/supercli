---
name: qemu-storage-daemon
description: Use this skill when the user wants to use qemu-storage-daemon, cli tool: qemu-storage-daemon.
---

# qemu-storage-daemon Plugin

CLI tool: qemu-storage-daemon.

## Commands
- `qemu-storage-daemon <resource> <action>` — Execute qemu-storage-daemon commands
- `qemu-storage-daemon self version` — Print qemu-storage-daemon version
- `qemu-storage-daemon _ _` — Passthrough to qemu-storage-daemon CLI

## Usage Examples
- "qemu-storage-daemon --help"
- "qemu-storage-daemon self version"

## Installation
```bash
apt-get install qemu-storage-daemon 2>/dev/null || which qemu-storage-daemon
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
