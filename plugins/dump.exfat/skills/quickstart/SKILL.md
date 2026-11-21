---
name: dump.exfat
description: Use this skill when the user wants to use dump.exfat, exFAT file system utilities.
---

# dump.exfat Plugin

dump.exfat — exFAT file system utilities.

## Commands
- `dump.exfat <resource> <action>` — Execute dump.exfat commands
- `dump.exfat self version` — Print dump.exfat version
- `dump.exfat _ _` — Passthrough to dump.exfat CLI

## Usage Examples
- "dump.exfat --help"
- "dump.exfat self version"

## Installation
```bash
apt-get install exfatprogs 2>/dev/null || which dump.exfat
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
