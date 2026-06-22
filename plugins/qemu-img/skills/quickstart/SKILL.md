---
name: qemu-img
description: Use this skill when the user wants to use qemu-img, cli tool: qemu-img.
---

# qemu-img Plugin

CLI tool: qemu-img.

## Commands
- `qemu-img <resource> <action>` — Execute qemu-img commands
- `qemu-img self version` — Print qemu-img version
- `qemu-img _ _` — Passthrough to qemu-img CLI

## Usage Examples
- "qemu-img --help"
- "qemu-img self version"

## Installation
```bash
apt-get install qemu-img 2>/dev/null || which qemu-img
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
