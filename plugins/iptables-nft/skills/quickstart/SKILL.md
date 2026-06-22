---
name: iptables-nft
description: Use this skill when the user wants to use iptables-nft, cli tool: iptables-nft.
---

# iptables-nft Plugin

CLI tool: iptables-nft.

## Commands
- `iptables-nft <resource> <action>` — Execute iptables-nft commands
- `iptables-nft self version` — Print iptables-nft version
- `iptables-nft _ _` — Passthrough to iptables-nft CLI

## Usage Examples
- "iptables-nft --help"
- "iptables-nft self version"

## Installation
```bash
apt-get install iptables-nft 2>/dev/null || which iptables-nft
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
