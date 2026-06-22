---
name: VBoxDTrace
description: Use this skill when the user wants to use VBoxDTrace, cli tool: vboxdtrace.
---

# VBoxDTrace Plugin

CLI tool: VBoxDTrace.

## Commands
- `VBoxDTrace <resource> <action>` — Execute VBoxDTrace commands
- `VBoxDTrace self version` — Print VBoxDTrace version
- `VBoxDTrace _ _` — Passthrough to VBoxDTrace CLI

## Usage Examples
- "VBoxDTrace --help"
- "VBoxDTrace self version"

## Installation
```bash
apt-get install VBoxDTrace 2>/dev/null || which VBoxDTrace
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
