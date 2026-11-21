---
name: wofm2opl
description: Use this skill when the user wants to use wofm2opl, Binaries for TeX Live.
---

# wofm2opl Plugin

wofm2opl — Binaries for TeX Live.

## Commands
- `wofm2opl <resource> <action>` — Execute wofm2opl commands
- `wofm2opl self version` — Print wofm2opl version
- `wofm2opl _ _` — Passthrough to wofm2opl CLI

## Usage Examples
- "wofm2opl --help"
- "wofm2opl self version"

## Installation
```bash
apt-get install texlive-binaries 2>/dev/null || which wofm2opl
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
