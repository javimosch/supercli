---
name: wsdump
description: Use this skill when the user wants to use wsdump, cli tool: wsdump.
---

# wsdump Plugin

CLI tool: wsdump.

## Commands
- `wsdump <resource> <action>` — Execute wsdump commands
- `wsdump self version` — Print wsdump version
- `wsdump _ _` — Passthrough to wsdump CLI

## Usage Examples
- "wsdump --help"
- "wsdump self version"

## Installation
```bash
apt-get install wsdump 2>/dev/null || which wsdump
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
