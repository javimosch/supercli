---
name: grub-probe
description: Use this skill when the user wants to use grub-probe, cli tool: grub-probe.
---

# grub-probe Plugin

CLI tool: grub-probe.

## Commands
- `grub-probe <resource> <action>` — Execute grub-probe commands
- `grub-probe self version` — Print grub-probe version
- `grub-probe _ _` — Passthrough to grub-probe CLI

## Usage Examples
- "grub-probe --help"
- "grub-probe self version"

## Installation
```bash
apt-get install grub-probe 2>/dev/null || which grub-probe
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
