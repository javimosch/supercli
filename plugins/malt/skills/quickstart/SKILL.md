---
name: malt
description: Use this skill when the user wants to Package Manager.
---

# malt Plugin

A fast, drop-in Homebrew alternative for macOS. Post-install scripts that actually run. Full operational surface beyond install/uninstall.

## Commands
- `malt self version` — Print version
- `malt _ _ <args>` — Passthrough to malt

## Usage Examples
- "Package Manager"

## Installation
```bash
curl -fsSL https://raw.githubusercontent.com/indaco/malt/main/scripts/install.sh | bash
```

## Key Features
- CLI-only, no interactive prompts
- No API keys or authentication required
- Pipeline-ready output format
```
