---
name: xlsclients
description: Use this skill when the user wants to use xlsclients, X11 utilities.
---

# xlsclients Plugin

xlsclients — X11 utilities.

## Commands
- `xlsclients <resource> <action>` — Execute xlsclients commands
- `xlsclients self version` — Print xlsclients version
- `xlsclients _ _` — Passthrough to xlsclients CLI

## Usage Examples
- "xlsclients --help"
- "xlsclients self version"

## Installation
```bash
apt-get install x11-utils 2>/dev/null || which xlsclients
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
