---
name: watchgnupg
description: Use this skill when the user wants to use watchgnupg, GNU privacy guard - utility programs.
---

# watchgnupg Plugin

watchgnupg — GNU privacy guard - utility programs.

## Commands
- `watchgnupg <resource> <action>` — Execute watchgnupg commands
- `watchgnupg self version` — Print watchgnupg version
- `watchgnupg _ _` — Passthrough to watchgnupg CLI

## Usage Examples
- "watchgnupg --help"
- "watchgnupg self version"

## Installation
```bash
apt-get install gnupg-utils 2>/dev/null || which watchgnupg
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
