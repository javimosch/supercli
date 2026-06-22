---
name: partprobe
description: Use this skill when the user wants to use partprobe, cli tool: partprobe.
---

# partprobe Plugin

CLI tool: partprobe.

## Commands
- `partprobe <resource> <action>` — Execute partprobe commands
- `partprobe self version` — Print partprobe version
- `partprobe _ _` — Passthrough to partprobe CLI

## Usage Examples
- "partprobe --help"
- "partprobe self version"

## Installation
```bash
apt-get install partprobe 2>/dev/null || which partprobe
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
