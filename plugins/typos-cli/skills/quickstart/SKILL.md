---
name: typos-cli
description: Use this skill when the user wants to check source code for typos, fix spelling errors, or run a spell checker with minimal false positives.
---

# typos-cli Plugin

Source code spell checker that finds and fixes typos with minimal false positives.

## Commands

### Checking
- `typos files check` — Check files for typos

### Utility
- `typos _ _` — Passthrough to typos CLI

## Usage Examples
- "Check this file for typos"
- "Fix typos in this directory"
- "Show me the typos in JSON format"
- "Check my whole project for spelling mistakes"

## Installation

```bash
brew install typos-cli
```

Or via Cargo:
```bash
cargo install typos-cli
```
