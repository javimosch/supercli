---
name: x86_64-linux-musl-gcc
description: Use this skill when the user wants to use x86_64-linux-musl-gcc, standard C library development files.
---

# x86_64-linux-musl-gcc Plugin

x86_64-linux-musl-gcc — standard C library development files.

## Commands
- `x86_64-linux-musl-gcc <resource> <action>` — Execute x86_64-linux-musl-gcc commands
- `x86_64-linux-musl-gcc self version` — Print x86_64-linux-musl-gcc version
- `x86_64-linux-musl-gcc _ _` — Passthrough to x86_64-linux-musl-gcc CLI

## Usage Examples
- "x86_64-linux-musl-gcc --help"
- "x86_64-linux-musl-gcc self version"

## Installation
```bash
apt-get install musl-dev 2>/dev/null || which x86_64-linux-musl-gcc
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
