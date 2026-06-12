---
name: fast-cli
description: Use this skill when the user wants to Speed Test CLI.
---

# fast-cli Plugin

Command-line version of fast.com internet speed test. Single ~1.2MB Rust binary, no dependencies, curl install.

## Commands
- `fast-cli self version` — Print version
- `fast-cli _ _ <args>` — Passthrough to fast-cli

## Usage Examples
- "Speed Test CLI"

## Installation
```bash
curl -sSL https://raw.githubusercontent.com/mikkelam/fast-cli/main/install.sh | bash
```

## Key Features
- CLI-only, no interactive prompts
- No API keys or authentication required
- Pipeline-ready output format
```
