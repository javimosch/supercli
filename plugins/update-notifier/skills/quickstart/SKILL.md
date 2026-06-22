---
name: update-notifier
description: Use this skill when the user wants to use update-notifier, cli tool: update-notifier.
---

# update-notifier Plugin

CLI tool: update-notifier.

## Commands
- `update-notifier <resource> <action>` — Execute update-notifier commands
- `update-notifier self version` — Print update-notifier version
- `update-notifier _ _` — Passthrough to update-notifier CLI

## Usage Examples
- "update-notifier --help"
- "update-notifier self version"

## Installation
```bash
apt-get install update-notifier 2>/dev/null || which update-notifier
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
