---
name: resolvconf
description: Use this skill when the user wants to use resolvconf, cli tool: resolvconf.
---

# resolvconf Plugin

CLI tool: resolvconf.

## Commands
- `resolvconf <resource> <action>` — Execute resolvconf commands
- `resolvconf self version` — Print resolvconf version
- `resolvconf _ _` — Passthrough to resolvconf CLI

## Usage Examples
- "resolvconf --help"
- "resolvconf self version"

## Installation
```bash
apt-get install resolvconf 2>/dev/null || which resolvconf
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
