---
name: xdg-open
description: Use this skill when the user wants to use xdg-open, desktop integration utilities from freedesktop.org.
---

# xdg-open Plugin

xdg-open — desktop integration utilities from freedesktop.org.

## Commands
- `xdg-open <resource> <action>` — Execute xdg-open commands
- `xdg-open self version` — Print xdg-open version
- `xdg-open _ _` — Passthrough to xdg-open CLI

## Usage Examples
- "xdg-open --help"
- "xdg-open self version"

## Installation
```bash
apt-get install xdg-utils 2>/dev/null || which xdg-open
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
