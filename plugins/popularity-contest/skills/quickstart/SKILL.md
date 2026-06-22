---
name: popularity-contest
description: Use this skill when the user wants to use popularity-contest, cli tool: popularity-contest.
---

# popularity-contest Plugin

CLI tool: popularity-contest.

## Commands
- `popularity-contest <resource> <action>` — Execute popularity-contest commands
- `popularity-contest self version` — Print popularity-contest version
- `popularity-contest _ _` — Passthrough to popularity-contest CLI

## Usage Examples
- "popularity-contest --help"
- "popularity-contest self version"

## Installation
```bash
apt-get install popularity-contest 2>/dev/null || which popularity-contest
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
