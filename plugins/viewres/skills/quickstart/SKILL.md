---
name: viewres
description: Use this skill when the user wants to use viewres, X11 utilities.
---

# viewres Plugin

viewres — X11 utilities.

## Commands
- `viewres <resource> <action>` — Execute viewres commands
- `viewres self version` — Print viewres version
- `viewres _ _` — Passthrough to viewres CLI

## Usage Examples
- "viewres --help"
- "viewres self version"

## Installation
```bash
apt-get install x11-utils 2>/dev/null || which viewres
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
