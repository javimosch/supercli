---
name: xiccd
description: Use this skill when the user wants to use xiccd, X color management daemon.
---

# xiccd Plugin

X color management daemon.

## Commands
- `xiccd <resource> <action>` — Execute xiccd commands
- `xiccd self version` — Print xiccd version
- `xiccd _ _` — Passthrough to xiccd CLI

## Usage Examples
- "xiccd --help"
- "xiccd self version"

## Installation
```bash
apt-get install xiccd 2>/dev/null || which xiccd
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
