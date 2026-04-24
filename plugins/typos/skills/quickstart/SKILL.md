---
name: typos
description: Use this skill when the user wants to check code for typos, fix spelling errors in source code, or run spell checking in CI/CD.
---

# typos Plugin

Source code spell checker. Find and fix typos in source code files. Fast, customizable, and easy to integrate into CI/CD pipelines.

## Commands

### Spell Checking
- `typos code check` — Check code for typos

### Utility
- `typos _ _` — Passthrough to typos CLI

## Usage Examples
- "Check code for typos"
- "Fix spelling errors"
- "Spell check source code"
- "Run spell checker"

## Installation

```bash
brew install typos
```

Or via Cargo:
```bash
cargo install typos-cli
```

## Examples

```bash
# Check current directory
typos code check .

# Auto-fix typos
typos code check . --fix

# Check specific file
typos code check src/main.rs

# Set output format
typos code check . --format json

# Exclude files
typos code check . --exclude "*.log"

# Any typos command with passthrough
typos _ _ . --fix
typos _ _ --format json
```

## Key Features
- **Fast** - High performance checking
- **Multi-language** - Supports many programming languages
- **Auto-fix** - Can fix typos automatically
- **Customizable** - Custom dictionaries
- **CI/CD** - Easy to integrate
- **Config** - Configuration file support
- **False positives** - Whitelist words
- **Cross-platform** - Linux, macOS, Windows
- **Binary** - Single binary
- **Efficient** - Low false positives

## Notes
- Great for code quality
- Can be used in pre-commit hooks
- Supports custom dictionaries
- Configurable for different languages
