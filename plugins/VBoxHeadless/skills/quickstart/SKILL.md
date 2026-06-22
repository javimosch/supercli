---
name: VBoxHeadless
description: Use this skill when the user wants to use VBoxHeadless, cli tool: vboxheadless.
---

# VBoxHeadless Plugin

CLI tool: VBoxHeadless.

## Commands
- `VBoxHeadless <resource> <action>` — Execute VBoxHeadless commands
- `VBoxHeadless self version` — Print VBoxHeadless version
- `VBoxHeadless _ _` — Passthrough to VBoxHeadless CLI

## Usage Examples
- "VBoxHeadless --help"
- "VBoxHeadless self version"

## Installation
```bash
apt-get install VBoxHeadless 2>/dev/null || which VBoxHeadless
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
