---
name: sshd
description: Use this skill when the user wants to use sshd, cli tool: sshd.
---

# sshd Plugin

CLI tool: sshd.

## Commands
- `sshd <resource> <action>` — Execute sshd commands
- `sshd self version` — Print sshd version
- `sshd _ _` — Passthrough to sshd CLI

## Usage Examples
- "sshd --help"
- "sshd self version"

## Installation
```bash
apt-get install sshd 2>/dev/null || which sshd
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
