---
name: keepassxc
description: Use this skill when the user wants to use keepassxc, cli tool: keepassxc.
---

# keepassxc Plugin

CLI tool: keepassxc.

## Commands
- `keepassxc <resource> <action>` — Execute keepassxc commands
- `keepassxc self version` — Print keepassxc version
- `keepassxc _ _` — Passthrough to keepassxc CLI

## Usage Examples
- "keepassxc --help"
- "keepassxc self version"

## Installation
```bash
apt-get install keepassxc 2>/dev/null || which keepassxc
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
