---
name: word-list-compress
description: Use this skill when the user wants to use word-list-compress, GNU Aspell spell-checker.
---

# word-list-compress Plugin

word-list-compress — GNU Aspell spell-checker.

## Commands
- `word-list-compress <resource> <action>` — Execute word-list-compress commands
- `word-list-compress self version` — Print word-list-compress version
- `word-list-compress _ _` — Passthrough to word-list-compress CLI

## Usage Examples
- "word-list-compress --help"
- "word-list-compress self version"

## Installation
```bash
apt-get install aspell 2>/dev/null || which word-list-compress
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
