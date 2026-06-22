---
name: virt-qemu-run
description: Use this skill when the user wants to use virt-qemu-run, cli tool: virt-qemu-run.
---

# virt-qemu-run Plugin

CLI tool: virt-qemu-run.

## Commands
- `virt-qemu-run <resource> <action>` — Execute virt-qemu-run commands
- `virt-qemu-run self version` — Print virt-qemu-run version
- `virt-qemu-run _ _` — Passthrough to virt-qemu-run CLI

## Usage Examples
- "virt-qemu-run --help"
- "virt-qemu-run self version"

## Installation
```bash
apt-get install virt-qemu-run 2>/dev/null || which virt-qemu-run
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
