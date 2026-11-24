---
name: zstdgrep
description: Use this skill when the user wants to use zstdgrep, fast lossless compression algorithm -- CLI tool.
---

# zstdgrep Plugin

zstdgrep — fast lossless compression algorithm -- CLI tool.

## Commands
- `zstdgrep <resource> <action>` — Execute zstdgrep commands
- `zstdgrep self version` — Print zstdgrep version
- `zstdgrep _ _` — Passthrough to zstdgrep CLI

## Usage Examples
- "zstdgrep --help"
- "zstdgrep self version"

## Installation
```bash
apt-get install zstd 2>/dev/null || which zstdgrep
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
