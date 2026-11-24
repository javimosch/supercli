---
name: xgettext
description: Use this skill when the user wants to use xgettext, GNU Internationalization utilities.
---

# xgettext Plugin

xgettext — GNU Internationalization utilities.

## Commands
- `xgettext <resource> <action>` — Execute xgettext commands
- `xgettext self version` — Print xgettext version
- `xgettext _ _` — Passthrough to xgettext CLI

## Usage Examples
- "xgettext --help"
- "xgettext self version"

## Installation
```bash
apt-get install gettext 2>/dev/null || which xgettext
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
