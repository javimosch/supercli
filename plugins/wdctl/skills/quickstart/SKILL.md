---
name: wdctl
description: Use this skill when the user wants to use wdctl, miscellaneous system utilities.
---

# wdctl Plugin

wdctl — miscellaneous system utilities.

## Commands
- `wdctl <resource> <action>` — Execute wdctl commands
- `wdctl self version` — Print wdctl version
- `wdctl _ _` — Passthrough to wdctl CLI

## Usage Examples
- "wdctl --help"
- "wdctl self version"

## Installation
```bash
apt-get install util-linux 2>/dev/null || which wdctl
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
