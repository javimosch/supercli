---
name: grub-editenv
description: Use this skill when the user wants to use grub-editenv, cli tool: grub-editenv.
---

# grub-editenv Plugin

CLI tool: grub-editenv.

## Commands
- `grub-editenv <resource> <action>` — Execute grub-editenv commands
- `grub-editenv self version` — Print grub-editenv version
- `grub-editenv _ _` — Passthrough to grub-editenv CLI

## Usage Examples
- "grub-editenv --help"
- "grub-editenv self version"

## Installation
```bash
apt-get install grub-editenv 2>/dev/null || which grub-editenv
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
