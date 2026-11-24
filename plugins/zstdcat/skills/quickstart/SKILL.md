---
name: zstdcat
description: Use this skill when the user wants to use zstdcat, fast lossless compression algorithm -- CLI tool.
---

# zstdcat Plugin

zstdcat — fast lossless compression algorithm -- CLI tool.

## Commands
- `zstdcat <resource> <action>` — Execute zstdcat commands
- `zstdcat self version` — Print zstdcat version
- `zstdcat _ _` — Passthrough to zstdcat CLI

## Usage Examples
- "zstdcat --help"
- "zstdcat self version"

## Installation
```bash
apt-get install zstd 2>/dev/null || which zstdcat
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
