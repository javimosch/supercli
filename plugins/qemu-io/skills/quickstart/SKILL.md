---
name: qemu-io
description: Use this skill when the user wants to use qemu-io, cli tool: qemu-io.
---

# qemu-io Plugin

CLI tool: qemu-io.

## Commands
- `qemu-io <resource> <action>` — Execute qemu-io commands
- `qemu-io self version` — Print qemu-io version
- `qemu-io _ _` — Passthrough to qemu-io CLI

## Usage Examples
- "qemu-io --help"
- "qemu-io self version"

## Installation
```bash
apt-get install qemu-io 2>/dev/null || which qemu-io
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
