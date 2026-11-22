---
name: jshell
description: Use this skill when the user wants to use jshell, cli tool: jshell.
---

# jshell Plugin

CLI tool: jshell.

## Commands
- `jshell <resource> <action>` — Execute jshell commands
- `jshell self version` — Print jshell version
- `jshell _ _` — Passthrough to jshell CLI

## Usage Examples
- "jshell --help"
- "jshell self version"

## Installation
```bash
apt-get install openjdk-17-jdk-headless 2>/dev/null || which jshell
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
