---
name: zipgrep
description: Use this skill when the user wants to use zipgrep, De-archiver for .zip files.
---

# zipgrep Plugin

zipgrep — De-archiver for .zip files.

## Commands
- `zipgrep <resource> <action>` — Execute zipgrep commands
- `zipgrep self version` — Print zipgrep version
- `zipgrep _ _` — Passthrough to zipgrep CLI

## Usage Examples
- "zipgrep --help"
- "zipgrep self version"

## Installation
```bash
apt-get install unzip 2>/dev/null || which zipgrep
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
