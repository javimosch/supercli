---
name: dviconcat
description: Use this skill when the user wants to use dviconcat, Binaries for TeX Live.
---

# dviconcat Plugin

dviconcat — Binaries for TeX Live.

## Commands
- `dviconcat <resource> <action>` — Execute dviconcat commands
- `dviconcat self version` — Print dviconcat version
- `dviconcat _ _` — Passthrough to dviconcat CLI

## Usage Examples
- "dviconcat --help"
- "dviconcat self version"

## Installation
```bash
apt-get install texlive-binaries 2>/dev/null || which dviconcat
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
