---
name: xgettext
description: Use this skill when the user wants to use xgettext, cli tool: xgettext.
---

# xgettext Plugin

CLI tool: xgettext.

## Commands
- `xgettext <resource> <action>` — Execute xgettext commands
- `xgettext self version` — Print xgettext version
- `xgettext _ _` — Passthrough to xgettext CLI

## Usage Examples
- "xgettext --help"
- "xgettext self version"

## Installation
```bash
apt-get install xgettext 2>/dev/null || which xgettext
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
