---
name: qemu-nbd
description: Use this skill when the user wants to use qemu-nbd, cli tool: qemu-nbd.
---

# qemu-nbd Plugin

CLI tool: qemu-nbd.

## Commands
- `qemu-nbd <resource> <action>` — Execute qemu-nbd commands
- `qemu-nbd self version` — Print qemu-nbd version
- `qemu-nbd _ _` — Passthrough to qemu-nbd CLI

## Usage Examples
- "qemu-nbd --help"
- "qemu-nbd self version"

## Installation
```bash
apt-get install qemu-nbd 2>/dev/null || which qemu-nbd
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
