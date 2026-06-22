---
name: osinfo-detect
description: Use this skill when the user wants to use osinfo-detect, cli tool: osinfo-detect.
---

# osinfo-detect Plugin

CLI tool: osinfo-detect.

## Commands
- `osinfo-detect <resource> <action>` — Execute osinfo-detect commands
- `osinfo-detect self version` — Print osinfo-detect version
- `osinfo-detect _ _` — Passthrough to osinfo-detect CLI

## Usage Examples
- "osinfo-detect --help"
- "osinfo-detect self version"

## Installation
```bash
apt-get install osinfo-detect 2>/dev/null || which osinfo-detect
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
