---
name: kernel-install
description: Use this skill when the user wants to use kernel-install, cli tool: kernel-install.
---

# kernel-install Plugin

CLI tool: kernel-install.

## Commands
- `kernel-install <resource> <action>` — Execute kernel-install commands
- `kernel-install self version` — Print kernel-install version
- `kernel-install _ _` — Passthrough to kernel-install CLI

## Usage Examples
- "kernel-install --help"
- "kernel-install self version"

## Installation
```bash
apt-get install kernel-install 2>/dev/null || which kernel-install
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
