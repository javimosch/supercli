---
name: repo-radar
description: Use this skill when the user wants to use repo-radar — Real-time GitHub trend detector in Rust — monitors trending repos and detects exposed secrets.
---

# repo-radar Plugin

Real-time GitHub trend detector in Rust — monitors trending repos and detects exposed secrets

## Commands
- `repo-radar self version` — Print repo-radar version
- `repo-radar _ _` — Passthrough to repo-radar CLI

## Usage Examples
- `repo-radar self version` — Check installed version
- `repo-radar _ _ --help` — Show repo-radar help
- `repo-radar _ _ --json` — JSON output mode

## Installation
```bash
cargo install repo-radar
```

## Key Features
- github, trending, secrets, rust
- Non-interactive CLI with JSON output support
- Pipeline-ready for automation
