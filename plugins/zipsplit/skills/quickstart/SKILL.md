---
name: zipsplit
description: Use this skill when the user wants to use zipsplit, Archiver for .zip files.
---

# zipsplit Plugin

zipsplit — Archiver for .zip files.

## Commands
- `zipsplit <resource> <action>` — Execute zipsplit commands
- `zipsplit self version` — Print zipsplit version
- `zipsplit _ _` — Passthrough to zipsplit CLI

## Usage Examples
- "zipsplit --help"
- "zipsplit self version"

## Installation
```bash
apt-get install zip 2>/dev/null || which zipsplit
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
