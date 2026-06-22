---
name: qemu-system-x86_64
description: Use this skill when the user wants to use qemu-system-x86_64, cli tool: qemu-system-x86_64.
---

# qemu-system-x86_64 Plugin

CLI tool: qemu-system-x86_64.

## Commands
- `qemu-system-x86_64 <resource> <action>` — Execute qemu-system-x86_64 commands
- `qemu-system-x86_64 self version` — Print qemu-system-x86_64 version
- `qemu-system-x86_64 _ _` — Passthrough to qemu-system-x86_64 CLI

## Usage Examples
- "qemu-system-x86_64 --help"
- "qemu-system-x86_64 self version"

## Installation
```bash
apt-get install qemu-system-x86_64 2>/dev/null || which qemu-system-x86_64
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
