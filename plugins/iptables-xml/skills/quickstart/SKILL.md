---
name: iptables-xml
description: Use this skill when the user wants to use iptables-xml, cli tool: iptables-xml.
---

# iptables-xml Plugin

CLI tool: iptables-xml.

## Commands
- `iptables-xml <resource> <action>` — Execute iptables-xml commands
- `iptables-xml self version` — Print iptables-xml version
- `iptables-xml _ _` — Passthrough to iptables-xml CLI

## Usage Examples
- "iptables-xml --help"
- "iptables-xml self version"

## Installation
```bash
apt-get install iptables-xml 2>/dev/null || which iptables-xml
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
