---
name: qemu-pr-helper
description: Use this skill when the user wants to use qemu-pr-helper, cli tool: qemu-pr-helper.
---

# qemu-pr-helper Plugin

CLI tool: qemu-pr-helper.

## Commands
- `qemu-pr-helper <resource> <action>` — Execute qemu-pr-helper commands
- `qemu-pr-helper self version` — Print qemu-pr-helper version
- `qemu-pr-helper _ _` — Passthrough to qemu-pr-helper CLI

## Usage Examples
- "qemu-pr-helper --help"
- "qemu-pr-helper self version"

## Installation
```bash
apt-get install qemu-pr-helper 2>/dev/null || which qemu-pr-helper
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
