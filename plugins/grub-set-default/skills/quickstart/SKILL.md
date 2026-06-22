---
name: grub-set-default
description: Use this skill when the user wants to use grub-set-default, cli tool: grub-set-default.
---

# grub-set-default Plugin

CLI tool: grub-set-default.

## Commands
- `grub-set-default <resource> <action>` — Execute grub-set-default commands
- `grub-set-default self version` — Print grub-set-default version
- `grub-set-default _ _` — Passthrough to grub-set-default CLI

## Usage Examples
- "grub-set-default --help"
- "grub-set-default self version"

## Installation
```bash
apt-get install grub-set-default 2>/dev/null || which grub-set-default
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
