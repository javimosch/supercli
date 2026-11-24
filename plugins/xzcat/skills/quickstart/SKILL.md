---
name: xzcat
description: Use this skill when the user wants to use xzcat, XZ-format compression utilities.
---

# xzcat Plugin

xzcat — XZ-format compression utilities.

## Commands
- `xzcat <resource> <action>` — Execute xzcat commands
- `xzcat self version` — Print xzcat version
- `xzcat _ _` — Passthrough to xzcat CLI

## Usage Examples
- "xzcat --help"
- "xzcat self version"

## Installation
```bash
apt-get install xz-utils 2>/dev/null || which xzcat
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
