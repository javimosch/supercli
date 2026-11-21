---
name: vlna
description: Use this skill when the user wants to use vlna, Binaries for TeX Live.
---

# vlna Plugin

vlna — Binaries for TeX Live.

## Commands
- `vlna <resource> <action>` — Execute vlna commands
- `vlna self version` — Print vlna version
- `vlna _ _` — Passthrough to vlna CLI

## Usage Examples
- "vlna --help"
- "vlna self version"

## Installation
```bash
apt-get install texlive-binaries 2>/dev/null || which vlna
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
