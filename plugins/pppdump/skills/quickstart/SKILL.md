---
name: pppdump
description: Use this skill when the user wants to use pppdump, cli tool: pppdump.
---

# pppdump Plugin

CLI tool: pppdump.

## Commands
- `pppdump <resource> <action>` — Execute pppdump commands
- `pppdump self version` — Print pppdump version
- `pppdump _ _` — Passthrough to pppdump CLI

## Usage Examples
- "pppdump --help"
- "pppdump self version"

## Installation
```bash
apt-get install pppdump 2>/dev/null || which pppdump
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
