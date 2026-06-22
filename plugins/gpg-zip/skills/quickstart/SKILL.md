---
name: gpg-zip
description: Use this skill when the user wants to use gpg-zip, cli tool: gpg-zip.
---

# gpg-zip Plugin

CLI tool: gpg-zip.

## Commands
- `gpg-zip <resource> <action>` — Execute gpg-zip commands
- `gpg-zip self version` — Print gpg-zip version
- `gpg-zip _ _` — Passthrough to gpg-zip CLI

## Usage Examples
- "gpg-zip --help"
- "gpg-zip self version"

## Installation
```bash
apt-get install gpg-zip 2>/dev/null || which gpg-zip
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
