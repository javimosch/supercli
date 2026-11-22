---
name: weave
description: Use this skill when the user wants to use weave, Binaries for TeX Live.
---

# weave Plugin

weave — Binaries for TeX Live.

## Commands
- `weave <resource> <action>` — Execute weave commands
- `weave self version` — Print weave version
- `weave _ _` — Passthrough to weave CLI

## Usage Examples
- "weave --help"
- "weave self version"

## Installation
```bash
apt-get install texlive-binaries 2>/dev/null || which weave
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
