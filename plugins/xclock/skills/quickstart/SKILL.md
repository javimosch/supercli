---
name: xclock
description: Use this skill when the user wants to use xclock, X applications.
---

# xclock Plugin

xclock — X applications.

## Commands
- `xclock <resource> <action>` — Execute xclock commands
- `xclock self version` — Print xclock version
- `xclock _ _` — Passthrough to xclock CLI

## Usage Examples
- "xclock --help"
- "xclock self version"

## Installation
```bash
apt-get install x11-apps 2>/dev/null || which xclock
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
