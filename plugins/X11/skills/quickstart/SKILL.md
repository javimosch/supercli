---
name: X11
description: Use this skill when the user wants to use X11, X Window System (X.Org) infrastructure.
---

# X11 Plugin

X11 — X Window System (X.Org) infrastructure.

## Commands
- `X11 <resource> <action>` — Execute X11 commands
- `X11 self version` — Print X11 version
- `X11 _ _` — Passthrough to X11 CLI

## Usage Examples
- "X11 --help"
- "X11 self version"

## Installation
```bash
apt-get install x11-common 2>/dev/null || which X11
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
