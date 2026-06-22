---
name: update-ca-certificates
description: Use this skill when the user wants to use update-ca-certificates, cli tool: update-ca-certificates.
---

# update-ca-certificates Plugin

CLI tool: update-ca-certificates.

## Commands
- `update-ca-certificates <resource> <action>` — Execute update-ca-certificates commands
- `update-ca-certificates self version` — Print update-ca-certificates version
- `update-ca-certificates _ _` — Passthrough to update-ca-certificates CLI

## Usage Examples
- "update-ca-certificates --help"
- "update-ca-certificates self version"

## Installation
```bash
apt-get install update-ca-certificates 2>/dev/null || which update-ca-certificates
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
