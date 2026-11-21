---
name: xmllint
description: Use this skill when the user wants to use xmllint, GNOME XML library - utilities.
---

# xmllint Plugin

xmllint — GNOME XML library - utilities.

## Commands
- `xmllint <resource> <action>` — Execute xmllint commands
- `xmllint self version` — Print xmllint version
- `xmllint _ _` — Passthrough to xmllint CLI

## Usage Examples
- "xmllint --help"
- "xmllint self version"

## Installation
```bash
apt-get install libxml2-utils 2>/dev/null || which xmllint
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
