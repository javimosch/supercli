---
name: xcutsel
description: Use this skill when the user wants to use xcutsel, X applications.
---

# xcutsel Plugin

xcutsel — X applications.

## Commands
- `xcutsel <resource> <action>` — Execute xcutsel commands
- `xcutsel self version` — Print xcutsel version
- `xcutsel _ _` — Passthrough to xcutsel CLI

## Usage Examples
- "xcutsel --help"
- "xcutsel self version"

## Installation
```bash
apt-get install x11-apps 2>/dev/null || which xcutsel
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
