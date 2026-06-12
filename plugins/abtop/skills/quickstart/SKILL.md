---
name: abtop
description: Use this skill when the user wants to Agent Monitor.
---

# abtop Plugin

Like htop but for AI coding agents. Monitor Claude Code, Codex CLI sessions, tokens, context window, rate limits, and ports in real-time. Has --json flag.

## Commands
- `abtop self version` — Print version
- `abtop _ _ <args>` — Passthrough to abtop

## Usage Examples
- "Agent Monitor"

## Installation
```bash
cargo install abtop
```

## Key Features
- CLI-only, no interactive prompts
- No API keys or authentication required
- Pipeline-ready output format
```
